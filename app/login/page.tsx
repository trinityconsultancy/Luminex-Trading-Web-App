"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TrendingUp, Mail, Lock, Eye, EyeOff, ArrowLeft, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { OTPInput } from "@/components/otp-input"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GuestGuard } from "@/components/auth-guard"

type LoginStep = 'credentials' | 'verify-otp'

function LoginPageContent() {
  const router = useRouter()
  const { login, verifyOTP: verifyLoginOTP, resendOTP } = useAuth()
  
  const [step, setStep] = useState<LoginStep>('credentials')
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    identifier: "", // Can be email or phone
    password: "",
    remember: false,
  })
  
  const [otpType, setOtpType] = useState<'email' | 'sms'>('email')
  const [userId, setUserId] = useState<string>("")
  const [otp, setOtp] = useState("")
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Step 1: Submit credentials and get OTP
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    setIsLoading(true)

    const result = await login(formData.identifier, formData.password, otpType)
    
    setIsLoading(false)

    if (result.success && result.userId) {
      setUserId(result.userId)
      setSuccess(`OTP sent to your ${otpType}!`)
      setStep('verify-otp')
    } else {
      setError(result.message)
    }
  }

  // Step 2: Verify OTP and complete login
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP")
      return
    }

    setIsLoading(true)

    const result = await verifyLoginOTP(userId, otp, otpType, 'login')
    
    setIsLoading(false)

    if (result.success) {
      setSuccess("Login successful! Redirecting...")
      
      // Check for redirect destination
      const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/dashboard"
      sessionStorage.removeItem("redirectAfterLogin")
      
      // Redirect to intended page or dashboard
      setTimeout(() => {
        router.push(redirectTo)
      }, 1000)
    } else {
      setError(result.message)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setError("")
    setIsLoading(true)

    const result = await resendOTP(userId, otpType, 'login')
    
    setIsLoading(false)

    if (result.success) {
      setSuccess(`OTP resent to your ${otpType}!`)
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

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {step === 'credentials' ? 'Welcome Back' : 'Verify OTP'}
            </CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              {step === 'credentials' 
                ? 'Sign in to your account to continue'
                : `OTP sent to your ${otpType}`}
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

            {/* Step 1: Enter Credentials */}
            {step === 'credentials' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email or Phone</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="you@example.com or +91 98765 43210"
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Receive OTP via</Label>
                  <Tabs value={otpType} onValueChange={(v) => setOtpType(v as 'email' | 'sms')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="email">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="sms">
                        <Smartphone className="w-4 h-4 mr-2" />
                        SMS
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.remember}
                      onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
                    />
                    <Label htmlFor="remember" className="text-sm cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Continue with OTP"}
                </Button>

                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground text-center">
                  Secure login with OTP verification
                </div>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {step === 'verify-otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Enter the 6-digit code sent to your {otpType}
                  </p>
                  
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    length={6}
                    disabled={isLoading}
                    error={!!error}
                  />
                </div>

                <div className="space-y-3">
                  <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setStep('credentials')
                      setOtp("")
                      setError("")
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        {step === 'credentials' && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up
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

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginPageContent />
    </GuestGuard>
  )
}
