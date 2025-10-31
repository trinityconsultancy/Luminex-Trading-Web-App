"use client"

import { Newspaper, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const newsItems = [
  {
    title: "RBI keeps repo rate unchanged at 6.5%",
    source: "Economic Times",
    time: "2 hours ago",
    category: "Policy",
    sentiment: "neutral",
  },
  {
    title: "IT sector shows strong Q4 earnings growth",
    source: "Moneycontrol",
    time: "4 hours ago",
    category: "Earnings",
    sentiment: "positive",
  },
  {
    title: "FII inflows hit 3-month high in May",
    source: "Business Standard",
    time: "6 hours ago",
    category: "Markets",
    sentiment: "positive",
  },
  {
    title: "Crude oil prices surge on supply concerns",
    source: "Reuters",
    time: "8 hours ago",
    category: "Commodities",
    sentiment: "negative",
  },
]

export function MarketNews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Newspaper className="w-4 h-4" />
          Market News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {newsItems.map((news, index) => (
          <div
            key={index}
            className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                  {news.title}
                </h4>
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{news.source}</span>
                <span>•</span>
                <span>{news.time}</span>
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    news.sentiment === "positive"
                      ? "bg-green-500/10 text-green-600"
                      : news.sentiment === "negative"
                        ? "bg-red-500/10 text-red-600"
                        : "bg-muted"
                  }`}
                >
                  {news.category}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
