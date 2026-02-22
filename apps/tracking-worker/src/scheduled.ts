import { Redis } from '@upstash/redis/cloudflare';

export async function handleScheduled(event: any, env: any, ctx: any) {
	console.log(`⏰ Cron Triggered: ${event.cron} at ${new Date().toISOString()}`);

	switch (event.cron) {
		case '*/5 * * * *':
			return await handleBatchSync(env);
		case '0 0 * * *':
			return await handleCurrencySeed(env);
		default:
			console.log('No handler for this cron string');
	}
}

async function handleBatchSync(env: any) {
	const redis = Redis.fromEnv(env);
	const exists = await redis.exists('sync_batch');
	if (!exists) return;

	const processingKey = `sync_processing_${Date.now()}`;
	await redis.rename('sync_batch', processingKey);

	let cursor = '0';
	const fullBatch: Record<string, string> = {};

	do {
		const [nextCursor, items] = await redis.hscan(processingKey, cursor, { count: 1000 });
		cursor = nextCursor;
		for (let i = 0; i < items.length; i += 2) {
			fullBatch[String(items[i])] = String(items[i + 1]);
		}
	} while (cursor !== '0');

	const batchKeys = Object.keys(fullBatch);
	if (batchKeys.length === 0) {
		await redis.del(processingKey);
		return;
	}

	try {
		const response = await fetch(`${env.MAIN_APP_URL}/api/internal/sync-batch`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-internal-secret': env.INTERNAL_SECRET,
			},
			body: JSON.stringify({ batch: fullBatch }),
		});

		if (response.ok) {
			await redis.del(processingKey);
			console.log(`✅ Synced ${batchKeys.length} items to Vercel.`);
		} else {
			throw new Error(`Server returned ${response.status}`);
		}
	} catch (error) {
		console.error('❌ Sync failed, merging back:', error);
		const pipeline = redis.pipeline();
		for (const [key, val] of Object.entries(fullBatch)) {
			pipeline.hincrby('sync_batch', key, parseInt(val));
		}
		await pipeline.exec();
		await redis.del(processingKey);
	}
}

async function handleCurrencySeed(env: any) {
	try {
		const response = await fetch(`${env.MAIN_APP_URL}/api/internal/seed-rates`, {
			method: 'POST',
			headers: { 'x-internal-secret': env.INTERNAL_SECRET },
		});

		if (response.ok) {
			console.log('✅ Triggered Currency Seed on Vercel');
		} else {
			console.error('❌ Vercel failed to process currency seed');
		}
	} catch (err) {
		console.error('❌ Error pinging currency seed endpoint:', err);
	}
}
