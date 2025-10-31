"use client"

import { useEffect, useRef } from "react"

interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
}

interface CandlestickChartProps {
  symbol: string
  data?: CandleData[]
}

export function CandlestickChartReal({ symbol, data }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate mock candlestick data
  const generateMockData = (): CandleData[] => {
    const candles: CandleData[] = []
    let basePrice = 2500
    const now = Math.floor(Date.now() / 1000)

    for (let i = 30; i >= 0; i--) {
      const time = now - i * 86400
      const open = basePrice + (Math.random() - 0.5) * 100
      const close = open + (Math.random() - 0.5) * 150
      const high = Math.max(open, close) + Math.random() * 50
      const low = Math.min(open, close) - Math.random() * 50

      candles.push({
        time,
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
      })

      basePrice = close
    }

    return candles
  }

  const chartData = data || generateMockData()

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous content
    containerRef.current.innerHTML = ""

    // Create SVG canvas for candlestick chart
    const width = containerRef.current.clientWidth
    const height = 300
    const padding = 40

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", width.toString())
    svg.setAttribute("height", height.toString())
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)

    // Find min and max prices
    const prices = chartData.flatMap((c) => [c.high, c.low])
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice

    // Calculate scaling
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const candleWidth = (chartWidth / chartData.length) * 0.8
    const spacing = chartWidth / chartData.length

    // Draw grid lines
    const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
      line.setAttribute("x1", padding.toString())
      line.setAttribute("y1", y.toString())
      line.setAttribute("x2", (width - padding).toString())
      line.setAttribute("y2", y.toString())
      line.setAttribute("stroke", "#e5e7eb")
      line.setAttribute("stroke-width", "1")
      gridGroup.appendChild(line)
    }
    svg.appendChild(gridGroup)

    // Draw candlesticks
    chartData.forEach((candle, index) => {
      const x = padding + index * spacing + spacing / 2
      const yHigh = padding + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight
      const yLow = padding + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight
      const yOpen = padding + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight
      const yClose = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight

      const isGreen = candle.close >= candle.open
      const color = isGreen ? "#10b981" : "#ef4444"
      const bodyTop = Math.min(yOpen, yClose)
      const bodyHeight = Math.abs(yClose - yOpen) || 2

      // Wick (high-low line)
      const wick = document.createElementNS("http://www.w3.org/2000/svg", "line")
      wick.setAttribute("x1", x.toString())
      wick.setAttribute("y1", yHigh.toString())
      wick.setAttribute("x2", x.toString())
      wick.setAttribute("y2", yLow.toString())
      wick.setAttribute("stroke", color)
      wick.setAttribute("stroke-width", "1")
      svg.appendChild(wick)

      // Body (open-close rectangle)
      const body = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      body.setAttribute("x", (x - candleWidth / 2).toString())
      body.setAttribute("y", bodyTop.toString())
      body.setAttribute("width", candleWidth.toString())
      body.setAttribute("height", bodyHeight.toString())
      body.setAttribute("fill", color)
      body.setAttribute("opacity", "0.8")
      svg.appendChild(body)
    })

    // Draw axes
    const axisGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line")
    xAxis.setAttribute("x1", padding.toString())
    xAxis.setAttribute("y1", (height - padding).toString())
    xAxis.setAttribute("x2", (width - padding).toString())
    xAxis.setAttribute("y2", (height - padding).toString())
    xAxis.setAttribute("stroke", "#9ca3af")
    xAxis.setAttribute("stroke-width", "2")
    axisGroup.appendChild(xAxis)

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line")
    yAxis.setAttribute("x1", padding.toString())
    yAxis.setAttribute("y1", padding.toString())
    yAxis.setAttribute("x2", padding.toString())
    yAxis.setAttribute("y2", (height - padding).toString())
    yAxis.setAttribute("stroke", "#9ca3af")
    yAxis.setAttribute("stroke-width", "2")
    axisGroup.appendChild(yAxis)

    svg.appendChild(axisGroup)

    containerRef.current.appendChild(svg)
  }, [chartData])

  return <div ref={containerRef} className="w-full bg-background/50 rounded border border-border" />
}
