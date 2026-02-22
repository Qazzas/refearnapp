import { db } from "@/db/drizzle"
import { eq, and } from "drizzle-orm"
import { affiliateAccount } from "@/db/schema"
import * as bcrypt from "bcrypt"
import { decodedType } from "@/lib/types/organization/decodedType"
import { returnError } from "@/lib/errorHandler"
import { AppError } from "@/lib/exceptions"

export const validateAffiliatePasswordAction = async (
  decoded: decodedType,
  currentPassword: string
) => {
  const account = await db.query.affiliateAccount.findFirst({
    where: and(
      eq(affiliateAccount.affiliateId, decoded.id),
      eq(affiliateAccount.provider, "credentials")
    ),
  })

  if (!account || !account.password) {
    throw new AppError({
      status: 404,
      error: "Affiliate account not found",
      toast: "Account not found",
    })
  }

  const isMatch = await bcrypt.compare(currentPassword, account.password)
  if (!isMatch) {
    throw new AppError({
      status: 403,
      error: "Incorrect current password",
      toast: "Incorrect current password",
      data: currentPassword,
    })
  }
}
