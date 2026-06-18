import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'motion/react';
import PageTransition from './components/PageTransition';
import AccessibilityToggle, { useA11yState } from './components/AccessibilityToggle';
import { useT } from './i18n/useT';

const CANVAS_WIDTH = 1728;
const DESKTOP_MIN = 1025;

function useViewportScale() {
	useEffect(() => {
		const root = document.documentElement;
		// If zoom is unsupported (older Firefox), it silently does nothing —
		// the var must stay 1 or full-bleed layouts would divide by a scale
		// that was never applied.
		const zoomSupported = typeof CSS !== 'undefined' && CSS.supports('zoom', '1');
		function applyScale() {
			const scale = zoomSupported && window.innerWidth >= DESKTOP_MIN
				? Math.min(1, window.innerWidth / CANVAS_WIDTH)
				: 1;
			root.style.zoom = String(scale);
			// vw units ignore zoom, so full-bleed tricks (footer) divide by this
			root.style.setProperty('--viewport-zoom', String(scale));
		}
		applyScale();
		window.addEventListener('resize', applyScale);
		return () => {
			window.removeEventListener('resize', applyScale);
			root.style.zoom = '';
			root.style.setProperty('--viewport-zoom', '1');
		};
	}, []);
}

const Homepage           = lazy(() => import('./pages/Homepage'));
const Individuals        = lazy(() => import('./pages/Individuals'));
const BusinessAccount    = lazy(() => import('./pages/BusinessAccount'));
const IndividualDebitCard = lazy(() => import('./pages/IndividualDebitCard'));
const BusinessDebitCard  = lazy(() => import('./pages/BusinessDebitCard'));
const EMT                = lazy(() => import('./pages/EMT'));
const AcquiringECommerce = lazy(() => import('./pages/AcquiringECommerce'));
const BankingAPI         = lazy(() => import('./pages/BankingAPI'));
const CardsAPI           = lazy(() => import('./pages/CardsAPI'));
const Company            = lazy(() => import('./pages/Company'));
const Contact            = lazy(() => import('./pages/Contact'));
const PrivacyPolicy      = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions    = lazy(() => import('./pages/TermsConditions'));
const Complaints         = lazy(() => import('./pages/Complaints'));
const PaymentModules          = lazy(() => import('./pages/PaymentModules'));
const WhitelabelOnboarding   = lazy(() => import('./pages/WhitelabelOnboarding'));
const WhitelabelRamp         = lazy(() => import('./pages/WhitelabelRamp'));
const WhitelabelCustom       = lazy(() => import('./pages/WhitelabelCustom'));
const WhitelabelApplications = lazy(() => import('./pages/WhitelabelApplications'));
const PaymentAccounts        = lazy(() => import('./pages/PaymentAccounts'));
const DebitCards             = lazy(() => import('./pages/DebitCards'));
const Acquiring              = lazy(() => import('./pages/Acquiring'));
const NotFound                = lazy(() => import('./pages/NotFound'));

function PageLoader() {
	return (
		<div style={{
			display: 'flex', opacity: 0, alignItems: 'center', justifyContent: 'center',
			minHeight: 'calc(100vh / var(--viewport-zoom, 1))', fontFamily: "'Inter', sans-serif",
		}}>
			<div style={{
				width: 40, height: 40, border: '3px solid rgba(4,67,82,0.15)',
				borderTopColor: '#044352', borderRadius: '50%',
				animation: 'spin 0.7s linear infinite',
			}} />
			<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
		</div>
	);
}

// Reset scroll to the top on navigation. Without this, clicking a footer link
// (where the user is already scrolled to the bottom) opens the next page still
// scrolled down. Hash deep-links (e.g. /terms#section) are left to the page.
function ScrollToTop() {
	const { pathname, hash } = useLocation();
	useEffect(() => {
		if (!hash) window.scrollTo(0, 0);
	}, [pathname, hash]);
	return null;
}

function AnimatedRoutes() {
	const location = useLocation();
	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<PageTransition><Homepage /></PageTransition>} />
				<Route path="/products/payment-accounts" element={<PageTransition><PaymentAccounts /></PageTransition>} />
				<Route path="/products/payment-accounts/individual" element={<Navigate to="/products/payment-accounts?tab=individual" replace />} />
				<Route path="/products/payment-accounts/business" element={<Navigate to="/products/payment-accounts?tab=business" replace />} />
				<Route path="/products/individuals" element={<PageTransition><Individuals /></PageTransition>} />
				<Route path="/products/business-account" element={<PageTransition><BusinessAccount /></PageTransition>} />
				<Route path="/products/debit-cards" element={<PageTransition><DebitCards /></PageTransition>} />
				<Route path="/products/debit-cards/individual" element={<PageTransition><IndividualDebitCard /></PageTransition>} />
				<Route path="/products/debit-cards/business" element={<PageTransition><BusinessDebitCard /></PageTransition>} />
				<Route path="/products/emt" element={<PageTransition><EMT /></PageTransition>} />
				<Route path="/products/emt/v2" element={<PageTransition><EMT variant="v2" /></PageTransition>} />
				<Route path="/products/acquiring" element={<PageTransition><Acquiring /></PageTransition>} />
				<Route path="/products/acquiring/e-commerce" element={<PageTransition><AcquiringECommerce /></PageTransition>} />
				<Route path="/products/acquiring/payment-modules" element={<PageTransition><PaymentModules /></PageTransition>} />
				<Route path="/solutions/banking-api" element={<PageTransition><BankingAPI /></PageTransition>} />
				<Route path="/solutions/cards-api" element={<PageTransition><CardsAPI /></PageTransition>} />
				<Route path="/company" element={<PageTransition><Company /></PageTransition>} />
				<Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
				<Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
				<Route path="/terms" element={<PageTransition><TermsConditions /></PageTransition>} />
				<Route path="/complaints" element={<PageTransition><Complaints /></PageTransition>} />
				<Route path="/solutions/whitelabel" element={<PageTransition><WhitelabelApplications /></PageTransition>} />
				<Route path="/solutions/whitelabel/onboarding" element={<PageTransition><WhitelabelOnboarding /></PageTransition>} />
				<Route path="/solutions/whitelabel/ramp" element={<PageTransition><WhitelabelRamp /></PageTransition>} />
				<Route path="/solutions/whitelabel/custom" element={<PageTransition><WhitelabelCustom /></PageTransition>} />
				<Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
			</Routes>
		</AnimatePresence>
	);
}

export default function App() {
	useViewportScale();
	const a11y = useA11yState();
	const t = useT();

	useEffect(() => {
		document.documentElement.lang = a11y.language;
		document.title = t('meta.title');
	}, [a11y.language, t]);

	return (
		<MotionConfig reducedMotion={a11y.hideAnimations ? 'always' : 'never'}>
			<ScrollToTop />
			<div className="a11y-content-root">
				<Suspense fallback={<PageLoader />}>
					<AnimatedRoutes />
				</Suspense>
			</div>
			<AccessibilityToggle />
		</MotionConfig>
	);
}
