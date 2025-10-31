"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { usePrices } from "@/contexts/price-context"

interface StockListItemProps {
  symbol: string
  name: string
  isSelected: boolean
  onClick: () => void
}

export function StockListItem({ symbol, name, isSelected, onClick }: StockListItemProps) {
  const { getPrice } = usePrices()
  const stockPrice = getPrice(symbol)
  const price = stockPrice?.price || 0
  const change = stockPrice?.change || 0
  const changePercent = stockPrice?.changePercent || 0
  const isPositive = change >= 0

  return (
    <Card
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-sm">{symbol}</p>
            <p className="text-xs text-muted-foreground">{name}</p>
          </div>
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-sm">₹{(price || 0).toFixed(2)}</p>
          <p className={`text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "+" : ""}
            {changePercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </Card>
  )
}
