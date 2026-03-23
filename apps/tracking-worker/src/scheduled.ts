// apps/tracking-worker/src/index.ts
import { Redis } from '@upstash/redis/cloudflare';

export async function handleScheduled(event: any, env: any, ctx: any) {
	const redis = Redis.fromEnv(env);
	if (event.cron === '0 0 * * *') {
		ctx.waitUntil(triggerWorkflow(event.cron, env));
		return;
	}
	if (event.cron === '*/10 * * * *') {
		const [clickExists, leadKeys] = await Promise.all([redis.exists('sync_batch'), redis.scan(0, { match: 'sync:leads:*', count: 1 })]);

		const hasLeads = leadKeys[1].length > 0;

		if (clickExists || hasLeads) {
			console.log('📦 Data found! Triggering Workflow...');
			ctx.waitUntil(triggerWorkflow(event.cron, env));
		} else {
			console.log('😴 No data to sync. Skipping Workflow to save costs.');
		}
	}
}

async function triggerWorkflow(cron: string, env: any) {
	return fetch(`${env.MAIN_APP_URL}/api/workflows/sync`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-internal-secret': env.INTERNAL_SECRET,
		},
		body: JSON.stringify({ cron }),
	});
}
