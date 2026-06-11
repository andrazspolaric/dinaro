# Dinaro Homepage Feedback Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply Nina Strajnar's feedback (PDF dated 2026-05-28) to the Dinaro homepage: shift the three feature tiles up so their titles are visible above the fold, rewrite three feature card descriptions, add a new "Payment Gateway" solutions tile while halving the "White Label Cards" tile so all bottom-row solutions tiles share a single size, and remove visible "Paywiser" branding (Paywiser → Dinaro) from non-legal copy.

**Architecture:** All copy lives in `src/i18n/strings.js` keyed by language (`en` / `sl`); layout/sizing lives in `src/pages/Homepage.css` and tile widths inside `src/pages/Homepage.jsx`. Mobile rendering goes through `HomepageMobile` in the same file. Legal pages (`termsData.js`, Terms & Conditions, Privacy Policy) are explicitly out of scope.

**Tech Stack:** React 19, Vite 8, inline-style + CSS modules, i18n dictionary at `src/i18n/strings.js`.

---

## Scope summary

| # | Change | EN string | SL string | File(s) |
|---|---|---|---|---|
| 1 | Hero: pull the 3 feature cards up so titles are visible above the fold | n/a | n/a | `src/pages/Homepage.css` |
| 2 | Rewrite "Payment Accounts" feature card body | ✅ | ✅ | `src/i18n/strings.js` |
| 3 | Rewrite "Card Issuing" feature card body (removes "Paywiser") | ✅ | ✅ | `src/i18n/strings.js` |
| 4 | Rewrite "E-Money Tokens" feature card body | ✅ | ✅ | `src/i18n/strings.js` |
| 5 | Add "Payment Gateway" solutions tile, halve "White Label Cards" tile to match | ✅ | ✅ | `src/i18n/strings.js`, `src/pages/Homepage.jsx` |
| 6 | Contact card emails: `@paywiser.eu` → `@dinaro.si` | ✅ | ✅ | `src/i18n/strings.js` |

**Out of scope (do not touch):**
- `src/data/termsData.js` (Slovenian Privacy Policy contains 16× `PAYWISER` mentions — legal copy, leave alone)
- `src/pages/TermsConditions.jsx`, `src/pages/PrivacyPolicy.jsx`, `src/pages/Complaints.jsx`
- Any other "stuff like that" — only marketing copy on Homepage + Contact.

---

## Pre-flight

**Files touched:**
- `src/pages/Homepage.css` — hero height adjustment
- `src/pages/Homepage.jsx` — solutions row markup
- `src/i18n/strings.js` — copy + email + Slovenian parity

**Files NOT touched (explicit):**
- `src/data/termsData.js`
- Any file under `src/pages/` other than `Homepage.jsx`

**Branch:**

- [ ] **Step 0a: Create a feature branch off `main`**

```bash
git checkout main
git pull --ff-only
git checkout -b feedback/dinaro-si-comments-2026-05-28
```

- [ ] **Step 0b: Install deps and confirm dev server boots**

```bash
npm install
npm run dev
```

Open `http://localhost:5173/` in a browser. Confirm the homepage renders with no console errors. Keep the dev server running through the plan — Vite hot-reloads each edit.

---

## Task 1: Pull the three feature cards up so titles are visible in the hero

**Why:** Nina's screenshot (PDF page 1) shows only the icons of Payment Accounts / Card Issuing / E-Money Tokens poking above the fold. She wants the titles visible without scrolling.

**Files:**
- Modify: `src/pages/Homepage.css:517-525` (`.hp__features` block, especially `margin-top`)
- Optionally inspect: `src/pages/Homepage.css:405-412` (`.hp__hero-section { min-height: 905px }`)

**Approach:** The feature row already sits with `margin: -49px var(--page-gutter) 0` — overlapping the hero by only 49 px. Increase the negative top margin so the cards intrude further into the hero, exposing titles. Target overlap: ~210 px (icon + title + a slice of body text visible).

- [ ] **Step 1.1: Edit `.hp__features` margin in `Homepage.css`**

Find (around line 521):

```css
.hp__features {
	display: flex;
	gap: 24px;
	align-items: stretch;
	margin: -49px var(--page-gutter) 0;
	flex-shrink: 0;
	position: relative;
	z-index: 1;
}
```

