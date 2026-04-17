import React from "react"
import { OrgIdProps } from "@/lib/types/organization/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireOrganizationWithOrg } from "@/lib/server/auth/authGuards"
import { buildMetadata } from "@/util/BuildMetadata"
import { Metadata } from "next"
import PromotionCodesTable from "@/components/pages/Dashboard/Coupons/PromotionCodesTable"
import { getLicense } from "@/lib/server/organization/getLicense"
import { LicenseRequiredState } from "@/components/ui-custom/LicenseRequiredState"

export async function generateMetadata({
  params,
}: OrgIdProps): Promise<Metadata> {
  const orgId = await getValidatedOrgFromParams({ params })

  return buildMetadata({
    title: "RefearnApp | Coupons Page",
    description: "Coupons Page",
    url: `https://refearnapp.com/organization/${orgId}/dashboard/coupons`,
    indexable: false,
  })
}
const couponsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireOrganizationWithOrg(orgId)
  const licenseResult = await getLicense()
  if (licenseResult !== null) {
    if (!licenseResult.ok) {
      return (
        <LicenseRequiredState
          featureName="Coupons"
          requiredTier="ULTIMATE"
          isExpired={true}
          orgId={orgId}
        />
      )
    }

    const license = licenseResult.data
    const hasAccess =
      license.isActive && license.isUltimate && !!license.activationId

    if (!hasAccess) {
      const needsActivation = !license.activationId && !license.isCommunity
      return (
        <LicenseRequiredState
          featureName="Coupons"
          requiredTier="ULTIMATE"
          isExpired={!license.isActive}
          needsActivation={needsActivation}
          orgId={orgId}
        />
      )
    }
  }
  return (
    <>
      <PromotionCodesTable orgId={orgId} isTeam={false} />
    </>
  )
}
export default couponsPage
