import { sendEmail } from "@/lib/sendEmail"
import { escapeHtml } from "@/util/escapeHtml"

type MessageEmailPayload = {
  subject: string
  heading: string
  body: string
  replyTo?: string
}
function buildMessageTemplate(heading: string, body: string) {
  const safeHeading = escapeHtml(heading)
  const safeBody = escapeHtml(body)

  return `
    <div style="font-family:Arial, sans-serif; max-width:600px; padding:20px;">
      <h2 style="color:#333;">${safeHeading}</h2>
      <p style="color:#555; white-space:pre-line;">${safeBody}</p>
    </div>
  `
}
export const sendMessageEmail = async (
  to: string,
  payload: MessageEmailPayload
) => {
  const html = buildMessageTemplate(payload.heading, payload.body)

  return sendEmail({
    to,
    subject: payload.subject,
    html,
    replyTo: payload.replyTo,
  })
}
