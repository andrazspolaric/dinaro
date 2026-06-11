# Slovenian i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the existing language selector to actually translate the Dinaro-v2 marketing/UI surface between English and Slovenian.

**Architecture:** Central JS dictionary (`src/i18n/strings.js`) read via a `useT()` hook bound to the existing a11y `language` state. Initial language detected from localStorage, then `navigator.language`, defaulting to English. Legal pages (Terms, Privacy, Complaints) stay English-only.

**Tech Stack:** React 19, Vite 8, react-router 7, motion/react. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-05-04-slovenian-i18n-design.md`

**Verification model:** This repo has no test infra. Each task ends with a manual verification step (browser check via `npm run dev`) and a commit step. Translations are authored during the relevant task by the implementer, following length-parity rules and translation conventions in the spec.

---

## Phase 1 — i18n plumbing

After this phase the framework supports language switching, but no rendered text changes yet.

### Task 1: Create the strings dictionary skeleton

**Files:**
- Create: `src/i18n/strings.js`

- [ ] **Step 1: Create the file with both language objects**

```js
// src/i18n/strings.js
//
// Source of truth for all translatable copy.
// Keys are hierarchical. Values may be strings, arrays, or nested objects —
// useT()'s lookup walks the path and returns whatever's there.
//
// Conventions (see spec docs/superpowers/specs/2026-05-04-slovenian-i18n-design.md):
//   - Length parity: SL strings stay within ±10% of EN character count.
//   - Brand / product names (Dinaro, Mastercard, SEPA, EMI, EMT, etc.) stay
//     untranslated.
//   - Legal pages (Terms, Privacy, Complaints) are NOT in this dictionary;
//     those page bodies render English regardless of language.
//   - The language switcher uses native labels ("English", "Slovenščina")
//     regardless of selected language — those live in
//     AccessibilityToggle.jsx (LANGUAGES constant), not here.

export const strings = {
	en: {
		meta: {
			title: 'Dinaro - Fintech, Your Way!',
		},
		nav: {},
		footer: {},
		a11y: {},
		home: {},
		paymentAccounts: {},
		individuals: {},
		business: {},
		debitCards: {},
		individualDebitCard: {},
		businessDebitCard: {},
		emt: {},
		acquiring: {},
		acquiringECommerce: {},
		paymentModules: {},
		bankingApi: {},
		cardsApi: {},
		whitelabel: {},
		whitelabelOnboarding: {},
		whitelabelRamp: {},
		whitelabelCustom: {},
		company: {},
		contact: {},
		notFound: {},
	},
	sl: {
		meta: {
			title: 'Dinaro - Fintech po vaše!',
		},
		nav: {},
		footer: {},
		a11y: {},
		home: {},
		paymentAccounts: {},
		individuals: {},
		business: {},
		debitCards: {},
		individualDebitCard: {},
		businessDebitCard: {},
		emt: {},
		acquiringECommerce: {},
		acquiring: {},
		paymentModules: {},
		bankingApi: {},
		cardsApi: {},
		whitelabel: {},
		whitelabelOnboarding: {},
		whitelabelRamp: {},
		whitelabelCustom: {},
		company: {},
		contact: {},
		notFound: {},
	},
};
```

- [ ] **Step 2: Commit**

```bash
git add src/i18n/strings.js
git commit -m "feat(i18n): add strings dictionary skeleton"
```

---

### Task 2: Create the language-detection helper

**Files:**
- Create: `src/i18n/detectLanguage.js`

- [ ] **Step 1: Write the helper**

```js
// src/i18n/detectLanguage.js
import { strings } from './strings';

const STORAGE_KEY = 'dinaro_a11y';

// Resolve the initial language for a fresh page load.
// Priority:
//   1. Saved preference in localStorage (user clicked the selector before).
//   2. navigator.language starts with 'sl' → Slovenian.
//   3. Otherwise English.
//
// IP-based geolocation is intentionally out of scope here; it can layer on
// later when deployed to a host with edge geo headers (e.g. Cloudflare Pages).
export function detectLanguage() {
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
```

- [ ] **Step 2: Commit**

```bash
git add src/i18n/detectLanguage.js
git commit -m "feat(i18n): add detectLanguage helper"
```

---

### Task 3: Create the `useT` hook

**Files:**
- Create: `src/i18n/useT.js`

- [ ] **Step 1: Write the hook**

```js
// src/i18n/useT.js
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
```

- [ ] **Step 2: Commit**

```bash
git add src/i18n/useT.js
git commit -m "feat(i18n): add useT hook with EN fallback"
```

---

### Task 4: Wire `detectLanguage` into `AccessibilityToggle.loadState`

**Files:**
- Modify: `src/components/AccessibilityToggle.jsx` (`loadState` function, around line 192-200)

- [ ] **Step 1: Add the import at the top of `AccessibilityToggle.jsx`**

After the existing `import './AccessibilityToggle.css';` line, add:

```js
import { detectLanguage } from '../i18n/detectLanguage';
```

- [ ] **Step 2: Update `loadState` to use detection on first load**

Replace the existing `loadState` function:

```js
function loadState() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULT_STATE;
		return {...DEFAULT_STATE, ...JSON.parse(raw)};
	} catch {
		return DEFAULT_STATE;
	}
}
```

with:

```js
function loadState() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {...DEFAULT_STATE, language: detectLanguage()};
		const parsed = JSON.parse(raw);
		// Saved language wins; if absent, run detection so existing users with
		// pre-i18n a11y state still get browser-matched language.
		return {
			...DEFAULT_STATE,
			...parsed,
			language: parsed.language || detectLanguage(),
		};
	} catch {
		return {...DEFAULT_STATE, language: detectLanguage()};
	}
}
```

- [ ] **Step 3: Manual verification**

Run `npm run dev` and open `http://localhost:5173`. Open DevTools → Application → Local Storage → clear `dinaro_a11y`. In Chrome → Settings → Languages, move Slovenian to top. Hard-refresh. Confirm via DevTools Console: `JSON.parse(localStorage.getItem('dinaro_a11y')).language` returns `'sl'`. Move English back to top, clear storage again, hard-refresh — should return `'en'`. Click the language switcher in the footer to Slovenian, refresh — should still be `'sl'` (saved choice wins).

Nothing visible has changed yet — this is purely state plumbing.

- [ ] **Step 4: Commit**

```bash
git add src/components/AccessibilityToggle.jsx
git commit -m "feat(i18n): detect initial language from browser when no saved choice"
```

---

### Task 5: Sync `<html lang>` and `document.title` from a11y state

**Files:**
- Modify: `src/App.jsx` (after line 104 where `useA11yState` is called)
- Modify: `index.html` (line 2 — initial `lang` attribute)

- [ ] **Step 1: Update `index.html` initial lang**

Change line 2 from:

```html
<html lang="en">
```

to:

```html
<html lang="en" data-i18n-managed>
```

