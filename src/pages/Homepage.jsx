import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ctaBg } from '../shared';
import Navbar from '../components/Navbar';
import Footer, { LanguageDropdown } from '../components/Footer';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useT } from '../i18n/useT';
import './Homepage.css';

import imgHeroBg from '../hero-bg.svg';
import imgHeroCards from '../assets/credit-card-preview.svg';
import imgIcon from '../assets/icon-payment.svg';
import imgIcon1 from '../assets/icon-acquiring.svg';
import imgIcon2 from '../assets/icon-cards.svg';
import imgSignCheckmark from '../assets/icon-checkmark.svg';
import imgGroup1 from '../assets/shield.svg';
import imgPartnerGatehub from '../assets/partner-gatehub.svg';
import imgPartnerMastercard from '../assets/partner-mastercard.svg';
import imgPartnerGooglepay from '../assets/partner-googlepay.svg';
import imgPartnerApplepay from '../assets/partner-applepay.svg';
import imgPartnerDinit from '../assets/partner-dinit-fav.svg';
import imgPartnerAustriacard from '../assets/partner-austriacard.png';
import imgPartnerTribe from '../assets/partner-tribe.svg';
import imgPartnerComplyadvantage from '../assets/partner-complyadvantage.png';

const whyBg = `linear-gradient(0deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 1680 1142' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad2)' opacity='1'/%3E%3Cdefs%3E%3CradialGradient id='grad2' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-29.717 97.849 -75.283 -38.625 1137.2 571.64)'%3E%3Cstop stop-color='rgba(34,132,155,0.2)' offset='0'/%3E%3Cstop stop-color='rgba(34,132,155,0)' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

const regulatedBg = `linear-gradient(90deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 1224 338' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad4)' opacity='1'/%3E%3Cdefs%3E%3CradialGradient id='grad4' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-21.651 28.961 -54.849 -11.432 828.51 169.19)'%3E%3Cstop stop-color='rgba(34,132,155,0.2)' offset='0'/%3E%3Cstop stop-color='rgba(34,132,155,0)' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

const heroBgMobile = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

const partners = [
	{ src: imgPartnerGatehub, alt: 'GateHub' },
	{ src: imgPartnerDinit, alt: 'Dinit' },
	{ src: imgPartnerAustriacard, alt: 'Austria Card' },
	{ src: imgPartnerTribe, alt: 'Tribe' },
	{ src: imgPartnerComplyadvantage, alt: 'ComplyAdvantage' },
	{ src: imgPartnerMastercard, alt: 'Mastercard' },
	{ src: imgPartnerGooglepay, alt: 'Google Pay' },
	{ src: imgPartnerApplepay, alt: 'Apple Pay' },
];

const WhyCard = ({ title, text, index = 0 }) => (
	<motion.div
		className="hp__why-card"
		initial={{ opacity: 0, y: 30 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true, amount: 0.15 }}
		transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
	>
		<div className="hp__why-card-glass" />
		<div className="hp__why-card-body">
			<img alt="" className="hp__why-card-icon" src={imgSignCheckmark} />
			<div>
				<p className="hp__why-card-title">{title}</p>
				<p className="hp__why-card-desc">{text}</p>
			</div>
		</div>
	</motion.div>
);

