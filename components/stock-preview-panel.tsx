"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, CheckCircle } from "lucide-react"
import { usePrices } from "@/contexts/price-context"
import { CandlestickChartReal } from "./candlestick-chart-real"

interface StockPreviewPanelProps {
  symbol: string
  name: string
}

const mockNews = [
  { title: "Stock Market Rises", date: "2023-10-01", sentiment: "positive" },
  { title: "Earnings Report Released", date: "2023-09-29", sentiment: "neutral" },
]

const mockTradeHistory = [
  { type: "BUY", quantity: 100, price: 1500, date: "2023-09-30" },
  { type: "SELL", quantity: 50, price: 1600, date: "2023-10-01" },
]

export function StockPreviewPanel({ symbol, name }: StockPreviewPanelProps) {
  const { getPrice } = usePrices()
  const stockPrice = getPrice(symbol)
  const price = typeof stockPrice === "object" ? stockPrice?.price : 0
  const change = typeof stockPrice === "object" ? stockPrice?.change : 0

  const isPositive = change >= 0

  const openTradingView = () => {
    const tradingViewUrl = `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`
    window.open(tradingViewUrl, "_blank")
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-6 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2
                onClick={openTradingView}
                className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
                title="Click to view on TradingView"
              >
                {symbol}
              </h2>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
            {isPositive ? (
              <TrendingUp className="w-6 h-6 text-green-500" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-500" />
            )}
          </div>
          <div className="flex items-end gap-4">
            <div>
              <p className="text-3xl font-bold">₹{(price || 0).toFixed(2)}</p>
              <p className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? "+" : ""}
                {change.toFixed(2)}% (₹{Math.abs(((change || 0) * (price || 0)) / 100).toFixed(2)})
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3">Candlestick Chart (1D)</h3>
        <CandlestickChartReal symbol={symbol} />
        <p className="text-xs text-muted-foreground mt-2">Last 30 days • Click stock name to view on TradingView</p>
      </Card>

      {/* AI Analysis */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3">AI Analysis</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Buy Signal</span>
            </div>
            <Badge className="bg-green-500/20 text-green-700">Strong</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Technical indicators suggest upward momentum. RSI at 65, MACD positive crossover detected.
          </p>
        </div>
      </Card>

      {/* Latest News */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3">Latest News (This Week)</h3>
        <div className="space-y-3">
          {mockNews.map((news, i) => (
            <div key={i} className="pb-3 border-b border-border last:border-0">
              <p className="text-sm font-medium line-clamp-2">{news.title}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{news.date}</p>
                <Badge
                  variant="outline"
                  className={
                    news.sentiment === "positive"
                      ? "bg-green-500/10 text-green-700 border-green-500/20"
                      : "bg-gray-500/10 text-gray-700 border-gray-500/20"
                  }
                >
                  {news.sentiment}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Trade History */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3">Trade History</h3>
        <div className="space-y-2">
          {mockTradeHistory.map((trade, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-background/50 rounded">
              <div className="flex items-center gap-3">
                <Badge
                  className={trade.type === "BUY" ? "bg-green-500/20 text-green-700" : "bg-red-500/20 text-red-700"}
                >
                  {trade.type}
                </Badge>
                <div>
                  <p className="text-sm font-medium">
                    {trade.quantity} shares @ ₹{trade.price}
                  </p>
                  <p className="text-xs text-muted-foreground">{trade.date}</p>
                </div>
              </div>
              <p className="text-sm font-semibold">₹{(trade.quantity * trade.price).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
