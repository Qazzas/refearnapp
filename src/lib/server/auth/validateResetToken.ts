import jwt from "jsonwebtoken"
import { db } from "@/db/drizzle"
import { user, affiliate, team } from "@/db/schema"
import { eq } from "drizzle-orm"
import { handleAction } from "@/lib/handleAction"
import { AppError } from "@/lib/exceptions"

type ValidateResetTokenProps = {
  token: string
  tokenType: "affiliate" | "organization"
}

export const validateResetToken = async ({
  token,
  tokenType,
}: ValidateResetTokenProps) => {
  return handleAction("validateResetToken", async () => {
    // 1. Verify the JWT
    // If it's expired or malformed, jwt.verify throws—handleAction will catch it
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any

    const sessionPayload = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      role: decoded.role,
      orgId: decoded.organizationId || decoded.orgId,
    }

    // 2. Database Verification
    if (tokenType === "organization") {
      if (sessionPayload.role === "TEAM") {
        const existingTeam = await db.query.team.findFirst({
          where: eq(team.id, sessionPayload.id),
        })
        if (!existingTeam)
          throw new AppError({ status: 404, toast: "Team record not found" })
      } else {
        const existingUser = await db.query.user.findFirst({
          where: eq(user.id, sessionPayload.id),
        })
        if (!existingUser)
          throw new AppError({ status: 404, toast: "User record not found" })
      }
    }

    if (tokenType === "affiliate") {
      const existingAffiliate = await db.query.affiliate.findFirst({
        where: eq(affiliate.id, sessionPayload.id),
      })
      if (!existingAffiliate)
        throw new AppError({ status: 404, toast: "Affiliate record not found" })
    }

    return { ok: true, data: sessionPayload }
  })
}
