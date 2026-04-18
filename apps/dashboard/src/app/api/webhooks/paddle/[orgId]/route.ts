import { NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/db/drizzle"
import {
  affiliateInvoice,
  promotionCodes,
  subscriptionExpiration,
  ValueType,
  DurationUnit,
} from "@/db/schema"
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
import { getPaddleAccount } from "@/lib/server/organization/getPaddleAccount"
import { handleRoute } from "@/lib/handleRoute"
import { AppError } from "@/lib/exceptions"
import { updatePromoStats } from "@/util/updatePromoStats"
import { convertPaddleReferral } from "@/util/convertPaddleReferral"
import { notifyAffiliateSale } from "@/services/notifyAffiliateSale"

type Params = { orgId: string }

export const POST = handleRoute<Params>(
  "Paddle Affiliate Webhook",
  async (request, params) => {
    const { orgId } = params
    const rawBody = await request.text()
    const signatureHeader = request.headers.get("paddle-signature")

    if (!signatureHeader) {
      throw new AppError({
        error: "MISSING_SIGNATURE",
        toast: "Missing Paddle Signature Header",
        status: 400,
      })
    }

    // 1. Get the secret directly using the orgId
    const orgPaddleAccount = await getPaddleAccount(orgId)
    if (!orgPaddleAccount) {
      throw new AppError({
        error: "ACCOUNT_NOT_FOUND",
        toast: "Paddle account not configured for this org",
        status: 404,
      })
    }

    const secret = orgPaddleAccount.webhookPublicKey

    // 2. Verify Signature
    const [tsPart, h1Part] = signatureHeader.split(";")
    const timestamp = tsPart?.split("=")[1]
    const receivedSignature = h1Part?.split("=")[1]

    if (!timestamp || !receivedSignature) {
      throw new AppError({
        error: "INVALID_SIGNATURE_FORMAT",
        status: 400,
      })
    }

    const signedPayload = `${timestamp}:${rawBody}`
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex")

    if (computedSignature !== receivedSignature) {
      throw new AppError({
        error: "INVALID_SIGNATURE",
        toast: "Signature verification failed",
        status: 401,
      })
    }

    // 3. Parse payload only AFTER verification
    const payload = JSON.parse(rawBody)

    switch (payload.event_type) {
      case "transaction.completed": {
        const tx = payload.data
        const subscriptionId = tx.subscription_id || null
        const transactionId = tx.id
        const customerId = tx.customer_id

        // 1. Setup Currencies
        const rawCurrency = tx.details?.totals?.currency_code || "USD"
        const rawAmount = safeFormatAmount(tx.details?.totals?.total)
        const decimals = getCurrencyDecimals(rawCurrency)
        const { amount: amountInUSD } = await convertToUSD(
          parseFloat(rawAmount),
          rawCurrency,
          decimals
        )
        const isPaidAmount = parseFloat(amountInUSD) > 0
        // 2. Resolve Attribution (Initialize with undefined to satisfy TS)
        let promoRecord = null
        let affiliateLinkRecord
        let email: string | undefined
        // Use explicit types from your schema
        let finalCommissionType: ValueType | undefined
        let finalCommissionValue: string | undefined
        let durationValue: number | undefined
        let durationUnit: DurationUnit | undefined

        if (tx.discount_id) {
          const promo = await db.query.promotionCodes.findFirst({
            where: eq(promotionCodes.externalId, tx.discount_id),
          })
          if (promo && promo.affiliateId) {
            promoRecord = promo
            finalCommissionType = promo.commissionType
            finalCommissionValue = promo.commissionValue
            durationValue = promo.commissionDurationValue
            durationUnit = promo.commissionDurationUnit
          }
        }

        if (!promoRecord) {
          const customData = tx.custom_data || {}
          const refDataRaw = customData.refearnapp_affiliate_code
          if (!refDataRaw) break

          const parsedData = JSON.parse(refDataRaw)
          email = parsedData.email
          affiliateLinkRecord = await getAffiliateLinkRecord(parsedData.code)
          if (!affiliateLinkRecord) break

          const organizationRecord = await getOrganizationById(
            affiliateLinkRecord.organizationId
          )
          if (!organizationRecord) break

          finalCommissionType = parsedData.commissionType as ValueType
          finalCommissionValue = String(parsedData.commissionValue)
          durationValue = organizationRecord.commissionDurationValue ?? 1
          durationUnit =
            (organizationRecord.commissionDurationUnit as DurationUnit) ?? "day"
        }

        // 3. Final safety check (Guards against TS "not assigned" errors)
        if (
          !finalCommissionType ||
          !finalCommissionValue ||
          durationValue === undefined ||
          !durationUnit
        ) {
          break
        }
        if (subscriptionId) {
          const existingExp = await getSubscriptionExpiration(subscriptionId)
          if (existingExp && new Date() > existingExp.expirationDate) {
            console.log(
              `Skipping commission for expired subscription: ${subscriptionId}`
            )
            return NextResponse.json(
              { received: true, status: "expired" },
              { status: 200 }
            )
          }

          // Only update expiration for non-recurring events
          if (tx.origin !== "subscription_recurring") {
            const baseDate = existingExp
              ? existingExp.expirationDate
              : new Date()
            const newExpirationDate = calculateExpirationDate(
              baseDate,
              durationValue,
              durationUnit
            )

            if (!existingExp) {
              await db.insert(subscriptionExpiration).values({
                subscriptionId,
                expirationDate: newExpirationDate,
                promotionCodeId: promoRecord?.id || null,
              })
            } else {
              await db
                .update(subscriptionExpiration)
                .set({
                  expirationDate: newExpirationDate,
                  promotionCodeId: promoRecord?.id || null,
                  updatedAt: new Date(),
                })
                .where(
                  eq(subscriptionExpiration.subscriptionId, subscriptionId)
                )
            }
          }
        }
        // 4. Calculate Commission
        let commission = 0
        if (finalCommissionType === "PERCENTAGE") {
          commission =
            (parseFloat(amountInUSD) * parseFloat(finalCommissionValue)) / 100
        } else {
          commission =
            parseFloat(amountInUSD) < 0 ? 0 : parseFloat(finalCommissionValue)
        }

        // 6. Reason & Insert
        let reason: "one_time" | "subscription_create" | "subscription_update" =
          "one_time"
        if (subscriptionId) {
          const existingInvoice = await db.query.affiliateInvoice.findFirst({
            where: eq(affiliateInvoice.subscriptionId, subscriptionId),
          })
          reason = existingInvoice
            ? "subscription_update"
            : "subscription_create"
        }
        const finalAffiliateId =
          promoRecord?.affiliateId ?? affiliateLinkRecord?.affiliateId
        const finalOrgId =
          orgId ||
          promoRecord?.organizationId ||
          affiliateLinkRecord?.organizationId
        if (finalAffiliateId && finalOrgId) {
          await convertPaddleReferral({
            email: email,
            customerId: customerId,
            affiliateId: finalAffiliateId,
            organizationId: finalOrgId,
            affiliateLinkId: promoRecord
              ? null
              : affiliateLinkRecord?.id || null,
            promotionCodeId: promoRecord?.id || null,
            amount: amountInUSD.toString(),
            commission: commission,
          })
        }
        await db.insert(affiliateInvoice).values({
          paymentProvider: "paddle",
          transactionId,
          subscriptionId,
          customerId,
          amount: amountInUSD.toString(),
          currency: "USD",
          commission: commission.toFixed(2),
          paidAmount: "0.00",
          unpaidAmount: commission.toFixed(2),
          rawCurrency,
          rawAmount,
          promotionCodeId: promoRecord?.id || null,
          affiliateLinkId: promoRecord ? null : affiliateLinkRecord?.id || null,
          reason,
        })
        if (promoRecord) {
          await updatePromoStats(promoRecord.id, amountInUSD)
        }
        if (finalAffiliateId && finalOrgId && isPaidAmount && commission > 0) {
          await notifyAffiliateSale({
            orgId: finalOrgId,
            affiliateId: finalAffiliateId,
            saleAmount: amountInUSD.toString(),
            commissionAmount: commission.toFixed(2),
            currency: "USD",
          })
        }
        break
      }
      case "subscription.created": {
        const sub = payload.data
        const subscriptionId = sub.id
        const isTrial = sub.status === "trialing"
        if (!isTrial) break

        const trialItem = sub.items?.[0]?.price?.trial_period
        const trialDays = calculateTrialDays(
          trialItem?.interval,
          trialItem?.frequency || 0
        )

        const existingExpiration =
          await getSubscriptionExpiration(subscriptionId)

        if (existingExpiration) {
          const newExpiration = addDays(
            existingExpiration.expirationDate,
            trialDays
          )
          await db
            .update(subscriptionExpiration)
            .set({ expirationDate: newExpiration })
            .where(eq(subscriptionExpiration.subscriptionId, subscriptionId))
        } else {
          await db.insert(subscriptionExpiration).values({
            subscriptionId,
            expirationDate: addDays(new Date(), trialDays),
          })
        }
        break
      }

      case "adjustment.updated": {
        const adjustment = payload.data
        if (
          adjustment.status === "approved" &&
          adjustment.action === "refund"
        ) {
          const invoice = await db.query.affiliateInvoice.findFirst({
            where: eq(
              affiliateInvoice.transactionId,
              adjustment.transaction_id
            ),
          })

          if (!invoice) break

          const rawRefundCurrency = adjustment.totals?.currency_code || "USD"
          const rawRefundAmount = parseFloat(adjustment.totals?.total || "0")
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
        }
        break
      }
      case "discount.created": {
        const discount = payload.data
        const isCurrentlyActive =
          discount.status === "active" && discount.enabled_for_checkout === true
        let mappedType: "PERCENTAGE" | "FLAT_FEE" = "PERCENTAGE"
        if (discount.type === "flat" || discount.type === "flat_per_seat") {
          mappedType = "FLAT_FEE"
        }

        await db.insert(promotionCodes).values({
          code: discount.code,
          externalId: discount.id,
          provider: "paddle",
          isActive: isCurrentlyActive,
          discountType: mappedType,
          discountValue: discount.amount,
          currency: discount.currency_code || "USD",
          organizationId: orgId,
          commissionValue: "0.00",
          commissionType: "PERCENTAGE",
        })

        console.log(
          `✅ Paddle Discount Created: ${discount.code} for Org: ${orgId}`
        )
        break
      }
      case "discount.updated": {
        const discount = payload.data
        const isCurrentlyActive =
          discount.status === "active" && discount.enabled_for_checkout === true
        let mappedType: "PERCENTAGE" | "FLAT_FEE" = "PERCENTAGE"
        if (discount.type === "flat" || discount.type === "flat_per_seat") {
          mappedType = "FLAT_FEE"
        }
        await db
          .update(promotionCodes)
          .set({
            code: discount.code,
            isActive: isCurrentlyActive,
            discountType: mappedType,
            discountValue: discount.amount,
            currency: discount.currency_code || "USD",
            updatedAt: new Date(),
          })
          .where(eq(promotionCodes.externalId, discount.id))
        console.log(
          `✅ Paddle Discount Updated: ${discount.id} | Status: ${discount.status} | Active: ${isCurrentlyActive}`
        )
        break
      }
    }

    return NextResponse.json({ received: true, ok: true }, { status: 200 })
  }
)
