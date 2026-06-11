# Slovenian i18n — Design

**Date:** 2026-05-04
**Status:** Approved
**Owner:** Andraž Spolarič

## Goal

Wire up the language selector that already exists in the a11y panel and footer dropdown so that the marketing and UI surface of Dinaro-v2 actually translates between English (`en`) and Slovenian (`sl`). Today the selector only flips a localStorage flag — no rendered text changes.

## Non-goals

- Translating the legal pages: `PrivacyPolicy.jsx`, `TermsConditions.jsx` (+ `src/data/termsData.js`), and `Complaints.jsx` stay English-only. Their nav-link labels in the footer **do** translate; only the page bodies stay English.
- Path-based localized URLs (`/sl/...`). Same URLs across both languages; language is a stateful preference.
- Adding a translation library (i18next, react-i18next, FormatJS). Plain JS object + a hook is enough for this scope.
- IP-based geolocation. Deferred until a host with edge geo headers is chosen (Cloudflare Pages is the planned host; the geo step layers on later).

## Architecture

### Module layout

```
src/i18n/
  strings.js        # { en: {...}, sl: {...} } single source of truth
  useT.js           # useT() hook → returns t(key) bound to current language
  detectLanguage.js # initial-detection helper (localStorage → navigator → en)
```

### `strings.js`

Hierarchical keys, organized by surface:

```js
export const strings = {
  en: {
    nav: { products: 'Products', solutions: 'Solutions', /* ... */ },
    footer: { copyright: '© Copyright 2026, All Rights Reserved', /* ... */ },
    home: { hero: { title: 'Fintech, Your Way!', subtitle: '...' }, /* ... */ },
    products: { paymentAccounts: { /* ... */ } },
    a11y: { heading: 'Accessibility', sections: { reading: 'Reading', /* ... */ } },
    meta: { title: 'Dinaro - Fintech, Your Way' },
    // ...
  },
  sl: {
    // mirror of en, in Slovenian
  },
};
```

Translator hint comments (e.g., `// shortened for length parity — full: "..."`) inline next to non-obvious choices.

### `useT.js`

```js
import { useA11yState } from '../components/AccessibilityToggle';
import { strings } from './strings';

function lookup(dict, path) {
  return path.split('.').reduce((o, k) => o?.[k], dict);
}

export function useT() {
  const { language } = useA11yState();
  return (key) => {
    const value = lookup(strings[language], key);
    if (value !== undefined) return value;
    if (import.meta.env.DEV) console.warn(`[i18n] missing ${language}.${key}`);
    const fallback = lookup(strings.en, key);
    return fallback !== undefined ? fallback : key;
  };
}
```

`t(key)` returns whatever is at that path in the dictionary — usually a string, but **arrays and nested objects work too**. This matters because pages like Homepage have content arrays (feature cards, why-cards, solutions). They live in `strings.js` as arrays per language and pages read them whole:

```js
const t = useT();
const features = t('home.features.cards');  // returns [{title, text}, ...]
return features.map(({title, text}) => <Card key={title} {...}/>);
```

This avoids inventing dotted keys for every array index.

### `detectLanguage.js`

```js
import { strings } from './strings';

const STORAGE_KEY = 'dinaro_a11y';

export function detectLanguage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw)?.language;
      if (saved && strings[saved]) return saved;
    }
  } catch { /* ignore */ }

  const nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('sl')) return 'sl';
  return 'en';
}
```

### Wiring into existing a11y state

`AccessibilityToggle.jsx` currently:

- `DEFAULT_STATE.language = 'en'`
- `loadState()` returns `DEFAULT_STATE` when localStorage is empty.

Change: `loadState()` calls `detectLanguage()` for the language field when no saved state exists. Existing `language` already in the saved state still wins (preserves user choice).

### `<html lang>` sync

In `App.jsx` (where `useA11yState` is already called), add:

```js
useEffect(() => {
  document.documentElement.lang = a11y.language;
  document.title = t('meta.title');
}, [a11y.language]);
```

## Data flow

1. App boots → `loadState()` runs in `AccessibilityToggle` → resolves `language` via `detectLanguage()` if localStorage empty.
2. State persisted; `a11y:change` custom event broadcast.
3. Components calling `useT()` subscribe via `useA11yState()` → re-render with new `t`.
4. `App.jsx` effect updates `<html lang>` and `document.title`.
5. User clicks language in footer dropdown or a11y panel → `setA11yLanguage(code)` → existing `a11y:set` event → state update → cycle repeats.

## Translation surface

**In scope (translates):**

