import "server-only"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { AppError } from "@/lib/exceptions"

export async function getAffiliateOrganization(orgId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get(`affiliateToken-${orgId}`)?.value
  if (!token) throw new AppError({ status: 400, toast: "Unauthorized" })

  const decoded = jwt.verify(token, process.env.SECRET_KEY!) as {
    id: string
    orgId: string
  }
  if (!decoded) throw new AppError({ status: 400, toast: "Invalid session" })
  return decoded
}
