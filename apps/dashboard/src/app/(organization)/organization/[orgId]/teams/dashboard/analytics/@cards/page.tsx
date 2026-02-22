import React from "react"
import { OrgIdProps } from "@/lib/types/organization/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import Cards from "@/components/ui-custom/Cards/Cards"
import { requireTeamWithOrg } from "@/lib/server/auth/authGuards"

const cardsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireTeamWithOrg(orgId)
  return (
    <>
      <Cards orgId={orgId} affiliate={false} isTeam />
    </>
  )
}
export default cardsPage
