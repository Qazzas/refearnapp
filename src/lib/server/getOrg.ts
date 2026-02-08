"use server"
import { db } from "@/db/drizzle"
import { organization } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Organization } from "@/lib/types/orgAuth"
import { handleAction } from "@/lib/handleAction"
import { getAffiliateOrganization } from "@/lib/server/GetAffiliateOrganization"
import { getAffiliateLinksWithStatsAction } from "@/lib/server/getAffiliateLinksWithStats"
import { ActionResult } from "@/lib/types/response"
import { AppError } from "@/lib/exceptions"

export const getOrg = async (orgId: string): Promise<Organization> => {
  const org = await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
  })

  if (!org) {
    throw new AppError({
      status: 500,
      error: "failed to organization data",
      toast: "failed to fetch organization data",
    })
  }

  return org
}
export const getOrgAction = async (
  orgId: string
): Promise<ActionResult<Organization>> => {
  return handleAction("getAffiliateLinksWithStats", async () => {
    const rows = await getOrg(orgId)
    return { ok: true, data: rows }
  })
}
