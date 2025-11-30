import React from "react"
import EmailVerified from "@/components/pages/Email-verified"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireAffiliateWithOrg } from "@/lib/server/authGuards"
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
    title: `${org.name} | Email Verified Page`,
    description: org.description ?? `Email Verified Page for ${org.name}`,
    url: `${orgBaseUrl}/email-verified`,
    indexable: false,
  })
}
const emailVerifiedPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireAffiliateWithOrg(orgId)
  return (
    <>
      <EmailVerified orgId={orgId} affiliate />
    </>
  )
}
export default emailVerifiedPage
