import { getSubscriptionExpiration } from "@/services/getSubscriptionExpiration"

export async function checkSubscriptionExpired(
  subscriptionId: string,
  invoiceCreatedDate: Date
) {
  const expirationRecord = await getSubscriptionExpiration(subscriptionId)
  return !!(
    expirationRecord && invoiceCreatedDate > expirationRecord.expirationDate
  )
}
