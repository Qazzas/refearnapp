// workers/proxy/index.js
export default {
	async fetch(request: any, env: any, ctx: any) {
		const url = new URL(request.url);

		// 1. REDIRECT HOME PAGE TO SIGNUP
		// This catches "https://voteflow.xyz/" and sends it to "/signup"
		if (url.pathname === '/' || url.pathname === '') {
			return Response.redirect(`${url.origin}/signup`, 301);
		}

		// 2. PROXY ALL OTHER REQUESTS TO VPS
		// The "Secret Origin" (Your server's back door)
		const ORIGIN_HOSTNAME = 'origin.voteflow.xyz';
		const destination = `https://${ORIGIN_HOSTNAME}${url.pathname}${url.search}`;

		// Create the forwarded request
		const proxyRequest = new Request(destination, {
			method: request.method,
			headers: new Headers(request.headers),
			// Ensure body isn't passed for GET/HEAD requests
			body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
			redirect: 'manual',
		});

		// Set the Host header so Coolify knows which app to show
		proxyRequest.headers.set('Host', ORIGIN_HOSTNAME);
		proxyRequest.headers.set('X-Proxy-By', 'Cloudflare-Worker-Dynamic');

		try {
			return await fetch(proxyRequest);
		} catch (e: any) {
			return new Response(`Worker Proxy Error: ${e.message}`, { status: 502 });
		}
	},
};
