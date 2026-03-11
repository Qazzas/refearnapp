import React from "react"
import CustomizationPage from "@/components/pages/Dashboard/Customization/CustomizationPage"
import { OrgIdProps } from "@/lib/types/organization/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireTeamWithOrg } from "@/lib/server/auth/authGuards"
import { Metadata } from "next"
import { buildMetadata } from "@/util/BuildMetadata"
import { getLicense } from "@/lib/server/organization/getLicense"
import { getUnifiedPlan } from "@/lib/server/organization/getUnifiedPlan"
export async function generateMetadata({
  params,
}: OrgIdProps): Promise<Metadata> {
  const orgId = await getValidatedOrgFromParams({ params })

  return buildMetadata({
    title: "RefearnApp | Teams Customization Page",
    description: "Teams Customization Page",
    url: `https://refearnapp.com/organization/${orgId}/teams/dashboard/customization`,
    indexable: false,
  })
}
export default async function CustomizationServerPage({ params }: OrgIdProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireTeamWithOrg(orgId)
  const license = await getLicense(orgId)
  const plan = await getUnifiedPlan(orgId)
  return (
    <div className="overflow-auto">
      <CustomizationPage orgId={orgId} isTeam plan={plan} license={license} />
    </div>
  )
}
