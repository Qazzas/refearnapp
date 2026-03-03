import { z } from "zod"

// Ensure this matches the constant in your other files
const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "refearnapp.com"

export const subdomainSchema = z
  .string()
  .min(2, "Subdomain must be at least 2 characters long")
  .regex(
    /^[a-z0-9-]+$/,
    "Subdomain can only contain lowercase letters, numbers, and hyphens"
  )

export const hostnameSchema = z
  .string()
  .min(2)
  .refine((raw) => {
    const v = raw
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .toLowerCase()

    if (v.length > 253) return false
    const labels = v.split(".")
    if (labels.length < 2) return false

    for (const lbl of labels) {
      if (!/^[a-z0-9-]{1,63}$/.test(lbl)) return false
      if (lbl.startsWith("-") || lbl.endsWith("-")) return false
    }

    const last = labels[labels.length - 1]
    return !(!/^[a-z]{2,63}$/.test(last) && last.length < 2)
  }, "Invalid hostname or domain")

  // 🚫 DYNAMIC REFINE for the primary app domain
  .refine((raw) => {
    const v = raw
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .toLowerCase()

    const parts = v.split(".")
    const isPrimaryDomain = v === APP_DOMAIN || v.endsWith(`.${APP_DOMAIN}`)

    // Allow the primary domain itself (e.g., voteflow.xyz)
    if (v === APP_DOMAIN) return true

    // Allow only one subdomain level before the primary domain
    if (isPrimaryDomain) {
      const basePartsCount = APP_DOMAIN.split(".").length
      // If domain is 'voteflow.xyz' (2 parts), 'test.voteflow.xyz' is 3 parts.
      return parts.length === basePartsCount + 1
    }

    return true // For external custom domains (e.g., myproduct.com)
  }, `Invalid subdomain: only one level allowed before ${APP_DOMAIN} (e.g., app.${APP_DOMAIN})`)

export const domainCreateSchema = z.object({
  defaultDomain: z.union([subdomainSchema, hostnameSchema]),
})

export type DomainCreateForm = z.infer<typeof domainCreateSchema>
