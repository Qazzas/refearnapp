import { defineConfig } from "drizzle-kit"
const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === "true"
export default defineConfig({
  out: isSelfHosted ? "./self-hosted-migrations" : "./migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
