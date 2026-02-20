import {
  AffiliateKpiStats,
  OrganizationKpiStats,
} from "@/lib/types/affiliate/affiliateKpiStats"
import {
  CheckCircle2,
  DollarSign,
  Link,
  MousePointer,
  Percent,
  ShoppingCart,
  UserPlus,
  Users,
} from "lucide-react"

export const mapAffiliateStats = (stats: AffiliateKpiStats) => [
  { label: "Total Links", value: stats.totalLinks, icon: Link },
  { label: "Total Visitors", value: stats.totalVisitors, icon: MousePointer },
  { label: "Total Signups", value: stats.totalSignups, icon: UserPlus },
  { label: "Total Sales", value: stats.totalSales, icon: ShoppingCart },
  { label: "Click to Signup", value: stats.clickToSignupRate, icon: Percent },
  {
    label: "Paid Referrals",
    value: stats.totalPaidReferrals,
    icon: CheckCircle2,
  },
  { label: "Signup to Paid", value: stats.signupToPaidRate, icon: Percent },
  {
    label: "Total Commission",
    value: stats.totalCommission,
    icon: DollarSign,
  },
  {
    label: "Paid Commission",
    value: stats.totalCommissionPaid,
    icon: DollarSign,
  },
  {
    label: "Unpaid Commission",
    value: stats.totalCommissionUnpaid,
    icon: DollarSign,
  },
]

export const mapOrganizationStats = (stats: OrganizationKpiStats) => [
  { label: "Total Links", value: stats.totalLinks, icon: Link },
  { label: "Total Visitors", value: stats.totalVisitors, icon: MousePointer },
  { label: "Total Signups", value: stats.totalSignups, icon: UserPlus },
  { label: "Total Sales", value: stats.totalSales, icon: ShoppingCart },
  { label: "Click to Signup", value: stats.clickToSignupRate, icon: Percent },
  {
    label: "Paid Referrals",
    value: stats.totalPaidReferrals,
    icon: CheckCircle2,
  },
  { label: "Signup to Paid", value: stats.signupToPaidRate, icon: Percent },
  {
    label: "Total Commission",
    value: stats.totalCommission,
    icon: DollarSign,
  },
  {
    label: "Paid Commission",
    value: stats.totalCommissionPaid,
    icon: DollarSign,
  },
  {
    label: "Unpaid Commission",
    value: stats.totalCommissionUnpaid,
    icon: DollarSign,
  },
  {
    label: "Total Affiliates",
    value: stats.totalAffiliates,
    icon: Users,
  },
  {
    label: "Total Amount",
    value: stats.totalAmount,
    icon: DollarSign,
  },
]
