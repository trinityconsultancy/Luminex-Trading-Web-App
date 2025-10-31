"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Minus, Activity, BarChart3, Maximize2, Settings, Plus, Download } from "lucide-react"

interface TradingViewChartProps {
  symbol: string
  height?: number
}

function generateCandlestickData(days: number) {
  const data = []
  let basePrice = 2500 + Math.random() * 500
  const now = Date.now()

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60 * 1000
    const open = basePrice
    const volatility = basePrice * 0.02
    const close = open + (Math.random() - 0.5) * volatility
    const high = Math.max(open, close) + Math.random() * volatility * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * 0.5
    const volume = Math.random() * 1000000 + 500000

    data.push({
      time: Math.floor(timestamp / 1000),
      open,
      high,
      low,
      close,
      volume,
    })

    basePrice = close
  }

  return data
}

export function TradingViewChart({ symbol, height = 500 }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [timeframe, setTimeframe] = useState("1D")
  const [chartType, setChartType] = useState<"candlestick" | "line" | "area">("candlestick")
  const [indicators, setIndicators] = useState<string[]>([])
  const [data, setData] = useState(generateCandlestickData(30))

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData]
        const lastCandle = newData[newData.length - 1]
        const volatility = lastCandle.close * 0.001
        const newClose = lastCandle.close + (Math.random() - 0.5) * volatility

        newData[newData.length - 1] = {
          ...lastCandle,
          close: newClose,
          high: Math.max(lastCandle.high, newClose),
          low: Math.min(lastCandle.low, newClose),
        }

        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const currentPrice = data[data.length - 1]?.close || 0
  const previousPrice = data[data.length - 2]?.close || 0
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = (priceChange / previousPrice) * 100

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Chart Header */}
        <div className="border-b border-border p-4 bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{symbol}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-bold">₹{currentPrice.toFixed(2)}</span>
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    priceChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="w-4 h-4 mr-2" />
                Fullscreen
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-4">
            <Tabs value={timeframe} onValueChange={setTimeframe}>
              <TabsList>
                <TabsTrigger value="1D">1D</TabsTrigger>
                <TabsTrigger value="1W">1W</TabsTrigger>
                <TabsTrigger value="1M">1M</TabsTrigger>
                <TabsTrigger value="3M">3M</TabsTrigger>
                <TabsTrigger value="6M">6M</TabsTrigger>
                <TabsTrigger value="1Y">1Y</TabsTrigger>
                <TabsTrigger value="5Y">5Y</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant={chartType === "candlestick" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("candlestick")}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("line")}
              >
                <Activity className="w-4 h-4" />
              </Button>
              <Button
                variant={chartType === "area" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("area")}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div ref={chartContainerRef} style={{ height: `${height}px` }} className="relative bg-background">
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Grid */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Candlesticks */}
            {chartType === "candlestick" &&
              data.slice(-50).map((candle, i) => {
                const x = (i / 50) * 100
                const maxPrice = Math.max(...data.slice(-50).map((d) => d.high))
                const minPrice = Math.min(...data.slice(-50).map((d) => d.low))
                const priceRange = maxPrice - minPrice

                const yOpen = ((maxPrice - candle.open) / priceRange) * 80 + 10
                const yClose = ((maxPrice - candle.close) / priceRange) * 80 + 10
                const yHigh = ((maxPrice - candle.high) / priceRange) * 80 + 10
                const yLow = ((maxPrice - candle.low) / priceRange) * 80 + 10

                const isGreen = candle.close >= candle.open
                const color = isGreen ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"

                return (
                  <g key={i}>
                    {/* Wick */}
                    <line x1={`${x}%`} y1={`${yHigh}%`} x2={`${x}%`} y2={`${yLow}%`} stroke={color} strokeWidth="1" />
                    {/* Body */}
                    <rect
                      x={`${x - 0.4}%`}
                      y={`${Math.min(yOpen, yClose)}%`}
                      width="0.8%"
                      height={`${Math.abs(yClose - yOpen)}%`}
                      fill={color}
                    />
                  </g>
                )
              })}

            {/* Line Chart */}
            {chartType === "line" && (
              <polyline
                points={data
                  .slice(-50)
                  .map((candle, i) => {
                    const x = (i / 50) * 100
                    const maxPrice = Math.max(...data.slice(-50).map((d) => d.high))
                    const minPrice = Math.min(...data.slice(-50).map((d) => d.low))
                    const priceRange = maxPrice - minPrice
                    const y = ((maxPrice - candle.close) / priceRange) * 80 + 10
                    return `${x},${y}`
                  })
                  .join(" ")}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
            )}

            {/* Area Chart */}
            {chartType === "area" && (
              <>
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={
                    data
                      .slice(-50)
                      .map((candle, i) => {
                        const x = (i / 50) * 100
                        const maxPrice = Math.max(...data.slice(-50).map((d) => d.high))
                        const minPrice = Math.min(...data.slice(-50).map((d) => d.low))
                        const priceRange = maxPrice - minPrice
                        const y = ((maxPrice - candle.close) / priceRange) * 80 + 10
                        return `${x},${y}`
                      })
                      .join(" ") + " 100,90 0,90"
                  }
                  fill="url(#areaGradient)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                />
              </>
            )}
          </svg>
        </div>

        {/* Indicators Panel */}
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Indicators:</span>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Indicator
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">O:</span>{" "}
                <span className="font-medium">₹{data[data.length - 1]?.open.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">H:</span>{" "}
                <span className="font-medium">₹{data[data.length - 1]?.high.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">L:</span>{" "}
                <span className="font-medium">₹{data[data.length - 1]?.low.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">C:</span>{" "}
                <span className="font-medium">₹{data[data.length - 1]?.close.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Vol:</span>{" "}
                <span className="font-medium">{(data[data.length - 1]?.volume / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
