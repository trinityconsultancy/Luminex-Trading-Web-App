"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePrices } from "@/contexts/price-context"

interface CompactChartPreviewProps {
  symbol: string
  name: string
}

export function CompactChartPreview({ symbol, name }: CompactChartPreviewProps) {
  const { getPrice } = usePrices()
  const price = getPrice(symbol)

  const handleOpenTradingView = () => {
    const tvSymbol = `NSE:${symbol}`
    window.open(`https://www.tradingview.com/chart/?symbol=${tvSymbol}`, "_blank")
  }

  // Generate mini chart data for visualization
  const miniChartData = Array.from({ length: 20 }, (_, i) => {
    const basePrice = price?.price || 2500
    return basePrice + (Math.random() - 0.5) * basePrice * 0.02
  })

  const maxPrice = Math.max(...miniChartData)
  const minPrice = Math.min(...miniChartData)
  const priceRange = maxPrice - minPrice

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={handleOpenTradingView}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg">{symbol}</h3>
              <p className="text-xs text-muted-foreground truncate">{name}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          {/* Price Info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">₹{price?.price.toFixed(2) || "0.00"}</p>
              <p
                className={`text-sm font-medium flex items-center gap-1 ${
                  price?.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {price?.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {price?.change >= 0 ? "+" : ""}
                {price?.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="h-16 bg-muted/30 rounded flex items-end justify-between gap-0.5 p-2">
            {miniChartData.map((value, i) => {
              const height = ((value - minPrice) / priceRange) * 100
              const isPositive = value >= miniChartData[0]
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-colors ${isPositive ? "bg-green-500/70" : "bg-red-500/70"}`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
              )
            })}
          </div>

          {/* View Chart Button */}
          <Button
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenTradingView()
            }}
          >
            View on TradingView
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
