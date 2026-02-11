import "server-only"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { AppError } from "@/lib/exceptions"

export async function getCurrentAffiliateUser(orgId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get(`affiliateToken-${orgId}`)?.value
  if (!token) throw new AppError({ status: 401, toast: "Unauthorized" })

  const payload = jwt.verify(token, process.env.SECRET_KEY as string) as {
    id?: string
    orgId?: string
  }

  if (!payload?.id || payload.orgId !== orgId) {
    throw new AppError({ status: 400, toast: "Invalid session" })
  }

  return { id: payload.id, orgId: payload.orgId }
}
