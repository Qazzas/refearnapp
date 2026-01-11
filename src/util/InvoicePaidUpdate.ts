// util/InvoicePaidUpdate.ts
import { safeFormatAmount } from "@/util/SafeParse"
import { getCurrencyDecimals } from "@/util/CurrencyDecimal"
import { convertToUSD } from "@/util/CurrencyConvert"
import { affiliateInvoice } from "@/db/schema"
import { db } from "@/db/drizzle"
import { eq } from "drizzle-orm"

export const invoicePaidUpdate = async (
  total: string,
  currency: string,
  customerId: string,
  subscriptionId: string,
  affiliateLinkId: string | null,
  commissionType: string,
  commissionValue: string,
  placeholderId?: string | null
) => {
  const rawAmount = safeFormatAmount(total)
  const decimals = getCurrencyDecimals(currency ?? "usd")

  const { amount: invoiceAmount } = await convertToUSD(
    parseFloat(rawAmount),
    currency ?? "usd",
    decimals
  )
  let addedCommission = 0
  if (commissionType === "percentage") {
    addedCommission =
      (parseFloat(invoiceAmount) * parseFloat(commissionValue)) / 100
  } else if (commissionType === "fixed") {
    addedCommission =
      parseFloat(invoiceAmount) < 0 ? 0 : parseFloat(commissionValue)
  }
  // Data to be either inserted or updated
  const invoiceData = {
    amount: invoiceAmount.toString(),
    currency: "USD" as const,
    commission: addedCommission.toString(),
    unpaidAmount: addedCommission.toFixed(2),
    reason: "subscription_update" as const,
    updatedAt: new Date(),
  }

  if (placeholderId) {
    await db
      .update(affiliateInvoice)
      .set(invoiceData)
      .where(eq(affiliateInvoice.id, placeholderId))

    console.log(`✅ Merged invoice data into placeholder: ${placeholderId}`)
  } else {
    await db.insert(affiliateInvoice).values({
      ...invoiceData,
      paymentProvider: "stripe",
      subscriptionId,
      customerId,
      paidAmount: "0.00",
      affiliateLinkId,
    })

    console.log("✅ Inserted fresh invoice record for subscription cycle.")
  }
}
