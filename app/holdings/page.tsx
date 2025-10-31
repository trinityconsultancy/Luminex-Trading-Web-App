"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { TrendingUp, Menu, Download, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MobileNav } from "@/components/mobile-nav"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PortfolioAllocationChart } from "@/components/portfolio-allocation-chart" // Fix import to use named import instead of default import

const mockHoldings = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    quantity: 50,
    avgPrice: 2450.0,
    ltp: 2580.5,
    pnl: 6525.0,
    pnlPercent: 5.33,
    invested: 122500,
    currentValue: 129025,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    quantity: 30,
    avgPrice: 3200.0,
    ltp: 3450.75,
    pnl: 7522.5,
    pnlPercent: 7.83,
    invested: 96000,
    currentValue: 103522.5,
  },
  {
    symbol: "INFY",
    name: "Infosys Limited",
    quantity: 100,
    avgPrice: 1450.0,
    ltp: 1520.25,
    pnl: 7025.0,
    pnlPercent: 4.85,
    invested: 145000,
    currentValue: 152025,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Limited",
    quantity: 40,
    avgPrice: 1650.0,
    ltp: 1720.5,
    pnl: 2820.0,
    pnlPercent: 4.27,
    invested: 66000,
    currentValue: 68820,
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Limited",
    quantity: 60,
    avgPrice: 980.0,
    ltp: 1025.75,
    pnl: 2745.0,
    pnlPercent: 4.67,
    invested: 58800,
    currentValue: 61545,
  },
]

export default function HoldingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("pnl")
  const [filteredHoldings, setFilteredHoldings] = useState(mockHoldings)

  const totalInvested = mockHoldings.reduce((sum, h) => sum + h.invested, 0)
  const totalCurrentValue = mockHoldings.reduce((sum, h) => sum + h.currentValue, 0)
  const totalPnL = totalCurrentValue - totalInvested
  const totalPnLPercent = (totalPnL / totalInvested) * 100

  useEffect(() => {
    const filtered = mockHoldings.filter(
      (h) =>
        h.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Sort holdings
    if (sortBy === "pnl") {
      filtered.sort((a, b) => b.pnl - a.pnl)
    } else if (sortBy === "value") {
      filtered.sort((a, b) => b.currentValue - a.currentValue)
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.symbol.localeCompare(b.symbol))
    }

    setFilteredHoldings(filtered)
  }, [searchQuery, sortBy])

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
            <Link href="/holdings" className="text-sm font-medium text-foreground">
              Holdings
            </Link>
            <Link href="/positions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
        {/* Holdings Summary with Allocation Chart */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
              <Card className="transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-1">Total Invested</div>
                  <div className="text-2xl font-bold">₹{totalInvested.toLocaleString("en-IN")}</div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-1">Current Value</div>
                  <div className="text-2xl font-bold">₹{totalCurrentValue.toLocaleString("en-IN")}</div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-1">Total P&L</div>
                  <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {totalPnL >= 0 ? "+" : ""}₹{Math.abs(totalPnL).toLocaleString("en-IN")}
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-1">Returns</div>
                  <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {totalPnL >= 0 ? "+" : ""}
                    {totalPnLPercent.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search holdings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pnl">Sort by P&L</SelectItem>
                  <SelectItem value="value">Sort by Value</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Holdings Table */}
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filteredHoldings.map((holding) => (
                    <div
                      key={holding.symbol}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <Link href={`/stock/${holding.symbol}`}>
                          <div className="font-medium hover:underline truncate">{holding.symbol}</div>
                          <div className="text-sm text-muted-foreground truncate">{holding.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">Qty: {holding.quantity}</div>
                        </Link>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap justify-end">
                        <div className="text-right hidden md:block">
                          <div className="text-sm text-muted-foreground">Avg Price</div>
                          <div className="font-medium whitespace-nowrap">₹{holding.avgPrice.toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">LTP</div>
                          <div className="font-medium whitespace-nowrap">₹{holding.ltp.toFixed(2)}</div>
                        </div>
                        <div className="text-right hidden md:block">
                          <div className="text-sm text-muted-foreground">Invested</div>
                          <div className="font-medium whitespace-nowrap">
                            ₹{holding.invested.toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">P&L</div>
                          <div
                            className={`font-medium whitespace-nowrap ${holding.pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {holding.pnl >= 0 ? "+" : ""}₹{Math.abs(holding.pnl).toFixed(2)}
                          </div>
                          <div
                            className={`text-xs whitespace-nowrap ${holding.pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            ({holding.pnl >= 0 ? "+" : ""}
                            {holding.pnlPercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Allocation Chart */}
          <div>
            <PortfolioAllocationChart />
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
