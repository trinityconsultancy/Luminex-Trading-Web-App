"use client"

import type React from "react"

import { useState } from "react"
import { X, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface WithdrawFundsModalProps {
  isOpen: boolean
  onClose: () => void
}

const AVAILABLE_BALANCE = 50000

export function WithdrawFundsModal({ isOpen, onClose }: WithdrawFundsModalProps) {
  const [amount, setAmount] = useState("")

  const quickAmounts = [5000, 10000, 25000, 50000]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Withdrawing funds:", { amount })
    // Simulate success
    onClose()
  }

  const isAmountValid = amount && Number(amount) >= 100 && Number(amount) <= AVAILABLE_BALANCE

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Withdraw Funds</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Available Balance */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
            <div className="text-2xl font-bold">₹{AVAILABLE_BALANCE.toLocaleString("en-IN")}</div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Enter Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 text-lg h-12"
                min="100"
                max={AVAILABLE_BALANCE}
                required
              />
            </div>
            {amount && Number(amount) > AVAILABLE_BALANCE && (
              <p className="text-sm text-red-600">Amount exceeds available balance</p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick Select</Label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts
                .filter((qa) => qa <= AVAILABLE_BALANCE)
                .map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="bg-transparent"
                  >
                    ₹{quickAmount / 1000}k
                  </Button>
                ))}
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-3">
            <Label>Withdrawal Method</Label>
            <div className="flex items-center gap-3 border border-border rounded-lg p-3 bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Bank Transfer</div>
                <div className="text-sm text-muted-foreground">HDFC Bank •••• 4567</div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            This is a demo platform. No real money will be transferred. Funds will be deducted from your virtual account
            instantly.
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!isAmountValid}>
              Withdraw ₹{amount || "0"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
