export interface AffiliateStats {
  id: string
  email: string
  visitors: number
  sales: number
  commission: number
  paid: number
  unpaid: number
  links: string[]
  clickToSignupRate: number
  signupToPaidRate: number
  signups: number
  currency: string
}

export interface AffiliatePayout extends Omit<
  AffiliateStats,
  "clickToSignupRate" | "signupToPaidRate"
> {
  paypalEmail?: string
}
export interface AffiliateBasePayout extends Omit<AffiliateStats, "currency"> {
  paypalEmail?: string | null
}
