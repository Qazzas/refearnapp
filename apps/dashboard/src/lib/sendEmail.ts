import nodemailer from "nodemailer"
import { SendMailClient } from "zeptomail"
import { Resend } from "resend"
type SendEmailInput = {
  to: string
  subject: string
  html: string
  replyTo?: string
  fromName?: string
  fromEmail?: string
}
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null
export const sendEmail = async ({
  to,
  subject,
  html,
  replyTo,
  fromName = "RefearnApp",
  fromEmail = "noreply@refearnapp.com",
}: SendEmailInput) => {
  if (process.env.NODE_ENV === "development") {
    const transporter = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      secure: false,
    })
    // 2. RESEND (Primary recommendation for ease of use)
    if (process.env.EMAIL_PROVIDER === "resend" && resend) {
      return await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [to],
        subject,
        html,
        replyTo,
      })
    }

    // 3. SMTP (Best for Self-Hosters using SES, SendGrid, etc.)
    if (process.env.EMAIL_PROVIDER === "smtp") {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
      return transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject,
        html,
        replyTo,
      })
    }
    return transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
      replyTo, // nodemailer accepts string or object
    })
  }

  const client = new SendMailClient({
    url: "https://api.zeptomail.com/v1.1/email",
    token: process.env.ZEPTO_TOKEN!,
  })

  return client.sendMail({
    from: {
      address: fromEmail,
      name: fromName,
    },
    to: [
      {
        email_address: {
          address: to,
        },
      },
    ],
    subject,
    htmlbody: html,

    ...(replyTo
      ? {
          reply_to: [
            {
              address: replyTo,
            },
          ],
        }
      : {}),
  })
}
