import { $ } from 'bun';

export async function checkCloudflareAuth() {
	console.log('🔑 Checking Cloudflare session...');
	const authOutput = await $`npx wrangler whoami`.quiet().nothrow();
	const combinedOutput = authOutput.stdout.toString() + authOutput.stderr.toString();
	const isActuallyLoggedIn = combinedOutput.includes('Logged in') || /@/.test(combinedOutput);

	if (!isActuallyLoggedIn) {
		console.log('\n  ⚠️  Not logged in to Cloudflare.');
		console.log('  ---------------------------------------------------------');
		console.log('  Due to pnpm isolation, please authenticate manually:');
		console.log('\n  1. Run:  cd apps/tracking-worker');
		console.log('  2. Run:  npx wrangler login');
		console.log('  3. Run:  cd ../..');
		console.log('  4. Then: try your command again');
		console.log('  ---------------------------------------------------------\n');
		process.exit(1);
	}

	console.log(`  ✅ Authenticated.`);
}
