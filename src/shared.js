// ── Shared asset URLs ──────────────────────────────────────────────
import _logoUrl from './assets/logo.svg';
import _chevronUrl from './assets/chevron.svg';
export const imgUnion = _logoUrl;
export const imgGroup = _chevronUrl;

// ── Nav dropdown thumbnails ────────────────────────────────────────
import _navPaymentAccounts from './assets/graphics/customers/payment-accounts/nav.svg';
import _navDebitCards from './assets/graphics/customers/debit-cards/nav.svg';
import _navEmt from './assets/graphics/customers/emt/nav.svg';
import _navAcquiring from './assets/graphics/customers/acquiring/nav.svg';
import _navBankingApi from './assets/graphics/partners/banking-api/nav.svg';
import _navCardsApi from './assets/graphics/partners/cards-api/nav.svg';
import _navWhitelabel from './assets/graphics/partners/whitelabel/nav.svg';

// ── Inline style helpers ───────────────────────────────────────────
export const s = {
  inter: (weight, size, color, extra) => ({
    fontFamily: "'Inter', sans-serif",
    fontWeight: weight,
    fontSize: size,
    color: color,
    fontStyle: 'normal',
    ...extra,
  }),
  dmSans: (weight, size, color, extra) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: weight,
    fontSize: size,
    color: color,
    fontStyle: 'normal',
    fontVariationSettings: "'opsz' 14",
    ...extra,
  }),
  robotoMono: (weight, size, color, extra) => ({
    fontFamily: "'Roboto Mono', monospace",
    fontWeight: weight,
    fontSize: size,
    color: color,
    ...extra,
  }),
};

// ── Gradient backgrounds ───────────────────────────────────────────
export const ctaBg = `linear-gradient(0deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 1680 416' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad3)' opacity='1'/%3E%3Cdefs%3E%3CradialGradient id='grad3' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-29.717 35.644 -75.283 -14.07 1137.2 208.23)'%3E%3Cstop stop-color='rgba(34,132,155,0.2)' offset='0'/%3E%3Cstop stop-color='rgba(34,132,155,0)' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

// ── Nav dropdown data ──────────────────────────────────────────────
// Shape: { titleKey, titleHref, items: [{ labelKey, href }] }
// Labels resolved at render time via useT(). hrefs do not translate.
export const productsDropdown = [
  {
    titleKey: 'nav.products.paymentAccounts',
    titleHref: '/products/payment-accounts',
    thumb: _navPaymentAccounts,
    items: [
      { labelKey: 'nav.products.paymentAccountsIndividual', href: '/products/payment-accounts?tab=individual' },
      { labelKey: 'nav.products.paymentAccountsBusiness', href: '/products/payment-accounts?tab=business' },
    ],
  },
  {
    titleKey: 'nav.products.debitCards',
    titleHref: '/products/debit-cards',
    thumb: _navDebitCards,
    items: [
      { labelKey: 'nav.products.debitCardsIndividual', href: '/products/debit-cards/individual' },
      { labelKey: 'nav.products.debitCardsBusiness', href: '/products/debit-cards/business' },
    ],
  },
  {
    titleKey: 'nav.products.emt',
    titleHref: '/products/emt',
    thumb: _navEmt,
    items: [
      { labelKey: 'nav.products.emtIssuing', href: '/products/emt' },
    ],
  },
  {
    titleKey: 'nav.products.acquiring',
    titleHref: '/products/acquiring',
    thumb: _navAcquiring,
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
    thumb: _navBankingApi,
    items: [
      { labelKey: 'nav.solutions.paymentAccountApi', href: '/solutions/banking-api' },
    ],
  },
  {
    titleKey: 'nav.solutions.cardIssuing',
    titleHref: '/solutions/cards-api',
    thumb: _navCardsApi,
    items: [
      { labelKey: 'nav.solutions.cardsApi', href: '/solutions/cards-api' },
    ],
  },
  {
    titleKey: 'nav.solutions.fintechServices',
    titleHref: '/solutions/whitelabel',
    thumb: _navWhitelabel,
    items: [
      { labelKey: 'nav.solutions.onboarding', href: '/solutions/whitelabel/onboarding' },
      { labelKey: 'nav.solutions.ramp', href: '/solutions/whitelabel/ramp' },
      { labelKey: 'nav.solutions.customSolutions', href: '/solutions/whitelabel/custom' },
    ],
  },
];
