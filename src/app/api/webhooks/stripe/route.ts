// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

import { db } from "@/db/drizzle"
import { affiliateInvoice, subscriptionExpiration } from "@/db/schema"
import { addDays } from "date-fns"
import { eq } from "drizzle-orm"
import { generateStripeCustomerId } from "@/util/StripeCustomerId"
import { convertToUSD } from "@/util/CurrencyConvert"
import { getCurrencyDecimals } from "@/util/CurrencyDecimal"
import { safeFormatAmount } from "@/util/SafeParse"
import { invoicePaidUpdate } from "@/util/InvoicePaidUpdate"
import { calculateExpirationDate } from "@/util/CalculateExpiration"
import { getAffiliateLinkRecord } from "@/services/getAffiliateLinkRecord"
import { getOrganizationById } from "@/services/getOrganizationById"
import { getSubscriptionExpiration } from "@/services/getSubscriptionExpiration"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  console.log("incoming webhook request")
  const sig = req.headers.get("stripe-signature")!
  const body = await req.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed.", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const metadata = session.metadata || {}
      const refDataRaw = metadata.refearnapp_affiliate_code
      if (!refDataRaw) break
      const { code, commissionType, commissionValue } = JSON.parse(refDataRaw)
      const affiliateLinkRecord = await getAffiliateLinkRecord(code)
      if (!affiliateLinkRecord) break
      const organizationRecord = await getOrganizationById(
        affiliateLinkRecord.organizationId
      )
      if (!organizationRecord) break
      const mode = session.mode
      const isSubscription = mode === "subscription"
      const customerId = session.customer
        ? (session.customer as string)
        : generateStripeCustomerId()
      const subscriptionId = isSubscription
        ? (session.subscription as string)
        : null
      const rawAmount = safeFormatAmount(session.amount_total)
      const rawCurrency = session.currency ?? "usd"
      const decimals = getCurrencyDecimals(session.currency ?? "usd")
      const { amount } = await convertToUSD(
        parseFloat(rawAmount),
        rawCurrency,
        decimals
      )
      let commission = 0
      if (commissionType === "percentage") {
        commission = (parseFloat(amount) * parseFloat(commissionValue)) / 100
      } else if (commissionType === "fixed") {
        commission = parseFloat(commissionValue)
      }
      if (subscriptionId) {
        const subscriptionExpirationRecord =
          await getSubscriptionExpiration(subscriptionId)
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

          console.log(
            "✅ Created subscription expiration record:",
            subscriptionId
          )
        }

        await db.insert(affiliateInvoice).values({
          paymentProvider: "stripe",
          subscriptionId,
          customerId,
          amount: amount.toString(),
          currency: "USD",
          rawAmount,
          rawCurrency,
          commission: commission.toString(),
          paidAmount: "0.00",
          unpaidAmount: commission.toFixed(2),
          affiliateLinkId: affiliateLinkRecord.id,
          reason: "subscription_create",
        })

        console.log(
          "✅ checkout.session.completed — inserted new subscription:",
          subscriptionId
        )
      } else {
        await db.insert(affiliateInvoice).values({
          paymentProvider: "stripe",
          subscriptionId: null,
          customerId,
          amount: amount.toString(),
          currency: "USD",
          rawAmount,
          rawCurrency,
          commission: commission.toString(),
          paidAmount: "0.00",
          unpaidAmount: commission.toFixed(2),
          affiliateLinkId: affiliateLinkRecord.id,
          reason: "one_time",
        })

        console.log(
          "✅ checkout.session.completed — inserted one-time payment:",
          customerId
        )
      }

      break
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription
      const subscriptionId = subscription.id

      console.log("✅ Subscription created:", subscriptionId)

      if (
        subscription.status === "trialing" &&
        subscription.trial_end !== null &&
        subscription.trial_start !== null
      ) {
        const trialDurationMs =
          (subscription.trial_end - subscription.trial_start) * 1000
        const trialDaysOnly = Math.round(
          trialDurationMs / (1000 * 60 * 60 * 24)
        )
        const tryGetAffiliatePayment = async (
          retries: number
        ): Promise<any> => {
          for (let i = 0; i <= retries; i++) {
            const existing = await db.query.affiliateInvoice.findFirst({
              where: (tx, { eq }) => eq(tx.subscriptionId, subscriptionId),
            })
            if (existing) return existing
            if (i < retries) await new Promise((res) => setTimeout(res, 2000))
          }
          return null
        }

        const invoice = await tryGetAffiliatePayment(4)
        if (!invoice) {
          console.warn(
            "❌ No affiliate payment found after retries:",
            subscriptionId
          )
          break
        }
        const affiliateLinkRecord = await db.query.affiliateLink.findFirst({
          where: (link, { eq }) => eq(link.id, invoice.affiliateLinkId),
        })
        if (!affiliateLinkRecord) {
          console.warn("❌ No affiliate link found for invoice:", invoice.id)
          break
        }
        const organizationRecord = await getOrganizationById(
          affiliateLinkRecord.organizationId
        )
        if (!organizationRecord) break
        const existingExpiration =
          await getSubscriptionExpiration(subscriptionId)
        let expirationDate: Date
        if (existingExpiration) {
          expirationDate = addDays(new Date(), trialDaysOnly)

          await db
            .update(subscriptionExpiration)
            .set({ expirationDate })
            .where(eq(subscriptionExpiration.subscriptionId, subscriptionId))
        } else {
          expirationDate = calculateExpirationDate(
            new Date(),
            organizationRecord.commissionDurationValue,
            organizationRecord.commissionDurationUnit
          )

          await db.insert(subscriptionExpiration).values({
            subscriptionId,
            expirationDate,
          })
        }

        console.log(
          "✅ Updated affiliate payment with trial days:",
          subscriptionId
        )
      } else {
        console.log(
          `Subscription status is '${subscription.status}' — skipping`
        )
      }

      break
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice
      const invoiceCreatedDate = new Date(invoice.created * 1000)
      const subscriptionId = invoice.parent?.subscription_details?.subscription
      const customerId = invoice.customer as string
      if (!subscriptionId || typeof subscriptionId !== "string") {
        console.warn("❌ No valid subscriptionId found.")
        return
      }
      const reason = invoice.billing_reason
      if (reason === "subscription_update" || reason === "subscription_cycle") {
        const invoiceRecord = await db.query.affiliateInvoice.findFirst({
          where: (table, { eq }) => eq(table.subscriptionId, subscriptionId),
        })

        if (!invoiceRecord) {
          console.warn(
            "❌ No affiliate invoice found for subscription:",
            subscriptionId
          )
          return
        }

        const affiliateLinkRecord = await db.query.affiliateLink.findFirst({
          where: (link, { eq }) => eq(link.id, invoiceRecord.affiliateLinkId),
        })

        if (!affiliateLinkRecord) {
          console.warn("❌ No affiliate link found for invoice:", invoice.id)
          return
        }

        const organizationRecord = await getOrganizationById(
          affiliateLinkRecord.organizationId
        )
        if (!organizationRecord) break

        const subscriptionExpirationRecord =
          await getSubscriptionExpiration(subscriptionId)
        if (
          subscriptionExpirationRecord &&
          invoiceCreatedDate > subscriptionExpirationRecord.expirationDate
        ) {
          console.warn(
            "❌ Subscription expired — skipping update:",
            subscriptionId
          )
          break
        }

        const total = String(invoice.total_excluding_tax ?? 0)
        const currency = invoice.currency
        const commissionType = organizationRecord.commissionType ?? "percentage"
        const commissionValue = organizationRecord.commissionValue ?? "0.00"
        await invoicePaidUpdate(
          total,
          currency,
          customerId,
          subscriptionId,
          invoiceRecord.affiliateLinkId,
          commissionType,
          commissionValue
        )

        console.log(
          `✅ Updated subscription (${reason}) — amount & commission:`,
          subscriptionId
        )
      }

      break
    }
    case "charge.succeeded": {
      const charge = event.data.object as Stripe.Charge
      const customerId = charge.customer as string
      const chargeId = charge.id
      const maxRetries = 5
      for (let i = 0; i <= maxRetries; i++) {
        const latestPendingInvoice = await db.query.affiliateInvoice.findFirst({
          where: (table, { eq, and, isNull }) =>
            and(eq(table.customerId, customerId), isNull(table.transactionId)),
          orderBy: (table, { desc }) => [desc(table.createdAt)],
        })

        if (latestPendingInvoice) {
          await db
            .update(affiliateInvoice)
            .set({
              transactionId: chargeId,
              updatedAt: new Date(),
            })
            .where(eq(affiliateInvoice.id, latestPendingInvoice.id))

          console.log(
            `✅ Success: Linked Stripe Charge ${chargeId} to Invoice ${latestPendingInvoice.id}`
          )
          break
        }

        if (i < maxRetries) {
          console.log(
            `⏳ Retry ${i + 1}/${maxRetries}: Waiting for invoice record...`
          )
          await new Promise((res) => setTimeout(res, 2000))
        } else {
          console.warn(
            `❌ Failed: No pending invoice found for customer ${customerId} after retries.`
          )
        }
      }
      break
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge
      const chargeId = charge.id
      const invoice = await db.query.affiliateInvoice.findFirst({
        where: eq(affiliateInvoice.transactionId, chargeId),
      })
      if (!invoice) {
        console.warn(
          `⚠️ Stripe refund received for unknown charge: ${chargeId}`
        )
        break
      }
      const rawRefundCurrency = charge.currency ?? "usd"
      const rawRefundAmount = charge.amount_refunded
      const refundDecimals = getCurrencyDecimals(rawRefundCurrency)
      const { amount: refundAmountInUSD } = await convertToUSD(
        rawRefundAmount,
        rawRefundCurrency,
        refundDecimals
      )
      const originalCommissionUSD = parseFloat(invoice.commission || "0")
      const originalAmountUSD = parseFloat(invoice.amount || "0")
      if (originalAmountUSD <= 0) break
      const refundAmountUSDNum = parseFloat(refundAmountInUSD)
      const refundRatio = refundAmountUSDNum / originalAmountUSD

      const commissionReduction = originalCommissionUSD * refundRatio
      const newCommission = Math.max(
        0,
        originalCommissionUSD - commissionReduction
      )
      const isFullRefund =
        charge.refunded || refundAmountUSDNum >= originalAmountUSD - 0.01
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
        `📉 Stripe Refund: Adjusted USD Commission ${originalCommissionUSD} -> ${newCommission.toFixed(2)} for charge: ${chargeId}`
      )
      break
    }
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
