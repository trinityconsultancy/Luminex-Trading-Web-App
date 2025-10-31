"use client"

import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const marketSentiment = {
  bullish: 65,
  bearish: 20,
  neutral: 15,
}

const sectorPerformance = [
  { name: "IT", change: 2.3, trend: "up" },
  { name: "Banking", change: 1.8, trend: "up" },
  { name: "Auto", change: -0.5, trend: "down" },
  { name: "Pharma", change: 0.2, trend: "neutral" },
]

export function TodaysAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Today's Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Market Sentiment</span>
            <span className="text-xs text-muted-foreground">Based on 500+ stocks</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-600 w-16">Bullish</span>
              <Progress value={marketSentiment.bullish} className="h-2 flex-1" />
              <span className="text-xs font-medium w-8 text-right">{marketSentiment.bullish}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-600 w-16">Bearish</span>
              <Progress value={marketSentiment.bearish} className="h-2 flex-1 [&>div]:bg-red-600" />
              <span className="text-xs font-medium w-8 text-right">{marketSentiment.bearish}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">Neutral</span>
              <Progress value={marketSentiment.neutral} className="h-2 flex-1 [&>div]:bg-muted-foreground" />
              <span className="text-xs font-medium w-8 text-right">{marketSentiment.neutral}%</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Top Sector Movers</h4>
          <div className="space-y-2">
            {sectorPerformance.map((sector) => (
              <div
                key={sector.name}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {sector.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : sector.trend === "down" ? (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  ) : (
                    <Minus className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">{sector.name}</span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    sector.change > 0 ? "text-green-600" : sector.change < 0 ? "text-red-600" : "text-muted-foreground"
                  }`}
                >
                  {sector.change > 0 ? "+" : ""}
                  {sector.change}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
