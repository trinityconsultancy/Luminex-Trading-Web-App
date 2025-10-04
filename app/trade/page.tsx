"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { TrendingUp, Search, ArrowUpRight, ArrowDownRight, Menu, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MobileNav } from "@/components/mobile-nav"
import { TradeModal } from "@/components/trade-modal"
import { StockSearchResults } from "@/components/stock-search-results"

// Mock popular stocks data
const popularStocks = [
  { symbol: "RELIANCE", name: "Reliance Industries", ltp: 2580.5, change: 2.34, changePercent: 0.91 },
  { symbol: "TCS", name: "Tata Consultancy Services", ltp: 3450.75, change: -15.25, changePercent: -0.44 },
  { symbol: "INFY", name: "Infosys Limited", ltp: 1520.25, change: 8.5, changePercent: 0.56 },
  { symbol: "HDFCBANK", name: "HDFC Bank", ltp: 1580.0, change: -12.0, changePercent: -0.75 },
  { symbol: "ICICIBANK", name: "ICICI Bank", ltp: 1020.5, change: 18.75, changePercent: 1.87 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", ltp: 1245.3, change: 5.6, changePercent: 0.45 },
]

export default function TradePage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Check if there's a stock symbol in URL params
  useEffect(() => {
    const symbol = searchParams.get("symbol")
    const action = searchParams.get("action") as "buy" | "sell" | null
    if (symbol) {
      setSelectedStock(symbol)
      setTradeAction(action || "buy")
      setIsModalOpen(true)
    }
  }, [searchParams])

  const handleStockSelect = (symbol: string, action: "buy" | "sell") => {
    setSelectedStock(symbol)
    setTradeAction(action)
    setIsModalOpen(true)
  }

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
            <Link href="/watchlist" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Watchlist
            </Link>
            <Link href="/funds" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Funds
            </Link>
          </nav>

          <div className="flex items-center gap-3">
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
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>Search Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by stock name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {searchQuery && <StockSearchResults query={searchQuery} onSelect={handleStockSelect} />}
          </CardContent>
        </Card>

        {/* Popular Stocks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Popular Stocks</h2>
            <Button variant="link" className="text-sm" asChild>
              <Link href="/explore">View All</Link>
            </Button>
          </div>

          <div className="grid gap-3">
            {popularStocks.map((stock) => (
              <Card key={stock.symbol} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Star className="w-4 h-4" />
                      </Button>
                      <div className="flex-1">
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground">{stock.name}</div>
                      </div>
                    </div>

                    <div className="text-right mr-4">
                      <div className="font-semibold">₹{stock.ltp.toFixed(2)}</div>
                      <div
                        className={`text-sm flex items-center justify-end gap-1 ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {stock.change >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span>
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change.toFixed(2)} ({stock.changePercent}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleStockSelect(stock.symbol, "buy")}>
                        Buy
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleStockSelect(stock.symbol, "sell")}>
                        Sell
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Market Indices */}
        <Card>
          <CardHeader>
            <CardTitle>Market Indices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">NIFTY 50</div>
                <div className="text-2xl font-bold">21,456.75</div>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +125.50 (0.59%)
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">SENSEX</div>
                <div className="text-2xl font-bold">71,234.80</div>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +342.15 (0.48%)
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">BANK NIFTY</div>
                <div className="text-2xl font-bold">45,678.90</div>
                <div className="text-sm text-red-600 flex items-center gap-1">
                  <ArrowDownRight className="w-3 h-3" />
                  -89.25 (-0.19%)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Trade Modal */}
      {selectedStock && (
        <TradeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          symbol={selectedStock}
          action={tradeAction}
        />
      )}
    </div>
  )
}
