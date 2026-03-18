"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/Auth/FormFields" // Adjust path as needed
import { Button } from "@/components/ui/button"
import { useAppMutation } from "@/hooks/useAppMutation"
import { updateLinkSlug } from "@/app/affiliate/[orgId]/dashboard/links/action"
import { Check, X, Edit2, Loader2 } from "lucide-react"
import { useAtomValue } from "jotai"
import { dashboardButtonCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { useQueryClient } from "@tanstack/react-query"

const slugSchema = z.object({
  slug: z
    .string()
    .min(4, "Min 4 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Only letters, numbers, and dashes"),
})

type SlugFormValues = z.infer<typeof slugSchema>

export const EditableSlugCell = ({
  linkId,
  initialSlug,
  affiliate,
  orgId,
}: {
  linkId: string
  initialSlug: string
  affiliate: boolean
  orgId: string
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const { showCustomToast } = useCustomToast()
  const queryClient = useQueryClient()
  // Grab the button customization atoms to mimic the "Create New Link" button style
  const {
    dashboardButtonDisabledTextColor,
    dashboardButtonTextColor,
    dashboardButtonDisabledBackgroundColor,
    dashboardButtonBackgroundColor,
  } = useAtomValue(dashboardButtonCustomizationAtom)

  const form = useForm<SlugFormValues>({
    resolver: zodResolver(slugSchema),
    defaultValues: { slug: initialSlug },
  })

  const mutation = useAppMutation(
    (values: SlugFormValues) => updateLinkSlug(orgId, linkId, values.slug),
    {
      affiliate,
      onSuccess: (res) => {
        if (res.ok) {
          setIsEditing(false)
          queryClient
            .invalidateQueries({ queryKey: ["affiliate-links"] })
            .then(() => console.log("invalidated"))
        } else {
          showCustomToast({
            type: "error",
            title: "Error",
            description: "something went wrong",
            affiliate,
          })
        }
      },
    }
  )

  const onSubmit = (values: SlugFormValues) => {
    if (values.slug === initialSlug) {
      setIsEditing(false)
      return
    }
    mutation.mutate(values)
  }

  if (isEditing) {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-2"
        >
          <div className="w-40">
            <InputField
              control={form.control}
              name="slug"
              label="" // No label inside the table cell
              placeholder="Slug..."
              type="text"
              affiliate={affiliate}
              disabled={mutation.isPending}
            />
          </div>

          <div className="flex gap-1">
            {/* Styled Save Button */}
            <Button
              type="submit"
              size="icon"
              disabled={mutation.isPending}
              className="h-8 w-8"
              style={{
                backgroundColor: mutation.isPending
                  ? (affiliate && dashboardButtonDisabledBackgroundColor) ||
                    undefined
                  : (affiliate && dashboardButtonBackgroundColor) || undefined,
                color: mutation.isPending
                  ? (affiliate && dashboardButtonDisabledTextColor) || undefined
                  : (affiliate && dashboardButtonTextColor) || undefined,
              }}
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>

            {/* Cancel Button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                form.reset()
                setIsEditing(false)
              }}
              disabled={mutation.isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    )
  }

  return (
    <div
      className="flex items-center gap-2 group cursor-pointer hover:bg-accent/50 p-1 rounded transition-colors"
      onClick={() => setIsEditing(true)}
    >
      <span className="text-sm font-medium">{initialSlug}</span>
      <Edit2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}
