import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json()

    // Check if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // In production, use proper password hashing (bcrypt)
    // For demo, we'll store password as-is (NOT RECOMMENDED IN PRODUCTION)
    const user = await createUser(email, name, phone, password)

    // Return user data (without password)
    return NextResponse.json({
      user,
      message: "Account created successfully",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}
