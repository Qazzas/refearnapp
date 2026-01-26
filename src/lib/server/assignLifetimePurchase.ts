import { db } from "@/db/drizzle"
import { purchase } from "@/db/schema"
// 1. Alias the types from the Paddle SDK
import {
  Paddle,
  Environment,
  type Transaction as PaddleTransaction,
} from "@paddle/paddle-node-sdk"
import { paddleConfig } from "@/util/PaddleConfig"

const paddle = new Paddle(paddleConfig.server.apiToken, {
  environment: paddleConfig.env,
})

export async function assignLifetimePurchase(userId: string, txnId: string) {
  if (!userId || !txnId) return

  try {
    const transaction: PaddleTransaction = await paddle.transactions.get(txnId)

    if (transaction.status !== "completed") {
      console.error("Transaction not completed")
      return
    }

    // 💰 totalPaid remains as cents (e.g., 19900 or 29900)
    const totalPaid = parseFloat(transaction.details?.totals?.total || "0")

    let tier: "PRO" | "ULTIMATE" = "PRO"

    // ✅ Match logic to cent values
    if (totalPaid >= 29900) {
      tier = "ULTIMATE"
    } else if (totalPaid >= 19900) {
      tier = "PRO"
    } else {
      console.error("Payment amount invalid:", totalPaid)
      return
    }

    await db.insert(purchase).values({
      id: txnId,
      userId,
      tier,
      price: totalPaid.toString(), // Saves "19900" or "29900"
      currency: transaction.currencyCode || "USD",
      priceId: transaction.items[0]?.price?.id || "manual",
      isActive: true,
    })

    console.log(
      `Successfully assigned ${tier} to ${userId} (Cents: ${totalPaid})`
    )
  } catch (error) {
    console.error("Paddle Transaction Error:", error)
  }
}