Replace the `margin` line with:

```css
	margin: -210px var(--page-gutter) 0;
```

- [ ] **Step 1.2: Verify in the dev server**

Reload `http://localhost:5173/` in the desktop viewport (≥1024 px wide). Expected: the three feature cards now sit higher; each card's icon AND title ("Payment Accounts", "Card Issuing", "E-Money Tokens") is visible above the hero fold on a 1080 px-tall window. The hero copy and credit-card visual remain untouched.

If the cards collide with the hero copy on shorter viewports, fall back to `-160px`. Re-check.

- [ ] **Step 1.3: Sanity-check tablet/mobile**

Resize the browser to ≤1024 px. Expected: the mobile/tablet renderer (`HomepageMobile`) kicks in and the feature cards stack vertically below the hero (this branch is unaffected — desktop CSS only). No regression.

- [ ] **Step 1.4: Commit**

```bash
git add src/pages/Homepage.css
git commit -m "fix(homepage): lift feature cards into hero so titles are visible"
```

---

## Task 2: Rewrite "Payment Accounts" feature card body (EN + SL)

**Why:** PDF page 3 — Nina's new English copy. The Slovenian translation must stay within ±10 % char count (per `strings.js` header comment).

**Files:**
- Modify: `src/i18n/strings.js:108-113` (EN `home.features[0]`)
- Modify: `src/i18n/strings.js:488-493` (SL `home.features[0]`)

**New EN copy (verbatim from PDF):**
> Dinaro provides payment accounts for individuals, businesses, and white-label partners — with full SEPA and Instant SEPA support, so your money moves in seconds, exactly when you need it.

**New SL copy (length-parity translation; review with Nina before merge if uncertain):**
> Dinaro nudi plačilne račune za posameznike, podjetja in white-label partnerje — s polno podporo SEPA in Instant SEPA, da vaš denar potuje v sekundah, točno takrat, ko ga potrebujete.

- [ ] **Step 2.1: Edit EN entry**

In `src/i18n/strings.js`, find:

```js
		{
			title: 'Payment Accounts',
			text: 'Dinaro offers payment accounts for individuals, businesses, and white-label partners. With full support for SEPA and Instant SEPA transfers, so your money moves when you need it, in seconds.',
			textMobile: 'Dinaro offers payment accounts for individuals, businesses, and white-label partners. Full support for SEPA and Instant SEPA transfers.',
		},
```

Replace with:

```js
		{
			title: 'Payment Accounts',
			text: 'Dinaro provides payment accounts for individuals, businesses, and white-label partners — with full SEPA and Instant SEPA support, so your money moves in seconds, exactly when you need it.',
			textMobile: 'Dinaro provides payment accounts for individuals, businesses, and white-label partners. Full SEPA and Instant SEPA support.',
		},
```

- [ ] **Step 2.2: Edit SL entry**

Find:

```js
		{
			title: 'Plačilni računi',
			text: 'Dinaro ponuja plačilne račune za posameznike, podjetja in white-label partnerje. S polno podporo SEPA in Instant SEPA prenosov se vaš denar premika takrat, ko ga potrebujete - v nekaj sekundah.',
			textMobile: 'Dinaro ponuja plačilne račune za posameznike, podjetja in white-label partnerje. Polna podpora SEPA in Instant SEPA prenosov.',
		},
```

Replace with:

```js
		{
			title: 'Plačilni računi',
			text: 'Dinaro nudi plačilne račune za posameznike, podjetja in white-label partnerje — s polno podporo SEPA in Instant SEPA, da vaš denar potuje v sekundah, točno takrat, ko ga potrebujete.',
			textMobile: 'Dinaro nudi plačilne račune za posameznike, podjetja in white-label partnerje. Polna podpora SEPA in Instant SEPA.',
		},
```

- [ ] **Step 2.3: Verify**

Reload `/` (EN). Confirm the first feature card body matches the new EN text exactly. Switch language to Slovenščina (Accessibility toggle in nav → Jezik) and confirm the SL text.

- [ ] **Step 2.4: Commit**

