import { OrderDir, OrderBy } from "@/lib/types/analytics/orderTypes"

export interface ExportAffiliatePayoutsBulk {
  orgId: string
  months: { year: number; month: number }[]
  orderBy?: OrderBy
  orderDir?: OrderDir
  email?: string
}
