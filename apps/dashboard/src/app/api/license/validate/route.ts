import { NextRequest, NextResponse } from "next/server"
import { Polar } from "@polar-sh/sdk"
import { handleRoute } from "@/lib/handleRoute"

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
})

export const POST = handleRoute("ValidateLicense", async (req: NextRequest) => {
  if (process.env.NEXT_PUBLIC_SELF_HOSTED === "true") {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const { key, activationId, expectedUserId } = await req.json()

  if (!key || !activationId || !expectedUserId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 422 }
    )
  }
  const result = await polar.licenseKeys.validate({
    key,
    organizationId: process.env.POLAR_ORGANIZATION_ID!,
    activationId,
  })
  if (!result.activation) {
    return NextResponse.json({ error: "Invalid activation" }, { status: 401 })
  }
  if (result.activation.label !== expectedUserId) {
    return NextResponse.json(
      { error: "License is already in use by another device/user." },
      { status: 403 }
    )
  }

  return NextResponse.json(result)
})
