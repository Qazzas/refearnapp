// @/lib/types/analytics/dummyReferralData.ts

import { ReferralRow } from "@/lib/types/internal/ReferralRow"

export const getDummyReferrals = (currency: string = "USD"): ReferralRow[] => {
  return Array.from({ length: 25 }).map((_, i) => {
    const isConverted = i % 2 === 0
    const signupDate = new Date(Date.now() - i * 3600000 * 5)

    return {
      id: `dummy-ref-${i}`,
      signupEmail: `${String.fromCharCode(97 + (i % 26))}***@${i % 3 === 0 ? "gmail.com" : "outlook.com"}`,
      signedAt: signupDate.toISOString(),
      convertedAt: isConverted
        ? new Date(signupDate.getTime() + 86400000).toISOString()
        : null,
      totalRevenue: isConverted ? (50 + i * 10).toFixed(2) : "0.00",
      commissionEarned: isConverted ? (5 + i).toFixed(2) : "0.00",
      currency: currency,
      affiliateName: i % 4 === 0 ? "John Doe" : "Sarah Smith",
    }
  })
}
