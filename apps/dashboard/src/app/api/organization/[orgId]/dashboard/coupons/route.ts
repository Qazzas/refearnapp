import { NextResponse } from "next/server"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { handleRoute } from "@/lib/handleRoute"
import { getPromotionCodesAction } from "@/lib/server/organization/getPromotionCodesAction"
import { ExchangeRate } from "@/util/ExchangeRate"
import { CouponSortKeys } from "@/lib/types/organization/couponSortKeys"

export const GET = handleRoute(
  "Get Organization Promotion Codes",
  async (req, { orgId }: { orgId: string }) => {
    const { searchParams } = new URL(req.url)

    // 1. Extract and Parse Params
    const code = searchParams.get("code") || undefined
    const offset = Number(searchParams.get("offset") || 1)

    // Use the shared type for the cast
    const orderBy =
      (searchParams.get("orderBy") as CouponSortKeys) || "createdAt"
    const orderDir = (searchParams.get("orderDir") as "asc" | "desc") || "desc"

    const PAGE_SIZE = 10

    // 2. Auth and Context
    const org = await getOrgAuth(orgId)
    const rate = await ExchangeRate(org.currency)

    // 3. Fetch Data
    const rows = await getPromotionCodesAction(orgId, {
      code,
      limit: PAGE_SIZE + 1,
      offset: (offset - 1) * PAGE_SIZE,
      orderBy,
      orderDir,
    })

    // 4. Transform / Currency Conversion
    const convertedRows = rows.map((row) => ({
      ...row,
      discountValue:
        row.discountType === "FLAT_FEE"
          ? (Number(row.discountValue) * rate).toString()
          : row.discountValue,
      commissionValue:
        row.commissionType === "FLAT_FEE"
          ? (Number(row.commissionValue) * rate).toString()
          : row.commissionValue,
      currency: org.currency,
    }))

    // 5. Paginated Response
    return NextResponse.json({
      ok: true,
      data: {
        rows: convertedRows.slice(0, PAGE_SIZE),
        hasNext: rows.length > PAGE_SIZE,
      },
    })
  }
)
