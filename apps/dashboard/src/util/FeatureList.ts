import { FeatureList } from "@/lib/types/organization/FeatureList"

// Features shared across both Cloud and Self-Hosted
const COMMON_FEATURES: FeatureList[] = [
  { name: "Unlimited affiliates signup", pro: true, ultimate: true },
  { name: "Unlimited revenue from affiliate", pro: true, ultimate: true },
  { name: "PayPal mass payout", pro: true, ultimate: true },
  { name: "Custom domain", pro: true, ultimate: true },
  { name: "Affiliate page customization", pro: true, ultimate: true },
  { name: "Integrate with Stripe and Paddle", pro: true, ultimate: true },
  { name: "Advanced analytics & reports", pro: true, ultimate: true },
  {
    name: "First-time & last-time cookie attribution customization",
    pro: true,
    ultimate: true,
  },
  {
    name: "Set how long affiliates earn commissions",
    pro: true,
    ultimate: true,
  },
  { name: "Private Discord VIP & Support access", pro: true, ultimate: true },
]

const CLOUD_FEATURES: FeatureList[] = [
  { name: "1 organization", pro: true, ultimate: false },
  { name: "Unlimited organizations", pro: false, ultimate: true },
  { name: "Up to 3 team member invitations", pro: true, ultimate: false },
  { name: "Unlimited team member invitations", pro: false, ultimate: true },
]

const SELF_HOSTED_FEATURES: FeatureList[] = [
  { name: "Coupon code tracking", pro: false, ultimate: true },
  { name: "Team management", pro: false, ultimate: true },
]

const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === "true"

// Merge them based on environment
export const featuresList: FeatureList[] = [
  ...COMMON_FEATURES,
  ...(isSelfHosted ? SELF_HOSTED_FEATURES : CLOUD_FEATURES),
]
