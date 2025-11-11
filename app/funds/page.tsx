"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp, Menu, Plus, Minus, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MobileNav } from "@/components/mobile-nav"
import { AddFundsModal } from "@/components/add-funds-modal"
import { WithdrawFundsModal } from "@/components/withdraw-funds-modal"
import { AuthGuard } from "@/components/auth-guard"

// Mock funds data
const mockFundsData = {
  availableBalance: 50000,
  investedAmount: 100000,
  totalValue: 125430.5,
  totalPnL: 25430.5,
}

// Mock transaction history
const mockTransactions = [
  {
    id: "1",
    type: "credit" as const,
    amount: 50000,
    date: "2025-03-05",
    time: "10:30 AM",
    status: "completed" as const,
    method: "UPI",
  },
  {
    id: "2",
    type: "debit" as const,
    amount: 25000,
    date: "2025-03-01",
    time: "02:15 PM",
    status: "completed" as const,
    method: "Bank Transfer",
  },
  {
    id: "3",
    type: "credit" as const,
    amount: 75000,
    date: "2025-02-28",
    time: "11:45 AM",
    status: "completed" as const,
    method: "UPI",
  },
  {
    id: "4",
    type: "debit" as const,
    amount: 10000,
    date: "2025-02-25",
    time: "04:20 PM",
    status: "completed" as const,
    method: "Bank Transfer",
  },
  {
    id: "5",
    type: "credit" as const,
    amount: 100000,
    date: "2025-02-20",
    time: "09:00 AM",
    status: "completed" as const,
    method: "Bank Transfer",
  },
]

function FundsContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

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
            <Link href="/funds" className="text-sm font-medium text-foreground">
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
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold">Funds</h1>
          <p className="text-muted-foreground mt-1">Manage your virtual trading balance</p>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">₹{mockFundsData.availableBalance.toLocaleString("en-IN")}</div>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Funds
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setIsWithdrawModalOpen(true)}
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Invested</span>
                  <span className="font-semibold">₹{mockFundsData.investedAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Value</span>
                  <span className="font-semibold">₹{mockFundsData.totalValue.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">Total P&L</span>
                  <span className="font-semibold text-green-600">
                    +₹{mockFundsData.totalPnL.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
                <Link href="/trade">
                  <TrendingUp className="w-6 h-6" />
                  <span>Start Trading</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 bg-transparent"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="w-6 h-6" />
                <span>Add More Funds</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard">
                  <Wallet className="w-6 h-6" />
                  <span>View Portfolio</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {mockTransactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowDownRight className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {transaction.type === "credit" ? "Funds Added" : "Funds Withdrawn"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.date} • {transaction.time} • {transaction.method}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN")}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">{transaction.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Virtual Trading Balance</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This is a demo platform with virtual money. All transactions are simulated for educational purposes.
                  No real money is involved in any trades or transactions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Modals */}
      <AddFundsModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <WithdrawFundsModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} />
    </div>
  )
}

export default function FundsPage() {
  return (
    <AuthGuard>
      <FundsContent />
    </AuthGuard>
  )
}
