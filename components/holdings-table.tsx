"use client"

import Link from "next/link"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Holding {
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  ltp: number
  pnl: number
  pnlPercent: number
}

interface HoldingsTableProps {
  holdings: Holding[]
  searchQuery: string
}

export function HoldingsTable({ holdings, searchQuery }: HoldingsTableProps) {
  const filteredHoldings = holdings.filter(
    (holding) =>
      holding.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      holding.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (filteredHoldings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No holdings found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Qty</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Avg Price</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">LTP</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Current Value</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">P&L</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredHoldings.map((holding) => {
              const currentValue = holding.quantity * holding.ltp
              return (
                <tr key={holding.symbol} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4">
                    <Link href={`/stock/${holding.symbol}`} className="hover:underline">
                      <div className="font-medium">{holding.symbol}</div>
                      <div className="text-sm text-muted-foreground">{holding.name}</div>
                    </Link>
                  </td>
                  <td className="text-right py-4 px-4">{holding.quantity}</td>
                  <td className="text-right py-4 px-4">₹{holding.avgPrice.toFixed(2)}</td>
                  <td className="text-right py-4 px-4">₹{holding.ltp.toFixed(2)}</td>
                  <td className="text-right py-4 px-4 font-medium">₹{currentValue.toLocaleString("en-IN")}</td>
                  <td className="text-right py-4 px-4">
                    <div className={holding.pnl >= 0 ? "text-green-600" : "text-red-600"}>
                      <div className="font-medium">
                        {holding.pnl >= 0 ? "+" : ""}₹{Math.abs(holding.pnl).toFixed(2)}
                      </div>
                      <div className="text-sm flex items-center justify-end gap-1">
                        {holding.pnl >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(holding.pnlPercent).toFixed(2)}%
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-4 px-4">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/trade?symbol=${holding.symbol}&action=sell`}>Sell</Link>
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredHoldings.map((holding) => {
          const currentValue = holding.quantity * holding.ltp
          return (
            <div key={holding.symbol} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <Link href={`/stock/${holding.symbol}`}>
                  <div className="font-medium">{holding.symbol}</div>
                  <div className="text-sm text-muted-foreground">{holding.name}</div>
                </Link>
                <div className={`text-right ${holding.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                  <div className="font-medium text-sm">
                    {holding.pnl >= 0 ? "+" : ""}₹{Math.abs(holding.pnl).toFixed(2)}
                  </div>
                  <div className="text-xs flex items-center justify-end gap-1">
                    {holding.pnl >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(holding.pnlPercent).toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground">Qty</div>
                  <div className="font-medium">{holding.quantity}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Avg Price</div>
                  <div className="font-medium">₹{holding.avgPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">LTP</div>
                  <div className="font-medium">₹{holding.ltp.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Value</div>
                  <div className="font-medium">₹{currentValue.toLocaleString("en-IN")}</div>
                </div>
              </div>

              <Button size="sm" variant="outline" className="w-full bg-transparent" asChild>
                <Link href={`/trade?symbol=${holding.symbol}&action=sell`}>Sell</Link>
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
