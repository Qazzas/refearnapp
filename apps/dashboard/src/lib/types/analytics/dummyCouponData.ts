// @/lib/types/analytics/dummyCouponData.ts
import { AffiliateCouponData } from "@/lib/types/affiliate/affiliateCouponData"

export const getDummyCoupons = (
  currency: string = "USD"
): AffiliateCouponData[] => {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `dummy-coupon-${i}`,
    code: `PROMO${2025 + i}_${i + 1}`,
    discountValue: (10 + i).toString(),
    discountType: i % 2 === 0 ? "PERCENTAGE" : "FLAT_FEE",
    commissionValue: (5 + i / 2).toFixed(2),
    commissionType: i % 3 === 0 ? "FLAT_FEE" : "PERCENTAGE",
    durationValue: 12,
    durationUnit: "month",
    isSeenByAffiliate: i > 5,
    createdAt: new Date(Date.now() - i * 86400000),
    currency: currency,
  }))
}
