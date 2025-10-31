import { type NextRequest, NextResponse } from "next/server"
import { getStockQuote, getMultipleQuotes } from "@/lib/stock-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")
    const symbols = searchParams.get("symbols")

    if (symbols) {
      // Get multiple quotes
      const symbolArray = symbols.split(",")
      const quotes = await getMultipleQuotes(symbolArray)
      return NextResponse.json({ quotes })
    } else if (symbol) {
      // Get single quote
      const quote = await getStockQuote(symbol)
      if (!quote) {
        return NextResponse.json({ error: "Stock not found" }, { status: 404 })
      }
      return NextResponse.json({ quote })
    } else {
      return NextResponse.json({ error: "Symbol or symbols parameter required" }, { status: 400 })
    }
  } catch (error) {
    console.error("Get stock quote error:", error)
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }
}
