import React from "react"
import Signup from "@/components/pages/Signup"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { redirectIfAffiliateAuthed } from "@/lib/server/authGuards"
import { Metadata } from "next"
import { getOrganization } from "@/lib/server/getOrganization"
import { getOrgBaseUrl } from "@/lib/server/getOrgBaseUrl"
import { buildMetadata } from "@/util/BuildMetadata"
export async function generateMetadata({
  params,
}: {
  params: { orgId: string }
}): Promise<Metadata> {
  const org = await getOrganization(params.orgId)
  const orgBaseUrl = await getOrgBaseUrl(org.id)
  return buildMetadata({
    title: `${org.name} | Signup Page`,
    description: org.description ?? `Signup Page for ${org.name}`,
    url: `${orgBaseUrl}/signup`,
    indexable: false,
  })
}
const AffiliateSignupPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectIfAffiliateAuthed(orgId)
  return (
    <>
      <Signup affiliate orgId={orgId} />
    </>
  )
}
export default AffiliateSignupPage
