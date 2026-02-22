"use server"
import { ActionResult } from "@/lib/types/organization/response"
import { AffiliatePayout } from "@/lib/types/affiliate/affiliateStats"
import { handleAction } from "@/lib/handleAction"

import { createOrganizationAffiliatePayout } from "@/lib/organizationAction/createOrganizationAffiliatePayout"
import { getTeamAuthAction } from "@/lib/server/team/getTeamAuthAction"
import { PayoutResult } from "@/lib/types/organization/payoutResult"
import { getAffiliatePayoutData } from "@/lib/server/affiliate/getAffiliatePayoutData"
import { getAffiliatePayoutBulkData } from "@/lib/server/affiliate/getAffiliatePayoutBulkData"
import { InsertedRef } from "@/lib/types/organization/insertedRef"
import { CreatePayoutInput } from "@/lib/types/organization/createPayoutInput"
import { ExportAffiliatePayouts } from "@/lib/types/affiliate/exportAffiliatePayout"
import { ExportAffiliatePayoutsBulk } from "@/lib/types/affiliate/exportAffiliatePayoutBulk"
export async function createTeamExportAffiliatePayouts({
  orgId,
  year,
  month,
  orderBy,
  orderDir,
  email,
}: ExportAffiliatePayouts): Promise<
  ActionResult<PayoutResult<AffiliatePayout>>
> {
  return handleAction("getTeamExportAffiliatePayouts", async () => {
    const org = await getTeamAuthAction(orgId)
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
export async function createTeamExportAffiliatePayoutsBulk({
  orgId,
  months,
  orderBy,
  orderDir,
  email,
}: ExportAffiliatePayoutsBulk): Promise<
  ActionResult<PayoutResult<AffiliatePayout>>
> {
  return handleAction("getTeamExportAffiliatePayoutsBulk", async () => {
    const org = await getTeamAuthAction(orgId)
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
export async function createTeamAffiliatePayouts({
  orgId,
  affiliateIds,
  isUnpaid,
  months,
}: CreatePayoutInput): Promise<ActionResult<InsertedRef[]>> {
  return handleAction("createTeamAffiliatePayouts", async () => {
    await getTeamAuthAction(orgId)
    const insertedRefs = await createOrganizationAffiliatePayout({
      orgId,
      affiliateIds,
      isUnpaid,
      months,
    })
    return { ok: true, data: insertedRefs }
  })
}
