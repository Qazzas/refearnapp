export type PricingTier = "PRO" | "ULTIMATE"
export type SubscriptionCycle = "MONTHLY" | "YEARLY"

interface PricingConfig {
  readonly SUBSCRIPTION: {
    readonly [K in PricingTier]: {
      readonly [C in SubscriptionCycle]: number
    }
  }
  readonly PURCHASE: {
    readonly [K in PricingTier]: number
  }
  readonly SELF_HOSTED: {
    readonly [K in PricingTier]: number
  }
  readonly MARKUP_PERCENT: number
}

export const PRICING_CONFIG: PricingConfig = {
  SUBSCRIPTION: {
    PRO: { MONTHLY: 40, YEARLY: 384 },
    ULTIMATE: { MONTHLY: 60, YEARLY: 576 },
  },
  PURCHASE: {
    PRO: 199,
    ULTIMATE: 299,
  },
  SELF_HOSTED: {
    PRO: 199,
    ULTIMATE: 299,
  },
  MARKUP_PERCENT: 1.43,
} as const
