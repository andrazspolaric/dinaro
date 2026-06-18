import {useNavigate} from 'react-router-dom';
import {ctaBg} from '../shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {useBreakpoint} from '../hooks/useBreakpoint';
import {MobileFeaturePage} from '../components/MobileFeaturePage';
import {useT} from '../i18n/useT';
import '../components/FeaturePage.css';

import imgVector from '../assets/company-vector.svg';

const heroBg = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 1696 456' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/%3E%3Cdefs%3E%3CradialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-30 39.071 -76 -15.423 1148 228.26)'%3E%3Cstop stop-color='rgba(34,132,155,0.2)' offset='0'/%3E%3Cstop stop-color='rgba(34,132,155,0)' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

const FEATURE_SIDES = ['right', 'left', 'right', 'left'];

function FeatureRow({cardSide, tag, title, text, image }) {
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

export default function Company() {
	const navigate = useNavigate();
	const bp = useBreakpoint();
	const t = useT();
	const features = t('company.features').map((f, i) => ({...f, cardSide: FEATURE_SIDES[i]}));
	const legalDetails = t('company.legalDetails');
	const legalName = t('company.legalName');
	const legalAddress = t('company.legalAddress');

	const mobileLegalCard = (
		<div className="fp__legal-card-mobile">
			<div className="card fp__legal-card-mobile-inner">
				<p className="fp__legal-card-mobile-name">{legalName}</p>
				<p className="fp__legal-card-mobile-address">{legalAddress}</p>
				<div className="fp__legal-card-mobile-details">
					{legalDetails.map(({label, value}) => (
						<div key={label} className="fp__legal-card-mobile-detail">
							<p className="fp__legal-card-mobile-detail-label">{label}</p>
							<p className="fp__legal-card-mobile-detail-value">{value}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	if (bp === 'mobile' || bp === 'tablet') {
		return (
			<MobileFeaturePage
				heroTitle={t('company.heroTitleMobile')}
				heroSubtitle={t('company.heroSubtitle')}
				features={features}
				extraContent={mobileLegalCard}
				ctaTitle={t('company.ctaTitle')}
				navigate={navigate}
			/>
		);
	}
	return (
		<div className="fp">
			<Navbar/>

			<div className="fp__hero">
				<div className="fp__hero-bg" style={{backgroundImage: heroBg}}/>
				<div className="fp__hero-vector-wrap">
					<img alt="" className="fp__hero-vector" src={imgVector}/>
				</div>
				<div className="fp__hero-text">
					<p className="fp__hero-title">{t('company.heroTitle')}<br/>{t('company.heroTitleLine2')}</p>
					<p className="fp__hero-subtitle">{t('company.heroSubtitle')}</p>
				</div>
			</div>

			<div className="fp__features">
				{features.map(({cardSide, tag, title, text, image}) => (
					<FeatureRow key={tag} cardSide={cardSide} tag={tag} title={title} text={text} image={image}/>
				))}
			</div>

			<div className="card fp__legal-strip">
				<div className="fp__legal-strip-name">
					<p className="fp__legal-strip-name-title">{legalName}</p>
					<p className="fp__legal-strip-name-address">{legalAddress}</p>
				</div>
				<div className="fp__legal-strip-details">
					{legalDetails.map(({label, value}) => (
						<>
							<div key={label} className="fp__legal-detail">
								<p className="fp__legal-detail-label">{label}</p>
								<p className="fp__legal-detail-value">{value}</p>
							</div>
							<div className="separator"/>
						</>
					))}
				</div>
			</div>

			<div className="fp__cta" style={{backgroundImage: ctaBg}}>
				<p className="fp__cta-title">{t('company.ctaTitle')}</p>
				<button type="button" className="fp__cta-btn" onClick={() => navigate('/contact')}>
					<p className="fp__cta-btn-label">{t('common.contactUs')}</p>
				</button>
			</div>

			<Footer/>
		</div>
	);
}
