"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  phone: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>
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

  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: "1",
      name: "User Name",
      email,
      phone: "+91 98765 43210",
    }

    setUser(mockUser)
    setStoredUser(mockUser) // Use helper function
  }

  const signup = async (name: string, email: string, phone: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: "1",
      name,
      email,
      phone,
    }

    setUser(mockUser)
    setStoredUser(mockUser) // Use helper function
  }

  const logout = () => {
    setUser(null)
    setStoredUser(null) // Use helper function
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
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
