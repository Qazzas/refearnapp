import { $ } from 'bun';
import fs from 'node:fs';
import path from 'node:path';
import { checkCloudflareAuth } from './scripts/auth-helper';

const CONFIG_PATH = path.join(process.cwd(), '.env.selfhost');

async function tail() {
	if (!fs.existsSync(CONFIG_PATH)) {
		console.error('❌ No config found. Please run deploy:tracker first.');
		process.exit(1);
	}

	await checkCloudflareAuth();

	const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
	const workerNameLine = fileContent.split('\n').find((l) => l.startsWith('WORKER_NAME='));

	if (!workerNameLine) {
		console.error('❌ WORKER_NAME not found. Try redeploying.');
		process.exit(1);
	}

	const workerName = workerNameLine.split('=')[1].trim();

	console.log(`\n🕵️  Tailing logs for: ${workerName}...`);
	console.log(`📡 Connecting to Cloudflare...`);
	console.log(`💡 Press Ctrl+C to stop.\n`);

	try {
		// .quiet(false) ensures the output is piped to your terminal immediately
		// .nothrow() prevents the script from crashing when you hit Ctrl+C
		await $`npx wrangler tail ${workerName}`.quiet(false).nothrow();
	} catch (e) {
		// Silent exit
	}
}

tail();
