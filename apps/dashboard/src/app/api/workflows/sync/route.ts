import { serve } from "@upstash/workflow/nextjs"
import { redis } from "@/lib/redis"

export const { POST } = serve(
  async (context: any) => {
    const internalSecret = process.env.INTERNAL_SECRET
    const originUrl = process.env.NEXT_PUBLIC_REDIRECTION_URL

    if (context.headers.get("x-internal-secret") !== internalSecret) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { cron } = context.requestPayload

    if (cron === "*/10 * * * *") {
      const clickExists = await redis.exists("sync_batch")
      const [_, leadKeysFound] = await redis.scan(0, {
        match: "sync:leads:*",
        count: 100,
      })

      if (!clickExists && leadKeysFound.length === 0) return
      await context.run("execute-sync", async () => {
        const clickBatch: Record<string, string> = {}
        let clickProcessingKey = ""
        if (clickExists) {
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
        for (const key of leadKeysFound) {
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
        const pipeline = redis.pipeline()
        if (clickProcessingKey) pipeline.del(clickProcessingKey)
        for (const key of leadKeysFound) pipeline.del(key)
        await pipeline.exec()
      })
    }

    if (cron === "0 0 * * *") {
      await context.run("seed-rates", async () => {
        await fetch(`${originUrl}/api/internal/seed-rates`, {
          method: "POST",
          headers: { "x-internal-secret": internalSecret! },
        })
      })
    }
  },
  { baseUrl: process.env.NEXT_PUBLIC_REDIRECTION_URL, receiver: undefined }
)
