import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

// User operations
export async function createUser(email: string, name: string, phone: string, passwordHash: string) {
  const result = await sql`
    INSERT INTO users (email, name, phone, password_hash)
    VALUES (${email}, ${name}, ${phone}, ${passwordHash})
    RETURNING id, email, name, phone, created_at
  `

  // Create initial funds for new user
  if (result[0]) {
    await sql`
      INSERT INTO funds (user_id, balance)
      VALUES (${result[0].id}, 100000.00)
    `
    await sql`
      INSERT INTO user_settings (user_id)
      VALUES (${result[0].id})
    `
  }

  return result[0]
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT id, email, name, phone, password_hash, created_at
    FROM users
    WHERE email = ${email}
  `
  return result[0]
}

export async function getUserById(userId: number) {
  const result = await sql`
    SELECT id, email, name, phone, created_at
    FROM users
    WHERE id = ${userId}
  `
  return result[0]
}

// Funds operations
export async function getUserFunds(userId: number) {
  const result = await sql`
    SELECT balance, updated_at
    FROM funds
    WHERE user_id = ${userId}
  `
  return result[0]
}

export async function updateUserFunds(userId: number, amount: number) {
  const result = await sql`
    UPDATE funds
    SET balance = balance + ${amount}, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId}
    RETURNING balance
  `
  return result[0]
}

// Watchlist operations
export async function getUserWatchlist(userId: number) {
  const result = await sql`
    SELECT stock_symbol, added_at
    FROM watchlists
    WHERE user_id = ${userId}
    ORDER BY added_at DESC
  `
  return result
}

export async function addToWatchlist(userId: number, stockSymbol: string) {
  const result = await sql`
    INSERT INTO watchlists (user_id, stock_symbol)
    VALUES (${userId}, ${stockSymbol})
    ON CONFLICT (user_id, stock_symbol) DO NOTHING
    RETURNING id
  `
  return result[0]
}

export async function removeFromWatchlist(userId: number, stockSymbol: string) {
  await sql`
    DELETE FROM watchlists
    WHERE user_id = ${userId} AND stock_symbol = ${stockSymbol}
  `
}

// Trade operations
export async function createTrade(
  userId: number,
  stockSymbol: string,
  tradeType: "BUY" | "SELL",
  quantity: number,
  price: number,
  total: number,
) {
  const result = await sql`
    INSERT INTO trades (user_id, stock_symbol, trade_type, quantity, price, total)
    VALUES (${userId}, ${stockSymbol}, ${tradeType}, ${quantity}, ${price}, ${total})
    RETURNING id, created_at
  `

  // Update position
  if (tradeType === "BUY") {
    await sql`
      INSERT INTO positions (user_id, stock_symbol, quantity, avg_price)
      VALUES (${userId}, ${stockSymbol}, ${quantity}, ${price})
      ON CONFLICT (user_id, stock_symbol)
      DO UPDATE SET
        quantity = positions.quantity + ${quantity},
        avg_price = ((positions.avg_price * positions.quantity) + (${price} * ${quantity})) / (positions.quantity + ${quantity}),
        updated_at = CURRENT_TIMESTAMP
    `
  } else {
    await sql`
      UPDATE positions
      SET quantity = quantity - ${quantity}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId} AND stock_symbol = ${stockSymbol}
    `
    // Remove position if quantity becomes 0
    await sql`
      DELETE FROM positions
      WHERE user_id = ${userId} AND stock_symbol = ${stockSymbol} AND quantity <= 0
    `
  }

  return result[0]
}

export async function getUserTrades(userId: number, limit = 50) {
  const result = await sql`
    SELECT id, stock_symbol, trade_type, quantity, price, total, status, created_at
    FROM trades
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
  return result
}

// Position operations
export async function getUserPositions(userId: number) {
  const result = await sql`
    SELECT stock_symbol, quantity, avg_price, created_at, updated_at
    FROM positions
    WHERE user_id = ${userId} AND quantity > 0
    ORDER BY updated_at DESC
  `
  return result
}

// Settings operations
export async function getUserSettings(userId: number) {
  const result = await sql`
    SELECT email_notifications, push_notifications, trade_alerts, privacy_mode
    FROM user_settings
    WHERE user_id = ${userId}
  `
  return result[0]
}

export async function updateUserSettings(userId: number, settings: any) {
  const result = await sql`
    UPDATE user_settings
    SET
      email_notifications = COALESCE(${settings.email_notifications}, email_notifications),
      push_notifications = COALESCE(${settings.push_notifications}, push_notifications),
      trade_alerts = COALESCE(${settings.trade_alerts}, trade_alerts),
      privacy_mode = COALESCE(${settings.privacy_mode}, privacy_mode),
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId}
    RETURNING *
  `
  return result[0]
}
