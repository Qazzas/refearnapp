import { serve } from "@upstash/workflow/nextjs"
import { redis } from "@/lib/redis"

export const { POST } = serve(
  async (context: any) => {
    // Using process.env directly
    const internalSecret = process.env.INTERNAL_SECRET
    const originUrl = process.env.NEXT_PUBLIC_REDIRECTION_URL

    const authHeader = context.headers.get("x-internal-secret")
    if (authHeader !== internalSecret) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { cron } = context.requestPayload

    // --- 5 MINUTE SYNC ---
    if (cron === "*/10 * * * *") {
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
          const syncId = `sync_clicks_${Date.now()}`

          // Using the redirection URL from process.env
          const response = await fetch(`${originUrl}/api/internal/sync-batch`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-secret": internalSecret!,
              "x-sync-id": syncId,
            },
            body: JSON.stringify({
              batch: clickBatch,
              leads: leadData,
              syncId,
            }),
          })

          if (!response.ok)
            throw new Error(`Batch Sync failed with status ${response.status}`)

          // Cleanup Redis using the requested redis instance
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
        const response = await fetch(`${originUrl}/api/internal/seed-rates`, {
          method: "POST",
          headers: { "x-internal-secret": internalSecret! },
        })
        if (!response.ok) throw new Error("Seed rates failed")
        const result = await response.json()
        console.log("Seed Rates Response:", result)
      })
    }
  },
  { baseUrl: process.env.NEXT_PUBLIC_REDIRECTION_URL, receiver: undefined }
)
