import { $ } from 'bun';

async function setup() {
	console.log('\n🌐 Voteflow Tracker: Self-Host Deployment\n');

	// --- STEP 1: AUTH CHECK ---
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
		console.log('  4. Then: pnpm deploy:tracker');
		console.log('  ---------------------------------------------------------\n');
		process.exit(1);
	} else {
		console.log(`  ✅ Authenticated.`);
	}

	// --- STEP 2: COLLECT DATA ---
	console.log('\n📝 Configuration:');

	const rawVpsDomain = prompt('Enter VPS App URL:');
	const rawPublicDomain = prompt('Enter Public Worker Domain:');
	const internalSecret = prompt('INTERNAL_SECRET:');
	const redisUrl = prompt('REDIS_URL:');
	const redisToken = prompt('REDIS_TOKEN:');

	// Strict Blank Check
	if (!rawVpsDomain?.trim() || !rawPublicDomain?.trim() || !internalSecret?.trim() || !redisUrl?.trim() || !redisToken?.trim()) {
		console.error('\n❌ Error: All values are required. Deployment aborted.');
		process.exit(1);
	}

	// Formatting: Main App URL gets https://
	const cleanApp = rawVpsDomain
		.replace(/^https?:\/\//, '')
		.replace(/\/$/, '')
		.toLowerCase();
	const mainAppUrl = `https://${cleanApp}`;

	// Formatting: VPS Primary Host gets www.
	const cleanVps = rawPublicDomain
		.replace(/^https?:\/\//, '')
		.replace(/\/$/, '')
		.toLowerCase();
	const vpsPrimaryHost = cleanVps.startsWith('www.') ? cleanVps : `www.${cleanVps}`;

	// Use cleanApp for Worker Name (no dots, no https)
	const workerName = `${cleanVps.replace(/\./g, '-')}-tracker`;

	// --- STEP 3: DEPLOY ---
	try {
		console.log(`\n📦 Step 1: Deploying Worker Code...`);

		// PRIMARY_HOST gets the www domain (VPS), MAIN_APP_URL gets the https domain (App)
		await $`npx wrangler deploy src/index.ts --name ${workerName} --compatibility-date 2024-04-01 --var PRIMARY_HOST:${vpsPrimaryHost} --var MAIN_APP_URL:${mainAppUrl} --var IS_SELF_HOSTED:true`;

		console.log(`\n🔒 Step 2: Uploading Secrets...`);

		const setSecret = async (k, v) => {
			await $`echo "${v.trim()}" | npx wrangler secret put ${k} --name ${workerName}`.quiet();
			console.log(`  ✅ ${k} secured.`);
		};

		await setSecret('INTERNAL_SECRET', internalSecret);
		await setSecret('UPSTASH_REDIS_REST_URL', redisUrl);
		await setSecret('UPSTASH_REDIS_REST_TOKEN', redisToken);

		console.log(`\n🎉 SUCCESS! Tracker live for ${vpsPrimaryHost}`);
		console.log(`🔗 Dashboard: https://dash.cloudflare.com/?to=/:account/workers/services/view/${workerName}/production`);
	} catch (e) {
		console.error('\n❌ Deployment failed.');
		console.error(e.stderr?.toString() || e.stdout?.toString() || e.message);
	}
}

setup();
