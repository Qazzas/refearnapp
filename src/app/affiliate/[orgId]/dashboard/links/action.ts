"use server"
import { getAffiliateOrganization } from "@/lib/server/GetAffiliateOrganization"
import { revalidatePath } from "next/cache"
import { ActionResult, MutationData } from "@/lib/types/response"
import { AffiliateLinkWithStats } from "@/lib/types/affiliateLinkWithStats"
import { getAffiliateLinksWithStatsAction } from "@/lib/server/getAffiliateLinksWithStats"
import { createFullUrl } from "@/lib/server/createFullUrl"
import { getBaseUrl } from "@/lib/server/getBaseUrl"
import { buildAffiliateUrl } from "@/util/Url"
import { handleAction } from "@/lib/handleAction"
import { getOrgCurrencyAffiliate } from "@/lib/server/getOrgCurrencyAffiliate"
import { ExchangeRate } from "@/util/ExchangeRate"

export const createAffiliateLink = async (
  orgId: string
): Promise<MutationData> => {
  return handleAction("createAffiliateLink", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    const { org, fullUrl } = await createFullUrl(decoded)
    const baseUrl = await getBaseUrl()
    buildAffiliateUrl({
      path: "dashboard/links",
      organizationId: org.id,
      baseUrl,
      partial: true,
    })
    return { ok: true, toast: `Affiliate link created: ${fullUrl}` }
  })
}

export const getAffiliateLinksWithStats = async (
  orgId: string,
  year?: number,
  month?: number
): Promise<ActionResult<AffiliateLinkWithStats[]>> => {
  return handleAction("getAffiliateLinksWithStats", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    const currency = await getOrgCurrencyAffiliate(orgId)
    const rate = await ExchangeRate(currency)
    const rows = await getAffiliateLinksWithStatsAction(decoded, year, month)
    const AffiliateLinkStats = rows.map((item) => ({
      ...item,
      commission: item.commission * rate,
    }))
    return { ok: true, data: AffiliateLinkStats }
  })
}
