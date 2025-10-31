import { type NextRequest, NextResponse } from "next/server"
import { getUserPositions } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const positions = await getUserPositions(Number.parseInt(userId))
    return NextResponse.json({ positions })
  } catch (error) {
    console.error("Get positions error:", error)
    return NextResponse.json({ error: "Failed to fetch positions" }, { status: 500 })
  }
}
