import { strings } from './strings';

const STORAGE_KEY = 'dinaro_a11y';

// Flip to false to hide Slovenian: the language selector (footer, homepage
// mobile, a11y panel) and 'sl' detection disappear and the site serves
// English only.
export const SL_ENABLED = true;

// Visitor country stamped on the HTML response by the Cloudflare worker
// (worker.js) from the request IP. Absent on local dev and other hosts.
function geoCountry() {
	if (typeof document === 'undefined') return null;
	const m = document.cookie.match(/(?:^|; )geo_country=([A-Za-z]{2})/);
	return m ? m[1].toUpperCase() : null;
}

// Resolve the initial language for a fresh page load.
// Priority:
//   1. Saved preference in localStorage (user clicked the selector before).
//   2. geo_country cookie from the edge: SI → Slovenian, anything else → English.
//   3. No cookie (local dev): navigator.language starts with 'sl' → Slovenian.
//   4. Otherwise English.
export function detectLanguage() {
	if (!SL_ENABLED) return 'en';
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const saved = JSON.parse(raw)?.language;
			if (saved && strings[saved]) return saved;
		}
	} catch {
		// localStorage may throw in private mode / sandboxed iframes.
	}

	const geo = geoCountry();
	if (geo) return geo === 'SI' ? 'sl' : 'en';

	const nav = (typeof navigator !== 'undefined' && navigator.language || '').toLowerCase();
	if (nav.startsWith('sl')) return 'sl';
	return 'en';
}
