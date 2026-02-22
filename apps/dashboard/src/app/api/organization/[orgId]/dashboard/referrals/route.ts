// app/api/organization/[orgId]/dashboard/referrals/route.ts
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { handleRoute } from "@/lib/handleRoute"
import { getReferralsAction } from "@/lib/server/internal/getReferralAction"
import { NextResponse } from "next/server"

export const GET = handleRoute("Get Org Referrals", async (req, { orgId }) => {
  const { searchParams } = new URL(req.url)
  const offset = Number(searchParams.get("offset") || 1)
  const PAGE_SIZE = 10

  await getOrgAuth(orgId)

  const data = await getReferralsAction({
    orgId,
    limit: PAGE_SIZE + 1,
    offset: (offset - 1) * PAGE_SIZE,
  })

  return NextResponse.json({
    ok: true,
    data: {
      rows: data.slice(0, PAGE_SIZE),
      hasNext: data.length > PAGE_SIZE,
    },
  })
})
