// @/lib/types/referrals.ts
export type ReferralRow = {
  id: string
  signupEmail: string
  signedAt: string
  convertedAt: string | null
  totalRevenue: string
  commissionEarned: string
  currency: string
  affiliateName?: string
}