```bash
git add src/i18n/strings.js
git commit -m "copy(homepage): rewrite Payment Accounts feature card"
```

---

## Task 3: Rewrite "Card Issuing" feature card body (EN + SL) — removes Paywiser

**Why:** PDF page 4. Nina's new copy drops the "Paywiser" mention and reframes around white-label branding.

**Files:**
- Modify: `src/i18n/strings.js:114-118` (EN `home.features[1]`)
- Modify: `src/i18n/strings.js:494-498` (SL `home.features[1]`)

**New EN copy (verbatim from PDF):**
> Your brand, your card. Issue custom-designed payment cards connected to Dinaro payments and accounts platform, and let your customers shop seamlessly online and in-store.

**New SL copy:**
> Vaša znamka, vaša kartica. Izdajte plačilne kartice po meri, povezane s plačilno platformo Dinaro, in vašim strankam omogočite tekoče nakupovanje na spletu in v trgovinah.

- [ ] **Step 3.1: Edit EN entry**

Find:

```js
		{
			title: 'Card Issuing',
			text: 'Order a Dinaro card and shop seamlessly online and in-store. Issue a payment card with your logo and design, connected to the Paywiser payment and accounts system.',
			textMobile: 'Order a Dinaro card and shop seamlessly online and in-store. Issue a payment card with your logo and design.',
		},
```

Replace with:

```js
		{
			title: 'Card Issuing',
			text: 'Your brand, your card. Issue custom-designed payment cards connected to Dinaro payments and accounts platform, and let your customers shop seamlessly online and in-store.',
			textMobile: 'Your brand, your card. Issue custom-designed payment cards on the Dinaro platform — accepted online and in-store.',
		},
```

- [ ] **Step 3.2: Edit SL entry**

Find:

```js
		{
			title: 'Izdajanje kartic',
			text: 'Naročite kartico Dinaro in nakupujte brez zapletov - na spletu in v trgovinah. Izdajte plačilno kartico z vašim logom in dizajnom, povezano s sistemom plačil in računov Paywiser.',
			textMobile: 'Naročite kartico Dinaro in nakupujte brez zapletov - na spletu in v trgovinah. Izdajte plačilno kartico z vašim logom in dizajnom.',
		},
```

Replace with:

```js
		{
			title: 'Izdajanje kartic',
			text: 'Vaša znamka, vaša kartica. Izdajte plačilne kartice po meri, povezane s plačilno platformo Dinaro, in vašim strankam omogočite tekoče nakupovanje na spletu in v trgovinah.',
			textMobile: 'Vaša znamka, vaša kartica. Izdajte plačilne kartice po meri na platformi Dinaro — sprejete na spletu in v trgovinah.',
		},
```

- [ ] **Step 3.3: Verify "Paywiser" is gone from the homepage**

Run: `grep -ni paywiser src/i18n/strings.js`
Expected: only the four contact-email lines remain (108, 378–381, 758–761). The two feature lines (116, 496) should NOT appear.

- [ ] **Step 3.4: Visual verify EN + SL**

Reload `/`. EN card 2 body matches; SL card 2 body matches after language switch.

- [ ] **Step 3.5: Commit**

```bash
git add src/i18n/strings.js
git commit -m "copy(homepage): rewrite Card Issuing feature card, remove Paywiser mention"
```

---

## Task 4: Rewrite "E-Money Tokens" feature card body (EN + SL)

**Why:** PDF page 5 — new copy emphasises "Move Euros on-chain" framing and the 1:1 reserve.

**Files:**
- Modify: `src/i18n/strings.js:119-123` (EN `home.features[2]`)
- Modify: `src/i18n/strings.js:499-503` (SL `home.features[2]`)

**New EN copy (verbatim from PDF, dash normalised):**
> Move Euros on-chain with Dinaro's digital tokens, live on XRP Ledger and Xahau. EU MiCA regulated, with 1:1 reserve backing — so partners can integrate with confidence and users can send, hold, and redeem with ease.

> Note: the PDF uses a hyphen ("- so partners..."); use the em-dash for visual consistency with cards 1 and 2.

