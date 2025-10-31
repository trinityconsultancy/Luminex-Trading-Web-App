"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const allocationData = [
  { name: "Technology", value: 35, color: "#ef4444" },
  { name: "Finance", value: 28, color: "#f97316" },
  { name: "Energy", value: 20, color: "#eab308" },
  { name: "Telecom", value: 12, color: "#84cc16" },
  { name: "Others", value: 5, color: "#22c55e" },
]

export function PortfolioAllocationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name} ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
