"use server"
import { ResponseData } from "@/lib/types/response"
import { UnpaidMonth } from "@/lib/types/unpaidMonth"
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
import { getTeamAuthAction } from "@/lib/server/getTeamAuthAction"
import { PayoutResult } from "@/lib/types/payoutResult"
export async function getTeamAffiliatePayouts(
  orgId: string,
  year?: number,
  month?: number,
  orderBy?: OrderBy,
  orderDir?: OrderDir,
  offset?: number,
  email?: string,
  mode: "TABLE" | "EXPORT" = "TABLE"
): Promise<ResponseData<PayoutResult<AffiliatePayout>>> {
  return handleAction("getAffiliatePayouts", async () => {
    const org = await getTeamAuthAction(orgId)
    const PAGE_SIZE = 10
    const isExport = mode === "EXPORT"
    const rows = (await getAffiliatePayoutAction(
      orgId,
      year,
      month,
      orderBy === "none" ? undefined : orderBy,
      orderDir,
      isExport ? undefined : PAGE_SIZE + 1,
      isExport ? undefined : ((offset ?? 1) - 1) * PAGE_SIZE,
      email
    )) as AffiliatePayout[]
    const converted = await convertedCurrency<AffiliatePayout>(
      org.currency,
      rows
    )
    if (isExport) {
      return {
        ok: true,
        data: {
          mode: "EXPORT",
          rows: converted,
        },
      }
    }

    return {
      ok: true,
      data: {
        mode: "TABLE",
        rows: converted.slice(0, PAGE_SIZE),
        hasNext: converted.length > PAGE_SIZE,
      },
    }
  })
}
export async function getTeamAffiliatePayoutsBulk(
  orgId: string,
  months: { month: number; year: number }[],
  orderBy?: OrderBy,
  orderDir?: OrderDir,
  offset?: number,
  email?: string,
  mode: "TABLE" | "EXPORT" = "TABLE"
): Promise<ResponseData<PayoutResult<AffiliatePayout>>> {
  return handleAction("getAffiliatePayoutsBulk", async () => {
    const org = await getTeamAuthAction(orgId)
    const PAGE_SIZE = 10
    const isExport = mode === "EXPORT"
    const rows = (await getAffiliatePayoutBulkAction(
      orgId,
      months,
      orderBy === "none" ? undefined : orderBy,
      orderDir,
      isExport ? undefined : PAGE_SIZE + 1,
      isExport ? undefined : ((offset ?? 1) - 1) * PAGE_SIZE,
      email
    )) as AffiliatePayout[]
    const converted = await convertedCurrency<AffiliatePayout>(
      org.currency,
      rows
    )
    if (isExport) {
      return {
        ok: true,
        data: {
          mode: "EXPORT",
          rows: converted,
        },
      }
    }

    return {
      ok: true,
      data: {
        mode: "TABLE",
        rows: converted.slice(0, PAGE_SIZE),
        hasNext: converted.length > PAGE_SIZE,
      },
    }
  })
}

export async function getTeamUnpaidMonths(
  orgId: string
): Promise<ResponseData<UnpaidMonth[]>> {
  return handleAction("getUnpaidMonths", async () => {
    await getTeamAuthAction(orgId)
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

export async function createTeamAffiliatePayouts({
  orgId,
  affiliateIds,
  isUnpaid,
  months,
}: CreatePayoutInput) {
  await getTeamAuthAction(orgId)
  return await createOrganizationAffiliatePayout({
    orgId,
    affiliateIds,
    isUnpaid,
    months,
  })
}
