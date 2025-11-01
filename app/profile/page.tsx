"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp, Menu, History, Settings, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MobileNav } from "@/components/mobile-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock user data
const mockUserData = {
  name: "User Name",
  email: "user@example.com",
  phone: "+91 98765 43210",
  joinDate: "January 2025",
  accountType: "Virtual Trading",
  totalTrades: 45,
  successRate: 68.9,
  totalPnL: 25430.5,
}

// Mock trading history
const mockTradeHistory = [
  {
    id: "1",
    symbol: "RELIANCE",
    type: "buy" as const,
    quantity: 10,
    price: 2580.5,
    total: 25805,
    date: "2025-03-05",
    time: "10:30 AM",
    status: "completed" as const,
  },
  {
    id: "2",
    symbol: "TCS",
    type: "sell" as const,
    quantity: 5,
    price: 3450.75,
    total: 17253.75,
    date: "2025-03-04",
    time: "02:15 PM",
    status: "completed" as const,
  },
  {
    id: "3",
    symbol: "INFY",
    type: "buy" as const,
    quantity: 15,
    price: 1520.25,
    total: 22803.75,
    date: "2025-03-03",
    time: "11:45 AM",
    status: "completed" as const,
  },
  {
    id: "4",
    symbol: "HDFCBANK",
    type: "sell" as const,
    quantity: 8,
    price: 1580.0,
    total: 12640,
    date: "2025-03-02",
    time: "04:20 PM",
    status: "completed" as const,
  },
  {
    id: "5",
    symbol: "ICICIBANK",
    type: "buy" as const,
    quantity: 20,
    price: 1020.5,
    total: 20410,
    date: "2025-03-01",
    time: "09:00 AM",
    status: "completed" as const,
  },
]

// Mock pending orders
const mockPendingOrders = [
  {
    id: "1",
    symbol: "BHARTIARTL",
    type: "buy" as const,
    quantity: 12,
    price: 1245.3,
    total: 14943.6,
    date: "2025-03-05",
    time: "03:45 PM",
    status: "pending" as const,
  },
  {
    id: "2",
    symbol: "WIPRO",
    type: "sell" as const,
    quantity: 25,
    price: 450.75,
    total: 11268.75,
    date: "2025-03-05",
    time: "01:20 PM",
    status: "pending" as const,
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
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
              Dashboard
            </Link>
            <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Portfolio
            </Link>
            <Link href="/watchlist" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Watchlist
            </Link>
            <Link href="/funds" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Funds
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button size="sm" className="hidden md:flex" asChild>
              <Link href="/trade">Trade</Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  U
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold">
                U
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{mockUserData.name}</h1>
                <p className="text-muted-foreground mt-1">{mockUserData.email}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>Member since {mockUserData.joinDate}</span>
                  <span>•</span>
                  <span>{mockUserData.accountType}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent" asChild>
                <Link href="/account">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockUserData.totalTrades}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockUserData.successRate}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">+₹{mockUserData.totalPnL.toLocaleString("en-IN")}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
            <TabsTrigger value="orders">Pending Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-between bg-transparent" asChild>
                  <Link href="/account">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5" />
                      <span>Account Settings</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-between bg-transparent" asChild>
                  <Link href="/profile?tab=history">
                    <div className="flex items-center gap-3">
                      <History className="w-5 h-5" />
                      <span>View Trade History</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-between bg-transparent" asChild>
                  <Link href="/dashboard">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5" />
                      <span>View Portfolio</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between text-red-600 hover:text-red-600 bg-transparent"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Full Name</span>
                  <span className="font-medium">{mockUserData.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{mockUserData.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{mockUserData.phone}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="font-medium">{mockUserData.accountType}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
              </CardHeader>
              <CardContent>
                {mockTradeHistory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No trades yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockTradeHistory.map((trade) => (
                      <div
                        key={trade.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              trade.type === "buy" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}
                          >
                            {trade.type === "buy" ? "B" : "S"}
                          </div>
                          <div>
                            <div className="font-semibold">{trade.symbol}</div>
                            <div className="text-sm text-muted-foreground">
                              {trade.quantity} shares @ ₹{trade.price.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {trade.date} • {trade.time}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold">₹{trade.total.toLocaleString("en-IN")}</div>
                          <div className="text-sm text-muted-foreground capitalize">{trade.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {mockPendingOrders.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No pending orders</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockPendingOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              order.type === "buy" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}
                          >
                            {order.type === "buy" ? "B" : "S"}
                          </div>
                          <div>
                            <div className="font-semibold">{order.symbol}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.quantity} shares @ ₹{order.price.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.date} • {order.time}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold">₹{order.total.toLocaleString("en-IN")}</div>
                          <div className="text-sm text-yellow-600 capitalize">{order.status}</div>
                          <Button variant="ghost" size="sm" className="mt-2 text-red-600 hover:text-red-600">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
