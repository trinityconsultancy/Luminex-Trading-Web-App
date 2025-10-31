"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Stock {
  symbol: string
  price: number
  change: number
  changePercent: number
}

const initialStocks: Stock[] = [
  { symbol: "RELIANCE", price: 2580.5, change: 45.25, changePercent: 1.78 },
  { symbol: "TCS", price: 3450.75, change: -23.5, changePercent: -0.68 },
  { symbol: "INFY", price: 1520.25, change: 12.75, changePercent: 0.85 },
  { symbol: "HDFCBANK", price: 1580.0, change: -15.5, changePercent: -0.97 },
  { symbol: "ICICIBANK", price: 1020.5, change: 28.3, changePercent: 2.85 },
  { symbol: "WIPRO", price: 445.6, change: 8.2, changePercent: 1.87 },
  { symbol: "BHARTIARTL", price: 1234.5, change: -5.3, changePercent: -0.43 },
  { symbol: "ITC", price: 456.75, change: 3.25, changePercent: 0.72 },
  { symbol: "SBIN", price: 625.8, change: 12.4, changePercent: 2.02 },
  { symbol: "AXISBANK", price: 1089.5, change: -8.7, changePercent: -0.79 },
]

export function StockTicker() {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks)

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          // Random price change between -2% and +2%
          const changePercent = (Math.random() - 0.5) * 4
          const changeAmount = (stock.price * changePercent) / 100
          const newPrice = stock.price + changeAmount

          return {
            ...stock,
            price: newPrice,
            change: changeAmount,
            changePercent: changePercent,
          }
        }),
      )
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  // Duplicate stocks for seamless infinite scroll
  const duplicatedStocks = [...stocks, ...stocks]

  return (
    <div className="bg-muted/30 border-b border-border overflow-hidden">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {duplicatedStocks.map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className="ticker-item inline-flex items-center gap-3 px-6 py-3 transition-colors duration-300"
            >
              <span className="font-medium text-sm">{stock.symbol}</span>
              <span className="font-semibold text-sm">₹{stock.price.toFixed(2)}</span>
              <span
                className={`flex items-center gap-1 text-xs font-medium transition-colors duration-300 ${
                  stock.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stock.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(stock.changePercent).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
