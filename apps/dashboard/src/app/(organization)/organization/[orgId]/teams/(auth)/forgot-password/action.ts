"use server"

import { db } from "@/db/drizzle"
import jwt from "jsonwebtoken"
import { sendVerificationEmail } from "@/lib/verificationEmail"
import { MutationData } from "@/lib/types/organization/response"
import { handleAction } from "@/lib/handleAction"
import { AppError } from "@/lib/exceptions"

export const ForgotPasswordTeamServer = async ({
  email,
  organizationId,
}: {
  email: string
  organizationId: string
}): Promise<MutationData> => {
  return handleAction("Forgot Password Team Server", async () => {
    if (!email || !organizationId) {
      throw new AppError({
        status: 400,
        error: "Email and organization are required.",
        toast: "Please enter your email.",
      })
    }

    const existingTeam = await db.query.team.findFirst({
      where: (a, { and, eq }) =>
        and(eq(a.email, email), eq(a.organizationId, organizationId)),
    })

    if (!existingTeam) {
      return {
        ok: true,
        toast: "If the email exists, a reset link was sent.",
      }
    }

    const payload = {
      id: existingTeam.id,
      email: existingTeam.email,
      type: existingTeam.type,
      organizationId: existingTeam.organizationId,
      role: existingTeam.role,
      action: "reset-password",
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
      expiresIn: "15m",
    })
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/organization/${organizationId}/teams/reset-password?teamToken=${token}`
    await sendVerificationEmail(existingTeam.email, resetUrl, "reset-password")
    return {
      ok: true,
      toast: "Reset link sent to your email",
      redirectUrl: `/organization/${organizationId}/teams/checkEmail?email=${encodeURIComponent(existingTeam.email)}`,
    }
  })
}
