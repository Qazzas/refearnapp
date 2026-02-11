import { user } from "@/db/schema"
import { AppError } from "@/lib/exceptions"
import { eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { getUserAuthCapabilities } from "@/lib/server/organization/getUserAuthCapabilities"
import { handleAction } from "@/lib/handleAction"
import { SafeUserWithCapabilities } from "@/lib/types/organization/authUser"
import { ActionResult } from "@/lib/types/organization/response"
export const getUserData = async (): Promise<
  ActionResult<SafeUserWithCapabilities>
> => {
  return handleAction("getUserData", async () => {
    const { userId, canChangePassword, canChangeEmail } =
      await getUserAuthCapabilities()

    const userData = await db.query.user.findFirst({
      where: eq(user.id, userId),
    })

    if (!userData) {
      throw new AppError({
        status: 404,
        error: "User not found",
        toast: "Your account could not be found.",
      })
    }

    return {
      ok: true,
      data: {
        ...userData,
        canChangeEmail,
        canChangePassword,
      },
    }
  })
}
