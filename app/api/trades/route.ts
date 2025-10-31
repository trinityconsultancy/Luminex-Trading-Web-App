import { type NextRequest, NextResponse } from "next/server"
import { createTrade, getUserTrades, updateUserFunds } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const trades = await getUserTrades(Number.parseInt(userId))
    return NextResponse.json({ trades })
  } catch (error) {
    console.error("Get trades error:", error)
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { symbol, type, quantity, price } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const total = quantity * price
    const userIdNum = Number.parseInt(userId)

    // Update funds (deduct for BUY, add for SELL)
    const fundsChange = type === "BUY" ? -total : total
    await updateUserFunds(userIdNum, fundsChange)

    // Create trade record
    const trade = await createTrade(userIdNum, symbol, type, quantity, price, total)

    return NextResponse.json({
      trade,
      message: `${type} order executed successfully`,
    })
  } catch (error) {
    console.error("Create trade error:", error)
    return NextResponse.json({ error: "Failed to execute trade" }, { status: 500 })
  }
}
