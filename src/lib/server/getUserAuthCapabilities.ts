"use server"

import { eq } from "drizzle-orm"
import { getCurrentUser } from "@/lib/server/getCurrentUser"
import { account } from "@/db/schema"
import { db } from "@/db/drizzle"
import { AppError } from "@/lib/exceptions"

export async function getUserAuthCapabilities() {
  const { id } = await getCurrentUser()
  if (!id) throw new AppError({ status: 401, toast: "Unauthorized" })
  const accounts = await db.query.account.findMany({
    where: eq(account.userId, id),
  })

  const hasCredentials = accounts.some((a) => a.provider === "credentials")
  const hasOAuth = accounts.some((a) => a.provider !== "credentials")

  return {
    userId: id,
    hasCredentials,
    hasOAuth,
    canChangePassword: hasCredentials,
    canChangeEmail: hasCredentials && !hasOAuth,
  }
}
