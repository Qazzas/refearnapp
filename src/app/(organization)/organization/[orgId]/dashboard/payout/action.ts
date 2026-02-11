"use server"
import { ActionResult } from "@/lib/types/organization/response"
import { UnpaidMonth } from "@/lib/types/organization/unpaidMonth"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { AffiliatePayout } from "@/lib/types/affiliate/affiliateStats"
import { getUnpaidPayoutAction } from "@/lib/server/organization/getUnpaidPayout"
import { OrderBy, OrderDir } from "@/lib/types/analytics/orderTypes"
import { handleAction } from "@/lib/handleAction"
import { createOrganizationAffiliatePayout } from "@/lib/organizationAction/createOrganizationAffiliatePayout"
import { PayoutResult } from "@/lib/types/organization/payoutResult"
import { getAffiliatePayoutData } from "@/lib/server/affiliate/getAffiliatePayoutData"
import { getAffiliatePayoutBulkData } from "@/lib/server/affiliate/getAffiliatePayoutBulkData"
import { InsertedRef } from "@/lib/types/organization/insertedRef"
import { CreatePayoutInput } from "@/lib/types/organization/createPayoutInput"
import { ExportAffiliatePayoutsBulk } from "@/lib/types/affiliate/exportAffiliatePayoutBulk"
import { ExportAffiliatePayouts } from "@/lib/types/affiliate/exportAffiliatePayout"
export async function getAffiliatePayouts(
  mode: "TABLE" | "EXPORT" = "TABLE",
  orgId: string,
  year?: number,
  month?: number,
  orderBy?: OrderBy,
  orderDir?: OrderDir,
  offset?: number,
  email?: string
): Promise<ActionResult<PayoutResult<AffiliatePayout>>> {
  return handleAction("getAffiliatePayouts", async () => {
    const org = await getOrgAuth(orgId)
    return getAffiliatePayoutData(
      mode,
      org,
      orgId,
      year,
      month,
      orderBy,
      orderDir,
      offset,
      email
    )
  })
}
export async function createExportAffiliatePayouts({
  orgId,
  year,
  month,
  orderBy,
  orderDir,
  email,
}: ExportAffiliatePayouts): Promise<
  ActionResult<PayoutResult<AffiliatePayout>>
> {
  return handleAction("getExportAffiliatePayouts", async () => {
    const org = await getOrgAuth(orgId)
    return getAffiliatePayoutData(
      "EXPORT",
      org,
      orgId,
      year,
      month,
      orderBy,
      orderDir,
      undefined,
      email
    )
  })
}
export async function getAffiliatePayoutsBulk(
  mode: "TABLE" | "EXPORT" = "TABLE",
  orgId: string,
  months: { month: number; year: number }[],
  orderBy?: OrderBy,
  orderDir?: OrderDir,
  offset?: number,
  email?: string
): Promise<ActionResult<PayoutResult<AffiliatePayout>>> {
  return handleAction("getAffiliatePayoutsBulk", async () => {
    const org = await getOrgAuth(orgId)
    return getAffiliatePayoutBulkData(
      mode,
      org,
      orgId,
      months,
      orderBy,
      orderDir,
      offset,
      email
    )
  })
}
export async function createExportAffiliatePayoutsBulk({
  orgId,
  months,
  orderBy,
  orderDir,
  email,
}: ExportAffiliatePayoutsBulk): Promise<
  ActionResult<PayoutResult<AffiliatePayout>>
> {
  return handleAction("getExportAffiliatePayoutsBulk", async () => {
    const org = await getOrgAuth(orgId)
    return getAffiliatePayoutBulkData(
      "EXPORT",
      org,
      orgId,
      months,
      orderBy,
      orderDir,
      undefined,
      email
    )
  })
}

export async function getUnpaidMonths(
  orgId: string
): Promise<ActionResult<UnpaidMonth[]>> {
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
}: CreatePayoutInput): Promise<ActionResult<InsertedRef[]>> {
  return handleAction("createAffiliatePayouts", async () => {
    await getOrgAuth(orgId)
    const insertedRefs = await createOrganizationAffiliatePayout({
      orgId,
      affiliateIds,
      isUnpaid,
      months,
    })
    return { ok: true, data: insertedRefs }
  })
}
