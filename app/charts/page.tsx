"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MobileNav } from "@/components/mobile-nav"
import { usePrices } from "@/contexts/price-context"
import { StockListItem } from "@/components/stock-list-item"
import { StockPreviewPanel } from "@/components/stock-preview-panel"

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

export default function ChartsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStock, setSelectedStock] = useState(topStocks[0])
  const { getPrice } = usePrices()

  const filteredStocks = topStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 animate-fade-in">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Luminex</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/charts" className="text-sm font-medium text-foreground">
              Charts
            </Link>
            <Link href="/holdings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Holdings
            </Link>
            <Link href="/positions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Positions
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button size="sm" className="hidden md:flex" asChild>
              <Link href="/trade">Trade</Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/accounts">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  U
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
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

      <MobileNav />
    </div>
  )
}
