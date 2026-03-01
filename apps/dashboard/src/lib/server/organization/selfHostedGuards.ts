// @/lib/server/auth/selfHostedGuards.ts
import { db } from "@/db/drizzle"
import { user } from "@/db/schema"
import { count } from "drizzle-orm"
import { redirect } from "next/navigation"
import { AppError } from "@/lib/exceptions"

/**
 * Prevents multiple signups in self-hosted mode.
 * If 1 user exists, it redirects or throws an error.
 */
export const restrictSelfHostedSignup = async (shouldRedirect = true) => {
  const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === "true"

  if (!isSelfHosted) return

  const [res] = await db.select({ value: count() }).from(user)
  const hasUser = res.value > 0

  if (hasUser) {
    if (shouldRedirect) {
      redirect("/login?error=RegistrationDisabled")
    } else {
      throw new AppError({
        status: 403,
        error: "RegistrationDisabled",
        toast: "Registration is disabled on this instance.",
      })
    }
  }
}
