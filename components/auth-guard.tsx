"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoadingScreen } from "./loading-screen"

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * AuthGuard component protects routes that require authentication
 * Redirects to /login if user is not authenticated
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the intended destination for redirect after login
      sessionStorage.setItem("redirectAfterLogin", pathname)
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router, pathname])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <LoadingScreen />
  }

  return <>{children}</>
}

/**
 * GuestGuard component for auth pages (login, signup)
 * Redirects authenticated users to dashboard
 */
export function GuestGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if there's a stored redirect destination
      const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/dashboard"
      sessionStorage.removeItem("redirectAfterLogin")
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    return <LoadingScreen />
  }

  return <>{children}</>
}
