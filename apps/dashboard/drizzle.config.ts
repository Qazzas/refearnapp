import "dotenv/config"
import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(__dirname, ".env") })
export default defineConfig({
  out: "./migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.SUPABASE_DATABASE_URL!,
  },
})
