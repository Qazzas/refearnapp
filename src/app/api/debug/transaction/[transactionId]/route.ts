import { db } from "@/db/drizzle"
import { affiliateInvoice } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

// ✅ params must be treated as a Promise in Next.js 15
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  // 1. Await the params to get the transactionId
  const { transactionId } = await params

  // 2. Check for the Secret Header
  const authHeader = request.headers.get("x-refearn-debug-secret")
  if (authHeader !== process.env.DEBUG_SECRET) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const invoice = await db.query.affiliateInvoice.findFirst({
      where: eq(affiliateInvoice.transactionId, transactionId),
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: invoice.transactionId,
      customer_id: invoice.customerId,
      subscription_id: invoice.subscriptionId,
      amount: invoice.rawAmount,
      currency: invoice.rawCurrency,
    })
  } catch (error) {
    console.error("Debug API Error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
