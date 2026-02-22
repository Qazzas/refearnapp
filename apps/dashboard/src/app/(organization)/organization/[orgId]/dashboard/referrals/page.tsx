import React from "react"
import { OrgIdProps } from "@/lib/types/organization/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireOrganizationWithOrg } from "@/lib/server/auth/authGuards"
import { buildMetadata } from "@/util/BuildMetadata"
import { Metadata } from "next"
import OrgReferralsTable from "@/components/pages/Dashboard/Referrals/OrgReferralsTable"

export async function generateMetadata({
  params,
}: OrgIdProps): Promise<Metadata> {
  const orgId = await getValidatedOrgFromParams({ params })

  return buildMetadata({
    title: "RefearnApp | Referrals Page",
    description: "Referrals Page",
    url: `https://refearnapp.com/organization/${orgId}/dashboard/referrals`,
    indexable: false,
  })
}
const referralPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireOrganizationWithOrg(orgId)
  return (
    <>
      <OrgReferralsTable orgId={orgId} isTeam={false} />
    </>
  )
}

export default referralPage
