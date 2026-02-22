import { ActionResult } from "@/lib/types/organization/response"
import { handleAction } from "@/lib/handleAction"
import { getAffiliateOrganization } from "@/lib/server/affiliate/GetAffiliateOrganization"
import { SafeAffiliateWithCapabilities } from "@/lib/types/affiliate/authAffiliate"
import { getAffiliateAuthCapabilities } from "@/lib/server/affiliate/getAffiliateAuthCapabilities"
import { getAffiliateDataAction } from "@/lib/server/affiliate/getAffiliateDataAction"

export const getAffiliateData = async (
  orgId: string
): Promise<ActionResult<SafeAffiliateWithCapabilities>> => {
  return handleAction("getAffiliateData", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    const { canChangeEmail, canChangePassword } =
      await getAffiliateAuthCapabilities(orgId)
    const affiliateData = await getAffiliateDataAction(decoded)
    return {
      ok: true,
      data: { ...affiliateData, canChangeEmail, canChangePassword },
    }
  })
}
