import { PromotionCodeType } from "@/lib/types/organization/promotion"

export const getDummyCoupons = (): PromotionCodeType[] => {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `dummy-coupon-${i}`,
    code: `PROMO${2026 + i}_${i + 1}`,
    status: i % 5 === 0 ? "inactive" : "active",
    discountValue: (10 + i).toString(),
    discountType: i % 2 === 0 ? "PERCENTAGE" : "FLAT_FEE",
    commissionValue: (5 + i / 2).toFixed(2),
    commissionType: i % 3 === 0 ? "FLAT_FEE" : "PERCENTAGE",
    commissionDurationValue: 12,
    commissionDurationUnit: "month",
    affiliateName: i % 4 === 0 ? `Affiliate User ${i}` : null,
    affiliateEmail: i % 4 === 0 ? `user${i}@example.com` : null,
    createdAt: new Date(Date.now() - i * 86400000),
  }))
}