The `data-i18n-managed` attribute is a marker so it's clear the runtime overrides this. Initial value stays `en` so SSR / first paint isn't blank for Slovenian visitors before JS runs (acceptable: the title swap happens on the same render tick once React mounts).

- [ ] **Step 2: Add the sync effect in `App.jsx`**

At the top of `App.jsx`, replace this import line:

```js
import AccessibilityToggle, { useA11yState } from './components/AccessibilityToggle';
```

with this (adds `useT`):

```js
import AccessibilityToggle, { useA11yState } from './components/AccessibilityToggle';
import { useT } from './i18n/useT';
```

Then in the `App()` function, replace:

```js
export default function App() {
	useViewportScale();
	const a11y = useA11yState();
	return (
```

with:

```js
export default function App() {
	useViewportScale();
	const a11y = useA11yState();
	const t = useT();

	useEffect(() => {
		document.documentElement.lang = a11y.language;
		document.title = t('meta.title');
	}, [a11y.language, t]);

	return (
```

(`useEffect` is already imported at the top of `App.jsx`.)

- [ ] **Step 3: Manual verification**

Run `npm run dev`. Open the page. In DevTools, inspect `<html>`: `lang="en"`, document title: `Dinaro - Fintech, Your Way!`. Click the footer language switcher to Slovenian. Inspect `<html>`: `lang="sl"`, title: `Dinaro - Fintech po vaše!`. Switch back to English, both revert.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx index.html
git commit -m "feat(i18n): sync html lang and document title with selected language"
```

---

## Phase 2 — Translate the chrome

After this phase, switching language visibly changes navbar, footer, and the a11y panel on every page. Pages still show English content, but you can verify the system end-to-end.

### Task 6: Translate the accessibility panel

**Files:**
- Modify: `src/i18n/strings.js` (fill the `a11y` keys for `en` and `sl`)
- Modify: `src/components/AccessibilityToggle.jsx` (replace literal labels with `t()` calls)

- [ ] **Step 1: Add the `a11y` block to `strings.js`**

Replace the empty `a11y: {}` blocks with:

```js
// inside strings.en
a11y: {
	openLabel: 'Open accessibility settings',
	closeLabel: 'Close accessibility settings',
	heading: 'Accessibility',
	resetAll: 'Reset All Settings',
	sections: {
		language: 'Language',
		reading: 'Reading',
		colors: 'Colors',
		orientation: 'Orientation',
	},
	rows: {
		fontSize: 'Font size',
		readingFont: 'Reading font',
		lineHeight: 'Line height',
		bigCursor: 'Big cursor',
		letterSpacing: 'Letter spacing',
		textCenter: 'Text align center',
		bold: 'Bold fonts',
		lightContrast: 'Light contrast',
		highContrast: 'High contrast',
		monochrome: 'Monochrome',
		readingLine: 'Reading line',
		readingMask: 'Reading mask',
		hidePhotos: 'Hide photos',
		highlightContent: 'Highlight content',
		hideAnimations: 'Hide animations',
		highlightLinks: 'Highlight links',
	},
	stepper: {
		decreaseFont: 'Decrease font size',
		increaseFont: 'Increase font size',
		decreaseLine: 'Decrease line height',
		increaseLine: 'Increase line height',
	},
},

// inside strings.sl
a11y: {
	openLabel: 'Odpri nastavitve dostopnosti',
	closeLabel: 'Zapri nastavitve dostopnosti',
	heading: 'Dostopnost',
	resetAll: 'Ponastavi vse nastavitve',
	sections: {
		language: 'Jezik',
		reading: 'Branje',
		colors: 'Barve',
		orientation: 'Postavitev',
	},
	rows: {
		fontSize: 'Velikost pisave',
		readingFont: 'Pisava za branje',
		lineHeight: 'Razmik vrstic',
		bigCursor: 'Velik kazalec',
		letterSpacing: 'Razmik črk',
		textCenter: 'Sredinska poravnava',
		bold: 'Krepka pisava',
		lightContrast: 'Svetel kontrast',
		highContrast: 'Visok kontrast',
		monochrome: 'Enobarvno',
		readingLine: 'Vrstica za branje',
		readingMask: 'Maska za branje',
		hidePhotos: 'Skrij slike',
		highlightContent: 'Označi vsebino',
		hideAnimations: 'Brez animacij',
		highlightLinks: 'Označi povezave',
	},
	stepper: {
		decreaseFont: 'Zmanjšaj pisavo',
		increaseFont: 'Povečaj pisavo',
		decreaseLine: 'Zmanjšaj razmik',
		increaseLine: 'Povečaj razmik',
	},
},
```

- [ ] **Step 2: Add `useT` import at the top of `AccessibilityToggle.jsx`**

```js
import { useT } from '../i18n/useT';
```

- [ ] **Step 3: Wire `t()` into the component**

Inside the default export, immediately after `const [mouseY, setMouseY] = useState(0);`, add:

```js
const t = useT();
```

Replace the hardcoded `TOGGLES` block (currently `const TOGGLES = { reading: [...], colors: [...], orientation: [...] };` near line 133) by moving it inside the component and binding labels to `t()`:

```js
// Move this OUT of module scope and INSIDE the component, replacing the
// existing module-scope TOGGLES constant.
const toggles = {
	reading: [
		{key: 'bigCursor', label: t('a11y.rows.bigCursor'), icon: Icons.bigCursor},
		{key: 'letterSpacing', label: t('a11y.rows.letterSpacing'), icon: Icons.letterSpacing},
		{key: 'textCenter', label: t('a11y.rows.textCenter'), icon: Icons.textCenter},
		{key: 'bold', label: t('a11y.rows.bold'), icon: Icons.bold},
	],
	colors: [
		{key: 'lightContrast', label: t('a11y.rows.lightContrast'), icon: Icons.lightContrast},
		{key: 'highContrast', label: t('a11y.rows.highContrast'), icon: Icons.highContrast},
		{key: 'monochrome', label: t('a11y.rows.monochrome'), icon: Icons.monochrome},
	],
	orientation: [
		{key: 'readingLine', label: t('a11y.rows.readingLine'), icon: Icons.readingLine},
		{key: 'readingMask', label: t('a11y.rows.readingMask'), icon: Icons.readingMask},
		{key: 'hidePhotos', label: t('a11y.rows.hidePhotos'), icon: Icons.hidePhotos},
		{key: 'highlightContent', label: t('a11y.rows.highlightContent'), icon: Icons.highlightContent},
		{key: 'hideAnimations', label: t('a11y.rows.hideAnimations'), icon: Icons.hideAnimations},
		{key: 'highlightLinks', label: t('a11y.rows.highlightLinks'), icon: Icons.highlightLinks},
	],
};
```

Delete the module-scope `const TOGGLES = ...` block (lines ~133-153).

In the JSX, update references from `TOGGLES.reading.map(...)` to `toggles.reading.map(...)` (three places).

Replace literal labels in JSX:

| Find | Replace with |
|---|---|
| `aria-label="Open accessibility settings"` (button line ~306) | `aria-label={t('a11y.openLabel')}` |
| `<h2>Accessibility</h2>` | `<h2>{t('a11y.heading')}</h2>` |
| `aria-label="Close accessibility settings"` | `aria-label={t('a11y.closeLabel')}` |
| `aria-label="Accessibility settings"` (the `<aside>` aria-label) | `aria-label={t('a11y.heading')}` |
| `<div className="a11y-section-title">Language</div>` | `<div className="a11y-section-title">{t('a11y.sections.language')}</div>` |
| `<div className="a11y-section-title">Reading</div>` | `<div className="a11y-section-title">{t('a11y.sections.reading')}</div>` |
| `<div className="a11y-section-title">Colors</div>` | `<div className="a11y-section-title">{t('a11y.sections.colors')}</div>` |
| `<div className="a11y-section-title">Orientation</div>` | `<div className="a11y-section-title">{t('a11y.sections.orientation')}</div>` |
| `<span className="a11y-row-label">Font size</span>` | `<span className="a11y-row-label">{t('a11y.rows.fontSize')}</span>` |
| `aria-label="Decrease font size"` | `aria-label={t('a11y.stepper.decreaseFont')}` |
| `aria-label="Increase font size"` | `aria-label={t('a11y.stepper.increaseFont')}` |
| `<span className="a11y-row-label">Line height</span>` | `<span className="a11y-row-label">{t('a11y.rows.lineHeight')}</span>` |
| `aria-label="Decrease line height"` | `aria-label={t('a11y.stepper.decreaseLine')}` |
| `aria-label="Increase line height"` | `aria-label={t('a11y.stepper.increaseLine')}` |
| `label="Reading font"` (the Row component) | `label={t('a11y.rows.readingFont')}` |
| `>Reset All Settings<` (button label) | `>{t('a11y.resetAll')}<` |

The `Row` for English/Slovenščina language (line ~357 / ~362) — leave the labels as `"English"` / `"Slovenščina"` literally. Native-language convention.

- [ ] **Step 4: Manual verification**

Run `npm run dev`. Click the accessibility button (bottom-right circular icon). Verify all section titles, toggle labels, and aria-labels render in current language. Switch language via the panel's Language section — the panel labels should update live without closing. Toggle a setting (e.g., Big cursor / Velik kazalec) and confirm it still works.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/strings.js src/components/AccessibilityToggle.jsx
git commit -m "feat(i18n): translate accessibility panel"
```

