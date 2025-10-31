// Finnhub API integration for real-time stock data
const FINNHUB_API_KEY = "demo" // Users should get their own free API key from finnhub.io

// Top 10 stocks to track
export const TOP_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "BRK.B", name: "Berkshire Hathaway" },
  { symbol: "JPM", name: "JPMorgan Chase" },
  { symbol: "V", name: "Visa Inc." },
]

// Top 3 indexes
export const TOP_INDEXES = [
  { symbol: "^GSPC", name: "S&P 500", displaySymbol: "SPX" },
  { symbol: "^DJI", name: "Dow Jones", displaySymbol: "DJI" },
  { symbol: "^IXIC", name: "NASDAQ", displaySymbol: "IXIC" },
]

export interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  volume: number
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
    const data = await response.json()

    if (data.c === 0) return null

    const change = data.c - data.pc
    const changePercent = (change / data.pc) * 100

    return {
      symbol,
      name: TOP_STOCKS.find((s) => s.symbol === symbol)?.name || symbol,
      price: data.c,
      change,
      changePercent,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      volume: 0, // Finnhub doesn't provide volume in quote endpoint
    }
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error)
    return null
  }
}

export async function getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
  const quotes = await Promise.all(symbols.map((symbol) => getStockQuote(symbol)))
  return quotes.filter((q): q is StockQuote => q !== null)
}

export async function getStockCandles(
  symbol: string,
  resolution: "D" | "60" | "30" | "15" | "5" | "1",
  from: number,
  to: number,
) {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`,
    )
    const data = await response.json()

    if (data.s === "no_data") return null

    return {
      timestamps: data.t,
      open: data.o,
      high: data.h,
      low: data.l,
      close: data.c,
      volume: data.v,
    }
  } catch (error) {
    console.error(`Error fetching candles for ${symbol}:`, error)
    return null
  }
}
