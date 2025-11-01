"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { StockTicker } from "@/components/stock-ticker"
import { HoldingsChart } from "@/components/holdings-chart"
import { AISuggestions } from "@/components/ai-suggestions"
import { MarketNews } from "@/components/market-news"
import { TodaysAnalysis } from "@/components/todays-analysis"

const mockIndices = [
  { name: "NIFTY 50", value: 21453.25, change: 145.3, changePercent: 0.68 },
  { name: "SENSEX", value: 71234.56, change: -234.12, changePercent: -0.33 },
  { name: "NIFTY BANK", value: 45678.9, change: 567.8, changePercent: 1.26 },
]

const mockWatchlist = [
  {
    symbol: "RELIANCE",
    ltp: 2580.5,
    change: 45.25,
    changePercent: 1.78,
    change24h: 52.3,
    change24hPercent: 2.07,
    volume: "2.5M",
  },
  {
    symbol: "TCS",
    ltp: 3450.75,
    change: -23.5,
    changePercent: -0.68,
    change24h: -18.2,
    change24hPercent: -0.52,
    volume: "1.8M",
  },
  {
    symbol: "INFY",
    ltp: 1520.25,
    change: 12.75,
    changePercent: 0.85,
    change24h: 28.5,
    change24hPercent: 1.91,
    volume: "3.2M",
  },
  {
    symbol: "HDFCBANK",
    ltp: 1580.0,
    change: -15.5,
    changePercent: -0.97,
    change24h: -8.3,
    change24hPercent: -0.52,
    volume: "4.1M",
  },
  {
    symbol: "ICICIBANK",
    ltp: 1020.5,
    change: 28.3,
    changePercent: 2.85,
    change24h: 35.7,
    change24hPercent: 3.62,
    volume: "2.9M",
  },
  {
    symbol: "WIPRO",
    ltp: 445.6,
    change: 8.2,
    changePercent: 1.87,
    change24h: 12.4,
    change24hPercent: 2.86,
    volume: "1.5M",
  },
  {
    symbol: "BHARTIARTL",
    ltp: 1234.5,
    change: -5.3,
    changePercent: -0.43,
    change24h: 3.2,
    change24hPercent: 0.26,
    volume: "2.1M",
  },
  {
    symbol: "ITC",
    ltp: 456.75,
    change: 3.25,
    changePercent: 0.72,
    change24h: 8.5,
    change24hPercent: 1.9,
    volume: "5.6M",
  },
]

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
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [privacyMode, setPrivacyMode] = useState(false)

  const totalPnL = mockHoldings.reduce((sum, h) => sum + h.pnl, 0)
  const totalInvested = mockHoldings.reduce((sum, h) => sum + h.avgPrice * h.quantity, 0)
  const totalValue = totalInvested + totalPnL

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0">
      <Navbar privacyMode={privacyMode} onPrivacyToggle={() => setPrivacyMode(!privacyMode)} />

      {/* Stock Ticker */}
      <StockTicker />

      <main className="container mx-auto px-4 py-6 space-y-6 flex-1">
        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="transition-all hover:shadow-md border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Balance</div>
              <div className="text-3xl font-bold mb-2">
                {privacyMode ? "••••••" : `₹${totalValue.toLocaleString("en-IN")}`}
              </div>
              <div className={`flex items-center gap-1 text-sm ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                {totalPnL >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span className="font-medium">
                  {privacyMode ? "••••" : `₹${Math.abs(totalPnL).toLocaleString("en-IN")}`}
                </span>
                <span className="text-muted-foreground">
                  ({((Math.abs(totalPnL) / totalInvested) * 100).toFixed(2)}%)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Invested</div>
              <div className="text-3xl font-bold mb-2">
                {privacyMode ? "••••••" : `₹${totalInvested.toLocaleString("en-IN")}`}
              </div>
              <div className="text-sm text-muted-foreground">Across {mockHoldings.length} holdings</div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Profit</div>
              <div className={`text-3xl font-bold mb-2 ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                {privacyMode ? "••••••" : `₹${Math.abs(totalPnL).toLocaleString("en-IN")}`}
              </div>
              <div className="text-sm text-muted-foreground">
                Returns: {((Math.abs(totalPnL) / totalInvested) * 100).toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Indices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockIndices.map((index) => (
            <Card key={index.name} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">{index.name}</div>
                <div className="text-2xl font-bold mb-2">{index.value.toLocaleString("en-IN")}</div>
                <div
                  className={`flex items-center gap-1 text-sm ${index.change >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {index.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span className="font-medium">{Math.abs(index.change).toFixed(2)}</span>
                  <span>({index.changePercent.toFixed(2)}%)</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Holdings Chart */}
            <HoldingsChart />

            {/* Watchlist and Holdings Tabs */}
            <Tabs defaultValue="watchlist" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                  <TabsTrigger value="holdings">Holdings ({mockHoldings.length})</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search stocks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                </div>
              </div>

              <TabsContent value="watchlist" className="mt-0">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {mockWatchlist
                        .filter(
                          (stock) =>
                            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === "",
                        )
                        .map((stock) => (
                          <div
                            key={stock.symbol}
                            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                          >
                            <div className="flex-1">
                              <Link href={`/stock/${stock.symbol}`}>
                                <div className="font-medium hover:underline">{stock.symbol}</div>
                              </Link>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="font-medium">₹{stock.ltp.toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground">{stock.volume}</div>
                              </div>
                              <div className="text-right min-w-[80px]">
                                <div className="text-xs text-muted-foreground mb-0.5">Today</div>
                                <div
                                  className={`text-sm font-medium ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                  {stock.change >= 0 ? "+" : ""}
                                  {stock.changePercent.toFixed(2)}%
                                </div>
                              </div>
                              <div className="text-right min-w-[80px]">
                                <div className="text-xs text-muted-foreground mb-0.5">24h</div>
                                <div
                                  className={`text-sm font-medium ${stock.change24h >= 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                  {stock.change24h >= 0 ? "+" : ""}
                                  {stock.change24hPercent.toFixed(2)}%
                                </div>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="outline" className="h-8 bg-transparent" asChild>
                                  <Link href={`/trade?symbol=${stock.symbol}&action=buy`}>B</Link>
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 bg-transparent" asChild>
                                  <Link href={`/trade?symbol=${stock.symbol}&action=sell`}>S</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="holdings" className="mt-0">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {mockHoldings
                        .filter(
                          (holding) =>
                            holding.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            holding.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            searchQuery === "",
                        )
                        .map((holding) => {
                          const currentValue = holding.quantity * holding.ltp
                          return (
                            <div
                              key={holding.symbol}
                              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                            >
                              <div className="flex-1">
                                <Link href={`/stock/${holding.symbol}`}>
                                  <div className="font-medium hover:underline">{holding.symbol}</div>
                                  <div className="text-sm text-muted-foreground">{holding.name}</div>
                                </Link>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground">Qty</div>
                                  <div className="font-medium">{holding.quantity}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground">Avg</div>
                                  <div className="font-medium">₹{holding.avgPrice.toFixed(2)}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground">LTP</div>
                                  <div className="font-medium">₹{holding.ltp.toFixed(2)}</div>
                                </div>
                                <div className="text-right min-w-[100px]">
                                  <div className="text-sm text-muted-foreground">P&L</div>
                                  <div
                                    className={`font-medium ${holding.pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {holding.pnl >= 0 ? "+" : ""}₹{Math.abs(holding.pnl).toFixed(2)}
                                  </div>
                                  <div className={`text-xs ${holding.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {Math.abs(holding.pnlPercent).toFixed(2)}%
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-transparent"
                                  asChild
                                >
                                  <Link href={`/trade?symbol=${holding.symbol}&action=sell`}>Sell</Link>
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Insights and News */}
          <div className="space-y-6">
            <TodaysAnalysis />
            <AISuggestions />
            <MarketNews />
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
