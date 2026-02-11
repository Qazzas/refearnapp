"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import {
  account,
  affiliate,
  affiliateAccount,
  team,
  teamAccount,
  user,
} from "@/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { getBaseUrl } from "@/lib/server/affiliate/getBaseUrl"
import { buildAffiliateUrl } from "@/util/Url"
import { assignFreeTrialSubscription } from "@/lib/server/organization/assignFreeTrial"
import { assignLifetimePurchase } from "@/lib/server/organization/assignLifetimePurchase"
import { AppError } from "@/lib/exceptions"
import { handleAction } from "@/lib/handleAction"

type VerifyServerProps = {
  token: string
  mode: "login" | "signup" | "changeEmail"
  redirectUrl?: string
}

type SessionPayload = {
  id: string
  email: string
  type: string
  role: string
  orgIds?: string[]
  activeOrgId?: string
  orgId?: string
}
export const VerifyServer = async ({ token, mode }: VerifyServerProps) => {
  return handleAction("VerifyServer", async () => {
    const baseUrl = await getBaseUrl()
    let decoded: any

    // Initial verification to extract context for error redirects
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY!) as any
    } catch (err) {
      // If the token is totally unreadable, we still need to know where to redirect
      throw new AppError({
        status: 401,
        toast: "Invalid or expired token",
      })
    }

    const transactionId = decoded.transactionId
    const tokenType = (decoded.type as string).toLowerCase() as
      | "organization"
      | "affiliate"
    const tokenRole = decoded.role
      ? (decoded.role.toLowerCase() as "owner" | "team")
      : null
    const orgIds = decoded.orgIds || []
    const activeOrgId = decoded.activeOrgId
    const orgId = decoded.orgId || decoded.organizationId

    const sessionPayload: SessionPayload = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      role: decoded.role,
      orgIds,
      activeOrgId: activeOrgId || undefined,
      orgId: orgId || undefined,
    }

    // 🧠 Step 1: Signup / Email Verification Logic
    if (mode === "signup") {
      if (tokenRole === "team" && tokenType === "organization") {
        const teamAccRecord = await db.query.teamAccount.findFirst({
          where: (ta, { and, eq }) =>
            and(
              eq(ta.teamId, sessionPayload.id),
              eq(ta.provider, "credentials")
            ),
        })
        if (teamAccRecord) {
          await db
            .update(teamAccount)
            .set({ emailVerified: new Date() })
            .where(eq(teamAccount.id, teamAccRecord.id))
        }
      } else if (tokenType === "organization") {
        const userAccount = await db.query.account.findFirst({
          where: (a, { and, eq }) =>
            and(eq(a.userId, sessionPayload.id), eq(a.provider, "credentials")),
        })
        if (userAccount) {
          await db
            .update(account)
            .set({ emailVerified: new Date() })
            .where(eq(account.id, userAccount.id))
        }
        if (transactionId) {
          await assignLifetimePurchase(sessionPayload.id, transactionId)
        } else {
          await assignFreeTrialSubscription(sessionPayload.id)
        }
      } else {
        const affiliateAcc = await db.query.affiliateAccount.findFirst({
          where: (aa, { and, eq }) =>
            and(
              eq(aa.affiliateId, sessionPayload.id),
              eq(aa.provider, "credentials")
            ),
        })
        if (affiliateAcc) {
          await db
            .update(affiliateAccount)
            .set({ emailVerified: new Date() })
            .where(eq(affiliateAccount.id, affiliateAcc.id))
        }
      }
    }

    // 🧠 Step 2: Change Email Logic
    if (mode === "changeEmail") {
      const newEmail = decoded.newEmail
      if (!newEmail)
        throw new AppError({ status: 400, toast: "Missing new email in token" })

      if (tokenRole === "team" && tokenType === "organization") {
        await db
          .update(team)
          .set({ email: newEmail })
          .where(eq(team.id, decoded.id))
      } else if (tokenType === "organization") {
        await db
          .update(user)
          .set({ email: newEmail })
          .where(eq(user.id, decoded.id))
      } else {
        await db
          .update(affiliate)
          .set({ email: newEmail })
          .where(eq(affiliate.id, decoded.id))
      }
      sessionPayload.email = newEmail
    }

    // 🧠 Step 3: Session Cookie Generation
    const cookieStore = await cookies()
    const sessionToken = jwt.sign(sessionPayload, process.env.SECRET_KEY!, {
      expiresIn: decoded.rememberMe ? "30d" : "1d",
    })

    const cookieName =
      tokenRole === "team" && tokenType === "organization"
        ? `teamToken-${sessionPayload.orgId}`
        : tokenType === "organization"
          ? "organizationToken"
          : `affiliateToken-${sessionPayload.orgId}`

    cookieStore.set({
      name: cookieName,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: decoded.rememberMe ? 30 * 24 * 60 * 60 : undefined,
    })

    // 🧠 Step 4: Final Redirect Computation
    const affRedirect = buildAffiliateUrl({
      path: "email-verified",
      organizationId: sessionPayload.orgId,
      baseUrl,
      partial: true,
    })

    return {
      ok: true,
      toast: "Email verified successfully",
      redirectUrl:
        tokenRole === "team" && tokenType === "organization"
          ? `/organization/${sessionPayload.orgId}/teams/email-verified`
          : tokenType === "organization"
            ? "/email-verified"
            : affRedirect,
      tokenType,
      tokenRole,
    }
  })
}
