import { $ } from 'bun';
import fs from 'node:fs';
import path from 'node:path';
import { checkCloudflareAuth } from './scripts/auth-helper';

const CONFIG_PATH = path.join(process.cwd(), '.env.selfhost');

async function setup() {
	console.log('\n🌐 Voteflow Tracker: Self-Host Deployment\n');

	const isReset = process.argv.includes('--reset');
	if (isReset && fs.existsSync(CONFIG_PATH)) {
		console.log('🧹 Reset flag detected. Clearing previous configuration...');
		fs.unlinkSync(CONFIG_PATH);
	}

	// --- REUSABLE AUTH CHECK ---
	await checkCloudflareAuth();

	let config = {};

	if (fs.existsSync(CONFIG_PATH)) {
		console.log('📖 Loading existing configuration from .env.selfhost...');
		const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
		fileContent.split('\n').forEach((line) => {
			const [key, ...valueParts] = line.split('=');
			const value = valueParts.join('=');
			if (key && value) config[key.trim()] = value.trim();
		});
	} else {
		console.log('📝 New configuration required:');

		const vpsRaw = prompt('Enter VPS App URL:') || '';
		const publicRaw = prompt('Enter Public Worker Domain:') || '';
		const secretRaw = prompt('INTERNAL_SECRET:') || '';
		const redisUrlRaw = prompt('UPSTASH_REDIS_REST_URL:') || '';
		const redisTokenRaw = prompt('UPSTASH_REDIS_REST_TOKEN:') || '';

		const clean = (val) => val.trim().replace(/^["']|["']$/g, '');

		config.VPS_DOMAIN = clean(vpsRaw)
			.replace(/^https?:\/\//, '')
			.replace(/\/$/, '')
			.toLowerCase();
		config.PUBLIC_DOMAIN = clean(publicRaw)
			.replace(/^https?:\/\//, '')
			.replace(/\/$/, '')
			.toLowerCase();
		config.INTERNAL_SECRET = clean(secretRaw);
		config.REDIS_URL = clean(redisUrlRaw).replace(/\/$/, '');
		config.REDIS_TOKEN = clean(redisTokenRaw);

		// SAVE THE WORKER NAME TO THE FILE HERE
		config.WORKER_NAME = `${config.PUBLIC_DOMAIN.replace(/\./g, '-')}-tracker`;

		if (Object.values(config).some((v) => !v)) {
			console.error('\n❌ Error: All values are required.');
			process.exit(1);
		}

		const configData = Object.entries(config)
			.map(([k, v]) => `${k}=${v}`)
			.join('\n');
		fs.writeFileSync(CONFIG_PATH, configData);
		console.log('💾 Configuration saved (including WORKER_NAME).');
	}

	const mainAppUrl = `https://${config.VPS_DOMAIN}`;
	const vpsPrimaryHost = config.PUBLIC_DOMAIN.startsWith('www.') ? config.PUBLIC_DOMAIN : `www.${config.PUBLIC_DOMAIN}`;
	const workerName = config.WORKER_NAME;

	try {
		console.log(`\n📦 Deploying to Worker: ${workerName}...`);
		await $`npx wrangler deploy src/index.ts --name ${workerName} --compatibility-date 2026-01-01 --var PRIMARY_HOST:${vpsPrimaryHost} --var MAIN_APP_URL:${mainAppUrl} --var IS_SELF_HOSTED:true`;

		const setSecret = async (k, v) => {
			await $`echo ${v} | npx wrangler secret put ${k} --name ${workerName}`.quiet();
		};

		await setSecret('INTERNAL_SECRET', config.INTERNAL_SECRET);
		await setSecret('UPSTASH_REDIS_REST_URL', config.REDIS_URL);
		await setSecret('UPSTASH_REDIS_REST_TOKEN', config.REDIS_TOKEN);

		console.log(`\n🎉 SUCCESS! Tracker live for ${vpsPrimaryHost}`);
	} catch (e) {
		console.error('\n❌ Deployment failed:', e.message);
	}
}

setup();
