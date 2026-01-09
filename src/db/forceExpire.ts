// src/lib/forceExpire.ts
import { db } from "@/db/drizzle"
import { subscriptionExpiration } from "@/db/schema"
import { eq } from "drizzle-orm"

async function forceExpire(subId: string) {
  await db
    .update(subscriptionExpiration)
    .set({ expirationDate: new Date("2020-01-01") })
    .where(eq(subscriptionExpiration.subscriptionId, subId))
  console.log(`💀 Sub ${subId} is now forced to EXPIRED status in DB.`)
}

forceExpire(process.argv[2])
  .then(() => console.log("Done"))
  .catch((err) => console.error(err))
