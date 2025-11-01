"use client"

import Link from "next/link"
import { Home, ArrowLeft, TrendingUp, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LuminexLogo } from "@/components/luminex-logo"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Logo */}
            <div className="relative">
              <div className="absolute inset-0 animate-ping opacity-20">
                <LuminexLogo className="w-20 h-20 text-primary" />
              </div>
              <LuminexLogo className="w-20 h-20 text-primary" />
            </div>

            {/* 404 Error */}
            <div className="space-y-2">
              <h1 className="text-8xl font-bold text-primary animate-pulse">404</h1>
              <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
            </div>

            {/* Description */}
            <div className="max-w-md space-y-2">
              <p className="text-muted-foreground">
                Oops! The page you're looking for seems to have wandered off the trading floor.
              </p>
              <p className="text-sm text-muted-foreground">
                The market moves fast, but this page moved faster than we expected!
              </p>
            </div>

            {/* Trading-themed message */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 max-w-md">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Market Tip</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Just like in trading, sometimes the best move is to go back and reassess your strategy.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4">
              <Button asChild className="flex-1" size="lg">
                <Link href="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link href="javascript:history.back()">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Link>
              </Button>
            </div>

            {/* Quick Links */}
            <div className="pt-6 border-t border-border w-full max-w-md">
              <p className="text-sm text-muted-foreground mb-3">Quick Links</p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/charts"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Search className="w-3 h-3" />
                  Charts
                </Link>
                <Link
                  href="/holdings"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Search className="w-3 h-3" />
                  Holdings
                </Link>
                <Link
                  href="/positions"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Search className="w-3 h-3" />
                  Positions
                </Link>
                <Link
                  href="/watchlist"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Search className="w-3 h-3" />
                  Watchlist
                </Link>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-muted-foreground pt-4">
              If you believe this is an error, please contact support
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
