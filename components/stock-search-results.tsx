"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock search results
const allStocks = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", ltp: 2580.5, change: 2.34, changePercent: 0.91 },
  { symbol: "TCS", name: "Tata Consultancy Services", ltp: 3450.75, change: -15.25, changePercent: -0.44 },
  { symbol: "INFY", name: "Infosys Limited", ltp: 1520.25, change: 8.5, changePercent: 0.56 },
  { symbol: "HDFCBANK", name: "HDFC Bank Limited", ltp: 1580.0, change: -12.0, changePercent: -0.75 },
  { symbol: "ICICIBANK", name: "ICICI Bank Limited", ltp: 1020.5, change: 18.75, changePercent: 1.87 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Limited", ltp: 1245.3, change: 5.6, changePercent: 0.45 },
  { symbol: "ITC", name: "ITC Limited", ltp: 445.8, change: 3.2, changePercent: 0.72 },
  { symbol: "SBIN", name: "State Bank of India", ltp: 625.4, change: -8.5, changePercent: -1.34 },
  { symbol: "WIPRO", name: "Wipro Limited", ltp: 445.6, change: 2.1, changePercent: 0.47 },
  { symbol: "AXISBANK", name: "Axis Bank Limited", ltp: 1089.75, change: 12.3, changePercent: 1.14 },
]

interface StockSearchResultsProps {
  query: string
  onSelect: (symbol: string, action: "buy" | "sell") => void
}

export function StockSearchResults({ query, onSelect }: StockSearchResultsProps) {
  const filteredStocks = allStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase()),
  )

  if (filteredStocks.length === 0) {
    return (
      <div className="mt-4 text-center py-8 text-muted-foreground">
        <p>No stocks found matching "{query}"</p>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
      {filteredStocks.map((stock) => (
        <div
          key={stock.symbol}
          className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1">
            <div className="font-semibold">{stock.symbol}</div>
            <div className="text-sm text-muted-foreground">{stock.name}</div>
          </div>

          <div className="text-right mr-4">
            <div className="font-semibold">₹{stock.ltp.toFixed(2)}</div>
            <div
              className={`text-sm flex items-center justify-end gap-1 ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {stock.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              <span>
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)} ({stock.changePercent}%)
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => onSelect(stock.symbol, "buy")}>
              Buy
            </Button>
            <Button size="sm" variant="outline" onClick={() => onSelect(stock.symbol, "sell")}>
              Sell
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
