// Cloudflare Worker: serves the SPA assets and stamps the visitor's
// country (resolved by Cloudflare from the request IP) onto HTML
// responses as a cookie, so detectLanguage() can pick the default
// language before first paint. SI → Slovenian, everything else → English.
export default {
	async fetch(request, env) {
		const response = await env.ASSETS.fetch(request);
		const country = request.cf?.country;
		const accept = request.headers.get('accept') || '';
		if (country && accept.includes('text/html')) {
			const withCookie = new Response(response.body, response);
			withCookie.headers.append(
				'Set-Cookie',
				`geo_country=${country}; Path=/; Max-Age=86400; SameSite=Lax`
			);
			return withCookie;
		}
		return response;
	},
};