**New SL copy:**
> Premikajte evre on-chain z digitalnimi žetoni Dinaro, na voljo na XRP Ledger in Xahau. Skladno z EU MiCA in s polnim 1:1 rezervnim kritjem — partnerji se zanesljivo integrirajo, uporabniki pa preprosto pošiljajo, hranijo in unovčujejo.

- [ ] **Step 4.1: Edit EN entry**

Find:

```js
		{
			title: 'E-Money Tokens',
			text: "Tap into Dinaro's euro-backed digital tokens on XRP Ledger and Xahau. Fully EU MiCA regulated and 1:1 reserve backed — ready for partners to integrate and for users to send, hold, and redeem.",
			textMobile: "Dinaro's euro-backed digital tokens on XRP Ledger and Xahau. EU MiCA regulated, ready for partners and users.",
		},
```

Replace with:

```js
		{
			title: 'E-Money Tokens',
			text: "Move Euros on-chain with Dinaro's digital tokens, live on XRP Ledger and Xahau. EU MiCA regulated, with 1:1 reserve backing — so partners can integrate with confidence and users can send, hold, and redeem with ease.",
			textMobile: "Move Euros on-chain with Dinaro's digital tokens on XRP Ledger and Xahau. EU MiCA regulated, 1:1 reserve backed.",
		},
```

- [ ] **Step 4.2: Edit SL entry**

Find:

```js
		{
			title: 'E-žetoni',
			text: 'Izkoristite Dinarove digitalne žetone, podprte z evrom, na XRP Ledger in Xahau. Skladno z EU MiCA in s polnim 1:1 rezervnim kritjem — pripravljeno za partnerje za integracijo in za uporabnike za pošiljanje, hranjenje in unovčevanje.',
			textMobile: 'Dinarovi digitalni žetoni, podprti z evrom, na XRP Ledger in Xahau. Skladno z EU MiCA, pripravljeno za partnerje in uporabnike.',
		},
```

Replace with:

```js
		{
			title: 'E-žetoni',
			text: 'Premikajte evre on-chain z digitalnimi žetoni Dinaro, na voljo na XRP Ledger in Xahau. Skladno z EU MiCA in s polnim 1:1 rezervnim kritjem — partnerji se zanesljivo integrirajo, uporabniki pa preprosto pošiljajo, hranijo in unovčujejo.',
			textMobile: 'Premikajte evre on-chain z digitalnimi žetoni Dinaro na XRP Ledger in Xahau. Skladno z EU MiCA, 1:1 rezervno kritje.',
		},
```

- [ ] **Step 4.3: Verify**

Reload `/`. EN + SL card 3 bodies match.

- [ ] **Step 4.4: Commit**

```bash
git add src/i18n/strings.js
git commit -m "copy(homepage): rewrite E-Money Tokens feature card"
```

---

## Task 5: Add "Payment Gateway" solutions tile + halve "White Label Cards"

**Why:** PDF page 5 — Nina wants a new "Payment Gateway" tile of the same width as the row-1 tiles, placed next to a halved "White Label Cards" tile so every solutions tile in the second row is uniform-width.

**Current second-row layout** (`src/pages/Homepage.jsx:287-311`):
- White Label Cards: width 808 (index 3)
- ON & OFF Ramp Platform: width 392 (index 4)

**Target second-row layout:**
- White Label Cards: width 392 (index 3)
- Payment Gateway: width 392 (index 5, new tile)
- ON & OFF Ramp Platform: width 392 (index 4)

> Total row width math: `392 × 3 + 24 × 2 = 1224 px` — identical to the existing row-1 width, so no parent container changes needed.

### 5a. Add the Payment Gateway entry to `home.solutionCards` (EN + SL)

**Files:**
- Modify: `src/i18n/strings.js:129-139` (EN `home.solutionCards`)
- Modify: `src/i18n/strings.js:509-519` (SL `home.solutionCards`)

**Payment Gateway copy (verbatim from PDF):**
> Accept payments anywhere — online, in person, or cross-border — backed by MasterCard, VISA and SEPA rails. One platform, built for businesses at every stage.

**SL parity:**
> Sprejemajte plačila kjerkoli — na spletu, v živo ali čezmejno — z Mastercard, VISA in SEPA. Ena platforma, zgrajena za podjetja v vseh fazah rasti.

