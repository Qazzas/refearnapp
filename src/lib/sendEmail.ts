import nodemailer from "nodemailer"
import { SendMailClient } from "zeptomail"

type SendEmailInput = {
  to: string
  subject: string
  html: string
  replyTo?: string
}
export const sendEmail = async ({
  to,
  subject,
  html,
  replyTo,
}: SendEmailInput) => {
  if (process.env.NODE_ENV === "development") {
    const transporter = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      secure: false,
    })

    return transporter.sendMail({
      from: '"RefearnApp" <noreply@refearnapp.com>',
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
      address: "noreply@refearnapp.com",
      name: "RefearnApp",
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
