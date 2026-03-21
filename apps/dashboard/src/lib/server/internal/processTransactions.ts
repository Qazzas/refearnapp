import { sql, inArray, eq, and, or } from "drizzle-orm"
import { db } from "@/db/drizzle"
import {
  affiliateInvoice,
  affiliateLink,
  payoutReference,
  payoutReferencePeriods,
  promotionCodes,
} from "@/db/schema"
import pLimit from "p-limit"

export interface Transaction {
  Unique_Identifier: string
  Recipient: string
  Status: string
  Amount: number
}

// Bulk update invoices for given payout refs
async function bulkUpdateInvoices(refIds: string[]) {
  if (refIds.length === 0) return { rowCount: 0 }

  return await db.transaction(async (tx) => {
    const payoutDetails = await tx
      .select({
        affiliateId: payoutReference.affiliateId,
        month: payoutReferencePeriods.month,
        year: payoutReferencePeriods.year,
      })
      .from(payoutReference)
      .leftJoin(
        payoutReferencePeriods,
        eq(payoutReference.refId, payoutReferencePeriods.refId)
      )
      .where(inArray(payoutReference.refId, refIds))

    if (payoutDetails.length === 0) return { rowCount: 0 }

    const affiliateIds = payoutDetails.map((p) => p.affiliateId)
    const [links, codes] = await Promise.all([
      tx
        .select({ id: affiliateLink.id })
        .from(affiliateLink)
        .where(inArray(affiliateLink.affiliateId, affiliateIds)),
      tx
        .select({ id: promotionCodes.id })
        .from(promotionCodes)
        .where(inArray(promotionCodes.affiliateId, affiliateIds)),
    ])

    const linkIds = links.map((l) => l.id)
    const codeIds = codes.map((c) => c.id)
    const result = await tx
      .update(affiliateInvoice)
      .set({
        paidAmount: sql`${affiliateInvoice.paidAmount} + ${affiliateInvoice.unpaidAmount}`,
        unpaidAmount: "0.00",
        updatedAt: new Date(),
      })
      .where(
        and(
          sql`${affiliateInvoice.unpaidAmount} > 0`,
          or(
            linkIds.length > 0
              ? inArray(affiliateInvoice.affiliateLinkId, linkIds)
              : undefined,
            codeIds.length > 0
              ? inArray(affiliateInvoice.promotionCodeId, codeIds)
              : undefined
          ),
          or(
            ...payoutDetails.map((p) => {
              if (!p.year) return sql`TRUE`
              const yearMatch = eq(
                sql`EXTRACT(YEAR FROM ${affiliateInvoice.createdAt})`,
                p.year
              )
              const monthMatch =
                p.month && p.month !== 0
                  ? eq(
                      sql`EXTRACT(MONTH FROM ${affiliateInvoice.createdAt})`,
                      p.month
                    )
                  : sql`TRUE`

              return and(yearMatch, monthMatch)
            })
          )
        )
      )
      .returning({ id: affiliateInvoice.id })

    return { rowCount: result.length }
  })
}

// Process transactions from PayPal
export async function processTransactions(transactions: Transaction[]) {
  const completed = transactions.filter((tx) => tx.Status === "Completed")

  if (completed.length === 0) {
    console.log("No completed transactions to process.")
    return
  }
  const refIds = completed.map((tx) => tx.Unique_Identifier)
  const THRESHOLD = 5000

  if (refIds.length <= THRESHOLD) {
    const result = await bulkUpdateInvoices(refIds)
    console.log(
      `✅ Bulk update finished. Updated ${result.rowCount} invoices for ${completed.length} completed transactions.`
    )
  } else {
    const limit = pLimit(20)
    const chunkSize = 2000
    const chunks: string[][] = []

    for (let i = 0; i < refIds.length; i += chunkSize) {
      chunks.push(refIds.slice(i, i + chunkSize))
    }

    const tasks = chunks.map((chunk) =>
      limit(async () => {
        const result = await bulkUpdateInvoices(chunk)
        console.log(
          `Chunk processed (${chunk.length} refs). Updated ${result.rowCount} invoices.`
        )
      })
    )

    await Promise.all(tasks)
    console.log(
      `✅ Large batch finished. Processed ${completed.length} completed transactions for ${refIds.length} refs in ${chunks.length} chunks.`
    )
  }
}
