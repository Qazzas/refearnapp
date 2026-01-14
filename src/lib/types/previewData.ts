import { AffiliatePaymentRow } from "@/lib/types/affiliatePaymentRow"
import { DummyAffiliateLink } from "@/lib/types/DummyAffiliateLink"

export const dummyAffiliateLinksRaw: DummyAffiliateLink[] = [
  {
    id: "link1",
    fullUrl: "https://example.com/ref/john123",
    createdAt: new Date(),
    clicks: [
      { createdAt: new Date("2025-08-01"), count: 5 },
      { createdAt: new Date("2025-08-05"), count: 10 },
    ],
    sales: [
      { createdAt: new Date("2025-08-01"), count: 1 },
      { createdAt: new Date("2025-08-05"), count: 3 },
    ],
    commissions: [
      { createdAt: new Date("2025-08-01"), amount: 25.5 },
      { createdAt: new Date("2025-08-05"), amount: 75.0 },
    ],
  },
  {
    id: "link2",
    fullUrl: "https://example.com/ref/jane456",
    createdAt: new Date(),
    clicks: [
      { createdAt: new Date("2025-08-02"), count: 3 },
      { createdAt: new Date("2025-08-03"), count: 2 },
    ],
    sales: [{ createdAt: new Date("2025-08-02"), count: 1 }],
    commissions: [{ createdAt: new Date("2025-08-02"), amount: 15.0 }],
  },
]
export const dummyAffiliatePayments: AffiliatePaymentRow[] = [
  {
    month: "2025-06",
    totalCommission: 200.0,
    paidCommission: 150.0,
    unpaidCommission: 50.0,
    currency: "USD",
  },
  {
    month: "2025-07",
    totalCommission: 300.0,
    paidCommission: 200.0,
    unpaidCommission: 100.0,
    currency: "USD",
  },
  {
    month: "2025-08",
    totalCommission: 300.0,
    paidCommission: 200.0,
    unpaidCommission: 0.0,
    currency: "USD",
  },
]
export const dummyProfileData = {
  id: "demo-profile-id",
  name: "Preview User",
  email: "preview.user@example.com",
  paypalEmail: "preview.paypal@gmail.com",
}
