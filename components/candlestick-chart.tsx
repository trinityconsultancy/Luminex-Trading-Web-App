"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CandlestickChartProps {
  symbol: string
}

// Mock candlestick data generator
const generateCandlestickData = (days: number, basePrice: number) => {
  const data = []
  let currentPrice = basePrice

  for (let i = 0; i < days; i++) {
    const open = currentPrice
    const volatility = 0.03
    const change = (Math.random() - 0.5) * basePrice * volatility
    const close = open + change
    const high = Math.max(open, close) + Math.random() * basePrice * 0.01
    const low = Math.min(open, close) - Math.random() * basePrice * 0.01

    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    })

    currentPrice = close
  }

  return data
}

export function CandlestickChart({ symbol }: CandlestickChartProps) {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "3M" | "1Y">("1M")

  const getDaysForTimeframe = (tf: string) => {
    switch (tf) {
      case "1D":
        return 1
      case "1W":
        return 7
      case "1M":
        return 30
      case "3M":
        return 90
      case "1Y":
        return 365
      default:
        return 30
    }
  }

  const basePrice = symbol === "RELIANCE" ? 2580 : symbol === "TCS" ? 3450 : 1000
  const data = generateCandlestickData(getDaysForTimeframe(timeframe), basePrice)

  // Calculate chart dimensions
  const chartWidth = 800
  const chartHeight = 400
  const padding = { top: 20, right: 60, bottom: 40, left: 60 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Find min and max prices
  const allPrices = data.flatMap((d) => [d.high, d.low])
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const priceRange = maxPrice - minPrice

  // Scale functions
  const xScale = (index: number) => padding.left + (index / (data.length - 1)) * innerWidth
  const yScale = (price: number) => padding.top + ((maxPrice - price) / priceRange) * innerHeight

  const candleWidth = Math.max(2, innerWidth / data.length - 2)

  return (
    <div className="space-y-4">
      {/* Timeframe Selector */}
      <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
        <TabsList>
          <TabsTrigger value="1D">1D</TabsTrigger>
          <TabsTrigger value="1W">1W</TabsTrigger>
          <TabsTrigger value="1M">1M</TabsTrigger>
          <TabsTrigger value="3M">3M</TabsTrigger>
          <TabsTrigger value="1Y">1Y</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Chart */}
      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="w-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + ratio * innerHeight
            const price = maxPrice - ratio * priceRange
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text x={chartWidth - padding.right + 10} y={y + 4} fontSize="12" fill="hsl(var(--muted-foreground))">
                  ₹{price.toFixed(0)}
                </text>
              </g>
            )
          })}

          {/* Candlesticks */}
          {data.map((candle, index) => {
            const x = xScale(index)
            const isGreen = candle.close >= candle.open
            const color = isGreen ? "#16a34a" : "#dc2626"

            const bodyTop = yScale(Math.max(candle.open, candle.close))
            const bodyBottom = yScale(Math.min(candle.open, candle.close))
            const bodyHeight = Math.max(1, bodyBottom - bodyTop)

            return (
              <g key={index}>
                {/* Wick */}
                <line x1={x} y1={yScale(candle.high)} x2={x} y2={yScale(candle.low)} stroke={color} strokeWidth="1" />
                {/* Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={color}
                  stroke={color}
                  strokeWidth="1"
                />
              </g>
            )
          })}

          {/* X-axis labels */}
          {data
            .filter((_, i) => i % Math.ceil(data.length / 8) === 0)
            .map((candle, index) => {
              const originalIndex = data.indexOf(candle)
              const x = xScale(originalIndex)
              return (
                <text
                  key={index}
                  x={x}
                  y={chartHeight - padding.bottom + 20}
                  fontSize="12"
                  fill="hsl(var(--muted-foreground))"
                  textAnchor="middle"
                >
                  {candle.date}
                </text>
              )
            })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 rounded" />
          <span className="text-muted-foreground">Bullish</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded" />
          <span className="text-muted-foreground">Bearish</span>
        </div>
      </div>
    </div>
  )
}
