import "server-only"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { AppError } from "@/lib/exceptions"

export async function getOrgAuthForPlan(): Promise<{
  userId: string
  orgId: string
}> {
  const cookieStore = await cookies()
  const token = cookieStore.get("organizationToken")?.value

  if (!token) throw new AppError({ status: 401, toast: "Unauthorized" })

  const decoded = jwt.decode(token) as { id: string; activeOrgId: string }
  if (!decoded?.id || !decoded?.activeOrgId)
    throw new AppError({ status: 401, toast: "Unauthorized" })

  return { userId: decoded.id, orgId: decoded.activeOrgId }
}
