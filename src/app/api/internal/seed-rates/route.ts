import { NextRequest, NextResponse } from "next/server"
//@ts-ignore
import currencyapi from "@everapi/currencyapi-js"
import { db } from "@/db/drizzle"
import { exchangeRate } from "@/db/schema"

export async function POST(req: NextRequest) {
  // 1. Security Check
  const secret = req.headers.get("x-internal-secret")
  if (secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const client = new currencyapi(process.env.CURRENCY_API_KEY!)
    const res = await client.latest({ base_currency: "USD", type: "fiat" })
    const now = new Date(res.meta.last_updated_at)

    // 2. Database Update Logic
    for (const [code, info] of Object.entries(res.data)) {
      const rate = (info as { value: any }).value.toString()

      await db
        .insert(exchangeRate)
        .values({
          baseCurrency: "USD",
          targetCurrency: code,
          rate,
          fetchedAt: now,
        })
        .onConflictDoUpdate({
          target: [exchangeRate.baseCurrency, exchangeRate.targetCurrency],
          set: {
            rate,
            fetchedAt: now,
          },
        })
    }

    return NextResponse.json({ success: true, message: "Rates updated" })
  } catch (error: any) {
    console.error("❌ Seed Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