| Surface | Files |
|---|---|
| Pages (20) | Homepage, Individuals, BusinessAccount, IndividualDebitCard, BusinessDebitCard, EMT, Acquiring, AcquiringECommerce, BankingAPI, CardsAPI, Company, Contact, PaymentModules, PaymentAccounts, DebitCards, WhitelabelApplications, WhitelabelOnboarding, WhitelabelRamp, WhitelabelCustom, NotFound |
| Navbar | `src/components/Navbar.jsx` (desktop + mobile drawer) |
| Footer | `src/components/Footer.jsx` (copyright, link labels) |
| A11y panel | `src/components/AccessibilityToggle.jsx` (heading, section titles, 17 toggle labels, "Reset All Settings", aria-labels) |
| Nav data | `src/shared.js` — `productsDropdown` / `solutionsDropdown` change shape from `{title, items: [{label, href}]}` to `{titleKey, items: [{labelKey, href}]}`. Navbar resolves `t(item.titleKey)` at render. `href` stays unchanged (URLs don't translate). |
| Document title | via `App.jsx` effect |

**Out of scope (stay English):**

- `src/pages/PrivacyPolicy.jsx`
- `src/pages/TermsConditions.jsx`
- `src/data/termsData.js`
- `src/pages/Complaints.jsx`

Footer link labels pointing to these pages **do** translate; the destination page bodies stay English.

## Translation conventions

- **Length parity is a hard goal.** Each Slovenian string aims to stay within ±10% of the English source's character count. Concise idiomatic phrasing chosen over literal translations.
- **Native-language labels in the language switcher.** "English" stays "English"; "Slovenščina" stays "Slovenščina" regardless of currently selected language. Standard convention so users always recognize their language.
- **Preserve untranslated:** brand names (Dinaro, Mastercard, GateHub, Apple Pay, Google Pay, Dinit, Tribe, ComplyAdvantage, Austria Card), product names (Mastercard, SEPA, PCI DSS, BIN, EMI, EMT, API), email addresses, URLs.
- **Inline comments** in `strings.js` flag length-driven shortenings so the user can override later. Example:
  ```js
  // shortened for length parity — literal: "Izdajte svojo prvo debetno kartico"
  heroCta: 'Naročite svojo kartico',
  ```
- **Escape hatch:** any term that resists short Slovenian phrasing (e.g., "Payment Account as a Service") may be left in English with a `// kept English — no compact equivalent` comment, flagged for user review.

## Layout safeguards

Translate-first, then visually QA each page in both desktop and mobile breakpoints. With length parity as the goal, layout breaks should be the exception. When they happen:

1. Prefer a CSS fix (relax `min-width`, allow wrap, slight `font-size` adjust) over shortening the Slovenian copy further.
2. If both options cost too much, document the tight-fit case so the user can review.

Hot spots to audit each pass:

- Hero title (`hp__hero-title`) and CTA buttons.
- Navbar dropdown items (especially "Payment Account as a Service" in `solutionsDropdown`).
- Card titles in Why Choose / Solutions grids.
- Footer link row.

## Error handling

- **Missing key in Slovenian** → `t()` falls back to English; `console.warn` in dev only (Vite strips in prod).
- **Missing key entirely** → `t()` returns the raw key string (`home.hero.title`) so the gap is visible in QA.
- **localStorage disabled / throws** → `loadState` and `detectLanguage` already swallow throws; detection still runs from `navigator.language`.

## Testing

Manual QA, no test infra in this repo:

- `npm run dev`. Switch language via footer dropdown and a11y panel.
- For each translated page, walk both desktop and mobile breakpoints in both languages. Verify no clipping, overflow, or layout breakage.
- Verify `<html lang>` updates in DevTools.
- Verify `document.title` updates.
- Hard-refresh on a fresh browser profile with Slovenian as preferred language → site loads in Slovenian.
- Hard-refresh on profile with English preferred → site loads in English.
- Switch language, refresh → choice persists (localStorage).
- Visit `/privacy-policy`, `/terms`, `/complaints` in Slovenian mode → page bodies render English; only navbar/footer chrome translates.

## Future work (out of scope for this spec)

- Translate the legal pages (Terms, Privacy, Complaints) once a Slovenian-fluent reviewer is engaged.
- IP-based language detection via Cloudflare's `cf-ipcountry` once deployed.
- Path-based localized routes (`/sl/...`) if SEO becomes a priority.
- Add a third language (the architecture supports it: add a key to `strings`, add a row to `LANGUAGES` in `AccessibilityToggle.jsx`).
