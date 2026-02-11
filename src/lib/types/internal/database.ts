import { InferSelectModel } from "drizzle-orm"
import { websiteDomain } from "@/db/schema"

export type WebsiteDomain = InferSelectModel<typeof websiteDomain>