---

### Task 7: Translate the footer

**Files:**
- Modify: `src/i18n/strings.js` (fill `footer` keys)
- Modify: `src/components/Footer.jsx`

- [ ] **Step 1: Add `footer` block to `strings.js`**

Replace `footer: {}` blocks with:

```js
// strings.en
footer: {
	copyright: '© Copyright 2026, All Rights Reserved',
	terms: 'Terms & Conditions',
	complaints: 'Complaints',
	privacy: 'Privacy Policy',
},

// strings.sl
footer: {
	copyright: '© Copyright 2026, vse pravice pridržane',
	terms: 'Splošni pogoji',
	complaints: 'Pritožbe',
	privacy: 'Zasebnost',
},
```

- [ ] **Step 2: Wire `useT` into `Footer.jsx`**

Add import at the top:

```js
import { useT } from '../i18n/useT';
```

Inside the default `Footer()` function, after `const isMobile = ...;`, add:

```js
const t = useT();
```

Replace literals:

| Find | Replace with |
|---|---|
| `© Copyright 2026, All Rights Reserved` | `{t('footer.copyright')}` |
| `Terms &amp; Conditions` (button text) | `{t('footer.terms')}` |
| `Complaints` (button text) | `{t('footer.complaints')}` |
| `Privacy Policy` (button text) | `{t('footer.privacy')}` |

- [ ] **Step 3: Manual verification**

Run `npm run dev`. Scroll to footer. Verify in English. Switch language to Slovenščina via the dropdown. Confirm "© Copyright 2026, vse pravice pridržane", "Splošni pogoji", "Pritožbe", "Zasebnost". Click each link — the legal pages still load in English (expected).

- [ ] **Step 4: Commit**

```bash
git add src/i18n/strings.js src/components/Footer.jsx
git commit -m "feat(i18n): translate footer chrome"
```

---

### Task 8: Translate navbar + restructure shared dropdown data

**Files:**
- Modify: `src/i18n/strings.js` (fill `nav` keys)
- Modify: `src/shared.js` (change dropdown shape from labels to keys)
- Modify: `src/components/Navbar.jsx` (resolve labels via `t()`)

- [ ] **Step 1: Add `nav` block to `strings.js`**

```js
// strings.en
nav: {
	customers: 'Customers',
	partners: 'Partners',
	company: 'Company',
	contact: 'Contact',
	getStarted: 'Get Started',
	openMenu: 'Open menu',
	closeMenu: 'Close menu',
	logoLabel: 'Dinaro home',
	products: {
		paymentAccounts: 'Payment Accounts',
		paymentAccountsIndividual: 'Individual',
		paymentAccountsBusiness: 'Business',
		debitCards: 'Debit Cards',
		debitCardsIndividual: 'Individual',
		debitCardsBusiness: 'Business',
		emt: 'E-Money Tokens',
		emtIssuing: 'EMT Issuing',
		acquiring: 'Acquiring',
		acquiringECommerce: 'E-Commerce',
		acquiringPaymentModules: 'Payment Modules',
	},
	solutions: {
		paymentAccountAaS: 'Payment Account as a Service',
		paymentAccountApi: 'Payment Account API',
		cardIssuing: 'Card Issuing',
		cardsApi: 'Cards API',
		fintechServices: 'Fintech Services',
		onboarding: 'Onboarding',
		ramp: 'Ramp',
		customSolutions: 'Custom Solutions',
	},
},

// strings.sl
nav: {
	customers: 'Stranke',
	partners: 'Partnerji',
	company: 'Podjetje',
	contact: 'Stik',
	getStarted: 'Začnite zdaj',
	openMenu: 'Odpri meni',
	closeMenu: 'Zapri meni',
	logoLabel: 'Domov - Dinaro',
	products: {
		paymentAccounts: 'Plačilni računi',
		paymentAccountsIndividual: 'Osebni',
		paymentAccountsBusiness: 'Poslovni',
		debitCards: 'Debetne kartice',
		debitCardsIndividual: 'Osebne',
		debitCardsBusiness: 'Poslovne',
		emt: 'E-žetoni',
		emtIssuing: 'Izdajanje EMT',
		acquiring: 'Sprejemanje plačil',
		acquiringECommerce: 'E-trgovina',
		acquiringPaymentModules: 'Plačilni moduli',
	},
	solutions: {
		// kept compact for layout — literal: "Plačilni račun kot storitev"
		paymentAccountAaS: 'Plačilni račun kot storitev',
		paymentAccountApi: 'API za plačilne račune',
		cardIssuing: 'Izdajanje kartic',
		cardsApi: 'API za kartice',
		fintechServices: 'Fintech storitve',
		onboarding: 'Vključitev',
		ramp: 'Ramp',
		customSolutions: 'Po meri',
	},
},
```

