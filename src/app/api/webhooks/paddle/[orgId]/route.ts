import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/db/drizzle"
import { affiliateInvoice, subscriptionExpiration } from "@/db/schema"
import { eq } from "drizzle-orm"
import { calculateTrialDays } from "@/util/CalculateTrialDays"
import { convertToUSD } from "@/util/CurrencyConvert"
import { getCurrencyDecimals } from "@/util/CurrencyDecimal"
import { safeFormatAmount } from "@/util/SafeParse"
import { addDays } from "date-fns"
import { calculateExpirationDate } from "@/util/CalculateExpiration"
import { getAffiliateLinkRecord } from "@/services/getAffiliateLinkRecord"
import { getOrganizationById } from "@/services/getOrganizationById"
import { getSubscriptionExpiration } from "@/services/getSubscriptionExpiration"
import { getPaddleAccount } from "@/lib/server/getPaddleAccount"

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { orgId } = params
    const rawBody = await request.text()
    const signatureHeader = request.headers.get("paddle-signature")

    if (!signatureHeader) {
      return NextResponse.json({ error: "Missing Signature" }, { status: 400 })
    }

    // 1. Get the secret directly using the orgId from the URL
    const orgPaddleAccount = await getPaddleAccount(orgId)
    if (!orgPaddleAccount) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    const secret = orgPaddleAccount.webhookPublicKey

    // 2. Verify Signature
    const [tsPart, h1Part] = signatureHeader.split(";")
    const timestamp = tsPart.split("=")[1]
    const receivedSignature = h1Part.split("=")[1]

    const signedPayload = `${timestamp}:${rawBody}`
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex")

    if (computedSignature !== receivedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // 3. Parse payload only AFTER verification
    const payload = JSON.parse(rawBody)

    switch (payload.event_type) {
      case "transaction.completed": {
        const tx = payload.data
        const isSubscription = Boolean(tx.subscription_id)
        const transactionId = tx.id
        const customerId = tx.customer_id
        const subscriptionId = tx.subscription_id || null
        const rawCurrency = tx.details?.totals?.currency_code || "USD"
        const rawAmount = safeFormatAmount(tx.details?.totals?.total)
        const decimals = getCurrencyDecimals(rawCurrency)
        const { amount } = await convertToUSD(
          parseFloat(rawAmount),
          rawCurrency,
          decimals
        )

        const customData = tx.custom_data || {}
        const refDataRaw = customData.refearnapp_affiliate_code
        if (!refDataRaw) break

        const { code, commissionType, commissionValue } = JSON.parse(refDataRaw)

        const transactionTime = new Date(tx.created_at)

        let commission = 0
        if (commissionType === "percentage") {
          commission = (parseFloat(amount) * parseFloat(commissionValue)) / 100
        } else if (commissionType === "fixed") {
          commission = parseFloat(amount) < 0 ? 0 : parseFloat(commissionValue)
        }

        const affiliateLinkRecord = await getAffiliateLinkRecord(code)
        if (!affiliateLinkRecord) break
        const organizationRecord = await getOrganizationById(
          affiliateLinkRecord.organizationId
        )
        if (!organizationRecord) break
        if (isSubscription) {
          const subscriptionExpirationRecord =
            await getSubscriptionExpiration(subscriptionId)
          const existingInvoice = await db.query.affiliateInvoice.findFirst({
            where: eq(affiliateInvoice.subscriptionId, subscriptionId),
          })

          const reason = existingInvoice
            ? "subscription_update"
            : "subscription_create"
          if (!subscriptionExpirationRecord) {
            const expirationDate = calculateExpirationDate(
              new Date(),
              organizationRecord.commissionDurationValue,
              organizationRecord.commissionDurationUnit
            )

            await db.insert(subscriptionExpiration).values({
              subscriptionId,
              expirationDate,
            })

            console.log("✅ Created new subscription expiration record:", {
              subscriptionId,
              expirationDate: expirationDate.toISOString(),
            })
          } else if (
            transactionTime > subscriptionExpirationRecord.expirationDate
          ) {
            console.log("🚫 Skipping: transaction after expiration date")
            break
          }
          await db.insert(affiliateInvoice).values({
            paymentProvider: "paddle",
            transactionId,
            subscriptionId,
            customerId,
            amount: amount.toString(),
            currency: "USD",
            commission: commission.toString(),
            paidAmount: "0.00",
            rawCurrency,
            rawAmount,
            unpaidAmount: commission.toFixed(2),
            affiliateLinkId: affiliateLinkRecord.id,
            reason,
          })
          console.log("✅ Inserted new affiliatePayment:", subscriptionId)
        } else {
          // One-time purchase
          await db.insert(affiliateInvoice).values({
            paymentProvider: "paddle",
            transactionId,
            subscriptionId: null,
            customerId,
            amount: amount.toString(),
            currency: "USD",
            commission: commission.toString(),
            paidAmount: "0.00",
            unpaidAmount: commission.toFixed(2),
            affiliateLinkId: affiliateLinkRecord.id,
            reason: "one_time",
          })

          console.log("✅ Inserted one-time affiliatePayment:", customerId)
        }

        console.log("✅ Logged checkTransaction:", subscriptionId ?? customerId)
        break
      }

      case "subscription.created": {
        const sub = payload.data
        const isTrial = sub.status === "trialing"

        if (!isTrial) break

        const subscriptionId = sub.id
        const customData = sub.custom_data || {}
        const refDataRaw = customData.refearnapp_affiliate_code
        if (!refDataRaw) break

        // Extract organization settings from the custom data
        const { code, commissionDurationValue, commissionDurationUnit } =
          JSON.parse(refDataRaw)

        const affiliateLinkRecord = await getAffiliateLinkRecord(code)
        if (!affiliateLinkRecord) break

        // Calculate the Trial Length
        const trialItem = sub.items?.[0]?.price?.trial_period
        const trialDays = calculateTrialDays(
          trialItem?.interval,
          trialItem?.frequency || 0
        )

        // ✅ CORRECT LOGIC:
        // Expiration = Sign-up Date + Trial Days + Commission Duration
        // OR simply Sign-up Date + Commission Duration (depending on your policy)

        // If you want the 90-day window to start AFTER the 60-day trial:
        const baseDate = addDays(new Date(), trialDays)
        const expirationDate = calculateExpirationDate(
          baseDate,
          commissionDurationValue,
          commissionDurationUnit
        )

        const existingExpiration =
          await getSubscriptionExpiration(subscriptionId)

        if (existingExpiration) {
          await db
            .update(subscriptionExpiration)
            .set({ expirationDate })
            .where(eq(subscriptionExpiration.subscriptionId, subscriptionId))
        } else {
          await db.insert(subscriptionExpiration).values({
            subscriptionId,
            expirationDate,
          })
        }

        console.log(
          "✅ Correctly set expiration to:",
          expirationDate.toISOString()
        )
        break
      }
      case "adjustment.updated": {
        const adjustment = payload.data
        const status = adjustment.status
        const action = adjustment.action
        const transactionId = adjustment.transaction_id

        if (status === "approved" && action === "refund") {
          const invoice = await db.query.affiliateInvoice.findFirst({
            where: eq(affiliateInvoice.transactionId, transactionId),
          })

          if (!invoice) {
            console.warn(
              `⚠️ Refund received for unknown transaction: ${transactionId}`
            )
            break
          }

          // 1. Convert the Refunded Amount from Paddle (Local Currency) to USD
          const rawRefundCurrency = adjustment.totals?.currency_code || "USD"
          const rawRefundAmount = parseFloat(adjustment.totals?.total || "0")
          const refundDecimals = getCurrencyDecimals(rawRefundCurrency)

          // We use your convertToUSD function to get the USD value of the refund
          const { amount: refundAmountInUSD } = await convertToUSD(
            rawRefundAmount,
            rawRefundCurrency,
            refundDecimals
          )

          // 2. Safely parse the original values (Fixes TS2345)
          // We use || "0" to provide a fallback string for null values
          const originalCommissionUSD = parseFloat(invoice.commission || "0")
          const originalAmountUSD = parseFloat(invoice.amount || "0")

          if (originalAmountUSD <= 0) break

          // 3. Calculate the Ratio and Reduction in USD
          const refundAmountUSDNum = parseFloat(refundAmountInUSD)
          const refundRatio = refundAmountUSDNum / originalAmountUSD

          const commissionReduction = originalCommissionUSD * refundRatio
          const newCommission = Math.max(
            0,
            originalCommissionUSD - commissionReduction
          )

          // 4. Mathematical Full Refund Check (using USD values)
          const isFullRefund = refundAmountUSDNum >= originalAmountUSD - 0.01

          await db
            .update(affiliateInvoice)
            .set({
              refundedAt: isFullRefund ? new Date() : null,
              commission: newCommission.toFixed(2),
              unpaidAmount: newCommission.toFixed(2),
              updatedAt: new Date(),
            })
            .where(eq(affiliateInvoice.id, invoice.id))

          console.log(
            `📉 Refund (USD): Adjusted ${originalCommissionUSD} -> ${newCommission.toFixed(2)} (Ratio: ${refundRatio.toFixed(4)})`
          )
        }
        break
      }

      default:
        console.log("Unhandled event type:", payload.event_type)
    }

    return NextResponse.json({ received: true, payload }, { status: 200 })
  } catch (err) {
    console.error("Error processing Paddle webhook:", err)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    )
  }
}
