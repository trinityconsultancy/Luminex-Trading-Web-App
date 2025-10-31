"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface StockPrice {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  volume: string
  timestamp: number
}

interface PriceContextType {
  prices: Map<string, StockPrice>
  getPrice: (symbol: string) => StockPrice | undefined
  isLoading: boolean
}

const PriceContext = createContext<PriceContextType | undefined>(undefined)

const TOP_STOCKS = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "WIPRO",
  "BHARTIARTL",
  "ITC",
  "SBIN",
  "AXISBANK",
]

function generateMockPrice(symbol: string, previousPrice?: StockPrice): StockPrice {
  const basePrices: Record<string, number> = {
    RELIANCE: 2580.5,
    TCS: 3450.75,
    INFY: 1520.25,
    HDFCBANK: 1580.0,
    ICICIBANK: 1020.5,
    WIPRO: 445.6,
    BHARTIARTL: 1234.5,
    ITC: 456.75,
    SBIN: 625.3,
    AXISBANK: 1045.8,
  }

  const basePrice = previousPrice?.price || basePrices[symbol] || 1000
  const fluctuation = (Math.random() - 0.5) * (basePrice * 0.002) // ±0.2% fluctuation
  const newPrice = basePrice + fluctuation

  const open = previousPrice?.open || basePrice * (1 + (Math.random() - 0.5) * 0.01)
  const change = newPrice - open
  const changePercent = (change / open) * 100

  return {
    symbol,
    price: Number(newPrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    high: Number((Math.max(newPrice, open) * 1.005).toFixed(2)),
    low: Number((Math.min(newPrice, open) * 0.995).toFixed(2)),
    open: Number(open.toFixed(2)),
    volume: `${(Math.random() * 5 + 1).toFixed(1)}M`,
    timestamp: Date.now(),
  }
}

export function PriceProvider({ children }: { children: ReactNode }) {
  const [prices, setPrices] = useState<Map<string, StockPrice>>(new Map())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize prices
    const initialPrices = new Map<string, StockPrice>()
    TOP_STOCKS.forEach((symbol) => {
      initialPrices.set(symbol, generateMockPrice(symbol))
    })
    setPrices(initialPrices)
    setIsLoading(false)

    // Update prices every 3 seconds to simulate real-time updates
    const interval = setInterval(() => {
      setPrices((prevPrices) => {
        const newPrices = new Map(prevPrices)
        TOP_STOCKS.forEach((symbol) => {
          const previousPrice = prevPrices.get(symbol)
          newPrices.set(symbol, generateMockPrice(symbol, previousPrice))
        })
        return newPrices
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getPrice = (symbol: string) => prices.get(symbol)

  return <PriceContext.Provider value={{ prices, getPrice, isLoading }}>{children}</PriceContext.Provider>
}

export function usePrices() {
  const context = useContext(PriceContext)
  if (context === undefined) {
    throw new Error("usePrices must be used within a PriceProvider")
  }
  return context
}
