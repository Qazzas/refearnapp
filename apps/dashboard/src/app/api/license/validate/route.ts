import { NextRequest, NextResponse } from "next/server"
import { Polar } from "@polar-sh/sdk"
import { handleRoute } from "@/lib/handleRoute"
import { AppError } from "@/lib/exceptions"
import { polarConfig } from "@/lib/polarConfig"

const polar = new Polar({
  accessToken: polarConfig.accessToken,
  server: polarConfig.server,
})

export const POST = handleRoute("ValidateLicense", async (req: NextRequest) => {
  if (process.env.NEXT_PUBLIC_SELF_HOSTED === "true") {
    throw new AppError({
      status: 403,
      error: "FORBIDDEN",
      toast: "Access denied",
    })
  }

  const { key, activationId, expectedUserId } = await req.json()

  if (!key || !activationId || !expectedUserId) {
    throw new AppError({
      status: 422,
      error: "MISSING_FIELDS",
      toast: "Missing required fields",
    })
  }

  const result = await polar.licenseKeys.validate({
    key,
    organizationId: process.env.POLAR_ORGANIZATION_ID!,
    activationId,
  })

  if (!result.activation) {
    throw new AppError({
      status: 401,
      error: "INVALID_ACTIVATION",
      toast: "Invalid activation key",
    })
  }

  if (result.activation.label !== expectedUserId) {
    throw new AppError({
      status: 403,
      error: "LICENSE_IN_USE",
      toast: "License is already in use by another device/user.",
    })
  }

  return NextResponse.json(result)
})
