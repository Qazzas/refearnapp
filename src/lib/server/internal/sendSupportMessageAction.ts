import { SupportMessageInput } from "@/lib/types/internal/supportMessageInput"
import { supportMessage } from "@/db/schema"
import { db } from "@/db/drizzle"
import { sendMessageEmail } from "@/lib/supportEmail"
export async function sendSupportMessageAction({
  type,
  subject,
  message,
  orgId,
  senderEmail,
  isTeam,
}: SupportMessageInput): Promise<void> {
  // 1️⃣ Save message to DB
  await db.insert(supportMessage).values({
    type: type,
    subject: subject,
    message: message,
    orgId: orgId,
    email: senderEmail,
    isTeam,
  })

  // 2️⃣ Send email to support inbox
  await sendMessageEmail("support@refearnapp.com", {
    subject: `[${type}] ${subject}`,
    heading: subject,
    body: `
From: ${senderEmail ?? "Unknown user"}
Organization: ${orgId ?? "N/A"}

${message}
      `.trim(),
    replyTo: senderEmail,
  })
}
