import { useNavigate } from 'react-router-dom';
import { ctaBg } from '../shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useT } from '../i18n/useT';
import '../components/FeaturePage.css';
import '../components/MobileFeaturePage.css';

import imgVector from '../assets/contact-vector.svg';
import imgCircle from '../assets/circle-contact.svg';
import imgArrowExt from '../assets/arrow-ext.svg';

const heroBg = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 1696 456' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/%3E%3Cdefs%3E%3CradialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-30 39.071 -76 -15.423 1148 228.26)'%3E%3Cstop stop-color='rgba(34,132,155,0.2)' offset='0'/%3E%3Cstop stop-color='rgba(34,132,155,0)' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

const heroBgMobile = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

function PillButton({ label, arrowSrc, onClick }) {
  return (
    <button type="button" className="fp__contact-pill-btn" onClick={onClick}>
      <p className="fp__contact-pill-label">{label}</p>
      <div className="fp__contact-pill-icon-wrap">
        <img alt="" className="fp__contact-pill-icon-bg" src={imgCircle} />
        <img alt="" className="fp__contact-pill-icon-arrow" src={arrowSrc} />
      </div>
    </button>
  );
}

function InfoCard({ title, sub, buttonLabel, arrowSrc, onButtonClick }) {
  return (
    <div className="card fp__contact-info-card">
      <div className="fp__contact-info-icon" />
      <div className="fp__contact-info-content">
        <p className="fp__contact-info-title">{title}</p>
        <p className="fp__contact-info-sub">{sub}</p>
        <PillButton label={buttonLabel} arrowSrc={arrowSrc} onClick={onButtonClick} />
      </div>
    </div>
  );
}

function ContactMobile({ t }) {
  const cards = t('contact.cards');
  const address = t('contact.address');
  return (
    <div className="mobile-page">
      <Navbar />

      <div className="mobile-page__hero" style={{ backgroundImage: heroBgMobile }}>
        <p className="mobile-page__hero-title">{t('contact.heroTitle')}</p>
        <p className="mobile-page__hero-subtitle">{t('contact.heroSubtitleMobile')}</p>
      </div>

      <div className="fp__contact-mobile-info-cards">
        {cards.map(({ email, title, description }) => (
          <div key={email} className="card fp__contact-mobile-info-card">
            <p className="fp__contact-mobile-info-title">{title}</p>
            <p className="fp__contact-mobile-info-text">{description}</p>
            <button
              type="button"
              className="fp__contact-mobile-map-btn"
              onClick={() => window.location.href = `mailto:${email}`}
            >
              {t('contact.contactButton')}
            </button>
          </div>
        ))}
      </div>

      <div className="fp__contact-mobile-info-cards">
        <div className="card fp__contact-mobile-info-card">
          <p className="fp__contact-mobile-info-title">{address.title}</p>
          <p className="fp__contact-mobile-info-text">{address.value}</p>
          <button
            type="button"
            className="fp__contact-mobile-map-btn"
            onClick={() => window.open('https://maps.google.com/?q=Bravničarjeva+ulica+13,+1000+Ljubljana', '_blank', 'noopener')}
          >
            {t('contact.viewOnMaps')}
          </button>
        </div>
      </div>

      <div className="mobile-page__cta" style={{ backgroundImage: ctaBg }}>
        <p className="mobile-page__cta-title">{t('contact.ctaTitle')}</p>
        <p style={{ fontFamily: 'var(--font-inter)', fontWeight: 400, fontSize: 15, lineHeight: '24px', color: 'white', opacity: 0.7, textAlign: 'center' }}>{t('contact.ctaBody')}</p>
      </div>

      <div className="mobile-page__footer">
        <p className="mobile-page__footer-copy">{t('footer.copyShort')}</p>
        <div className="mobile-page__footer-links">
          {[
            { label: t('footer.terms'), href: '/terms' },
            { label: t('footer.privacy'), href: '/privacy-policy' },
            { label: t('footer.complaints'), href: '/complaints' },
          ].map(({ label, href }) => (
            <a key={href} href={href} className="mobile-page__footer-link">{label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const bp = useBreakpoint();
  const t = useT();

  if (bp === 'mobile' || bp === 'tablet') {
    return <ContactMobile t={t} />;
  }

  const cards = t('contact.cards');
  const address = t('contact.address');
  const contactButton = t('contact.contactButton');
  const viewOnMaps = t('contact.viewOnMaps');

  return (
    <div className="fp">
      <Navbar />

      <div className="fp__hero">
        <div className="fp__hero-bg" style={{ backgroundImage: heroBg }} />
        <div className="fp__hero-vector-wrap">
          <img alt="" className="fp__hero-vector" src={imgVector} />
        </div>
        <div className="fp__hero-text">
          <p className="fp__hero-title">{t('contact.heroTitle')}</p>
        </div>
      </div>

      <div className="fp__contact-info-row fp__contact-info-row--four">
        {cards.map(({ email, title, description }) => (
          <InfoCard
            key={email}
            title={title}
            sub={description}
            buttonLabel={contactButton}
            arrowSrc={imgArrowExt}
            onButtonClick={() => window.location.href = `mailto:${email}`}
          />
        ))}
      </div>

      <div className="fp__contact-info-row fp__contact-info-row--single">
        <InfoCard
          title={address.title}
          sub={address.value}
          buttonLabel={viewOnMaps}
          arrowSrc={imgArrowExt}
          onButtonClick={() => window.open('https://maps.google.com/?q=Bravničarjeva+ulica+13,+1000+Ljubljana', '_blank', 'noopener')}
        />
      </div>

      <div className="fp__cta" style={{ backgroundImage: ctaBg }}>
        <p className="fp__cta-title">{t('contact.ctaTitle')}</p>
        <p style={{ fontFamily: 'var(--font-inter)', fontWeight: 400, fontSize: 18, lineHeight: '28px', color: 'white', opacity: 0.7, textAlign: 'center', width: 675, alignSelf: 'center' }}>{t('contact.ctaBody')}</p>
      </div>

      <Footer />
    </div>
  );
}
