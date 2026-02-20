export interface AffiliateKpiTimeSeries {
  createdAt: string
  visitors: number
  signups: number
  sales: number
  amount: number
  clickToSignupRate: number
  signupToPaidRate: number
}
export type OrganizationKpiTimeSeries = AffiliateKpiTimeSeries
