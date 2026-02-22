import { OrderBy } from "@/lib/types/analytics/orderTypes"

export type PayoutSortKeys = Extract<
  OrderBy,
  | "none"
  | "sales"
  | "commission"
  | "clickToSignupRate"
  | "signupToPaidRate"
  | "signups"
  | "visits"
  | "email"
  | "commissionPaid"
  | "commissionUnpaid"
>
