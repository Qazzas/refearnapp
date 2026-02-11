export interface RedisOrgHash {
  userId?: string
  planType?: "FREE" | "PRO" | "ULTIMATE"
  paymentType?: "SUBSCRIPTION" | "ONE-TIME"
  expiresAt?: string | null
  name?: string
  websiteUrl?: string
  referralParam?: string
  cookieLifetimeValue?: string
  cookieLifetimeUnit?: string
  commissionType?: string
  commissionValue?: string
  commissionDurationValue?: string
  commissionDurationUnit?: string
  attributionModel?: string
  currency?: string
}
