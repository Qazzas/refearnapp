// app/api/affiliate/[orgId]/dashboard/referrals/route.ts
import { handleRoute } from "@/lib/handleRoute"
import { getAffiliateOrganization } from "@/lib/server/affiliate/GetAffiliateOrganization"
import { getReferralsAction } from "@/lib/server/internal/getReferralAction"
import { NextResponse } from "next/server"

export const GET = handleRoute(
  "Get Affiliate Referrals",
  async (req, { orgId }) => {
    const { searchParams } = new URL(req.url)
    const offset = Number(searchParams.get("offset") || 1)

    // 1. Get the current logged-in affiliate's ID from session/token
    const decoded = await getAffiliateOrganization(orgId)

    const data = await getReferralsAction({
      orgId,
      affiliateId: decoded.id,
      limit: 11,
      offset: (offset - 1) * 10,
    })

    return NextResponse.json({
      ok: true,
      data: {
        rows: data.slice(0, 10),
        hasNext: data.length > 10,
      },
    })
  }
)
