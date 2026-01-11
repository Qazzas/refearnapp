"use server"
import { db } from "@/db/drizzle"
import { and, eq, isNull, sql } from "drizzle-orm"
import { affiliateInvoice, affiliateLink } from "@/db/schema"
export async function getAffiliateCommissionByMonthAction(
  decoded: {
    id: string
    orgId: string
  },
  targetYear: number
) {
  return db
    .select({
      month: sql<string>`to_char(${affiliateInvoice.createdAt}, 'YYYY-MM')`,
      linkId: affiliateLink.id,
      // Since we filter in WHERE, we don't need CASE WHEN inside the SUM
      totalCommission:
        sql<number>`sum(CAST(${affiliateInvoice.commission} AS NUMERIC))`.mapWith(
          Number
        ),
      paidCommission:
        sql<number>`sum(CAST(${affiliateInvoice.paidAmount} AS NUMERIC))`.mapWith(
          Number
        ),
      unpaidCommission:
        sql<number>`sum(CAST(${affiliateInvoice.unpaidAmount} AS NUMERIC))`.mapWith(
          Number
        ),
    })
    .from(affiliateInvoice)
    .innerJoin(
      affiliateLink,
      eq(affiliateInvoice.affiliateLinkId, affiliateLink.id)
    )
    .where(
      and(
        // Ensure we are looking at the correct year
        sql`extract(year from ${affiliateInvoice.createdAt}) = ${targetYear}`,
        eq(affiliateLink.organizationId, decoded.orgId),
        eq(affiliateLink.affiliateId, decoded.id),
        // This is the most important line:
        isNull(affiliateInvoice.refundedAt)
      )
    )
    .groupBy(
      sql`to_char(${affiliateInvoice.createdAt}, 'YYYY-MM')`,
      affiliateLink.id
    )
}
