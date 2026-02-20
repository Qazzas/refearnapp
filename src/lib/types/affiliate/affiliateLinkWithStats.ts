export type AffiliateLinkWithStats = {
  id: string
  fullUrl: string
  clicks: number
  sales: number
  createdAt: Date
  signups: number
  clickToSignupRate: number
  signupToPaidRate: number
  commission: number
}