- [ ] **Step 5a.1: Shorten "White Label Cards" EN body to fit the narrower tile**

The current EN text is long; once the tile halves it will visually overflow. Replace the existing EN object at index 3:

```js
		{
			title: 'White Label Cards',
			text: 'Offering a flexible White Label solution for the turnkey launch of branded debit and prepaid cards, fully tailormade to your business identity and accepted everywhere your customers shop.',
			textMobile: 'Offering a flexible White Label solution for the turnkey launch of branded debit and prepaid cards, tailored to your business.',
		},
```

with:

```js
		{
			title: 'White Label Cards',
			text: 'Turnkey branded debit and prepaid cards, fully tailored to your identity and accepted everywhere your customers shop.',
			textMobile: 'Turnkey branded debit and prepaid cards, tailored to your business.',
		},
```

- [ ] **Step 5a.2: Append the Payment Gateway entry to EN `home.solutionCards`**

After the existing `ON & OFF Ramp Platform` line (index 4), add a 6th entry (index 5):

```js
		{ title: 'ON & OFF Ramp Platform', text: 'Providing flexible topping up and withdrawal options for your marketplace or wallets.' },
		{ title: 'Payment Gateway', text: 'Accept payments anywhere — online, in person, or cross-border — backed by Mastercard, VISA and SEPA rails. One platform, built for businesses at every stage.' },
```

(Note: brand "Mastercard" cased as in the rest of the file — `whyCards`/`features` use "Mastercard"; the PDF used "MasterCard" but the codebase convention wins.)

- [ ] **Step 5a.3: Mirror in SL — shorten "White Label kartice" and append Payment Gateway**

Replace SL index 3:

```js
		{
			title: 'White Label kartice',
			text: 'Ponujamo prilagodljivo White Label rešitev za hiter zagon debetnih in predplačniških kartic, povsem prilagojenih identiteti vašega podjetja in sprejetih povsod, kjer vaše stranke nakupujejo.',
			textMobile: 'Ponujamo prilagodljivo White Label rešitev za hiter zagon debetnih in predplačniških kartic, prilagojenih vašemu podjetju.',
		},
```

with:

```js
		{
			title: 'White Label kartice',
			text: 'Hiter zagon debetnih in predplačniških kartic vaše znamke, prilagojenih identiteti podjetja in sprejetih povsod, kjer stranke nakupujejo.',
			textMobile: 'Hiter zagon debetnih in predplačniških kartic vaše znamke, prilagojenih podjetju.',
		},
```

Append after the SL `ON & OFF Ramp platforma` entry:

```js
		{ title: 'ON & OFF Ramp platforma', text: 'Ponujamo prilagodljive možnosti polnjenja in dvigov za vaš marketplace ali denarnice.' },
		{ title: 'Payment Gateway', text: 'Sprejemajte plačila kjerkoli — na spletu, v živo ali čezmejno — z Mastercard, VISA in SEPA. Ena platforma, zgrajena za podjetja v vseh fazah rasti.' },
```

- [ ] **Step 5a.4: Quick lint**

Run: `npm run build`
Expected: build succeeds. If it fails on a JS syntax error in the new objects, fix and rerun.

- [ ] **Step 5a.5: Commit**

```bash
git add src/i18n/strings.js
git commit -m "copy(homepage): add Payment Gateway solution tile, tighten White Label Cards"
```

### 5b. Restructure the desktop solutions grid in `Homepage.jsx`

**Files:**
- Modify: `src/pages/Homepage.jsx:287-311` (second `hp__solutions-row`)

The current second row hard-codes `{ width: 808, idx: 3 }` and `{ width: 392, idx: 4 }`. Change to three uniform tiles: `idx: 3` (White Label), `idx: 5` (Payment Gateway), `idx: 4` (ON & OFF Ramp).

- [ ] **Step 5b.1: Replace the second-row block**

Find:

```jsx
				<div className="hp__solutions-row">
					{[
						{ width: 808, idx: 3 },
						{ width: 392, idx: 4 },
					].map(({ width, idx }, index) => {
```

Replace the array literal with:

```jsx
				<div className="hp__solutions-row">
					{[
						{ width: 392, idx: 3 },
						{ width: 392, idx: 5 },
						{ width: 392, idx: 4 },
					].map(({ width, idx }, index) => {
```

