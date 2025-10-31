import { type NextRequest, NextResponse } from "next/server"
import { getUserWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const watchlist = await getUserWatchlist(Number.parseInt(userId))
    return NextResponse.json({ watchlist })
  } catch (error) {
    console.error("Get watchlist error:", error)
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { symbol } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await addToWatchlist(Number.parseInt(userId), symbol)
    return NextResponse.json({ message: "Added to watchlist" })
  } catch (error) {
    console.error("Add to watchlist error:", error)
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!userId || !symbol) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    await removeFromWatchlist(Number.parseInt(userId), symbol)
    return NextResponse.json({ message: "Removed from watchlist" })
  } catch (error) {
    console.error("Remove from watchlist error:", error)
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 })
  }
}
