export type SupportMessageInput = {
  type: "FEEDBACK" | "SUPPORT"
  subject: string
  message: string
  orgId: string
  senderEmail?: string
  isTeam?: boolean
}
