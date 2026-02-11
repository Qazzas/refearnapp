import { db } from "@/db/drizzle"
import { and, eq, sql } from "drizzle-orm"
import {
  affiliate,
  affiliateClick,
  affiliateInvoice,
  affiliateLink,
} from "@/db/schema"
import { buildWhereWithDate } from "@/util/BuildWhereWithDate"
export async function getAffiliateKpiStatsAction(
  orgId: string,
  affiliateId: string,
  year?: number,
  month?: number
) {
  return db
    .select({
      totalLinks: sql<number>`COUNT(DISTINCT ${affiliateLink.id})`.mapWith(
        Number
      ),

      totalVisitors: sql<number>`COUNT(DISTINCT ${affiliateClick.id})`.mapWith(
        Number
      ),

      sales: sql<number>`COUNT(DISTINCT CASE
        WHEN ${affiliateInvoice.reason} IN ('subscription_create', 'one_time')
      AND ${affiliateInvoice.refundedAt} IS NULL
      THEN ${affiliateInvoice.id}
      END)`.mapWith(Number),

      commission: sql<number>`COALESCE(SUM(CASE 
        WHEN ${affiliateInvoice.refundedAt} IS NULL THEN ${affiliateInvoice.commission}
      ELSE 0 END), 0)`.mapWith(Number),
      paid: sql<number>`COALESCE(SUM(CASE 
        WHEN ${affiliateInvoice.refundedAt} IS NULL THEN ${affiliateInvoice.paidAmount}
      ELSE 0 END), 0)`.mapWith(Number),
      unpaid: sql<number>`COALESCE(SUM(CASE 
        WHEN ${affiliateInvoice.refundedAt} IS NULL THEN ${affiliateInvoice.unpaidAmount}
      ELSE 0 END), 0)`.mapWith(Number),
      amount: sql<number>`COALESCE(SUM(CASE 
        WHEN ${affiliateInvoice.refundedAt} IS NULL THEN ${affiliateInvoice.amount}
      ELSE 0 END), 0)`.mapWith(Number),
    })
    .from(affiliate)
    .innerJoin(affiliateLink, eq(affiliateLink.affiliateId, affiliate.id))
    .leftJoin(
      affiliateClick,
      buildWhereWithDate(
        [eq(affiliateClick.affiliateLinkId, affiliateLink.id)],
        affiliateClick,
        year,
        month
      )
    )
    .leftJoin(
      affiliateInvoice,
      buildWhereWithDate(
        [eq(affiliateInvoice.affiliateLinkId, affiliateLink.id)],
        affiliateInvoice,
        year,
        month
      )
    )
    .where(
      and(eq(affiliate.organizationId, orgId), eq(affiliate.id, affiliateId))
    )
}
