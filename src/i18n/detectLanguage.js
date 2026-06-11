import { strings } from './strings';

const STORAGE_KEY = 'dinaro_a11y';

// Slovenian is hidden for launch until the SL copy fixes are reviewed.
// Flip to true to bring the language selector entries and detection back.
export const SL_ENABLED = false;

// Resolve the initial language for a fresh page load.
// Priority:
//   1. Saved preference in localStorage (user clicked the selector before).
//   2. navigator.language starts with 'sl' → Slovenian.
//   3. Otherwise English.
//
// IP-based geolocation is intentionally out of scope here; it can layer on
// later when deployed to a host with edge geo headers (e.g. Cloudflare Pages).
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

	const nav = (typeof navigator !== 'undefined' && navigator.language || '').toLowerCase();
	if (nav.startsWith('sl')) return 'sl';
	return 'en';
}
