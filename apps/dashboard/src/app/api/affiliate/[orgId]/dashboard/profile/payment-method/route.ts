import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { getAffiliateOrganization } from "@/lib/server/affiliate/GetAffiliateOrganization"
import { getPayoutEmailMethod } from "@/lib/server/organization/getPayoutEmailMethod"
export const GET = handleRoute(
  "Get Affiliate Payment Method",
  async (_, { orgId }: { orgId: string }) => {
    // 🔐 Affiliate Auth
    const decoded = await getAffiliateOrganization(orgId)

    // Fetch the specific payment record
    const paypalMethod = await getPayoutEmailMethod(decoded)

    return NextResponse.json({
      ok: true,
      data: {
        paypalEmail: paypalMethod?.accountIdentifier ?? null,
      },
    })
  }
)
