import { InferSelectModel } from "drizzle-orm"
import { organization, websiteDomain } from "@/db/schema"

export type WebsiteDomain = InferSelectModel<typeof websiteDomain>
export type Organization = InferSelectModel<typeof organization>
