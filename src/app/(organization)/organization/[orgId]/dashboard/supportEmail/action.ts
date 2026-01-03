"use server"
import { handleAction } from "@/lib/handleAction"
import { MutationData } from "@/lib/types/response"
import { SupportMessageInput } from "@/lib/types/supportMessageInput"
import { sendSupportMessageAction } from "@/lib/server/sendSupportMessageAction"
import { getOrgAuth } from "@/lib/server/GetOrgAuth"

export async function sendSupportMessage({
  type,
  subject,
  message,
  orgId,
}: SupportMessageInput): Promise<MutationData> {
  return handleAction("sendSupportMessage", async () => {
    const org = await getOrgAuth(orgId)
    await sendSupportMessageAction({
      type,
      subject,
      message,
      orgId,
      senderEmail: org.email,
      isTeam: false,
    })
    return {
      ok: true,
      toast:
        type === "FEEDBACK"
          ? "Feedback received. Thank you! We’ll review it and reach out via email if needed."
          : "Support request received. Our team will contact you via email as soon as possible.",
    }
  })
}
