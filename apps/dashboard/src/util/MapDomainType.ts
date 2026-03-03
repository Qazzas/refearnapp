import { z } from "zod"

// --- Dynamic Domain Configuration ---
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
  // 🚫 Dynamic check for the primary app domain (voteflow.xyz or refearnapp.com)
  .refine((raw) => {
    const v = raw
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .toLowerCase()

    const parts = v.split(".")
    const isPrimaryDomain = v === APP_DOMAIN || v.endsWith(`.${APP_DOMAIN}`)

    // Allow the primary domain itself
    if (v === APP_DOMAIN) return true

    // Allow only one subdomain before the primary domain
    if (isPrimaryDomain) {
      // If APP_DOMAIN is "voteflow.xyz" (2 parts), a subdomain should have 3 parts
      const basePartsCount = APP_DOMAIN.split(".").length
      return parts.length === basePartsCount + 1
    }

    return true // For custom domains
  }, `Invalid subdomain: only one level allowed before ${APP_DOMAIN}`)

export const domainCreateSchema = z.object({
  defaultDomain: z.union([subdomainSchema, hostnameSchema]),
})

export type DomainCreateForm = z.infer<typeof domainCreateSchema>

export function mapDomainType(
  input: "platform" | "custom-main" | "custom-subdomain"
): {
  type: "DEFAULT" | "CUSTOM_DOMAIN" | "CUSTOM_SUBDOMAIN"
  dnsStatus: "Pending" | "Verified"
  isVerified: boolean
  finalDomain: (d: string) => string
} {
  switch (input) {
    case "platform":
      return {
        type: "DEFAULT",
        dnsStatus: "Verified",
        isVerified: true,
        finalDomain: (d) =>
          d.endsWith(`.${APP_DOMAIN}`) ? d : `${d}.${APP_DOMAIN}`,
      }

    case "custom-main":
      return {
        type: "CUSTOM_DOMAIN",
        dnsStatus: "Pending",
        isVerified: false,
        finalDomain: (d) => d,
      }

    case "custom-subdomain":
      return {
        type: "CUSTOM_SUBDOMAIN",
        dnsStatus: "Pending",
        isVerified: false,
        finalDomain: (d) => d,
      }
  }
}
