import { serve } from "@upstash/workflow/nextjs"
import { redis } from "@/lib/redis"

export const { POST } = serve(
  async (context: any) => {
    const internalSecret = process.env.INTERNAL_SECRET
    const originUrl = process.env.NEXT_PUBLIC_REDIRECTION_URL

    // 1. Auth check is fine here (it uses headers, which are constant)
    if (context.headers.get("x-internal-secret") !== internalSecret) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { cron } = context.requestPayload

    if (cron === "*/10 * * * *") {
      const discovery = await context.run("check-redis-for-data", async () => {
        const clickExists = await redis.exists("sync_batch")
        const [_, keys] = await redis.scan(0, {
          match: "sync:leads:*",
          count: 100,
        })
        return { clickExists, leadKeysFound: keys }
      })
      if (!discovery.clickExists && discovery.leadKeysFound.length === 0) return

      await context.run("execute-sync", async () => {
        const clickBatch: Record<string, string> = {}
        let clickProcessingKey = ""

        // Use the data from the 'discovery' step
        if (discovery.clickExists) {
          clickProcessingKey = `sync_proc_${Date.now()}`
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

        const leadData: Record<string, string[]> = {}
        for (const key of discovery.leadKeysFound) {
          const leads = await redis.smembers(key)
          if (leads.length > 0) leadData[key.split(":")[2]] = leads
        }

        const syncId = `sync_${Date.now()}`
        const response = await fetch(`${originUrl}/api/internal/sync-batch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": internalSecret!,
            "x-sync-id": syncId,
          },
          body: JSON.stringify({ batch: clickBatch, leads: leadData, syncId }),
        })

        if (!response.ok) throw new Error(`VPS Sync failed`)

        // Cleanup
        const pipeline = redis.pipeline()
        if (clickProcessingKey) pipeline.del(clickProcessingKey)
        for (const key of discovery.leadKeysFound) pipeline.del(key)
        await pipeline.exec()

        return { success: true, syncId }
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
      })
    }
  },
  { baseUrl: process.env.NEXT_PUBLIC_REDIRECTION_URL, receiver: undefined }
)
