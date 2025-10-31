"use client"
import Link from "next/link"
import { TrendingUp, Menu, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MobileNav } from "@/components/mobile-nav"

const mockPositions = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    type: "Intraday",
    quantity: 25,
    avgPrice: 2575.0,
    ltp: 2580.5,
    pnl: 137.5,
    pnlPercent: 0.21,
    time: "10:45 AM",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    type: "Intraday",
    quantity: 15,
    avgPrice: 3440.0,
    ltp: 3450.75,
    pnl: 161.25,
    pnlPercent: 0.31,
    time: "11:20 AM",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Limited",
    type: "Intraday",
    quantity: 30,
    avgPrice: 1725.0,
    ltp: 1720.5,
    pnl: -135.0,
    pnlPercent: -0.26,
    time: "12:05 PM",
  },
]

export default function PositionsPage() {
  const totalPnL = mockPositions.reduce((sum, p) => sum + p.pnl, 0)
  const totalInvested = mockPositions.reduce((sum, p) => sum + p.avgPrice * p.quantity, 0)
  const totalCurrentValue = mockPositions.reduce((sum, p) => sum + p.ltp * p.quantity, 0)

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 animate-fade-in">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Luminex</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/charts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Charts
            </Link>
            <Link href="/holdings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Holdings
            </Link>
            <Link href="/positions" className="text-sm font-medium text-foreground">
              Positions
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="hidden md:flex gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button size="sm" className="hidden md:flex" asChild>
              <Link href="/trade">Trade</Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/accounts">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  U
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Real-time P&L Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
          <Card className="transition-all hover:shadow-md border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Total P&L</div>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                {totalPnL >= 0 ? "+" : ""}₹{Math.abs(totalPnL).toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {((totalPnL / totalInvested) * 100).toFixed(2)}% return
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Invested</div>
              <div className="text-2xl font-bold">₹{totalInvested.toLocaleString("en-IN")}</div>
              <div className="text-xs text-muted-foreground mt-2">{mockPositions.length} positions</div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Current Value</div>
              <div className="text-2xl font-bold">₹{totalCurrentValue.toLocaleString("en-IN")}</div>
              <div className="text-xs text-muted-foreground mt-2">Real-time</div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
              <div className="text-2xl font-bold">
                {mockPositions.length > 0
                  ? ((mockPositions.filter((p) => p.pnl > 0).length / mockPositions.length) * 100).toFixed(0)
                  : "0"}
                %
              </div>
              <div className="text-xs text-muted-foreground mt-2">Profitable trades</div>
            </CardContent>
          </Card>
        </div>

        {/* Alert */}
        <Alert className="animate-slide-up border-l-4 border-l-yellow-500 bg-yellow-50/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            All intraday positions will be automatically squared off at 3:20 PM if not closed manually.
          </AlertDescription>
        </Alert>

        {/* Positions Table */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {mockPositions.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-muted-foreground mb-4">No active positions</div>
                  <Button asChild>
                    <Link href="/trade">Start Trading</Link>
                  </Button>
                </div>
              ) : (
                mockPositions.map((position) => (
                  <div
                    key={position.symbol + position.time}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex-1">
                      <Link href={`/stock/${position.symbol}`}>
                        <div className="font-medium hover:underline">{position.symbol}</div>
                        <div className="text-sm text-muted-foreground">{position.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {position.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{position.time}</span>
                        </div>
                      </Link>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <div className="text-sm text-muted-foreground">Qty</div>
                        <div className="font-medium">{position.quantity}</div>
                      </div>
                      <div className="text-right hidden md:block">
                        <div className="text-sm text-muted-foreground">Avg</div>
                        <div className="font-medium">₹{position.avgPrice.toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">LTP</div>
                        <div className="font-medium">₹{position.ltp.toFixed(2)}</div>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <div className="text-sm text-muted-foreground">P&L</div>
                        <div className={`font-medium ${position.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {position.pnl >= 0 ? "+" : ""}₹{Math.abs(position.pnl).toFixed(2)}
                        </div>
                        <div className={`text-xs ${position.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ({position.pnl >= 0 ? "+" : ""}
                          {position.pnlPercent.toFixed(2)}%)
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Exit
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  )
}
