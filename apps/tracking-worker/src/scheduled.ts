export async function handleScheduled(event: any, env: any, ctx: any) {
	const trigger = fetch(`${env.MAIN_APP_URL}/api/workflows/sync`, {
		method: 'POST',
		headers: { 'x-internal-secret': env.INTERNAL_SECRET },
		body: JSON.stringify({ cron: event.cron }),
	});
	ctx.waitUntil(trigger);
}
