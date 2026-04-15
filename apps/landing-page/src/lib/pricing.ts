// src/lib/pricing.ts

export const AVAILABLE_MODES = ['PURCHASE', 'SUBSCRIPTION'] as const;

// This is your global "Toggle"
// Set this to 'PURCHASE' or 'SUBSCRIPTION'
export const CURRENT_BILLING_MODE: (typeof AVAILABLE_MODES)[number] =
  'PURCHASE';

export const PRICING_TEXT = {
  PURCHASE: {
    badge: 'LIFETIME DEAL',
    button: 'Buy Once, Own Forever',
    footer: 'Pay once. No recurring fees.',
  },
  SUBSCRIPTION: {
    badge: 'LIMITED TIME OFFER',
    button: 'Start 14-Day Free Trial',
    footer: 'Cancel anytime. No hidden fees.',
  },
};
