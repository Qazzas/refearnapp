"use client"
import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { InputField, TextareaField } from "@/components/Auth/FormFields"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { sendTeamSupportMessage } from "@/app/(organization)/organization/[orgId]/teams/dashboard/supportEmail/action"
import { sendSupportMessage } from "@/app/(organization)/organization/[orgId]/dashboard/supportEmail/action"
import { useAppMutation } from "@/hooks/useAppMutation"
import { Loader2 } from "lucide-react"

// Zod validation schema
const supportSchema = z.object({
  header: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Message is required"),
})

type FormValues = z.infer<typeof supportSchema>

type SupportEmailProps = {
  affiliate: boolean
  isTeam?: boolean
  orgId: string
}

const SupportEmail = ({
  affiliate,
  isTeam = false,
  orgId,
}: SupportEmailProps) => {
  const [tab, setTab] = useState<"feedback" | "support">("feedback")
  const feedbackForm = useForm<FormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: { header: "", description: "" },
  })

  const supportForm = useForm<FormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: { header: "", description: "" },
  })
  const sendMessage = isTeam ? sendTeamSupportMessage : sendSupportMessage
  const sendMutation = useAppMutation(sendMessage, {
    affiliate,
    onSuccess: () => {
      if (tab === "feedback") {
        feedbackForm.reset()
      }

      if (tab === "support") {
        supportForm.reset()
      }
    },
  })
  const onSubmit = (values: FormValues) => {
    const payload = {
      type: tab.toUpperCase() as "FEEDBACK" | "SUPPORT",
      subject:
        values.header ||
        (tab === "feedback" ? "Feedback Request" : "Support Request"),
      message: values.description,
      orgId,
    }

    sendMutation.mutate(payload)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "feedback" | "support")}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="feedback">Feedback Request</TabsTrigger>
          <TabsTrigger value="support">Support Request</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          <Form {...feedbackForm}>
            <form
              onSubmit={feedbackForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <InputField
                control={feedbackForm.control}
                name="header"
                label="Subject"
                placeholder="Enter subject here"
                type="text"
                affiliate={affiliate}
              />
              <TextareaField
                control={feedbackForm.control}
                name="description"
                label="Message"
                placeholder="Write your feedback..."
                affiliate={affiliate}
                rows={6}
              />
              <Button
                type="submit"
                disabled={sendMutation.isPending && tab === "feedback"}
                className="w-full"
              >
                {sendMutation.isPending && tab === "feedback" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>Send Feedback Message</>
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="support">
          <Form {...supportForm}>
            <form
              onSubmit={supportForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <InputField
                control={supportForm.control}
                name="header"
                label="Subject"
                placeholder="Enter subject here"
                type="text"
                affiliate={affiliate}
              />
              <TextareaField
                control={supportForm.control}
                name="description"
                label="Message"
                placeholder="Write your support request..."
                affiliate={affiliate}
                rows={6}
              />
              <Button
                type="submit"
                disabled={sendMutation.isPending && tab === "support"}
                className="w-full"
              >
                {sendMutation.isPending && tab === "support" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>Send Support Message</>
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SupportEmail
