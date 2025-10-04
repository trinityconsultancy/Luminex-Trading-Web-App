"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { TrendingUp, ArrowUpRight, ArrowDownRight, Star, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MobileNav } from "@/components/mobile-nav"
import { CandlestickChart } from "@/components/candlestick-chart"
import { TradeModal } from "@/components/trade-modal"

// Mock stock data
const getStockDetails = (symbol: string) => {
  const stocks: Record<
    string,
    {
      name: string
      ltp: number
      change: number
      changePercent: number
      open: number
      high: number
      low: number
      volume: number
      marketCap: string
      pe: number
      week52High: number
      week52Low: number
    }
  > = {
    RELIANCE: {
      name: "Reliance Industries Ltd",
      ltp: 2580.5,
      change: 2.34,
      changePercent: 0.91,
      open: 2575.0,
      high: 2595.75,
      low: 2568.25,
      volume: 12500000,
      marketCap: "17.45L Cr",
      pe: 28.5,
      week52High: 2856.0,
      week52Low: 2220.3,
    },
    TCS: {
      name: "Tata Consultancy Services",
      ltp: 3450.75,
      change: -15.25,
      changePercent: -0.44,
      open: 3465.0,
      high: 3478.5,
      low: 3442.0,
      volume: 8200000,
      marketCap: "12.58L Cr",
      pe: 32.1,
      week52High: 4078.0,
      week52Low: 3311.0,
    },
  }
  return (
    stocks[symbol] || {
      name: symbol,
      ltp: 1000,
      change: 0,
      changePercent: 0,
      open: 1000,
      high: 1020,
      low: 980,
      volume: 1000000,
      marketCap: "10L Cr",
      pe: 25,
      week52High: 1200,
      week52Low: 800,
    }
  )
}

export default function StockDetailPage() {
  const params = useParams()
  const symbol = params.symbol as string
  const [isInWatchlist, setIsInWatchlist] = useState(true)
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy")

  const stock = getStockDetails(symbol)

  const handleTrade = (action: "buy" | "sell") => {
    setTradeAction(action)
    setIsTradeModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/watchlist">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Luminex</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsInWatchlist(!isInWatchlist)}
              className={isInWatchlist ? "text-yellow-500" : ""}
            >
              <Star className={`w-5 h-5 ${isInWatchlist ? "fill-current" : ""}`} />
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
        {/* Stock Header */}
        <div>
          <h1 className="text-3xl font-bold">{symbol}</h1>
          <p className="text-muted-foreground mt-1">{stock.name}</p>
        </div>

        {/* Price Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl font-bold">₹{stock.ltp.toFixed(2)}</div>
                <div
                  className={`flex items-center gap-2 text-lg mt-2 ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {stock.change >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  <span>
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)} ({stock.changePercent}%)
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleTrade("buy")}>Buy</Button>
                <Button variant="outline" onClick={() => handleTrade("sell")}>
                  Sell
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <CandlestickChart symbol={symbol} />
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Key Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Open</div>
                <div className="text-lg font-semibold mt-1">₹{stock.open.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">High</div>
                <div className="text-lg font-semibold mt-1">₹{stock.high.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Low</div>
                <div className="text-lg font-semibold mt-1">₹{stock.low.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="text-lg font-semibold mt-1">{(stock.volume / 1000000).toFixed(2)}M</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="text-lg font-semibold mt-1">{stock.marketCap}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">P/E Ratio</div>
                <div className="text-lg font-semibold mt-1">{stock.pe.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">52W High</div>
                <div className="text-lg font-semibold mt-1">₹{stock.week52High.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">52W Low</div>
                <div className="text-lg font-semibold mt-1">₹{stock.week52Low.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About {symbol}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {symbol === "RELIANCE"
                ? "Reliance Industries Limited is an Indian multinational conglomerate company, headquartered in Mumbai. It has diverse businesses including energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles."
                : symbol === "TCS"
                  ? "Tata Consultancy Services is an Indian multinational information technology services and consulting company. It is a subsidiary of the Tata Group and operates in 149 locations across 46 countries."
                  : `${stock.name} is a leading company in its sector with strong fundamentals and growth potential.`}
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Trade Modal */}
      <TradeModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        symbol={symbol}
        action={tradeAction}
      />
    </div>
  )
}
