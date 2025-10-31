"use client"

import { Sparkles, TrendingUp, AlertTriangle, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const suggestions = [
  {
    type: "opportunity",
    icon: TrendingUp,
    title: "Strong Buy Signal",
    description: "INFY showing bullish momentum with RSI at 65. Consider adding to position.",
    confidence: "High",
    color: "text-green-600",
  },
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Profit Booking Alert",
    description: "TCS up 12% this month. Consider booking partial profits at current levels.",
    confidence: "Medium",
    color: "text-yellow-600",
  },
  {
    type: "rebalance",
    icon: Target,
    title: "Portfolio Rebalancing",
    description: "Tech sector allocation at 45%. Consider diversifying into banking stocks.",
    confidence: "Medium",
    color: "text-blue-600",
  },
]

export function AISuggestions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon
          return (
            <div
              key={index}
              className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className={`${suggestion.color} mt-0.5`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{suggestion.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.confidence}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