Everything inside the `.map(...)` body stays untouched.

- [ ] **Step 5b.2: Verify the desktop grid**

Reload `/`. Scroll to the solutions section. Expected: row 1 has 3 cards (API Driven, BIN Sponsorship, SEPA Payments). Row 2 has 3 cards: **White Label Cards**, **Payment Gateway**, **ON & OFF Ramp Platform** — all visually identical width to row 1. The dotted placeholder graphic at the top of each card scales correctly.

- [ ] **Step 5b.3: Verify mobile renders all 6 tiles**

Resize browser to ≤768 px. `HomepageMobile` maps over `t('home.solutionCards')` (line 100 in `Homepage.jsx`), so the new Payment Gateway tile automatically appears at the bottom of the mobile solutions list. Confirm 6 tiles render in order: API Driven, BIN Sponsorship, SEPA Payments, White Label Cards, ON & OFF Ramp, Payment Gateway.

- [ ] **Step 5b.4: Commit**

```bash
git add src/pages/Homepage.jsx
git commit -m "feat(homepage): split solutions row 2 into 3 uniform tiles incl. Payment Gateway"
```

---

## Task 6: Swap `@paywiser.eu` → `@dinaro.si` on the Contact page

**Why:** "Paywiser = Dinaro" per the user; contact cards currently surface four `@paywiser.eu` addresses on both `/contact` language variants.

**Files:**
- Modify: `src/i18n/strings.js:378-381` (EN `contact.cards`)
- Modify: `src/i18n/strings.js:758-761` (SL `contact.cards`)

