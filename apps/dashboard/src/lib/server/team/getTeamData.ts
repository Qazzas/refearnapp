import { ActionResult } from "@/lib/types/organization/response"
import { SafeTeamWithCapabilities } from "@/lib/types/organization/authUser"
import { handleAction } from "@/lib/handleAction"
import { getTeamAuthAction } from "@/lib/server/team/getTeamAuthAction"
import { getTeamAuthCapabilities } from "@/lib/server/team/getTeamAuthCapabilities"
import { db } from "@/db/drizzle"
import { eq } from "drizzle-orm"
import { team } from "@/db/schema"
import { AppError } from "@/lib/exceptions"
export const getTeamData = async (
  orgId: string
): Promise<ActionResult<SafeTeamWithCapabilities>> => {
  return handleAction("get Team Data", async () => {
    await getTeamAuthAction(orgId)
    const { userId, canChangePassword, canChangeEmail } =
      await getTeamAuthCapabilities(orgId)

    const teamData = await db.query.team.findFirst({
      where: eq(team.id, userId),
    })

    if (!teamData) {
      throw new AppError({
        status: 404,
        error: "User not found",
        toast: "Your account could not be found.",
      })
    }

    return {
      ok: true,
      data: {
        ...teamData,
        canChangeEmail,
        canChangePassword,
      },
    }
  })
}