- [ ] **Step 2: Restructure `src/shared.js` dropdown data**

Replace the `productsDropdown` and `solutionsDropdown` exports:

```js
// ── Nav dropdown data ──────────────────────────────────────────────
// Shape: { titleKey, titleHref, items: [{ labelKey, href }] }
// Labels are resolved at render time via useT() → t(titleKey/labelKey).
// hrefs do not translate.
export const productsDropdown = [
	{
		titleKey: 'nav.products.paymentAccounts',
		titleHref: '/products/payment-accounts',
		items: [
			{ labelKey: 'nav.products.paymentAccountsIndividual', href: '/products/payment-accounts/individual' },
			{ labelKey: 'nav.products.paymentAccountsBusiness', href: '/products/payment-accounts/business' },
		],
	},
	{
		titleKey: 'nav.products.debitCards',
		titleHref: '/products/debit-cards',
		items: [
			{ labelKey: 'nav.products.debitCardsIndividual', href: '/products/debit-cards/individual' },
			{ labelKey: 'nav.products.debitCardsBusiness', href: '/products/debit-cards/business' },
		],
	},
	{
		titleKey: 'nav.products.emt',
		titleHref: '/products/emt',
		items: [
			{ labelKey: 'nav.products.emtIssuing', href: '/products/emt' },
		],
	},
	{
		titleKey: 'nav.products.acquiring',
		titleHref: '/products/acquiring',
		items: [
			{ labelKey: 'nav.products.acquiringECommerce', href: '/products/acquiring/e-commerce' },
			{ labelKey: 'nav.products.acquiringPaymentModules', href: '/products/acquiring/payment-modules' },
		],
	},
];

export const solutionsDropdown = [
	{
		titleKey: 'nav.solutions.paymentAccountAaS',
		titleHref: '/solutions/banking-api',
		items: [
			{ labelKey: 'nav.solutions.paymentAccountApi', href: '/solutions/banking-api' },
		],
	},
	{
		titleKey: 'nav.solutions.cardIssuing',
		titleHref: '/solutions/cards-api',
		items: [
			{ labelKey: 'nav.solutions.cardsApi', href: '/solutions/cards-api' },
		],
	},
	{
		titleKey: 'nav.solutions.fintechServices',
		titleHref: '/solutions/whitelabel',
		items: [
			{ labelKey: 'nav.solutions.onboarding', href: '/solutions/whitelabel/onboarding' },
			{ labelKey: 'nav.solutions.ramp', href: '/solutions/whitelabel/ramp' },
			{ labelKey: 'nav.solutions.customSolutions', href: '/solutions/whitelabel/custom' },
		],
	},
];
```

- [ ] **Step 3: Wire `useT` into `Navbar.jsx`**

Add import:

```js
import { useT } from '../i18n/useT';
```

In the `Navbar` function, after `const preloadRoute = usePreloadRoute();`, add:

```js
const t = useT();
```

In the **mobile branch**, replace literals:

| Find (mobile) | Replace with |
|---|---|
| `aria-label="Dinaro home"` | `aria-label={t('nav.logoLabel')}` |
| `aria-label="Open menu"` | `aria-label={t('nav.openMenu')}` |
| `aria-label="Close menu"` | `aria-label={t('nav.closeMenu')}` |
| `<span className="navbar-mobile__section-label">Customers</span>` | `<span className="navbar-mobile__section-label">{t('nav.customers')}</span>` |
| `<span className="navbar-mobile__section-label">Partners</span>` | `<span className="navbar-mobile__section-label">{t('nav.partners')}</span>` |
| (inside the products accordion) `{productsDropdown.map(({ title, items }) => (` | `{productsDropdown.map(({ titleKey, items }) => (` |
| (inside that block) `<p className="navbar-mobile__group-label">{title}</p>` | `<p className="navbar-mobile__group-label">{t(titleKey)}</p>` |
| `{items.map(({ label, href }) => (` | `{items.map(({ labelKey, href }) => (` |
| `<button key={label} ...>{label}</button>` (inside group items) | `<button key={labelKey} ...>{t(labelKey)}</button>` |
| Same three substitutions for `solutionsDropdown` mapping below | (parallel changes) |
| Mobile top-level array `[{ label: 'Company', href: '/company' }, { label: 'Contact', href: '/contact' }]` | `[{ label: t('nav.company'), href: '/company' }, { label: t('nav.contact'), href: '/contact' }]` |
| Get Started button inner text `Get Started` | `{t('nav.getStarted')}` |

In the **desktop branch**:

| Find (desktop) | Replace with |
|---|---|
| `aria-label="Dinaro home"` | `aria-label={t('nav.logoLabel')}` |
| `aria-label="Main navigation"` | `aria-label={t('nav.mainNav')}` (add the `mainNav` key in step 1 below) |
| Top-level links array `{ label: 'Customers', key: 'products', ... }` etc. | Use `{ label: t('nav.customers'), key: 'products', ... }`, `{ label: t('nav.partners'), key: 'solutions', ... }`, `{ label: t('nav.company'), ... }`, `{ label: t('nav.contact'), ... }` |
| `<p className="navbar__cta-label">Get Started</p>` | `<p className="navbar__cta-label">{t('nav.getStarted')}</p>` |
| `productsDropdown.map(({ title, titleHref, items }, index) => ...)` | `productsDropdown.map(({ titleKey, titleHref, items }, index) => ...)` |
| `<p className="navbar__dropdown-title">{title}</p>` | `<p className="navbar__dropdown-title">{t(titleKey)}</p>` |
| `key={`products-${index}-${title}`}` | `key={`products-${index}-${titleKey}`}` |
| `items.map(({ label, href }) =>` | `items.map(({ labelKey, href }) =>` |
| `key={`${title}-${label}`}` | `key={`${titleKey}-${labelKey}`}` |
| `>{label}</button>` (in dropdown items) | `>{t(labelKey)}</button>` |
| Identical triplet for `solutionsDropdown` | (parallel changes) |

Make sure to add the `mainNav` key referenced above. In step 1, add to **both** `nav` blocks:

```js
// strings.en.nav
mainNav: 'Main navigation',
// strings.sl.nav
mainNav: 'Glavna navigacija',
```

- [ ] **Step 4: Manual verification**

Run `npm run dev`.

Desktop:
- Verify top-level links render translated.
- Hover Customers / Stranke — dropdown opens with translated section titles and items.
- Hover Partners / Partnerji — same.
- Click Get Started / Začnite zdaj → navigates to /contact.

Mobile (resize browser to <1024px or DevTools mobile emulation):
- Tap hamburger — drawer opens, translated section labels.
- Expand each accordion — translated group labels and items.
- Tap Get Started → /contact.

