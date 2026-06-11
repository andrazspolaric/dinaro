import { useA11yState } from '../components/AccessibilityToggle';
import { strings } from './strings';

function lookup(dict, path) {
	return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict);
}

// Returns t(key) bound to the current language. t() returns whatever's at the
// path — string, array, or nested object. Falls back to English on missing
// keys; in dev, also logs a console.warn so missing translations surface.
export function useT() {
	const { language } = useA11yState();
	return (key) => {
		const value = lookup(strings[language], key);
		if (value !== undefined) return value;
		if (import.meta.env.DEV) {
			console.warn(`[i18n] missing ${language}.${key}`);
		}
		const fallback = lookup(strings.en, key);
		return fallback !== undefined ? fallback : key;
	};
}
