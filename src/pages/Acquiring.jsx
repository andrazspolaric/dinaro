import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ctaBg } from '../shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { MobileFeaturePage } from '../components/MobileFeaturePage';
import { useT } from '../i18n/useT';
import '../components/FeaturePage.css';
import '../components/Navbar.css';

import imgVector from '../assets/world-map.svg';
import imgVectorPM from '../assets/pm-vector.svg';
import imgCircle from '../assets/circle-pm.svg';

const heroBg = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 1696 456' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/%3E%3Cdefs%3E%3CradialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-30 39.071 -76 -15.423 1148 228.26)'%3E%3Cstop stop-color='rgba(34,132,155,0.2)' offset='0'/%3E%3Cstop stop-color='rgba(34,132,155,0)' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

const FEATURE_SIDES_ECOMMERCE = ['right', 'left', 'right'];

// Plugin titles & URLs are not translatable.
const modules = [
	{ title: 'Magento', sub: 'Dinaro Plugin', href: 'https://gate.paywiser.eu/apis/plugins/Magento%20v2.0+' },
	{ title: 'WooCommerce', sub: 'Dinaro Plugin', href: 'https://gate.paywiser.eu/apis/plugins/WooCommerce%20v3.5+' },
	{ title: 'OpenCard', sub: 'Dinaro Plugin', href: 'https://gate.paywiser.eu/apis/plugins/OpenCart%20v3.0+' },
	{ title: 'PrestShop', sub: 'Dinaro Plugin', href: 'https://gate.paywiser.eu/apis/plugins/PrestaShop%20v1.7+' },
];

function FeatureRow({ cardSide, tag, title, text, image }) {
	return (
		<div className={`fp__feature-row${cardSide === 'left' ? ' fp__feature-row--reversed' : ''}`}>
			<div className="fp__feature-text-side">
				<div className="fp__feature-text-inner">
					<p className="fp__feature-tag">{tag}</p>
					<p className="fp__feature-title">{title}</p>
					{text && <p className="fp__feature-body">{text}</p>}
				</div>
			</div>
			<div className="card fp__feature-card-side">
				<div className="fp__feature-card-thumb" style={image ? { backgroundImage: `url(${image})` } : undefined} />
			</div>
		</div>
	);
}

function ModuleCard({ title, sub, href, instructionsLabel }) {
	return (
		<div className="card pm__module-card">
			<div className="pm__module-thumb" />
			<div className="pm__module-footer">
				<div className="pm__module-info">
					<p className="pm__module-title">{title}</p>
					<p className="pm__module-sub">{sub}</p>
				</div>
				<button type="button" className="pm__module-btn" onClick={() => window.open(href, '_blank')}>
					<p className="pm__module-btn-label">{instructionsLabel}</p>
					<div className="pm__module-btn-icon-wrap">
						<img alt="" className="pm__module-btn-icon-bg" src={imgCircle} />
						<svg className="pm__module-btn-icon-svg" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="10" cy="10" r="9" stroke="#044352" strokeWidth="1.5"/>
							<path d="M10 9v5" stroke="#044352" strokeWidth="1.5" strokeLinecap="round"/>
							<circle cx="10" cy="6.5" r="0.75" fill="#044352"/>
						</svg>
					</div>
				</button>
			</div>
		</div>
	);
}

export default function Acquiring() {
	const navigate = useNavigate();
	const bp = useBreakpoint();
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get('tab') || 'ecommerce';
	const [direction, setDirection] = useState(1);
	const t = useT();

	const tabs = [
		{ id: 'ecommerce', label: t('acquiring.tabs.ecommerce') },
		{ id: 'modules', label: t('acquiring.tabs.modules') },
	];

	const handleTabChange = (tabId) => {
		const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
		const newIndex = tabs.findIndex(tab => tab.id === tabId);
		setDirection(newIndex > currentIndex ? 1 : -1);
		setSearchParams({ tab: tabId });
	};

	const tabKey = activeTab === 'modules' ? 'modules' : 'ecommerce';
	const tabContent = t(`acquiring.${tabKey}`);
	const features = tabKey === 'ecommerce'
		? tabContent.features.map((f, i) => ({ ...f, cardSide: FEATURE_SIDES_ECOMMERCE[i] }))
		: null;
	const ctaTitle = t('acquiring.ctaTitle');
	const instructionsLabel = t('acquiring.modulesInstructions');

	if (bp === 'mobile' || bp === 'tablet') {
		return (
			<MobileFeaturePage
				heroTitle={tabContent.heroTitle}
				heroSubtitle={tabContent.heroSubtitle}
				features={features || []}
				ctaTitle={ctaTitle}
				navigate={navigate}
			/>
		);
	}

	return (
		<div className="fp">
			<Navbar />
			<div className="fp__hero">
				<div className="fp__hero-bg" style={{ backgroundImage: heroBg }} />
				<div className="fp__hero-vector-wrap">
					<img alt="" className="fp__hero-vector" src={activeTab === 'modules' ? imgVectorPM : imgVector} />
				</div>
				<div className="fp__hero-text">
					<p className="fp__hero-title">{t('acquiring.heroTitle')}</p>
					<p className="fp__hero-subtitle">{t('acquiring.heroSubtitle')}</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="wl-tabs">
				<div className="wl-tabs__container">
					{tabs.map(({ id, label }) => (
						<button
							key={id}
							type="button"
							className={`wl-tabs__tab${activeTab === id ? ' wl-tabs__tab--active' : ''}`}
							onClick={() => handleTabChange(id)}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			{/* Tab Content */}
			<AnimatePresence mode="wait">
				{activeTab === 'ecommerce' && features ? (
					<motion.div
						key={activeTab}
						className="fp__features"
						initial={{ opacity: 0, x: 30 * direction }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -30 * direction }}
						transition={{ duration: 0.2, ease: 'easeInOut' }}
					>
						{features.map(({ cardSide, tag, title, text, image }) => (
							<FeatureRow key={tag} cardSide={cardSide} tag={tag} title={title} text={text} image={image} />
						))}
					</motion.div>
				) : (
					<motion.div
						key={activeTab}
						className="pm__modules-grid"
						initial={{ opacity: 0, x: 30 * direction }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -30 * direction }}
						transition={{ duration: 0.2, ease: 'easeInOut' }}
					>
						{modules.map(({ title, sub, href }) => (
							<ModuleCard key={title} title={title} sub={sub} href={href} instructionsLabel={instructionsLabel} />
						))}
					</motion.div>
				)}
			</AnimatePresence>

			<div className="fp__cta" style={{ backgroundImage: ctaBg }}>
				<p className="fp__cta-title">{ctaTitle}</p>
				<button type="button" className="fp__cta-btn" onClick={() => navigate('/contact')}>
					<p className="fp__cta-btn-label">{t('common.contactUs')}</p>
				</button>
			</div>
			<Footer />
		</div>
	);
}