function HomepageMobile({ navigate }) {
	const t = useT();
	const featureIcons = [imgIcon, imgIcon2, imgIcon1];
	const featureAlts = ['Payment accounts', 'Card issuing', 'E-money tokens'];
	return (
		<div className="hp-mobile">
			<Navbar />

			{/* Hero */}
			<div className="hp-mobile__hero" style={{ backgroundImage: heroBgMobile }}>
				<p className="hp-mobile__hero-title">{t('home.hero.title')}</p>
				<p className="hp-mobile__hero-subtitle">{t('home.hero.subtitle')}</p>
				<button type="button" className="hp-mobile__hero-btn" onClick={() => navigate('/contact')}>
					{t('home.hero.cta')}
				</button>
			</div>

			{/* Feature Cards */}
			<div className="hp-mobile__features">
				{t('home.features').map(({ title, textMobile }, i) => (
					<div key={title} className="card hp-mobile__feature-card">
						<img alt={featureAlts[i]} className="hp-mobile__feature-icon" src={featureIcons[i]} />
						<div className="hp-mobile__feature-content">
							<p className="hp-mobile__feature-title">{title}</p>
							<p className="hp-mobile__feature-text">{textMobile}</p>
						</div>
					</div>
				))}
			</div>

			{/* Regulated & Supervised */}
			<div className="hp-mobile__regulated" style={{ backgroundImage: regulatedBg }}>
				<p className="hp-mobile__regulated-title">{t('home.regulated.title')}</p>
				<p className="hp-mobile__regulated-subtitle">{t('home.regulated.subtitle')}</p>
			</div>

			{/* Solutions */}
			<div className="hp-mobile__solutions">
				{t('home.solutionCards').map(({ title, text, textMobile }) => (
					<div key={title} className="card hp-mobile__solution-card">
						<p className="hp-mobile__solution-title">{title}</p>
						<p className="hp-mobile__solution-text">{textMobile || text}</p>
					</div>
				))}
			</div>

			{/* Why Choose Dinaro */}
			<div className="hp-mobile__why" style={{ backgroundImage: whyBg }}>
				<p className="hp-mobile__why-title">{t('home.why.heading')}</p>
				<div className="hp-mobile__why-cards">
					{t('home.why.cards').map(({ title, text }) => (
						<div key={title} className="hp-mobile__why-card">
							<img alt="" className="hp-mobile__why-card-icon" src={imgSignCheckmark} />
							<div>
								<p className="hp-mobile__why-card-title">{title}</p>
								<p className="hp-mobile__why-card-text">{text}</p>
							</div>
						</div>
					))}
				</div>
				<button type="button" className="hp-mobile__why-cta" onClick={() => navigate('/contact')}>
					{t('home.why.cta')}
				</button>
			</div>

			{/* Partners */}
			<div className="hp-mobile__partners">
				<p className="hp-mobile__partners-title">{t('home.partners.titleMobile')}</p>
				<p className="hp-mobile__partners-label">{t('home.partners.label')}</p>
				<div className="hp-mobile__partners-grid">
					{partners.map(({ src, alt }) => (
						<div key={alt} className="hp-mobile__partner">
							<img alt={alt} src={src} />
						</div>
					))}
				</div>
			</div>

			{/* CTA */}
			<div className="hp-mobile__cta" style={{ backgroundImage: ctaBg }}>
				<p className="hp-mobile__cta-title">{t('home.cta.title')}</p>
				<p className="hp-mobile__cta-subtitle">{t('home.cta.bodyMobile')}</p>
				<div className="hp-mobile__cta-actions">
					<button type="button" className="hp-mobile__cta-primary" onClick={() => navigate('/contact')}>
						{t('home.cta.primary')}
					</button>
				</div>
			</div>

			{/* Footer */}
			<div className="hp-mobile__footer">
				<p className="hp-mobile__footer-copy">{t('home.mobileFooter.copy')}</p>
				<div className="hp-mobile__footer-links">
					{[
						{ label: t('footer.terms'), href: '/terms' },
						{ label: t('footer.privacy'), href: '/privacy-policy' },
						{ label: t('footer.complaints'), href: '/complaints' },
					].map(({ label, href }) => (
						<a key={href} href={href} className="hp-mobile__footer-link">{label}</a>
					))}
				</div>
				<div className="hp-mobile__footer-lang">
					<LanguageDropdown isMobile />
				</div>
			</div>
		</div>
	);
}

