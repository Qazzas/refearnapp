import React from "react"
import Links from "@/components/pages/AffiliateDashboard/Links/Links"
import { OrgIdProps } from "@/lib/types/orgId"
import { MissingPaypalEmailCard } from "@/components/ui-custom/MissingPayoutEmailCard"
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
    title: `${org.name} | Dashboard Links Page`,
    description: org.description ?? `Dashboard Links Page for ${org.name}`,
    url: `${orgBaseUrl}/dashboard/links`,
    indexable: false,
  })
}
const linksPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireAffiliateWithOrg(orgId)
  return (
    <div className="space-y-6">
      <MissingPaypalEmailCard affiliate orgId={orgId} />
      <Links orgId={orgId} affiliate />
    </div>
  )
}
export default linksPage
