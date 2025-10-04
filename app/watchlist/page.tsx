"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp, Search, ArrowUpRight, ArrowDownRight, Menu, Star, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MobileNav } from "@/components/mobile-nav"

// Mock watchlist data
const mockWatchlist = [
  { symbol: "RELIANCE", name: "Reliance Industries", ltp: 2580.5, change: 2.34, changePercent: 0.91 },
  { symbol: "TCS", name: "Tata Consultancy Services", ltp: 3450.75, change: -15.25, changePercent: -0.44 },
  { symbol: "INFY", name: "Infosys Limited", ltp: 1520.25, change: 8.5, changePercent: 0.56 },
  { symbol: "HDFCBANK", name: "HDFC Bank", ltp: 1580.0, change: -12.0, changePercent: -0.75 },
  { symbol: "ICICIBANK", name: "ICICI Bank", ltp: 1020.5, change: 18.75, changePercent: 1.87 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", ltp: 1245.3, change: 5.6, changePercent: 0.45 },
]

export default function WatchlistPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [watchlist, setWatchlist] = useState(mockWatchlist)

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((stock) => stock.symbol !== symbol))
  }

  const filteredWatchlist = watchlist.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Portfolio
            </Link>
            <Link href="/watchlist" className="text-sm font-medium text-foreground">
              Watchlist
            </Link>
            <Link href="/funds" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Funds
            </Link>
          </nav>

          <div className="flex items-center gap-3">
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
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Watchlist</h1>
            <p className="text-muted-foreground mt-1">Track your favorite stocks</p>
          </div>
          <Button asChild>
            <Link href="/trade">
              <Plus className="w-4 h-4 mr-2" />
              Add Stocks
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search watchlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Watchlist Grid */}
        {filteredWatchlist.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No stocks in watchlist</h3>
              <p className="text-muted-foreground mb-4">Add stocks to track their performance</p>
              <Button asChild>
                <Link href="/trade">Browse Stocks</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWatchlist.map((stock) => (
              <Card key={stock.symbol} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/stock/${stock.symbol}`}>
                        <CardTitle className="text-lg hover:underline">{stock.symbol}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{stock.name}</p>
                      </Link>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 -mt-1"
                      onClick={() => removeFromWatchlist(stock.symbol)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold">₹{stock.ltp.toFixed(2)}</div>
                    <div
                      className={`flex items-center gap-1 text-sm mt-1 ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {stock.change >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span>
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change.toFixed(2)} ({stock.changePercent}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/trade?symbol=${stock.symbol}&action=buy`}>Buy</Link>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href={`/stock/${stock.symbol}`}>Chart</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
