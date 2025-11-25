// app/affiliate/[orgId]/page.tsx
import { redirect } from "next/navigation"

export default async function SubDomainPage({
  params,
}: {
  params: { orgId: string }
}) {
  const { orgId } = params

  // Immediately redirect
  redirect(`/affiliate/${orgId}/login`)
}
