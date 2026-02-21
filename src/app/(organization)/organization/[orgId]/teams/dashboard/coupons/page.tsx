import React from "react"
import { OrgIdProps } from "@/lib/types/organization/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireTeamWithOrg } from "@/lib/server/auth/authGuards"
import { buildMetadata } from "@/util/BuildMetadata"
import { Metadata } from "next"
import PromotionCodesTable from "@/components/pages/Dashboard/Coupons/PromotionCodesTable"

export async function generateMetadata({
  params,
}: OrgIdProps): Promise<Metadata> {
  const orgId = await getValidatedOrgFromParams({ params })

  return buildMetadata({
    title: "RefearnApp | Coupons Team Page",
    description: "Coupons Team Page",
    url: `https://refearnapp.com/organization/${orgId}/teams/dashboard/coupons`,
    indexable: false,
  })
}
const couponsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireTeamWithOrg(orgId)
  return (
    <>
      <PromotionCodesTable orgId={orgId} isTeam={true} />
    </>
  )
}
export default couponsPage
