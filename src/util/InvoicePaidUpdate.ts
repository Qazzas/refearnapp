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
  const rawCurrency = currency ?? "usd"
  const decimals = getCurrencyDecimals(rawCurrency)

  const { amount: invoiceAmount } = await convertToUSD(
    parseFloat(rawAmount),
    rawCurrency,
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

  // Define the shared data for both Update and Insert
  const invoiceData = {
    amount: invoiceAmount.toString(),
    currency: "USD" as const,
    rawAmount,
    rawCurrency,
    commission: addedCommission.toString(),
    unpaidAmount: addedCommission.toFixed(2),
    reason: "subscription_update" as const,
    updatedAt: new Date(),
    subscriptionId,
    affiliateLinkId,
  }

  if (placeholderId) {
    // UPDATING THE PLACEHOLDER
    await db
      .update(affiliateInvoice)
      .set(invoiceData) // Now includes subId, linkId, and rawAmount
      .where(eq(affiliateInvoice.id, placeholderId))

    console.log(`✅ Merged full data into placeholder: ${placeholderId}`)
  } else {
    // INSERTING FRESH RECORD
    await db.insert(affiliateInvoice).values({
      ...invoiceData,
      paymentProvider: "stripe" as const,
      customerId,
      paidAmount: "0.00",
    })

    console.log("✅ Inserted fresh invoice record for subscription cycle.")
  }
}
