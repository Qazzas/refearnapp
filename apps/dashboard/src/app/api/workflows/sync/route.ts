import { serve } from "@upstash/workflow/nextjs"
import { Redis } from "@upstash/redis"

export const { POST } = serve(async (context: any) => {
  const { cron } = context.requestPayload
  const env = process.env // Accessible in Node.js runtime
  const redis = Redis.fromEnv()

  // --- 5 MINUTE SYNC ---
  if (cron === "*/5 * * * *") {
    await context.run("sync-batch", async () => {
      // 1. HANDLE CLICK BATCH
      const clickExists = await redis.exists("sync_batch")
      const clickBatch: Record<string, string> = {}
      let clickProcessingKey = ""

      if (clickExists) {
        clickProcessingKey = `sync_processing_clicks_${Date.now()}`
        await redis.rename("sync_batch", clickProcessingKey)
        let cursor = "0"
        do {
          const [nextCursor, items] = await redis.hscan(
            clickProcessingKey,
            cursor,
            { count: 500 }
          )
          cursor = nextCursor
          for (let i = 0; i < items.length; i += 2) {
            clickBatch[String(items[i])] = String(items[i + 1])
          }
        } while (cursor !== "0")
      }

      // 2. HANDLE LEAD BATCH
      const leadData: Record<string, string[]> = {}
      let leadScanCursor = "0"
      const leadKeys: string[] = []
      do {
        const [nextCursor, keys] = await redis.scan(leadScanCursor, {
          match: "sync:leads:*",
          count: 100,
        })
        leadScanCursor = nextCursor
        for (const key of keys) {
          const leads = await redis.smembers(key)
          if (leads.length > 0) {
            const orgId = key.split(":")[2]
            leadData[orgId] = leads
            leadKeys.push(key)
          }
        }
      } while (leadScanCursor !== "0")

      // 3. CALL EXISTING VERCEL API
      if (
        Object.keys(clickBatch).length > 0 ||
        Object.keys(leadData).length > 0
      ) {
        const response = await fetch(
          `${env.MAIN_APP_URL}/api/internal/sync-batch`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-secret": env.INTERNAL_SECRET!,
            },
            body: JSON.stringify({ batch: clickBatch, leads: leadData }),
          }
        )

        if (!response.ok)
          throw new Error(`Batch Sync failed with status ${response.status}`)

        // Cleanup Redis
        const pipeline = redis.pipeline()
        if (clickProcessingKey) pipeline.del(clickProcessingKey)
        for (const key of leadKeys) pipeline.del(key)
        await pipeline.exec()
        const clickCount = Object.keys(clickBatch).length
        const leadCount = Object.keys(leadData).length

        console.log(
          `🚀 Syncing ${clickCount} clicks and ${leadCount} lead keys.`
        )
      }
    })
  }

  // --- MIDNIGHT TASKS ---
  if (cron === "0 0 * * *") {
    await context.run("seed-rates", async () => {
      const response = await fetch(
        `${env.MAIN_APP_URL}/api/internal/seed-rates`,
        {
          method: "POST",
          headers: { "x-internal-secret": env.INTERNAL_SECRET! },
        }
      )

      if (!response.ok) throw new Error("Seed rates failed")

      const result = await response.json()
      console.log("Seed Rates Response:", result)
    })

    await context.run("polar-sync", async () => {
      const isSelfHosted =
        process.env.IS_SELF_HOSTED === "true" ||
        process.env.IS_SELF_HOSTED === "1"

      if (isSelfHosted) {
        console.log("☁️ Skipping Polar Sync: Self-hosted environment.")
        return
      }

      const response = await fetch(
        `${process.env.MAIN_APP_URL}/api/license/sync`,
        {
          method: "POST",
          headers: { "x-internal-secret": process.env.INTERNAL_SECRET! },
        }
      )

      if (!response.ok) throw new Error("Polar sync endpoint failed")

      const result = await response.json()
      console.log("✅ Polar Sync complete:", result)
    })
  }
})
