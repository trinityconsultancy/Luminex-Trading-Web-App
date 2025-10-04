"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp, ArrowUpRight, ArrowDownRight, Menu, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PortfolioChart } from "@/components/portfolio-chart"
import { HoldingsTable } from "@/components/holdings-table"
import { MobileNav } from "@/components/mobile-nav"

const mockPortfolio = {
  totalValue: 125430.5,
  investedAmount: 100000,
  totalPnL: 25430.5,
  totalPnLPercent: 25.43,
  buyingPower: 50000,
  todaysPnL: 1234.5,
  todaysPnLPercent: 0.99,
}

const mockHoldings = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    quantity: 50,
    avgPrice: 2450.0,
    ltp: 2580.5,
    pnl: 6525.0,
    pnlPercent: 5.33,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    quantity: 30,
    avgPrice: 3200.0,
    ltp: 3450.75,
    pnl: 7522.5,
    pnlPercent: 7.83,
  },
  {
    symbol: "INFY",
    name: "Infosys Limited",
    quantity: 100,
    avgPrice: 1450.0,
    ltp: 1520.25,
    pnl: 7025.0,
    pnlPercent: 4.85,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Limited",
    quantity: 40,
    avgPrice: 1650.0,
    ltp: 1580.0,
    pnl: -2800.0,
    pnlPercent: -4.24,
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Limited",
    quantity: 60,
    avgPrice: 950.0,
    ltp: 1020.5,
    pnl: 4230.0,
    pnlPercent: 7.42,
  },
]

const mockSectorAllocation = [
  { sector: "Technology", value: 45230, percent: 36.1 },
  { sector: "Banking", value: 38450, percent: 30.7 },
  { sector: "Energy", value: 25680, percent: 20.5 },
  { sector: "Consumer", value: 16070.5, percent: 12.8 },
]

export default function PortfolioPage() {
  const [timeframe, setTimeframe] = useState("1M")

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
              Dashboard
            </Link>
            <Link href="/portfolio" className="text-sm font-medium text-foreground">
              Portfolio
            </Link>
            <Link href="/watchlist" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Watchlist
            </Link>
            <Link href="/funds" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Funds
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
              <Link href="/profile">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  U
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Portfolio Summary */}
        <div className="space-y-2 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">₹{mockPortfolio.totalValue.toLocaleString("en-IN")}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={mockPortfolio.totalPnL >= 0 ? "default" : "destructive"} className="gap-1">
                  {mockPortfolio.totalPnL >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {mockPortfolio.totalPnL >= 0 ? "+" : ""}₹{Math.abs(mockPortfolio.totalPnL).toLocaleString("en-IN")} (
                  {mockPortfolio.totalPnLPercent}%)
                </Badge>
                <span className="text-sm text-muted-foreground">All time</span>
              </div>
            </div>
            <div className="flex gap-2">
              {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className="transition-all"
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Invested Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{mockPortfolio.investedAmount.toLocaleString("en-IN")}</div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{mockPortfolio.totalValue.toLocaleString("en-IN")}</div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${mockPortfolio.todaysPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                {mockPortfolio.todaysPnL >= 0 ? "+" : ""}₹{mockPortfolio.todaysPnL.toLocaleString("en-IN")}
              </div>
              <div className={`text-sm ${mockPortfolio.todaysPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                {mockPortfolio.todaysPnLPercent}%
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${mockPortfolio.totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                {mockPortfolio.totalPnLPercent}%
              </div>
              <div className="text-sm text-muted-foreground">XIRR</div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioChart />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Holdings */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle>Holdings ({mockHoldings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <HoldingsTable holdings={mockHoldings} searchQuery="" />
            </CardContent>
          </Card>

          {/* Sector Allocation */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle>Sector Allocation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSectorAllocation.map((sector) => (
                <div key={sector.sector} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{sector.sector}</span>
                    <span className="text-muted-foreground">
                      ₹{sector.value.toLocaleString("en-IN")} ({sector.percent}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${sector.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
