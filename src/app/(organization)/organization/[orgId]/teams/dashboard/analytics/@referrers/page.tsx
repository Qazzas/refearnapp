import React from "react"
import { OrgIdProps } from "@/lib/types/organization/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart"
import { requireTeamWithOrg } from "@/lib/server/auth/authGuards"
const referrersPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireTeamWithOrg(orgId)
  return (
    <>
      <SocialTrafficCharts orgId={orgId} affiliate={false} isTeam />
    </>
  )
}
export default referrersPage
