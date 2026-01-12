import { db } from "@/db/drizzle"
import { affiliateInvoice } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { transactionId: string } }
) {
  // 1. Check for a Secret Header to prevent public access
  const authHeader = request.headers.get("x-refearn-debug-secret")
  if (authHeader !== process.env.DEBUG_SECRET) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { transactionId } = params

  try {
    const invoice = await db.query.affiliateInvoice.findFirst({
      where: eq(affiliateInvoice.transactionId, transactionId),
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Return the specific fields your script needs
    return NextResponse.json({
      id: invoice.transactionId,
      customer_id: invoice.customerId,
      subscription_id: invoice.subscriptionId,
      amount: invoice.rawAmount,
      currency: invoice.rawCurrency,
    })
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
