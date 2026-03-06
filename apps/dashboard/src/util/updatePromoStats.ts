import { db } from "@/db/drizzle"
import { promotionCodes } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

/**
 * Atomically updates promo code sales and revenue statistics
 */
export async function updatePromoStats(
  promoCodeId: string,
  amount: string | number
) {
  const numericAmount = parseFloat(amount.toString())

  await db
    .update(promotionCodes)
    .set({
      totalSales: sql`${promotionCodes.totalSales} + 1`,
      totalRevenueGenerated: sql`${promotionCodes.totalRevenueGenerated} + ${numericAmount}`,
      updatedAt: new Date(),
    })
    .where(eq(promotionCodes.id, promoCodeId))
}
