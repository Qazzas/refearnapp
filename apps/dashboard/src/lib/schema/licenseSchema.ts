import { z } from "zod"

export const licenseSchema = z.object({
  licenseKey: z.string().min(10, "Please enter a valid license key"),
})
