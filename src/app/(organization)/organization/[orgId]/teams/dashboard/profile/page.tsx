import React from "react"
import Profile from "@/components/pages/Dashboard/Profile/Profile"
import { OrgIdProps } from "@/lib/types/organization/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"
import { requireTeamWithOrg } from "@/lib/server/auth/authGuards"
import { Metadata } from "next"
import { buildMetadata } from "@/util/BuildMetadata"
import { getTeamData } from "@/lib/server/team/getTeamData"
export async function generateMetadata({
  params,
}: OrgIdProps): Promise<Metadata> {
  const orgId = await getValidatedOrgFromParams({ params })

  return buildMetadata({
    title: "RefearnApp | Teams Profile Page",
    description: "Teams Profile Page",
    url: `https://refearnapp.com/organization/${orgId}/teams/dashboard/profile`,
    indexable: false,
  })
}
const profilePage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireTeamWithOrg(orgId)
  const teamResponse = await getTeamData(orgId)
  if (!teamResponse.ok) {
    return <ErrorCard message={teamResponse.error || "Something went wrong"} />
  }
  return (
    <>
      <Profile
        affiliate={false}
        orgId={orgId}
        TeamData={teamResponse.data}
        isTeam
      />
    </>
  )
}
export default profilePage
