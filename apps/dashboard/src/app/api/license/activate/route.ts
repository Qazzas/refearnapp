import { NextRequest, NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { Polar } from "@polar-sh/sdk"

const polar = new Polar({ accessToken: process.env.POLAR_ACCESS_TOKEN! })

// app/api/licenses/activate/route.ts
export const POST = handleRoute(
  "ActivateLicenseAPI",
  async (req: NextRequest) => {
    const { orgId, key, oldLicenseKey } = await req.json()

    // 1. Revoke old keys on Polar
    if (oldLicenseKey && Array.isArray(oldLicenseKey)) {
      for (const old of oldLicenseKey) {
        await polar.licenseKeys.update({
          id: old.key, // Ensure this is the UUID
          licenseKeyUpdate: { status: "revoked" },
        })
      }
    }

    // 2. Activate new key on Polar
    const result = await polar.licenseKeys.activate({
      key,
      organizationId: process.env.POLAR_ORGANIZATION_ID!,
      label: orgId,
    })
    return NextResponse.json({ success: true, data: result })
  }
)
