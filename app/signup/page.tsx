"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TrendingUp, Mail, Lock, User, Eye, EyeOff, Phone, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { OTPInput } from "@/components/otp-input"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GuestGuard } from "@/components/auth-guard"

type SignupStep = 'details' | 'verify-email' | 'complete'

interface ValidationErrors {
  name?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

function SignupPageContent() {
  const router = useRouter()
  const { register, verifyOTP, resendOTP } = useAuth()
  
  const [step, setStep] = useState<SignupStep>('details')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
  const [userId, setUserId] = useState<string>("")
  const [emailOTP, setEmailOTP] = useState("")
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Real-time validation on keyup
  useEffect(() => {
    const errors: ValidationErrors = {}

    // Name validation
    if (touched.name && formData.name) {
      if (formData.name.length < 2 || formData.name.length > 50) {
        errors.name = "Name must be between 2 and 50 characters"
      } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
        errors.name = "Name can only contain letters and spaces"
      }
    }

    // Email validation
    if (touched.email && formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please provide a valid email address"
      } else if (formData.email.length > 100) {
        errors.email = "Email must not exceed 100 characters"
      }
    }

    // Phone validation
    if (touched.phone && formData.phone) {
      const phoneDigits = formData.phone.replace(/\D/g, '')
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        errors.phone = "Phone number must be between 10 and 15 digits"
      } else if (!/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
        errors.phone = "Please provide a valid phone number"
      }
    }

    // Password validation
    if (touched.password && formData.password) {
      if (formData.password.length < 8 || formData.password.length > 128) {
        errors.password = "Password must be between 8 and 128 characters"
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        errors.password = "Password must contain at least one lowercase letter"
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        errors.password = "Password must contain at least one uppercase letter"
      } else if (!/(?=.*\d)/.test(formData.password)) {
        errors.password = "Password must contain at least one number"
      } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
        errors.password = "Password must contain at least one special character (@$!%*?&)"
      }
    }

    // Confirm password validation
    if (touched.confirmPassword && formData.confirmPassword) {
      if (formData.confirmPassword !== formData.password) {
        errors.confirmPassword = "Passwords do not match"
      }
    }

    setValidationErrors(errors)
  }, [formData, touched])

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
    setError("") // Clear general error on input
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  // Step 1: Submit registration details
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    })

    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) {
      setError("Please fix all validation errors before submitting")
      return
    }

    // Check required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError("All fields are required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    const result = await register(formData.name, formData.email, formData.phone, formData.password, formData.confirmPassword)
    
    setIsLoading(false)

    if (result.success && result.userId) {
      setUserId(result.userId)
      setSuccess("OTP sent to your email!")
      setStep('verify-email')
    } else {
      setError(result.message)
    }
  }

  // Step 2: Verify email OTP (final step)
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (emailOTP.length !== 6) {
      setError("Please enter the 6-digit OTP")
      return
    }

    setIsLoading(true)

    const result = await verifyOTP(userId, emailOTP, 'email', 'registration')
    
    setIsLoading(false)

    if (result.success) {
      setSuccess("Email verified! Registration complete.")
      setStep('complete')
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else {
      setError(result.message)
    }
  }

  // Resend OTP
  const handleResendOTP = async (type: 'email' | 'sms') => {
    setError("")
    setIsLoading(true)

    const result = await resendOTP(userId, type, 'registration')
    
    setIsLoading(false)

    if (result.success) {
      setSuccess(`OTP resent to your ${type}!`)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl">Luminex</span>
        </Link>

        {/* Signup Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {step === 'details' && 'Create Account'}
              {step === 'verify-email' && 'Verify Email'}
              {step === 'complete' && 'Welcome! 🎉'}
            </CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              {step === 'details' && 'Start your virtual trading journey'}
              {step === 'verify-email' && `OTP sent to ${formData.email}`}
              {step === 'complete' && 'Your account is ready!'}
            </p>
          </CardHeader>
          <CardContent>
            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4 border-green-500 text-green-700">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Registration Details */}
            {step === 'details' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      className={`pl-10 ${touched.name && validationErrors.name ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {touched.name && validationErrors.name && (
                    <p className="text-sm text-red-500">{validationErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`pl-10 ${touched.email && validationErrors.email ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {touched.email && validationErrors.email && (
                    <p className="text-sm text-red-500">{validationErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      className={`pl-10 ${touched.phone && validationErrors.phone ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {touched.phone && validationErrors.phone && (
                    <p className="text-sm text-red-500">{validationErrors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password (min 8 chars)"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      className={`pl-10 pr-10 ${touched.password && validationErrors.password ? 'border-red-500' : ''}`}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {touched.password && validationErrors.password && (
                    <p className="text-sm text-red-500">{validationErrors.password}</p>
                  )}
                  {!validationErrors.password && touched.password && formData.password && (
                    <p className="text-sm text-green-600">✓ Password meets requirements</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`pl-10 pr-10 ${touched.confirmPassword && validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {touched.confirmPassword && validationErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                  )}
                  {!validationErrors.confirmPassword && touched.confirmPassword && formData.confirmPassword && (
                    <p className="text-sm text-green-600">✓ Passwords match</p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground text-center">
                  Demo platform with virtual money for educational purposes
                </div>
              </form>
            )}

            {/* Step 2: Verify Email OTP */}
            {step === 'verify-email' && (
              <form onSubmit={handleVerifyEmail} className="space-y-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Enter the 6-digit code sent to your email
                  </p>
                  
                  <OTPInput
                    value={emailOTP}
                    onChange={setEmailOTP}
                    length={6}
                    disabled={isLoading}
                    error={!!error}
                  />
                </div>

                <div className="space-y-3">
                  <Button type="submit" className="w-full" disabled={isLoading || emailOTP.length !== 6}>
                    {isLoading ? "Verifying..." : "Verify & Complete Registration"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleResendOTP('email')}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setStep('details')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Complete */}
            {step === 'complete' && (
              <div className="text-center space-y-4 py-8">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <p className="text-lg font-medium">Account Created Successfully!</p>
                <p className="text-sm text-muted-foreground">
                  Redirecting to dashboard...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Login Link */}
        {step === 'details' && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <GuestGuard>
      <SignupPageContent />
    </GuestGuard>
  )
}
