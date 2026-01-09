"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery } from "@tanstack/react-query"
import { Loader2, CopyIcon, KeyRound } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/Auth/FormFields"
import { Form } from "@/components/ui/form"
import {
  getOrgWebhookKey,
  savePaddleWebhookKey,
} from "@/app/(organization)/organization/[orgId]/dashboard/integration/action"
import { useAppMutation } from "@/hooks/useAppMutation"
import {
  getTeamOrgWebhookKey,
  saveTeamPaddleWebhookKey,
} from "@/app/(organization)/organization/[orgId]/teams/dashboard/integration/action"
import { usePaddleImage } from "@/provider/PaddleImageProvider"
import PaddleImageButton from "@/components/ui-custom/PaddleImageButton"

const webhookSchema = z.object({
  webhookKey: z.string().min(1, "Webhook key cannot be empty"),
})

type WebhookSchema = z.infer<typeof webhookSchema>

interface ConnectProps {
  WEBHOOK_URL: string
  copied: boolean
  handleCopy: () => void
  orgId: string
  isTeam?: boolean
}

export default function Connect({
  WEBHOOK_URL,
  copied,
  handleCopy,
  orgId,
  isTeam = false,
}: ConnectProps) {
  const form = useForm<WebhookSchema>({
    resolver: zodResolver(webhookSchema),
    defaultValues: { webhookKey: "" },
  })
  const saveFn = isTeam ? saveTeamPaddleWebhookKey : savePaddleWebhookKey
  const getFn = isTeam ? getTeamOrgWebhookKey : getOrgWebhookKey
  const { openImage } = usePaddleImage()
  const mutation = useAppMutation(
    async (key: string) => {
      return await saveFn({ orgId, webhookPublicKey: key })
    },
    {
      onSuccess: () => {
        form.reset()
      },
      affiliate: false,
    }
  )

  const onSubmit = (data: WebhookSchema) => {
    mutation.mutate(data.webhookKey)
  }
  const { data, isPending } = useQuery({
    queryKey: ["paddle-webhook-key", orgId],
    queryFn: async () => await getFn(orgId),
  })

  const savedKey = data?.webhookPublicKey ?? ""

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Connect Paddle</h3>

      <Tabs defaultValue="step1" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="step1">Step 1</TabsTrigger>
          <TabsTrigger value="step2">Step 2</TabsTrigger>
          <TabsTrigger value="step3">Step 3</TabsTrigger>
          <TabsTrigger value="step4">Step 4</TabsTrigger>
        </TabsList>

        {/* STEP 1 */}
        <TabsContent value="step1">
          <Card>
            <CardHeader className="font-semibold">
              Go to Paddle Dashboard
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Login to your Paddle seller account, then navigate to:
                <br />
                <strong>Developer Tools → Notifications</strong>
              </p>

              <PaddleImageButton
                src="/images/paddle/paddle-1.png"
                alt="Paddle Notifications Settings"
                onClick={openImage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* STEP 2 */}
        <TabsContent value="step2">
          <Card>
            <CardHeader className="font-semibold">
              Create Webhook Destination
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Click <strong>New destination</strong> and choose:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  Type: <strong>Webhook</strong>
                </li>
                <li>
                  Usage: <strong>Platform</strong> (or Platform and Simulation)
                </li>
              </ul>
              <PaddleImageButton
                src="/images/paddle/paddle-2.png"
                alt="Create Destination"
                onClick={openImage}
              />
              <p>
                Then paste the following webhook URL into the destination URL
                field:
              </p>
              <div className="inline-flex items-start bg-muted px-3 py-2 rounded-md border max-w-full space-x-2">
                <p className="text-md break-all">{WEBHOOK_URL}</p>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  <CopyIcon className="w-4 h-4" />
                </Button>
              </div>

              {copied && (
                <span className="text-xs text-green-600">Copied!</span>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* STEP 3 */}
        <TabsContent value="step3">
          <Card>
            <CardHeader className="font-semibold">
              Select Events and Save
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Choose the events you want to listen to:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  <code>transaction.completed</code>
                </li>
                <li>
                  <code>subscription.created</code>
                </li>
                <li>
                  <code>adjustment.updated</code>
                </li>
              </ul>
              <p>
                Then click <strong>Save</strong> to finish the setup.
              </p>
              <PaddleImageButton
                src="/images/paddle/paddle-3.png"
                alt="Select Events"
                onClick={openImage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* STEP 4 */}
        <TabsContent value="step4">
          <Card>
            <CardHeader className="font-semibold">
              Copy Webhook Secret Key
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                After saving, click on the destination you just created, then
                click <strong>Edit</strong>. Scroll down and click{" "}
                <strong>Copy Secret Key</strong>.
              </p>
              <PaddleImageButton
                src="/images/paddle/paddle-4.png"
                alt="Copy Secret Key"
                onClick={openImage}
              />
              <p>Paste the copied Webhook Public Key below:</p>

              {/* Webhook Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <InputField
                    control={form.control}
                    name="webhookKey"
                    label="Webhook Public Key"
                    placeholder="Enter your Paddle Webhook Public Key"
                    type="text"
                    icon={KeyRound}
                    disabled={!!savedKey}
                    affiliate={false}
                  />

                  {savedKey ? (
                    <Button disabled className="w-full" variant="outline">
                      ✅ Connected
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="w-full"
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
