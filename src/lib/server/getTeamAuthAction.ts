import "server-only"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { db } from "@/db/drizzle"
import { team, organization } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { OrgAuthResult } from "@/lib/types/orgAuth"
import { AppError } from "@/lib/exceptions"
export async function getTeamAuthAction(orgId: string): Promise<OrgAuthResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get(`teamToken-${orgId}`)?.value
  if (!token) throw new AppError({ status: 401, toast: "Unauthorized" })

  const { id: teamId } = jwt.decode(token) as { id: string }

  // 🔹 Check if the team exists and is active
  const teamData = await db
    .select({
      id: team.id,
      orgId: team.organizationId,
      isActive: team.isActive,
      name: team.name,
      email: team.email,
    })
    .from(team)
    .where(and(eq(team.id, teamId), eq(team.organizationId, orgId)))
    .then((r) => r[0])

  if (!teamData) {
    throw new AppError({ status: 404, toast: "Team not found or unauthorized" })
  }

  if (!teamData.isActive) {
    throw new AppError({ status: 403, toast: "Team deactivated by owner" })
  }

  // 🔹 Fetch minimal org info for downstream context
  const org = await db
    .select({
      domain: organization.websiteUrl,
      param: organization.referralParam,
      currency: organization.currency,
      userId: organization.userId,
    })
    .from(organization)
    .where(eq(organization.id, orgId))
    .then((r) => r[0])

  if (!org) throw new AppError({ status: 404, toast: "Organization not found" })

  return {
    ...org,
    email: teamData.email,
  }
}
