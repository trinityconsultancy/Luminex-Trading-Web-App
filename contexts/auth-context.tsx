"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authApi, tokenStorage } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  phone: string
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  role?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Registration flow
  register: (name: string, email: string, phone: string, password: string, confirmPassword: string) => Promise<{
    success: boolean
    message: string
    userId?: string
    data?: any
  }>
  
  // Login flow
  login: (identifier: string, password: string, otpType?: 'email' | 'sms') => Promise<{
    success: boolean
    message: string
    userId?: string
    data?: any
  }>
  
  // OTP verification (for both registration and login)
  verifyOTP: (userId: string, otp: string, type: 'email' | 'sms', purpose: 'registration' | 'login') => Promise<{
    success: boolean
    message: string
    user?: User
    data?: any
  }>
  
  // Resend OTP
  resendOTP: (userId: string, type: 'email' | 'sms', purpose: 'registration' | 'login') => Promise<{
    success: boolean
    message: string
  }>
  
  // Update profile
  updateProfile: (data: { name?: string; email?: string; phone?: string }) => Promise<{
    success: boolean
    message: string
    user?: User
  }>
  
  // Change password
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<{
    success: boolean
    message: string
  }>
  
  // Logout
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null

  try {
    const storedUser = localStorage.getItem("luminex_user")
    if (storedUser) {
      return JSON.parse(storedUser)
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error)
  }
  return null
}

const setStoredUser = (user: User | null) => {
  if (typeof window === "undefined") return

  try {
    if (user) {
      localStorage.setItem("luminex_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("luminex_user")
    }
  } catch (error) {
    console.error("Error writing to localStorage:", error)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      return getStoredUser()
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    if (storedUser && JSON.stringify(storedUser) !== JSON.stringify(user)) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  // Register new user (Step 1 - sends OTP)
  const register = async (name: string, email: string, phone: string, password: string, confirmPassword: string) => {
    try {
      const response = await authApi.register({ name, email, phone, password, confirmPassword })
      
      if (response.success && response.data) {
        return {
          success: true,
          message: response.message,
          userId: response.data.userId,
          data: response.data,
        }
      }
      
      return {
        success: false,
        message: response.message || 'Registration failed',
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
      }
    }
  }

  // Login (Step 1 - sends OTP)
  const login = async (identifier: string, password: string, otpType: 'email' | 'sms' = 'email') => {
    try {
      const response = await authApi.login({ identifier, password, otpType })
      
      if (response.success && response.data) {
        return {
          success: true,
          message: response.message,
          userId: response.data.userId,
          data: response.data,
        }
      }
      
      return {
        success: false,
        message: response.message || 'Login failed',
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      }
    }
  }

  // Verify OTP (Step 2 for both registration and login)
  const verifyOTP = async (
    userId: string, 
    otp: string, 
    type: 'email' | 'sms',
    purpose: 'registration' | 'login'
  ) => {
    try {
      const response = await authApi.verifyOTP({ userId, otp, type, purpose })
      
      if (response.success && response.data) {
        // For login completion, we get tokens
        if (purpose === 'login' && response.data.tokens) {
          tokenStorage.setTokens(
            response.data.tokens.accessToken,
            response.data.tokens.refreshToken
          )
        }
        
        // For registration completion (when both email & phone verified), we also get tokens
        if (purpose === 'registration' && response.data.tokens) {
          tokenStorage.setTokens(
            response.data.tokens.accessToken,
            response.data.tokens.refreshToken
          )
        }
        
        // Set user if we got user data
        if (response.data.user) {
          const userData: User = {
            id: response.data.user._id || response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            phone: response.data.user.phone,
            isEmailVerified: response.data.user.isEmailVerified,
            isPhoneVerified: response.data.user.isPhoneVerified,
            role: response.data.user.role,
          }
          setUser(userData)
          setStoredUser(userData)
        }
        
        return {
          success: true,
          message: response.message,
          user: response.data.user,
          data: response.data,
        }
      }
      
      return {
        success: false,
        message: response.message || 'OTP verification failed',
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'OTP verification failed',
      }
    }
  }

  // Resend OTP
  const resendOTP = async (userId: string, type: 'email' | 'sms', purpose: 'registration' | 'login') => {
    try {
      const response = await authApi.sendOTP({ userId, type, purpose })
      
      return {
        success: response.success,
        message: response.message,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to resend OTP',
      }
    }
  }

  // Update user profile
  const updateProfile = async (data: { name?: string; email?: string; phone?: string }) => {
    try {
      const response = await authApi.updateProfile(data)
      
      if (response.success && response.data?.user) {
        const updatedUser: User = {
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          isEmailVerified: response.data.user.isEmailVerified,
          isPhoneVerified: response.data.user.isPhoneVerified,
          role: response.data.user.role,
        }
        
        setUser(updatedUser)
        setStoredUser(updatedUser)
        
        return {
          success: true,
          message: response.message,
          user: updatedUser,
        }
      }
      
      return {
        success: false,
        message: response.message || 'Profile update failed',
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Profile update failed',
      }
    }
  }

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      const response = await authApi.changePassword({ 
        currentPassword, 
        newPassword, 
        confirmPassword 
      })
      
      return {
        success: response.success,
        message: response.message,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Password change failed',
      }
    }
  }

  const logout = () => {
    const refreshToken = tokenStorage.getRefreshToken()
    if (refreshToken) {
      authApi.logout(refreshToken).catch(console.error)
    }
    
    setUser(null)
    setStoredUser(null)
    tokenStorage.clearTokens()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        register,
        login,
        verifyOTP,
        resendOTP,
        updateProfile,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