> **Assumption:** the destination domain is `dinaro.si` (matches the public marketing site referenced in Nina's email subject "Dinaro.si - komentarji"). If the team uses a different inbound domain (e.g. `dinaro.eu`), swap the suffix once at the end before merge.

- [ ] **Step 6.1: Replace EN contact emails**

Find:

```js
			cards: [
				{ email: 'info@paywiser.eu', title: 'General Information', description: 'For general inquiries and information about our services.' },
				{ email: 'sales@paywiser.eu', title: 'Sales', description: 'Interested in our solutions? Get in touch with our sales team.' },
				{ email: 'support@paywiser.eu', title: 'Support', description: 'Need help? Our support team is here to assist you.' },
				{ email: 'complaints@paywiser.eu', title: 'Complaints', description: 'Have a concern? We take all complaints seriously.' },
			],
```

Replace with:

```js
			cards: [
				{ email: 'info@dinaro.si', title: 'General Information', description: 'For general inquiries and information about our services.' },
				{ email: 'sales@dinaro.si', title: 'Sales', description: 'Interested in our solutions? Get in touch with our sales team.' },
				{ email: 'support@dinaro.si', title: 'Support', description: 'Need help? Our support team is here to assist you.' },
				{ email: 'complaints@dinaro.si', title: 'Complaints', description: 'Have a concern? We take all complaints seriously.' },
			],
```

- [ ] **Step 6.2: Replace SL contact emails**

Find:

```js
			cards: [
				{ email: 'info@paywiser.eu', title: 'Splošne informacije', description: 'Za splošna vprašanja in informacije o naših storitvah.' },
				{ email: 'sales@paywiser.eu', title: 'Prodaja', description: 'Vas zanimajo naše rešitve? Stopite v stik z našo prodajno ekipo.' },
				{ email: 'support@paywiser.eu', title: 'Podpora', description: 'Potrebujete pomoč? Naša ekipa za podporo vam pomaga.' },
				{ email: 'complaints@paywiser.eu', title: 'Pritožbe', description: 'Imate pomislek? Vse pritožbe obravnavamo resno.' },
			],
```

Replace with:

```js
			cards: [
				{ email: 'info@dinaro.si', title: 'Splošne informacije', description: 'Za splošna vprašanja in informacije o naših storitvah.' },
				{ email: 'sales@dinaro.si', title: 'Prodaja', description: 'Vas zanimajo naše rešitve? Stopite v stik z našo prodajno ekipo.' },
				{ email: 'support@dinaro.si', title: 'Podpora', description: 'Potrebujete pomoč? Naša ekipa za podporo vam pomaga.' },
				{ email: 'complaints@dinaro.si', title: 'Pritožbe', description: 'Imate pomislek? Vse pritožbe obravnavamo resno.' },
			],
```

- [ ] **Step 6.3: Verify**

Run: `grep -n 'paywiser' src/i18n/strings.js`
Expected: **no matches** (every Paywiser reference in marketing copy is now gone).

Run the dev server, navigate to `/contact`. Expected: four contact cards show `info@dinaro.si`, `sales@dinaro.si`, `support@dinaro.si`, `complaints@dinaro.si`. Click one — it should open a mail client with the new address.

- [ ] **Step 6.4: Sanity-check that termsData.js was NOT touched**

Run: `git status`
Expected: only `src/i18n/strings.js`, `src/pages/Homepage.css`, and `src/pages/Homepage.jsx` show as modified across the whole branch. `src/data/termsData.js` MUST remain unchanged (legal copy is out of scope).

If `termsData.js` shows up: `git restore src/data/termsData.js` and report the deviation.

- [ ] **Step 6.5: Commit**

```bash
git add src/i18n/strings.js
git commit -m "chore(contact): swap @paywiser.eu emails for @dinaro.si"
```

---

## Final verification

- [ ] **Step F.1: Run a full production build**

```bash
npm run build
```

Expected: build completes without errors. If a string contains an unescaped backtick or apostrophe issue, fix and rerun.

- [ ] **Step F.2: Preview the production bundle**

```bash
npm run preview
```

Open the URL printed by Vite. Walk through:
1. Homepage hero — three feature card titles visible above the fold.
2. Feature cards — Payment Accounts, Card Issuing, E-Money Tokens use the new copy. No "Paywiser" anywhere on the page.
3. Solutions section — two rows of 3 cards each, all uniform width. Row 2: White Label Cards, Payment Gateway, ON & OFF Ramp Platform.
4. Language switch to Slovenščina — all the above match the SL copy.
5. `/contact` — four cards show `@dinaro.si` emails in both languages.
6. `/terms` and `/privacy-policy` — confirmed unchanged (existing legal copy intact, may still reference PAYWISER inside the Slovenian Privacy Policy body — that is intentional and out of scope).

- [ ] **Step F.3: Push and open a PR**

```bash
git push -u origin feedback/dinaro-si-comments-2026-05-28
gh pr create \
  --title "Homepage feedback: Dinaro.si - komentarji (2026-05-28)" \
  --body "$(cat <<'EOF'
Applies Nina Strajnar's review of the Dinaro homepage (PDF: \"Re: Dinaro.si - komentarji\", 2026-05-28).

## Changes
- Lift homepage feature cards into the hero so titles are visible above the fold
- Rewrite Payment Accounts, Card Issuing, E-Money Tokens feature bodies (EN + SL)
- Add Payment Gateway solutions tile; halve White Label Cards so row 2 is three uniform tiles
- Swap @paywiser.eu contact emails for @dinaro.si

## Out of scope
- Terms & Conditions and Privacy Policy copy (legal — untouched)

## Test plan
- [x] `npm run build` succeeds
- [ ] Homepage hero: 3 feature-card titles visible above the fold at 1080p
- [ ] All 3 feature card bodies match the new copy in EN
- [ ] All 3 feature card bodies match the new copy in SL
- [ ] Solutions section row 2 = 3 uniform tiles (White Label / Payment Gateway / ON & OFF Ramp)
- [ ] /contact shows @dinaro.si emails in EN + SL
- [ ] No new \"Paywiser\" references on Homepage or /contact
- [ ] termsData.js unchanged

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Open question to confirm with the user before merge

1. **Email domain for contact cards.** Plan assumes `@dinaro.si`. Confirm before merging — if the team uses a different inbound domain (e.g. `@dinaro.eu`, or keeps Paywiser-hosted inboxes), update the four entries accordingly.
2. **Slovenian text wording.** Andraž's email asked Nina "slovenski texti so okej?" — Nina hasn't replied yet. The SL strings in this plan are length-parity translations of the new EN copy; have Nina sign off before merging if her reply is still pending.