Switch language at footer — navbar should re-render translated immediately (it's a sibling component subscribing to the same a11y state).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/strings.js src/shared.js src/components/Navbar.jsx
git commit -m "feat(i18n): translate navbar and dropdown nav data"
```

---

## Phase 3 — Translate pages

After this phase, page bodies translate. Each task follows the same pattern:

1. Read the page file. Identify all user-visible English strings (text content, button labels, aria-labels, alt text where it's prose).
2. Add an entry under the page's namespace in `strings.js` for both `en` and `sl`. Use the EN literal as the EN value. Author SL following length-parity goal (±10% of EN char count) and naming conventions in the spec.
3. In the page file, add `import { useT } from '../i18n/useT';` and inside each component (desktop and mobile branches both) call `const t = useT();`. Replace literal strings with `{t('page.key')}`.
4. For inline content arrays (feature cards, why-cards, solutions), move the array into `strings.js` and read the whole array via `t()`:
   ```js
   const cards = t('home.featureCards'); // returns [{title, text}, ...]
   ```
5. Manual verify in dev: switch language, walk both desktop and mobile breakpoints. Note any layout breaks for Phase 4.
6. Commit per page (or per group below).

**Translation conventions reminder:** Brand and product names stay English. Use idiomatic Slovenian. Add a `// shortened — literal: "..."` comment next to any non-obvious phrasing chosen for length parity.

### Task 9: Translate Homepage

**Files:**
- Modify: `src/i18n/strings.js` (fill `home` namespace)
- Modify: `src/pages/Homepage.jsx`

The Homepage has both desktop and mobile branches in one file. Both branches share content concepts: hero, features, regulated banner, solutions grid, why-cards, partners list, CTA section, mobile-only footer copy.

- [ ] **Step 1: Author `home` namespace in `strings.js`**

Extract these EN values from `src/pages/Homepage.jsx` (lines 68-185 mobile, 215-440 desktop). Use this structure:

```js
// strings.en
home: {
	hero: {
		title: 'Fintech, Your Way!',
		subtitle: 'This is fintech, redefined. Build branded payment accounts, issue debit cards, and go global - starting today!',
		cta: 'Issue Your First Debit Card',
	},
	features: [
		{
			title: 'Payment Accounts',
			text: 'Dinaro offers payment accounts for individuals, businesses, and white-label partners. With full support for SEPA and Instant SEPA transfers, so your money moves when you need it, in seconds.',
			textMobile: 'Dinaro offers payment accounts for individuals, businesses, and white-label partners. Full support for SEPA and Instant SEPA transfers.',
		},
		{
			title: 'Card Issuing',
			text: 'Order a Dinaro card and shop seamlessly online and in-store. Issue a payment card with your logo and design, connected to the Paywiser payment and accounts system.',
			textMobile: 'Order a Dinaro card and shop seamlessly online and in-store. Issue a payment card with your logo and design.',
		},
		{
			title: 'Accepting Payments',
			text: "Use Dinaro's accepting payments solution and leverage our infrastructure and partnerships. Provide your customers seamless and comfortable shopping experiences.",
			textMobile: "Leverage Dinaro's infrastructure and partnerships to provide seamless payment experiences for your customers.",
		},
	],
	regulated: {
		title: 'Regulated & Supervised',
		subtitle: 'Dinaro is a regulated and supervised financial institution',
	},
	// 5 unique cards. Each may have a `textMobile` variant where the desktop
	// copy is too long for the mobile column.
	// Desktop layout: row 1 = indices 0,1,2 (width 392 each); row 2 = idx 3 (width 808) + idx 4 (width 392).
	// Mobile layout: all 5 in single column, using textMobile where present.
	solutionCards: [
		{ title: 'API Driven', text: 'Providing a unified API for payment processing, clearing, settlement and reconciliation of payment operations.' },
		{ title: 'BIN Sponsorship', text: 'Avoid the complexity of a card issuing project. As a Mastercard Principal Member we can sponsor you.' },
		{ title: 'SEPA Payments', text: 'We enable SEPA credit transfers and Instant SEPA payments for fast, secure transactions across Europe.' },
		{
			title: 'White Label Cards',
			text: 'Offering a flexible White Label solution for the turnkey launch of branded debit and prepaid cards, fully tailormade to your business identity and accepted everywhere your customers shop.',
			textMobile: 'Offering a flexible White Label solution for the turnkey launch of branded debit and prepaid cards, tailored to your business.',
		},
		{ title: 'ON & OFF Ramp Platform', text: 'Providing flexible topping up and withdrawal options for your marketplace or wallets.' },
	],
	why: {
		heading: 'Why Choose Dinaro?',
		cards: [
			{ title: 'Individual Approach', text: 'Personalized solutions tailored to your needs.' },
			{ title: 'Secure', text: 'Access worldwide markets through one platform' },
			{ title: 'Simplicity & Transparency', text: 'Clear processes with no hidden complexities.' },
			{ title: 'EMI Licence', text: 'Dinaro is a licensed e-money institution regulated by the Bank of Slovenia,' },
			{ title: 'Global Reach', text: 'Access worldwide markets through one platform.' },
			{ title: 'PCI DSS Certified', text: 'Dinaro is PCI DSS Level 1 Certified Service Provider' },
		],
		cta: 'Get Started Now',
		body: "Using Mastercard's global network and card products, we enable domestic and cross-border transfers. Offer your cardholders safer, more reliable, and convenient transfers. Or send funds directly to any card in the MoneySend system-in just minutes, 24/7!",
	},
	partners: {
		title: 'Trusted by industry leaders and backed by world-class technology',
		titleMobile: 'Trusted by industry leaders',
		label: 'Partners',
	},
	cta: {
		title: 'Launch Your Financial Product',
		body: 'Get started with Dinaro and bring your financial services to market faster.',
		bodyExtra: 'Have questions? Our team is ready to help you find the right solution.',
		bodyMobile: 'Get started with Dinaro and bring your financial services to market faster.',
		primary: 'Contact Us',
	},
	mobileFooter: {
		copy: '© 2026 Dinaro. All Rights Reserved.',
	},
},
```

Then author the SL mirror following length parity. Sample for hero (you complete the rest in the same pass):

```js
// strings.sl
home: {
	hero: {
		title: 'Fintech po vaše!',
		subtitle: 'To je fintech na novo. Ustvarite plačilne račune svoje znamke, izdajte debetne kartice in poslujte globalno - od danes!',
		cta: 'Izdajte svojo prvo kartico',
	},
	features: [
		{
			title: 'Plačilni računi',
			text: 'Dinaro ponuja plačilne račune za posameznike, podjetja in white-label partnerje. S polno podporo SEPA in instant SEPA prenosov se vaš denar premika takrat, ko ga potrebujete - v sekundah.',
			textMobile: 'Dinaro ponuja plačilne račune za posameznike, podjetja in white-label partnerje. Polna podpora SEPA in instant SEPA prenosov.',
		},
		{
			title: 'Izdajanje kartic',
			text: 'Naročite kartico Dinaro in nakupujte brez zapletov - na spletu in v trgovinah. Izdajte plačilno kartico z vašim logom in dizajnom, povezano s sistemom plačil in računov Paywiser.',
			textMobile: 'Naročite kartico Dinaro in nakupujte brez zapletov - na spletu in v trgovinah. Izdajte plačilno kartico z vašim logom in dizajnom.',
		},
		{
			title: 'Sprejemanje plačil',
			text: 'Uporabite rešitev Dinaro za sprejemanje plačil in izkoristite našo infrastrukturo in partnerstva. Zagotovite svojim strankam tekočo in udobno nakupovalno izkušnjo.',
			textMobile: 'Izkoristite Dinarovo infrastrukturo in partnerstva za tekoče plačilne izkušnje vaših strank.',
		},
	],
	regulated: {
		title: 'Regulirani in nadzorovani',
		subtitle: 'Dinaro je regulirana in nadzorovana finančna ustanova',
	},
	solutionCards: [
		{ title: 'API rešitve', text: 'Ponujamo enotni API za obdelavo plačil, kliring, poravnavo in usklajevanje plačilnih operacij.' },
		{ title: 'BIN sponzorstvo', text: 'Izognite se zapletom projekta izdaje kartic. Kot glavni član Mastercarda vas lahko sponzoriramo.' },
		{ title: 'SEPA plačila', text: 'Omogočamo SEPA kredite in instant SEPA plačila za hitre in varne transakcije po Evropi.' },
		{
			title: 'White Label kartice',
			text: 'Ponujamo prilagodljivo White Label rešitev za hiter zagon debetnih in predplačilnih kartic, povsem prilagojenih identiteti vašega podjetja in sprejetih povsod, kjer vaše stranke nakupujejo.',
			textMobile: 'Ponujamo prilagodljivo White Label rešitev za hiter zagon debetnih in predplačilnih kartic, prilagojenih vašemu podjetju.',
		},
		{ title: 'ON & OFF Ramp platforma', text: 'Ponujamo prilagodljive možnosti polnjenja in dvigov za vaš marketplace ali denarnice.' },
	],
	why: {
		heading: 'Zakaj izbrati Dinaro?',
		cards: [
			{ title: 'Individualen pristop', text: 'Rešitve po meri vaših potreb.' },
			{ title: 'Varno', text: 'Dostop do svetovnih trgov skozi eno platformo' },
			{ title: 'Enostavnost in transparentnost', text: 'Jasen proces brez skritih zapletov.' },
			{ title: 'EMI licenca', text: 'Dinaro je licencirana ustanova za e-denar pod nadzorom Banke Slovenije,' },
			{ title: 'Globalni doseg', text: 'Dostop do svetovnih trgov skozi eno platformo.' },
			{ title: 'PCI DSS certifikat', text: 'Dinaro je certificiran ponudnik storitev PCI DSS stopnje 1' },
		],
		cta: 'Začnite zdaj',
		body: 'Z globalnim omrežjem in karticami Mastercard omogočamo domače in čezmejne prenose. Ponudite imetnikom kartic varnejše, zanesljivejše in udobnejše nakazila. Ali pošljite sredstva neposredno na katerokoli kartico v sistemu MoneySend - v nekaj minutah, 24/7!',
	},
	partners: {
		title: 'Zaupajo nam vodilni v industriji, podprti z vrhunsko tehnologijo',
		titleMobile: 'Zaupajo nam vodilni v industriji',
		label: 'Partnerji',
	},
	cta: {
		title: 'Lansirajte svoj finančni produkt',
		body: 'Začnite z Dinarom in hitreje predstavite svoje finančne storitve trgu.',
		bodyExtra: 'Imate vprašanja? Naša ekipa vam pomaga najti pravo rešitev.',
		bodyMobile: 'Začnite z Dinarom in hitreje predstavite svoje finančne storitve trgu.',
		primary: 'Kontaktirajte nas',
	},
	mobileFooter: {
		copy: '© 2026 Dinaro. Vse pravice pridržane.',
	},
},
```

- [ ] **Step 2: Wire Homepage.jsx**

Add at the top:

```js
import { useT } from '../i18n/useT';
```

In `HomepageMobile({ navigate })` and `Homepage()` (the default export), add `const t = useT();` as the first line of each function body.

In **HomepageMobile** (lines 61-188), replace inlined arrays with `t()` reads where applicable:

```jsx
// Hero
<p className="hp-mobile__hero-title">{t('home.hero.title')}</p>
<p className="hp-mobile__hero-subtitle">{t('home.hero.subtitle')}</p>
<button ... onClick={...}>{t('home.hero.cta')}</button>

// Feature Cards — replace inline array with:
{t('home.features').map(({ title, textMobile }, i) => {
	const icons = [imgIcon, imgIcon2, imgIcon1];
	const alts = ['Payment accounts', 'Card issuing', 'Accepting payments'];
	return (
		<div key={title} className="card hp-mobile__feature-card">
			<img alt={alts[i]} className="hp-mobile__feature-icon" src={icons[i]} />
			<div className="hp-mobile__feature-content">
				<p className="hp-mobile__feature-title">{title}</p>
				<p className="hp-mobile__feature-text">{textMobile}</p>
			</div>
		</div>
	);
})}

// Regulated
<p className="hp-mobile__regulated-title">{t('home.regulated.title')}</p>
<p className="hp-mobile__regulated-subtitle">{t('home.regulated.subtitle')}</p>

// Solutions — 5 cards, prefer textMobile when present
{t('home.solutionCards').map(({ title, text, textMobile }) => (
	<div key={title} className="card hp-mobile__solution-card">
		<p className="hp-mobile__solution-title">{title}</p>
		<p className="hp-mobile__solution-text">{textMobile || text}</p>
	</div>
))}

// Why
<p className="hp-mobile__why-title">{t('home.why.heading')}</p>
{t('home.why.cards').map(({ title, text }) => (
	<div key={title} className="hp-mobile__why-card">
		<img alt="" className="hp-mobile__why-card-icon" src={imgSignCheckmark} />
		<div>
			<p className="hp-mobile__why-card-title">{title}</p>
			<p className="hp-mobile__why-card-text">{text}</p>
		</div>
	</div>
))}
<button ... onClick={...}>{t('home.why.cta')}</button>

// Partners
<p className="hp-mobile__partners-title">{t('home.partners.titleMobile')}</p>
<p className="hp-mobile__partners-label">{t('home.partners.label')}</p>

// CTA
<p className="hp-mobile__cta-title">{t('home.cta.title')}</p>
<p className="hp-mobile__cta-subtitle">{t('home.cta.bodyMobile')}</p>
<button ...>{t('home.cta.primary')}</button>

// Mobile footer
<p className="hp-mobile__footer-copy">{t('home.mobileFooter.copy')}</p>
// the inline links array — replace labels with t('footer.terms'), t('footer.privacy'), t('footer.complaints')
```

In **Homepage** (lines 198-443):

```jsx
// Hero
<p className="hp__hero-title">{t('home.hero.title')}</p>
<p className="hp__hero-subtitle">{t('home.hero.subtitle')}</p>
<p className="hp__hero-cta-label">{t('home.hero.cta')}</p>

// Feature Cards — replace inline array
{t('home.features').map(({ title, text }, index) => {
	const icons = [imgIcon, imgIcon2, imgIcon1];
	const alts = ['Payment accounts icon', 'Card issuing icon', 'Acquiring payments icon'];
	return (
		<motion.div key={title} className="card hp__feature-card" ...>
			<img alt={alts[index]} className="hp__feature-icon" src={icons[index]} />
			<div>
				<p className="hp__feature-title">{title}</p>
				<p className="hp__feature-text">{text}</p>
			</div>
		</motion.div>
	);
})}

// Regulated
<p className="hp__regulated-title">{t('home.regulated.title')}</p>
<p className="hp__regulated-subtitle">{t('home.regulated.subtitle')}</p>

// Solutions row 1 (3 cards) — array indices 0,1,2 at width 392
{[0,1,2].map(i => {
	const { title, text } = t('home.solutionCards')[i];
	return (
		<motion.div key={title} className="card hp__solution-card" style={{ width: 392 }} ...>
			<div className="hp__solution-spacer" />
			<div className="hp__solution-content">
				<p className="hp__solution-title">{title}</p>
				<p className="hp__solution-text">{text}</p>
			</div>
		</motion.div>
	);
})}

// Solutions row 2 — White Label (idx 3, 808px) + ON/OFF Ramp (idx 4, 392px)
{[
	{ width: 808, idx: 3 },
	{ width: 392, idx: 4 },
].map(({ width, idx }) => {
	const { title, text } = t('home.solutionCards')[idx];
	return (
		<motion.div key={title} className="card hp__solution-card" style={{ width }} ...>
			<div className="hp__solution-spacer" />
			<div className="hp__solution-content">
				<p className="hp__solution-title">{title}</p>
				<p className="hp__solution-text">{text}</p>
			</div>
		</motion.div>
	);
})}

// Why heading
<motion.p className="hp__why-heading" ...>{t('home.why.heading')}</motion.p>

// Why cards — 6 cards in 2 rows, indices 0-2 and 3-5
<div className="hp__why-row">
	{[0,1,2].map(i => {
		const { title, text } = t('home.why.cards')[i];
		return <WhyCard key={title} index={i} title={title} text={text} />;
	})}
</div>
<div className="hp__why-row">
	{[3,4,5].map((i, idx) => {
		const { title, text } = t('home.why.cards')[i];
		return <WhyCard key={title} index={idx} title={title} text={text} />;
	})}
</div>

// Why CTA
<p className="hp__why-cta-label">{t('home.why.cta')}</p>

// Why body
<motion.p className="hp__why-body" ...>{t('home.why.body')}</motion.p>

// Partners
<motion.p className="hp__partners-title" ...>{t('home.partners.title')}</motion.p>
<motion.p className="hp__partners-label" ...>{t('home.partners.label')}</motion.p>

// CTA section
<motion.p className="hp__cta-title" ...>{t('home.cta.title')}</motion.p>
<motion.p className="hp__cta-body" ...>{t('home.cta.body')}<br />{t('home.cta.bodyExtra')}</motion.p>
<p className="hp__cta-primary-label">{t('home.cta.primary')}</p>
```

- [ ] **Step 3: Manual verification**

Run `npm run dev`. Walk through Homepage in EN at desktop (>1024px) and mobile (<1024px). Switch to SL and walk both again. Note any layout breaks (clipping, overflow, button text wrap) for Phase 4. Sections to focus on:

- Hero title (largest text on the page)
- The CTA buttons (Issue Your First Debit Card → Izdajte svojo prvo kartico is close in length)
- Solution cards (fixed widths 392/808)
- Why-card titles in 3-column layout

- [ ] **Step 4: Commit**

```bash
git add src/i18n/strings.js src/pages/Homepage.jsx
git commit -m "feat(i18n): translate homepage"
```

---

### Task 10: Translate hub pages — PaymentAccounts, DebitCards, Acquiring

**Files:**
- Modify: `src/i18n/strings.js` (`paymentAccounts`, `debitCards`, `acquiring`)
- Modify: `src/pages/PaymentAccounts.jsx`
- Modify: `src/pages/DebitCards.jsx`
- Modify: `src/pages/Acquiring.jsx`

These three pages share a similar structure: a hero plus 1-2 cards linking to sub-product pages.

- [ ] **Step 1: Read each page and extract EN strings**

For each page in turn:

```bash
# Read each file fully before editing
```

Identify: hero title, hero subtitle, any badge/eyebrow, card titles, card body text, CTA button labels, alt text for prose icons. Add per-page namespace under existing scaffold (`paymentAccounts`, `debitCards`, `acquiring`) for both `en` and `sl`.

- [ ] **Step 2: Author SL translations following length parity**

Use the same conventions as Task 9: brand names stay English, idiomatic Slovenian, `// shortened` comments where needed.

- [ ] **Step 3: Wire `useT` into each page**

Same pattern: `import { useT } from '../i18n/useT';` and `const t = useT();` at the top of every component (some pages have `*Mobile` variants). Replace literals with `{t('namespace.key')}`.

- [ ] **Step 4: Manual verification**

`npm run dev`. Visit:
- `/products/payment-accounts`
- `/products/debit-cards`
- `/products/acquiring`

Walk in EN and SL at desktop and mobile. Note layout issues for Phase 4.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/strings.js src/pages/PaymentAccounts.jsx src/pages/DebitCards.jsx src/pages/Acquiring.jsx
git commit -m "feat(i18n): translate product hub pages (payment accounts, debit cards, acquiring)"
```

---

### Task 11: Translate sub-product pages — Individuals, BusinessAccount, IndividualDebitCard, BusinessDebitCard, EMT, AcquiringECommerce, PaymentModules

**Files:**
- Modify: `src/i18n/strings.js` (`individuals`, `business`, `individualDebitCard`, `businessDebitCard`, `emt`, `acquiringECommerce`, `paymentModules`)
- Modify: each respective `src/pages/*.jsx`

These pages use a shared `FeaturePage` / `MobileFeaturePage` component pattern. Read one page first (e.g., `Individuals.jsx`) to understand the shape, then apply the same approach to the rest.

- [ ] **Step 1: Read `src/components/FeaturePage` (the shared layout)**

To understand whether content is passed via props from the page or rendered inline. Most likely the page builds an object/array of content and passes it to `FeaturePage`. The strings live on the page side, not inside `FeaturePage`.

- [ ] **Step 2: For each of the 7 pages**

Repeat:
1. Read the page file.
2. Add EN entries under the page's namespace key in `strings.js`.
3. Author SL with length parity.
4. Wire `useT` and replace literals.

Pages and their namespace keys:

| Page | Namespace |
|---|---|
| `src/pages/Individuals.jsx` | `individuals` |
| `src/pages/BusinessAccount.jsx` | `business` |
| `src/pages/IndividualDebitCard.jsx` | `individualDebitCard` |
| `src/pages/BusinessDebitCard.jsx` | `businessDebitCard` |
| `src/pages/EMT.jsx` | `emt` |
| `src/pages/AcquiringECommerce.jsx` | `acquiringECommerce` |
| `src/pages/PaymentModules.jsx` | `paymentModules` |

- [ ] **Step 3: Manual verification**

`npm run dev`. Visit each page. Walk in EN and SL at desktop and mobile. Note layout issues.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/strings.js src/pages/Individuals.jsx src/pages/BusinessAccount.jsx src/pages/IndividualDebitCard.jsx src/pages/BusinessDebitCard.jsx src/pages/EMT.jsx src/pages/AcquiringECommerce.jsx src/pages/PaymentModules.jsx
git commit -m "feat(i18n): translate sub-product pages"
```

---

### Task 12: Translate solutions pages — BankingAPI, CardsAPI, WhitelabelApplications, WhitelabelOnboarding, WhitelabelRamp, WhitelabelCustom

**Files:**
- Modify: `src/i18n/strings.js` (`bankingApi`, `cardsApi`, `whitelabel`, `whitelabelOnboarding`, `whitelabelRamp`, `whitelabelCustom`)
- Modify: each respective `src/pages/*.jsx`

- [ ] **Step 1: For each of the 6 pages, repeat the extract → translate → wire cycle**

| Page | Namespace |
|---|---|
| `src/pages/BankingAPI.jsx` | `bankingApi` |
| `src/pages/CardsAPI.jsx` | `cardsApi` |
| `src/pages/WhitelabelApplications.jsx` | `whitelabel` |
| `src/pages/WhitelabelOnboarding.jsx` | `whitelabelOnboarding` |
| `src/pages/WhitelabelRamp.jsx` | `whitelabelRamp` |
| `src/pages/WhitelabelCustom.jsx` | `whitelabelCustom` |

- [ ] **Step 2: Manual verification**

`npm run dev`. Visit each page. Walk in EN and SL at desktop and mobile.

- [ ] **Step 3: Commit**

```bash
git add src/i18n/strings.js src/pages/BankingAPI.jsx src/pages/CardsAPI.jsx src/pages/WhitelabelApplications.jsx src/pages/WhitelabelOnboarding.jsx src/pages/WhitelabelRamp.jsx src/pages/WhitelabelCustom.jsx
git commit -m "feat(i18n): translate solutions and whitelabel pages"
```

---

### Task 13: Translate static pages — Company, Contact, NotFound

**Files:**
- Modify: `src/i18n/strings.js` (`company`, `contact`, `notFound`)
- Modify: `src/pages/Company.jsx`
- Modify: `src/pages/Contact.jsx`
- Modify: `src/pages/NotFound.jsx`

`Contact.jsx` has 4 email contact cards — preserve email addresses as-is, translate only the surrounding labels and descriptions.

- [ ] **Step 1: For each of the 3 pages, repeat extract → translate → wire**

| Page | Namespace |
|---|---|
| `src/pages/Company.jsx` | `company` |
| `src/pages/Contact.jsx` | `contact` |
| `src/pages/NotFound.jsx` | `notFound` |

- [ ] **Step 2: Manual verification**

`npm run dev`. Visit `/company`, `/contact`, and an arbitrary 404 path like `/does-not-exist`. Walk in EN and SL at desktop and mobile.

- [ ] **Step 3: Commit**

```bash
git add src/i18n/strings.js src/pages/Company.jsx src/pages/Contact.jsx src/pages/NotFound.jsx
git commit -m "feat(i18n): translate company, contact, and 404 pages"
```

---

## Phase 4 — Layout audit and final QA

### Task 14: Layout audit + fixes

**Files:**
- Modify (only as needed): any CSS file in `src/`, plus any `strings.js` entries that need shortening.

- [ ] **Step 1: Walk every route in both languages at both breakpoints**

Routes to walk (open each in EN, then switch to SL, screenshot any layout break):

```
/
/products/payment-accounts
/products/payment-accounts/individual
/products/payment-accounts/business
/products/debit-cards
/products/debit-cards/individual
/products/debit-cards/business
/products/emt
/products/acquiring
/products/acquiring/e-commerce
/products/acquiring/payment-modules
/solutions/banking-api
/solutions/cards-api
/solutions/whitelabel
/solutions/whitelabel/onboarding
/solutions/whitelabel/ramp
/solutions/whitelabel/custom
/company
/contact
/privacy-policy   (English-only — verify chrome translates, body stays EN)
/terms            (English-only — verify chrome translates, body stays EN)
/complaints       (English-only — verify chrome translates, body stays EN)
/no-such-route    (NotFound)
```

For each: open at desktop width (1280px+) and mobile width (375px). Note any clipping, overflow, button-label wrap, or hero-title break.

- [ ] **Step 2: Fix layout breaks**

For each break, prefer in this order:
1. CSS fix — relax `min-width`, allow text wrap, adjust line-height, slight font-size reduction. Edit the relevant `.css` file.
2. SL string shortening — pick a more compact phrasing in `strings.js`. Add a `// shortened` comment.
3. As last resort: if a string truly cannot be shortened and CSS cannot accommodate it, document the case in a comment in `strings.js` and flag for user review.

- [ ] **Step 3: Verify legal pages**

Visit `/privacy-policy`, `/terms`, `/complaints` with language set to Slovenian. The page bodies should still render in English. The footer chrome and navbar should be Slovenian. This is the spec-defined behavior.

- [ ] **Step 4: Verify language detection on a fresh profile**

Open a Chrome incognito window. Set Slovenian as preferred language (Settings → Languages → move sl to top). Hit the deployed dev URL → page should load in Slovenian. Hit it from a profile with English first → loads in English. Switch via dropdown, refresh → choice persists.

- [ ] **Step 5: Verify a11y panel still works**

Toggle a few accessibility settings while in Slovenian. Confirm they still apply (big cursor, high contrast, etc. are CSS-class driven, not language-coupled, so nothing should regress).

- [ ] **Step 6: Build verification**

```bash
npm run build
```

Expected: Vite build succeeds with no errors. (Slovenian characters č/š/ž should bundle as UTF-8 by default; Vite handles this transparently.)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "fix(i18n): layout audit fixes for Slovenian translations"
```

---

## Done

The translation work is complete. The user can now:

- Toggle language via the footer dropdown or accessibility panel.
- Visit the site with Slovenian as their browser language and see Slovenian by default.
- See English chrome on legal pages but English bodies (intentional).
- Run `npm run build` cleanly.

Future work (deferred): IP-based geo detection (after Cloudflare deployment), translating legal pages, path-based localized URLs.
