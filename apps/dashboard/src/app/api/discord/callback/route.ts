import { NextRequest, NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { AppError } from "@/lib/exceptions"

export const POST = handleRoute("DiscordSyncAPI", async (req: NextRequest) => {
  const { type, code, tier, plan } = await req.json()
  if (!code) {
    throw new AppError({ status: 400, toast: "Authorization code missing." })
  }
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: `${new URL(req.url).origin}/api/auth/discord/callback`,
    }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })

  const tokenData = await tokenResponse.json()
  if (!tokenResponse.ok) {
    throw new AppError({
      status: 401,
      toast: "Discord session expired. Please try again.",
    })
  }
  const userResponse = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  const discordUser = await userResponse.json()
  const discordUserId = discordUser.id
  const targetTier = type === "SELF_HOSTED" ? tier : plan

  if (!targetTier || targetTier === "FREE") {
    throw new AppError({
      status: 403,
      toast: "No eligible plan found for sync.",
    })
  }
  const GUILD_ID = process.env.DISCORD_GUILD_ID
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
  const roleId =
    targetTier === "ULTIMATE"
      ? process.env.DISCORD_ULTIMATE_ROLE_ID
      : process.env.DISCORD_PRO_ROLE_ID

  const syncResponse = await fetch(
    `https://discord.com/api/guilds/${GUILD_ID}/members/${discordUserId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        "X-Audit-Log-Reason": `Syncing ${targetTier} access`,
      },
    }
  )

  if (!syncResponse.ok) {
    const errorBody = await syncResponse.text()
    console.error("Discord API Error:", errorBody)
    throw new AppError({
      status: 500,
      toast: "Discord failed to assign roles. Contact support.",
    })
  }

  return NextResponse.json({ ok: true, message: "Roles synced successfully!" })
})
