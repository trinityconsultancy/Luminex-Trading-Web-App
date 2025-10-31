"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp, Menu, Search, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"

const mockFuturesContracts = [
  { symbol: "NIFTY", expiry: "28 Mar 2024", ltp: 21450.5, change: 125.3, changePercent: 0.59, oi: "12.5M" },
  { symbol: "BANKNIFTY", expiry: "28 Mar 2024", ltp: 45678.25, change: -234.5, changePercent: -0.51, oi: "8.2M" },
  { symbol: "RELIANCE", expiry: "28 Mar 2024", ltp: 2585.75, change: 45.25, changePercent: 1.78, oi: "5.6M" },
]

const mockOptionsChain = [
  { strike: 21300, callLTP: 245.5, callOI: "2.5M", putLTP: 45.25, putOI: "1.8M" },
  { strike: 21400, callLTP: 178.25, callOI: "3.2M", putLTP: 78.5, putOI: "2.1M" },
  { strike: 21500, callLTP: 125.75, callOI: "4.5M", putLTP: 125.25, putOI: "4.2M" },
  { strike: 21600, callLTP: 85.5, callOI: "3.8M", putLTP: 185.75, putOI: "3.5M" },
  { strike: 21700, callLTP: 52.25, callOI: "2.9M", putLTP: 265.5, putOI: "2.7M" },
]

export default function FNOPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContract, setSelectedContract] = useState("NIFTY")

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
            <Link href="/charts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Charts
            </Link>
            <Link href="/positions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Positions
            </Link>
            <Link href="/fno" className="text-sm font-medium text-foreground">
              F&O
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

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Futures & Options</h1>
            <p className="text-sm text-muted-foreground mt-1">Advanced derivatives trading</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs defaultValue="futures" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="futures">Futures</TabsTrigger>
            <TabsTrigger value="options">Options Chain</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
          </TabsList>

          <TabsContent value="futures" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Futures Contracts</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {mockFuturesContracts.map((contract) => (
                    <div
                      key={contract.symbol}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{contract.symbol}</div>
                        <div className="text-sm text-muted-foreground">Expiry: {contract.expiry}</div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">LTP</div>
                          <div className="font-medium">₹{contract.ltp.toFixed(2)}</div>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <div className="text-sm text-muted-foreground">Change</div>
                          <div
                            className={`font-medium flex items-center gap-1 ${contract.change >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {contract.change >= 0 ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {Math.abs(contract.changePercent)}%
                          </div>
                        </div>
                        <div className="text-right hidden md:block">
                          <div className="text-sm text-muted-foreground">OI</div>
                          <div className="font-medium">{contract.oi}</div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="outline" className="bg-transparent">
                            Buy
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            Sell
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="options" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Options Chain - {selectedContract}</CardTitle>
                  <div className="flex gap-2">
                    {["NIFTY", "BANKNIFTY", "RELIANCE"].map((contract) => (
                      <Button
                        key={contract}
                        size="sm"
                        variant={selectedContract === contract ? "default" : "outline"}
                        onClick={() => setSelectedContract(contract)}
                      >
                        {contract}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Call LTP</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Call OI</th>
                        <th className="text-center p-3 text-sm font-medium">Strike</th>
                        <th className="text-right p-3 text-sm font-medium text-muted-foreground">Put OI</th>
                        <th className="text-right p-3 text-sm font-medium text-muted-foreground">Put LTP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOptionsChain.map((option) => (
                        <tr key={option.strike} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="p-3 text-green-600 font-medium">₹{option.callLTP}</td>
                          <td className="p-3 text-sm text-muted-foreground">{option.callOI}</td>
                          <td className="p-3 text-center font-bold">{option.strike}</td>
                          <td className="p-3 text-right text-sm text-muted-foreground">{option.putOI}</td>
                          <td className="p-3 text-right text-red-600 font-medium">₹{option.putLTP}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategies" className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Bull Call Spread", risk: "Limited", reward: "Limited", complexity: "Beginner" },
                { name: "Bear Put Spread", risk: "Limited", reward: "Limited", complexity: "Beginner" },
                { name: "Iron Condor", risk: "Limited", reward: "Limited", complexity: "Advanced" },
                { name: "Straddle", risk: "Limited", reward: "Unlimited", complexity: "Intermediate" },
              ].map((strategy) => (
                <Card key={strategy.name} className="transition-all hover:shadow-md cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base">{strategy.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risk</span>
                      <Badge variant="outline">{strategy.risk}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Reward</span>
                      <Badge variant="outline">{strategy.reward}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Complexity</span>
                      <Badge>{strategy.complexity}</Badge>
                    </div>
                    <Button size="sm" className="w-full mt-4">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNav />
    </div>
  )
}
