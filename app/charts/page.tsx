"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { usePrices } from "@/contexts/price-context"
import { StockListItem } from "@/components/stock-list-item"
import { StockPreviewPanel } from "@/components/stock-preview-panel"
import { AuthGuard } from "@/components/auth-guard"

const topStocks = [
  { symbol: "RELIANCE", name: "Reliance Industries" },
  { symbol: "TCS", name: "Tata Consultancy Services" },
  { symbol: "INFY", name: "Infosys Limited" },
  { symbol: "HDFCBANK", name: "HDFC Bank" },
  { symbol: "ICICIBANK", name: "ICICI Bank" },
  { symbol: "WIPRO", name: "Wipro Limited" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel" },
  { symbol: "ITC", name: "ITC Limited" },
  { symbol: "SBIN", name: "State Bank of India" },
  { symbol: "AXISBANK", name: "Axis Bank" },
]

function ChartsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStock, setSelectedStock] = useState(topStocks[0])
  const { getPrice } = usePrices()

  const filteredStocks = topStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0 animate-fade-in">
      <Navbar showPrivacyToggle={false} />

      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stock List */}
            <div className="lg:col-span-1">
              <h3 className="font-semibold text-sm mb-3 text-muted-foreground">Top Stocks</h3>
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {filteredStocks.map((stock) => (
                  <StockListItem
                    key={stock.symbol}
                    symbol={stock.symbol}
                    name={stock.name}
                    isSelected={selectedStock.symbol === stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                  />
                ))}
              </div>
              {filteredStocks.length === 0 && (
                <Card className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">No stocks found.</p>
                </Card>
              )}
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <StockPreviewPanel symbol={selectedStock.symbol} name={selectedStock.name} />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <MobileNav />
    </div>
  )
}

export default function ChartsPage() {
  return (
    <AuthGuard>
      <ChartsContent />
    </AuthGuard>
  )
}