export default function Homepage() {
	const navigate = useNavigate();
	const bp = useBreakpoint();
	const t = useT();
	const featureIcons = [imgIcon, imgIcon2, imgIcon1];
	const featureAlts = ['Payment accounts icon', 'Card issuing icon', 'E-money tokens icon'];

	if (bp === 'mobile' || bp === 'tablet') {
		return <HomepageMobile navigate={navigate} />;
	}

	return (
		<div className="hp">
			<Navbar />

			{/* ── Hero ── */}
			<section className="hp__hero-section">
				<div
					className="hp__hero-bg"
					style={{ backgroundImage: `url(${imgHeroBg})` }}
				></div>
				<div className="hp__hero-container">
					<motion.div
						className="hp__hero-copy"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
					>
						<p className="hp__hero-title">{t('home.hero.title')}</p>
						<p className="hp__hero-subtitle">{t('home.hero.subtitle')}</p>
					</motion.div>
					<motion.div
						className="hp__hero-card-container"
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
					>
						<img alt="" className="hp__hero-cards" src={imgHeroCards}/>
						<div className="hp__hero-cta-wrap">
							<button type="button" className="hp__hero-cta-btn" onClick={() => navigate('/contact')}>
								<p className="hp__hero-cta-label">{t('home.hero.cta')}</p>
							</button>
						</div>
					</motion.div>
				</div>
			</section>

			{/* ── Feature Cards ── */}
			<div className="hp__features">
				{t('home.features').map(({ title, text }, index) => (
					<motion.div
						key={title}
						className="card hp__feature-card"
						initial={{ opacity: 0, y: 32 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.5, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
					>
						<img alt={featureAlts[index]} className="hp__feature-icon" src={featureIcons[index]} />
						<div>
							<p className="hp__feature-title">{title}</p>
							<p className="hp__feature-text">{text}</p>
						</div>
					</motion.div>
				))}
			</div>

			{/* ── Regulated & Supervised ── */}
			<motion.div
				className="hp__regulated"
				style={{ backgroundImage: regulatedBg }}
				initial={{ opacity: 0, x: -40 }}
				whileInView={{ opacity: 1, x: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
			>
				<div className="hp__regulated-dots" />
				<div>
					<p className="hp__regulated-title">{t('home.regulated.title')}</p>
					<p className="hp__regulated-subtitle">{t('home.regulated.subtitle')}</p>
				</div>
				<div className="hp__regulated-shield">
					<motion.img
						alt=""
						className="hp__regulated-shield-img"
						src={imgGroup1}
						animate={{ y: [0, -12, 0] }}
						transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
					/>
				</div>
			</motion.div>

			{/* ── Solutions Grid ── */}
			<div className="hp__solutions">
				<div className="hp__solutions-row">
					{[0, 1, 2].map((idx, index) => {
						const { title, text, image } = t('home.solutionCards')[idx];
						return (
							<motion.div
								key={title}
								className="card hp__solution-card"
								style={{ width: 392 }}
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.15 }}
								transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
							>
								<div className="hp__solution-spacer" style={{ backgroundImage: `url(${image})` }}/>
								<div className="hp__solution-content">
									<p className="hp__solution-title">{title}</p>
									<p className="hp__solution-text">{text}</p>
								</div>
							</motion.div>
						);
					})}
				</div>
				<div className="hp__solutions-row">
					{[
						{ width: 392, idx: 3 },
						{ width: 392, idx: 5 },
						{ width: 392, idx: 4 },
					].map(({ width, idx }, index) => {
						const { title, text, image } = t('home.solutionCards')[idx];
						return (
							<motion.div
								key={title}
								className="card hp__solution-card"
								style={{ width }}
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.15 }}
								transition={{ duration: 0.5, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
							>
								<div className="hp__solution-spacer" style={{ backgroundImage: `url(${image})` }}/>
								<div className="hp__solution-content">
									<p className="hp__solution-title">{title}</p>
									<p className="hp__solution-text">{text}</p>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>

			{/* ── Why Choose Dinaro ── */}
			<div className="hp__why" style={{ backgroundImage: whyBg }}>
				<motion.p
					className="hp__why-heading"
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				>
					{t('home.why.heading')}
				</motion.p>

				<div className="hp__why-row">
					{[0, 1, 2].map((idx, index) => {
						const { title, text } = t('home.why.cards')[idx];
						return <WhyCard key={title} index={index} title={title} text={text} />;
					})}
				</div>
				<div className="hp__why-row">
					{[3, 4, 5].map((idx, index) => {
						const { title, text } = t('home.why.cards')[idx];
						return <WhyCard key={title} index={index} title={title} text={text} />;
					})}
				</div>

				<div className="hp__why-cta-wrap">
					<button type="button" className="hp__why-cta-btn" onClick={() => navigate('/contact')}>
						<p className="hp__why-cta-label">{t('home.why.cta')}</p>
					</button>
				</div>

			</div>

			{/* ── Partners ── */}
			<div className="hp__partners">
				<motion.p
					className="hp__partners-title"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				>
					{t('home.partners.title')}
				</motion.p>
				<motion.p
					className="hp__partners-label"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 0.4 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.4, delay: 0.1 }}
				>
					{t('home.partners.label')}
				</motion.p>
				<div className="hp__partners-grid">
					{partners.map(({ src, alt }, index) => (
						<motion.div
							key={alt}
							className="hp__partner"
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
						>
							<img alt={alt} src={src} />
						</motion.div>
					))}
				</div>
			</div>

			{/* ── CTA Section ── */}
			<div className="hp__cta" style={{ backgroundImage: ctaBg }}>
				<motion.p
					className="hp__cta-title"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				>
					{t('home.cta.title')}
				</motion.p>
				<motion.p
					className="hp__cta-body"
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 0.6, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
				>
					{t('home.cta.body')}<br />
					{t('home.cta.bodyExtra')}
				</motion.p>
				<div className="hp__cta-actions">
					<button type="button" className="hp__cta-primary" onClick={() => navigate('/contact')}>
						<p className="hp__cta-primary-label">{t('home.cta.primary')}</p>
					</button>
				</div>
			</div>

			<Footer />
		</div>
	);
}
