import { db } from "@/db/drizzle"
import { eq, sql, and, or } from "drizzle-orm"
import {
  affiliate,
  affiliateClick,
  affiliateInvoice,
  affiliateLink,
  promotionCodes,
  referrals,
} from "@/db/schema"
import { buildWhereWithDate } from "@/util/BuildWhereWithDate"

export async function getAffiliateKpiStatsAction(
  orgId: string,
  affiliateId: string,
  year?: number,
  month?: number
) {
  const getDateFilters = (table: any) => {
    const filters = buildWhereWithDate([], table, year, month)
    return Array.isArray(filters) ? filters : [filters]
  }

  // 1. Total Links count (Scoped by orgId and affiliateId)
  const totalLinks = await db
    .select({ count: sql<number>`count(*)` })
    .from(affiliateLink)
    .innerJoin(affiliate, eq(affiliate.id, affiliateLink.affiliateId))
    .where(
      and(eq(affiliate.id, affiliateId), eq(affiliate.organizationId, orgId))
    )
    .then((res) => res[0]?.count ?? 0)

  // 2. Clicks (Scoped)
  const clickSq = db
    .select({
      clicks: sql<number>`count(${affiliateClick.id})`.as("clicks"),
    })
    .from(affiliateClick)
    .innerJoin(
      affiliateLink,
      eq(affiliateLink.id, affiliateClick.affiliateLinkId)
    )
    .innerJoin(affiliate, eq(affiliate.id, affiliateLink.affiliateId))
    .where(
      and(
        eq(affiliate.id, affiliateId),
        eq(affiliate.organizationId, orgId),
        ...getDateFilters(affiliateClick)
      )
    )
    .as("click_sq")

  // 3. Referrals (Scoped)
  const referralSq = db
    .select({
      signups:
        sql<number>`count(case when ${referrals.convertedAt} is null then 1 end)`.as(
          "signups"
        ),
      paidReferrals:
        sql<number>`count(case when ${referrals.convertedAt} is not null then 1 end)`.as(
          "paid_referrals"
        ),
    })
    .from(referrals)
    .where(
      and(
        eq(referrals.affiliateId, affiliateId),
        eq(referrals.organizationId, orgId),
        ...getDateFilters(referrals)
      )
    )
    .as("ref_sq")

  // 4. Invoices (Scoped and Fan-out proof)
  const invoiceSq = db
    .select({
      salesCount:
        sql<number>`count(case when ${affiliateInvoice.reason} in ('subscription_create', 'one_time') and ${affiliateInvoice.refundedAt} is null then 1 end)`.as(
          "sales_count"
        ),
      totalComm:
        sql<number>`sum(case when ${affiliateInvoice.refundedAt} is null then ${affiliateInvoice.commission} else 0 end)`.as(
          "total_comm"
        ),
      totalPaid:
        sql<number>`sum(case when ${affiliateInvoice.refundedAt} is null then ${affiliateInvoice.paidAmount} else 0 end)`.as(
          "total_paid"
        ),
      totalUnpaid:
        sql<number>`sum(case when ${affiliateInvoice.refundedAt} is null then ${affiliateInvoice.unpaidAmount} else 0 end)`.as(
          "total_unpaid"
        ),
      totalAmt:
        sql<number>`sum(case when ${affiliateInvoice.refundedAt} is null then ${affiliateInvoice.amount} else 0 end)`.as(
          "total_amt"
        ),
    })
    .from(affiliateInvoice)
    .leftJoin(
      affiliateLink,
      eq(affiliateInvoice.affiliateLinkId, affiliateLink.id)
    )
    .leftJoin(
      promotionCodes,
      eq(affiliateInvoice.promotionCodeId, promotionCodes.id)
    )
    // Scope the invoice by checking the affiliate's org
    .leftJoin(affiliate, eq(affiliate.id, affiliateId))
    .where(
      and(
        or(
          eq(affiliateLink.affiliateId, affiliateId),
          eq(promotionCodes.affiliateId, affiliateId)
        ),
        eq(affiliate.organizationId, orgId),
        ...getDateFilters(affiliateInvoice)
      )
    )
    .as("inv_sq")

  // 5. Final Join
  return db
    .select({
      totalLinks: sql`${totalLinks}`.mapWith(Number),
      totalVisitors: sql<number>`coalesce(${clickSq.clicks}, 0)`.mapWith(
        Number
      ),
      totalSignups: sql<number>`coalesce(${referralSq.signups}, 0)`.mapWith(
        Number
      ),
      totalPaidReferrals:
        sql<number>`coalesce(${referralSq.paidReferrals}, 0)`.mapWith(Number),
      sales: sql<number>`coalesce(${invoiceSq.salesCount}, 0)`.mapWith(Number),
      commission: sql<number>`coalesce(${invoiceSq.totalComm}, 0)`.mapWith(
        Number
      ),
      paid: sql<number>`coalesce(${invoiceSq.totalPaid}, 0)`.mapWith(Number),
      unpaid: sql<number>`coalesce(${invoiceSq.totalUnpaid}, 0)`.mapWith(
        Number
      ),
      amount: sql<number>`coalesce(${invoiceSq.totalAmt}, 0)`.mapWith(Number),
      clickToSignupRate:
        sql<number>`coalesce(round(((${referralSq.signups})::float / nullif(${clickSq.clicks}, 0)::float) * 100, 2), 0)`.mapWith(
          Number
        ),
      signupToPaidRate:
        sql<number>`coalesce(round(((${referralSq.paidReferrals})::float / nullif(${referralSq.signups}, 0)::float) * 100, 2), 0)`.mapWith(
          Number
        ),
    })
    .from(clickSq)
    .leftJoin(referralSq, sql`1=1`)
    .leftJoin(invoiceSq, sql`1=1`)
}
