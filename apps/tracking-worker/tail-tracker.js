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

	// --- REUSABLE AUTH CHECK ---
	await checkCloudflareAuth();

	const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
	const workerNameLine = fileContent.split('\n').find((l) => l.startsWith('WORKER_NAME='));

	if (!workerNameLine) {
		console.error('❌ WORKER_NAME not found. Try redeploying.');
		process.exit(1);
	}

	const workerName = workerNameLine.split('=')[1].trim();

	console.log(`\n🕵️  Tailing logs for: ${workerName}...\n`);
	await $`npx wrangler tail --name ${workerName}`.inherit();
}

tail();
