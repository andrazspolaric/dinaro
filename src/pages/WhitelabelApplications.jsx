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

import imgVector from '../assets/api-vector.svg';

const heroBg = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 1696 456' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/%3E%3Cdefs%3E%3CradialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-30 39.071 -76 -15.423 1148 228.26)'%3E%3Cstop stop-color='rgba(34,132,155,0.2)' offset='0'/%3E%3Cstop stop-color='rgba(34,132,155,0)' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

const FEATURE_SIDES = ['right', 'left', 'right'];

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

export default function WhitelabelApplications() {
	const navigate = useNavigate();
	const bp = useBreakpoint();
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get('tab') || 'onboarding';
	const [direction, setDirection] = useState(1);
	const t = useT();

	const tabs = [
		{ id: 'onboarding', label: t('whitelabel.tabs.onboarding') },
		{ id: 'ramp', label: t('whitelabel.tabs.ramp') },
		{ id: 'custom', label: t('whitelabel.tabs.custom') },
	];

	const handleTabChange = (tabId) => {
		const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
		const newIndex = tabs.findIndex(tab => tab.id === tabId);
		setDirection(newIndex > currentIndex ? 1 : -1);
		setSearchParams({ tab: tabId });
	};

	const tabKey = ['onboarding', 'ramp', 'custom'].includes(activeTab) ? activeTab : 'onboarding';
	const tabContent = t(`whitelabel.${tabKey}`);
	const features = tabContent.features.map((f, i) => ({ ...f, cardSide: FEATURE_SIDES[i] }));
	const ctaTitle = tabContent.ctaTitle;

	if (bp === 'mobile' || bp === 'tablet') {
		return (
			<MobileFeaturePage
				heroTitle={tabContent.heroTitle}
				heroSubtitle={tabContent.heroSubtitle}
				features={features}
				ctaTitle={ctaTitle}
				ctaButton={t('common.contactUs')}
				navigate={navigate}
			/>
		);
	}

	return (
		<div className="fp">
			<Navbar />
			<div className="fp__hero">
				<div className="fp__hero-bg" style={{ backgroundImage: heroBg }} />
				<div className="fp__hero-vector-wrap"><img alt="" className="fp__hero-vector" src={imgVector} /></div>
				<div className="fp__hero-text">
					<p className="fp__hero-title">{t('whitelabel.heroTitle')}</p>
					<p className="fp__hero-subtitle">{t('whitelabel.heroSubtitle')}</p>
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
