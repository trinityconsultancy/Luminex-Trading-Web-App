"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Search, Menu, Star, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { MobileNav } from "@/components/mobile-nav"
import { StockTicker } from "@/components/stock-ticker"

const mockIndices = [
  { name: "NIFTY 50", value: 21453.25, change: 145.3, changePercent: 0.68 },
  { name: "SENSEX", value: 71234.56, change: -234.12, changePercent: -0.33 },
  { name: "NIFTY BANK", value: 45678.9, change: 567.8, changePercent: 1.26 },
]

const mockWatchlist = [
  { symbol: "RELIANCE", ltp: 2580.5, change: 45.25, changePercent: 1.78, volume: "2.5M" },
  { symbol: "TCS", ltp: 3450.75, change: -23.5, changePercent: -0.68, volume: "1.8M" },
  { symbol: "INFY", ltp: 1520.25, change: 12.75, changePercent: 0.85, volume: "3.2M" },
  { symbol: "HDFCBANK", ltp: 1580.0, change: -15.5, changePercent: -0.97, volume: "4.1M" },
  { symbol: "ICICIBANK", ltp: 1020.5, change: 28.3, changePercent: 2.85, volume: "2.9M" },
  { symbol: "WIPRO", ltp: 445.6, change: 8.2, changePercent: 1.87, volume: "1.5M" },
  { symbol: "BHARTIARTL", ltp: 1234.5, change: -5.3, changePercent: -0.43, volume: "2.1M" },
  { symbol: "ITC", ltp: 456.75, change: 3.25, changePercent: 0.72, volume: "5.6M" },
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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
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
            <Link href="/dashboard" className="text-sm font-medium text-foreground">
              Dashboard
            </Link>
            <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
            <Button variant="ghost" size="icon" onClick={() => setPrivacyMode(!privacyMode)} className="hidden md:flex">
              {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

      {/* Stock Ticker */}
      <StockTicker />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {mockIndices.map((index) => (
            <Card key={index.name} className="flex-shrink-0 transition-all hover:shadow-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">{index.name}</div>
                  <div className="text-xl font-bold">{index.value.toLocaleString("en-IN")}</div>
                </div>
                <div className={`flex items-center gap-1 ${index.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {index.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <div className="text-sm font-medium">
                    {Math.abs(index.change).toFixed(2)} ({Math.abs(index.changePercent)}%)
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Value</div>
              <div className="text-2xl font-bold">
                {privacyMode ? "••••••" : `₹${totalValue.toLocaleString("en-IN")}`}
              </div>
              <div
                className={`flex items-center gap-1 text-sm mt-1 ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {totalPnL >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{privacyMode ? "••••" : `₹${Math.abs(totalPnL).toLocaleString("en-IN")}`}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Invested</div>
              <div className="text-2xl font-bold">
                {privacyMode ? "••••••" : `₹${totalInvested.toLocaleString("en-IN")}`}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total invested</div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Buying Power</div>
              <div className="text-2xl font-bold">{privacyMode ? "••••••" : "₹50,000"}</div>
              <Button size="sm" variant="link" className="px-0 h-auto mt-1" asChild>
                <Link href="/funds">Add Funds</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="watchlist" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              <TabsTrigger value="holdings">Holdings ({mockHoldings.length})</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>
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
              <Button size="sm" asChild>
                <Link href="/trade">
                  <Plus className="w-4 h-4 mr-2" />
                  Buy
                </Link>
              </Button>
            </div>
          </div>

          <TabsContent value="watchlist" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {mockWatchlist
                    .filter(
                      (stock) => stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === "",
                    )
                    .map((stock) => (
                      <div
                        key={stock.symbol}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Link href={`/stock/${stock.symbol}`}>
                                <div className="font-medium hover:underline">{stock.symbol}</div>
                              </Link>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold">{stock.symbol}</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <div className="text-muted-foreground">LTP</div>
                                    <div className="font-medium">₹{stock.ltp}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Volume</div>
                                    <div className="font-medium">{stock.volume}</div>
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="font-medium">₹{stock.ltp.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">{stock.volume}</div>
                          </div>
                          <div className="text-right min-w-[80px]">
                            <div className={`font-medium ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {stock.change >= 0 ? "+" : ""}
                              {stock.change.toFixed(2)}
                            </div>
                            <div
                              className={`text-xs flex items-center justify-end gap-1 ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {stock.change >= 0 ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {Math.abs(stock.changePercent)}%
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
                              <div className={`font-medium ${holding.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
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

          <TabsContent value="positions" className="mt-0">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  <p className="mb-2">No open positions</p>
                  <p className="text-sm">Start trading to see your positions here</p>
                </div>
                <Button className="mt-4" asChild>
                  <Link href="/trade">Start Trading</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
