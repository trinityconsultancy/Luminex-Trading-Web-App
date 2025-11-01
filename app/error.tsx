"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Home, RefreshCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LuminexLogo } from "@/components/luminex-logo"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("[Luminex Error]:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 border-destructive/20">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Logo */}
            <div className="relative">
              <LuminexLogo className="w-20 h-20 text-destructive opacity-80" />
            </div>

            {/* Error Icon */}
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Something Went Wrong!</h1>
              <p className="text-muted-foreground">
                We encountered an unexpected error while processing your request.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === "development" && error.message && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 max-w-md w-full">
                <p className="text-xs font-mono text-destructive break-all">{error.message}</p>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-2">Error ID: {error.digest}</p>
                )}
              </div>
            )}

            {/* Trading-themed message */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 max-w-md">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Market Volatility Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Just like market fluctuations, technical issues happen. Don't worry, your data is safe.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4">
              <Button onClick={reset} className="flex-1" size="lg">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link href="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="pt-6 border-t border-border w-full max-w-md">
              <p className="text-sm text-muted-foreground mb-2">Need help?</p>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <p>• Try refreshing the page</p>
                <p>• Clear your browser cache</p>
                <p>• Check your internet connection</p>
                <p>• If the problem persists, contact support</p>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-muted-foreground pt-4">
              Luminex Trading - Virtual Trading Platform
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
