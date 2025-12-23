"use server"
import { ResponseData } from "@/lib/types/response"
import { UnpaidMonth } from "@/lib/types/unpaidMonth"
import { getOrgAuth } from "@/lib/server/GetOrgAuth"
import { AffiliatePayout } from "@/lib/types/affiliateStats"
import { getAffiliatePayoutBulkAction } from "@/lib/server/getAffiliatePayoutBulk"
import { getUnpaidPayoutAction } from "@/lib/server/getUnpaidPayout"
import { getAffiliatePayoutAction } from "@/lib/server/getAffiliatePayout"
import { OrderBy, OrderDir } from "@/lib/types/orderTypes"
import { convertedCurrency } from "@/util/ConvertedCurrency"
import { handleAction } from "@/lib/handleAction"
import {
  createOrganizationAffiliatePayout,
  CreatePayoutInput,
} from "@/lib/organizationAction/createOrganizationAffiliatePayout"
export async function getAffiliatePayouts(
  orgId: string,
  year?: number,
  month?: number,
  orderBy?: OrderBy,
  orderDir?: OrderDir,
  offset?: number,
  email?: string
): Promise<ResponseData<{ rows: AffiliatePayout[]; hasNext: boolean }>> {
  return handleAction("getAffiliatePayouts", async () => {
    const org = await getOrgAuth(orgId)
    const PAGE_SIZE = 10
    const rows = (await getAffiliatePayoutAction(
      orgId,
      year,
      month,
      orderBy === "none" ? undefined : orderBy,
      orderDir,
      PAGE_SIZE + 1,
      ((offset ?? 1) - 1) * PAGE_SIZE,
      email
    )) as AffiliatePayout[]
    const converted = await convertedCurrency<AffiliatePayout>(
      org.currency,
      rows
    )
    return {
      ok: true,
      data: {
        rows: converted.slice(0, PAGE_SIZE),
        hasNext: converted.length > PAGE_SIZE,
      },
    }
  })
}
export async function getAffiliatePayoutsBulk(
  orgId: string,
  months: { month: number; year: number }[],
  orderBy?: OrderBy,
  orderDir?: OrderDir,
  offset?: number,
  email?: string
): Promise<ResponseData<{ rows: AffiliatePayout[]; hasNext: boolean }>> {
  return handleAction("getAffiliatePayoutsBulk", async () => {
    const org = await getOrgAuth(orgId)
    const PAGE_SIZE = 10
    const rows = (await getAffiliatePayoutBulkAction(
      orgId,
      months,
      orderBy === "none" ? undefined : orderBy,
      orderDir,
      PAGE_SIZE + 1,
      ((offset ?? 1) - 1) * PAGE_SIZE,
      email
    )) as AffiliatePayout[]
    const converted = await convertedCurrency<AffiliatePayout>(
      org.currency,
      rows
    )
    return {
      ok: true,
      data: {
        rows: converted.slice(0, PAGE_SIZE),
        hasNext: converted.length > PAGE_SIZE,
      },
    }
  })
}

export async function getUnpaidMonths(
  orgId: string
): Promise<ResponseData<UnpaidMonth[]>> {
  return handleAction("getUnpaidMonths", async () => {
    await getOrgAuth(orgId)
    const rows = await getUnpaidPayoutAction(orgId)

    return {
      ok: true,
      data: rows.map((row) => ({
        month: row.month,
        year: row.year,
        unpaid: row.unpaid,
      })),
    }
  })
}

export async function createAffiliatePayouts({
  orgId,
  affiliateIds,
  isUnpaid,
  months,
}: CreatePayoutInput) {
  await getOrgAuth(orgId)
  return await createOrganizationAffiliatePayout({
    orgId,
    affiliateIds,
    isUnpaid,
    months,
  })
}
