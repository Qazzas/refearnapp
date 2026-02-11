// lib/server/getOrganizationContext.ts
"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { AppError } from "@/lib/exceptions"

export async function getOrganizationContext() {
  const cookieStore = await cookies()
  const token = cookieStore.get("organizationToken")?.value
  if (!token) throw new AppError({ status: 401, error: "Unauthorized" })

  const decoded = jwt.decode(token) as {
    orgIds?: string[]
    activeOrgId?: string
    role?: string
    type?: string
  }

  return {
    orgIds: decoded?.orgIds ?? [],
    activeOrgId: decoded?.activeOrgId,
    role: decoded?.role ?? "OWNER",
    type: decoded?.type ?? "ORGANIZATION",
  }
}
