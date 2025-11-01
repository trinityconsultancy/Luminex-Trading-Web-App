"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

interface ValidationErrors {
  name?: string
  email?: string
  phone?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export default function AccountPage() {
  const router = useRouter()
  const { user, updateProfile, changePassword, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("profile")

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Real-time validation
  useEffect(() => {
    const errors: ValidationErrors = {}

    // Name validation
    if (touched.name && profileData.name) {
      if (profileData.name.length < 2 || profileData.name.length > 50) {
        errors.name = "Name must be between 2 and 50 characters"
      } else if (!/^[a-zA-Z\s]+$/.test(profileData.name)) {
        errors.name = "Name can only contain letters and spaces"
      }
    }

    // Email validation
    if (touched.email && profileData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(profileData.email)) {
        errors.email = "Please provide a valid email address"
      } else if (profileData.email.length > 100) {
        errors.email = "Email must not exceed 100 characters"
      }
    }

    // Phone validation
    if (touched.phone && profileData.phone) {
      const phoneDigits = profileData.phone.replace(/\D/g, '')
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        errors.phone = "Phone number must be between 10 and 15 digits"
      }
    }

    // Password validations
    if (touched.newPassword && passwordData.newPassword) {
      if (passwordData.newPassword.length < 8 || passwordData.newPassword.length > 128) {
        errors.newPassword = "Password must be between 8 and 128 characters"
      } else if (!/(?=.*[a-z])/.test(passwordData.newPassword)) {
        errors.newPassword = "Password must contain at least one lowercase letter"
      } else if (!/(?=.*[A-Z])/.test(passwordData.newPassword)) {
        errors.newPassword = "Password must contain at least one uppercase letter"
      } else if (!/(?=.*\d)/.test(passwordData.newPassword)) {
        errors.newPassword = "Password must contain at least one number"
      } else if (!/(?=.*[@$!%*?&])/.test(passwordData.newPassword)) {
        errors.newPassword = "Password must contain at least one special character (@$!%*?&)"
      }
    }

    if (touched.confirmPassword && passwordData.confirmPassword) {
      if (passwordData.confirmPassword !== passwordData.newPassword) {
        errors.confirmPassword = "Passwords do not match"
      }
    }

    setValidationErrors(errors)
  }, [profileData, passwordData, touched])

  const handleProfileChange = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
    setError("")
    setSuccess("")
  }

  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
    setError("")
    setSuccess("")
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
    })

    // Check for validation errors
    const profileErrors = Object.keys(validationErrors).filter(key => 
      ['name', 'email', 'phone'].includes(key)
    )
    
    if (profileErrors.length > 0) {
      setError("Please fix all validation errors before saving")
      return
    }

    setIsLoadingProfile(true)

    const result = await updateProfile(profileData)
    
    setIsLoadingProfile(false)

    if (result.success) {
      setSuccess("Profile updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } else {
      setError(result.message)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Mark password fields as touched
    setTouched(prev => ({
      ...prev,
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    }))

    // Check for validation errors
    const passwordErrors = Object.keys(validationErrors).filter(key => 
      ['currentPassword', 'newPassword', 'confirmPassword'].includes(key)
    )
    
    if (passwordErrors.length > 0) {
      setError("Please fix all validation errors before changing password")
      return
    }

    if (!passwordData.currentPassword) {
      setError("Current password is required")
      return
    }

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setError("All password fields are required")
      return
    }

    setIsLoadingPassword(true)

    const result = await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
      passwordData.confirmPassword
    )
    
    setIsLoadingPassword(false)

    if (result.success) {
      setSuccess("Password changed successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setTouched({})
      setTimeout(() => setSuccess(""), 3000)
    } else {
      setError(result.message)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Account Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6 border-green-500 text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information. Changes to email will require re-verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={profileData.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
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
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={`pl-10 ${touched.email && validationErrors.email ? 'border-red-500' : ''}`}
                        required
                      />
                    </div>
                    {touched.email && validationErrors.email && (
                      <p className="text-sm text-red-500">{validationErrors.email}</p>
                    )}
                    {user.email !== profileData.email && (
                      <p className="text-sm text-amber-600">
                        ⚠️ Changing your email will require re-verification
                      </p>
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
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        className={`pl-10 ${touched.phone && validationErrors.phone ? 'border-red-500' : ''}`}
                        required
                      />
                    </div>
                    {touched.phone && validationErrors.phone && (
                      <p className="text-sm text-red-500">{validationErrors.phone}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoadingProfile || Object.keys(validationErrors).some(k => ['name', 'email', 'phone'].includes(k))}
                  >
                    {isLoadingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="Enter current password"
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        onBlur={() => handleBlur('currentPassword')}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        onBlur={() => handleBlur('newPassword')}
                        className={`pl-10 pr-10 ${touched.newPassword && validationErrors.newPassword ? 'border-red-500' : ''}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {touched.newPassword && validationErrors.newPassword && (
                      <p className="text-sm text-red-500">{validationErrors.newPassword}</p>
                    )}
                    {!validationErrors.newPassword && touched.newPassword && passwordData.newPassword && (
                      <p className="text-sm text-green-600">✓ Password meets requirements</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                        className={`pl-10 pr-10 ${touched.confirmPassword && validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {touched.confirmPassword && validationErrors.confirmPassword && (
                      <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                    )}
                    {!validationErrors.confirmPassword && touched.confirmPassword && passwordData.confirmPassword && (
                      <p className="text-sm text-green-600">✓ Passwords match</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoadingPassword || Object.keys(validationErrors).some(k => ['newPassword', 'confirmPassword'].includes(k))}
                  >
                    {isLoadingPassword ? "Changing Password..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Logout Section */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Logout</CardTitle>
                <CardDescription>
                  Sign out of your account on this device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout from Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
