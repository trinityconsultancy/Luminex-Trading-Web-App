"use client"

import type React from "react"

import { useState } from "react"
import { X, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TradeModalProps {
  isOpen: boolean
  onClose: () => void
  symbol: string
  action: "buy" | "sell"
}

// Mock stock data
const getStockData = (symbol: string) => {
  const stocks: Record<string, { name: string; ltp: number; change: number; changePercent: number }> = {
    RELIANCE: { name: "Reliance Industries Ltd", ltp: 2580.5, change: 2.34, changePercent: 0.91 },
    TCS: { name: "Tata Consultancy Services", ltp: 3450.75, change: -15.25, changePercent: -0.44 },
    INFY: { name: "Infosys Limited", ltp: 1520.25, change: 8.5, changePercent: 0.56 },
    HDFCBANK: { name: "HDFC Bank Limited", ltp: 1580.0, change: -12.0, changePercent: -0.75 },
    ICICIBANK: { name: "ICICI Bank Limited", ltp: 1020.5, change: 18.75, changePercent: 1.87 },
  }
  return stocks[symbol] || { name: symbol, ltp: 1000, change: 0, changePercent: 0 }
}

export function TradeModal({ isOpen, onClose, symbol, action }: TradeModalProps) {
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")

  const stockData = getStockData(symbol)
  const totalAmount = orderType === "market" ? Number(quantity) * stockData.ltp : Number(quantity) * Number(price)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle order submission
    console.log("[v0] Order submitted:", {
      symbol,
      action,
      orderType,
      quantity,
      price: orderType === "market" ? stockData.ltp : price,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {action === "buy" ? "Buy" : "Sell"} {symbol}
            </span>
            
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stock Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">{symbol}</div>
                <div className="text-sm text-muted-foreground">{stockData.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg">₹{stockData.ltp.toFixed(2)}</div>
                <div className={`text-sm ${stockData.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stockData.change >= 0 ? "+" : ""}
                  {stockData.change.toFixed(2)} ({stockData.changePercent}%)
                </div>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Type Tabs */}
            <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "market" | "limit")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="limit">Limit</TabsTrigger>
              </TabsList>

              <TabsContent value="market" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">₹{stockData.ltp.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="limit" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="limit-quantity">Quantity</Label>
                  <Input
                    id="limit-quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limit-price">Limit Price</Label>
                  <Input
                    id="limit-price"
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Market Price</span>
                    <span className="font-medium">₹{stockData.ltp.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className={`flex-1 ${action === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                disabled={!quantity || (orderType === "limit" && !price)}
              >
                {action === "buy" ? (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Buy
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Sell
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
