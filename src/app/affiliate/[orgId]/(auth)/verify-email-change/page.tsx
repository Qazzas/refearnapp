import InvalidToken from "@/components/pages/InvalidToken"
import VerifyClient from "@/components/pages/VerifyClient"
import { Metadata } from "next"
import { getOrganization } from "@/lib/server/getOrganization"
import { getOrgBaseUrl } from "@/lib/server/getOrgBaseUrl"
import { buildMetadata } from "@/util/BuildMetadata"

type Props = {
  searchParams: Promise<{ affiliateToken?: string }>
  params: Promise<{ orgId: string }>
}
export async function generateMetadata({
  params,
}: {
  params: { orgId: string }
}): Promise<Metadata> {
  const org = await getOrganization(params.orgId)
  const orgBaseUrl = await getOrgBaseUrl(org.id)
  return buildMetadata({
    title: `${org.name} | Verify Email Change Page`,
    description: org.description ?? `Verify Email Change Page for ${org.name}`,
    url: `${orgBaseUrl}/verify-email-change`,
    indexable: false,
  })
}
export default async function VerifyEmailChangePage({ searchParams }: Props) {
  const { affiliateToken } = await searchParams

  if (!affiliateToken) {
    return (
      <InvalidToken
        affiliate={true}
        message="The login link is invalid or expired."
      />
    )
  }

  return <VerifyClient affiliate token={affiliateToken} mode="changeEmail" />
}
