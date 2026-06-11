// Shared mobile layout for feature-row product/solution pages
import { ctaBg } from '../shared';
import Navbar from './Navbar';
import { useT } from '../i18n/useT';
import './MobileFeaturePage.css';

const heroBgMobile = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

export function MobileFeaturePage({ heroTitle, heroTagline, heroSubtitle, heroExtra, features, whyTitle, whyCards, ctaTitle, ctaButton, navigate, extraContent }) {
  const t = useT();
  return (
    <div className="mobile-page">
      <Navbar />

      {/* Hero */}
      <div className="mobile-page__hero" style={{ backgroundImage: heroBgMobile }}>
        <p className="mobile-page__hero-title">{heroTitle}</p>
        {heroTagline && (
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontWeight: 500,
            fontSize: 18,
            lineHeight: 1.35,
            color: 'white',
            opacity: 0.85,
            margin: 0,
          }}>{heroTagline}</p>
        )}
        {heroSubtitle && (
          <p className="mobile-page__hero-subtitle">{heroSubtitle}</p>
        )}
        {heroExtra}
      </div>

      {/* Feature Cards */}
      <div className="mobile-page__features">
        {features.map(({ tag, badge, title, text }) => (
          <div key={tag} className="card mobile-page__feature-card">
            <div className="mobile-page__feature-tag-row">
              <p className="mobile-page__feature-tag">{tag}</p>
              {badge && <span className="mobile-page__feature-badge">{badge}</span>}
            </div>
            <p className="mobile-page__feature-title">{title}</p>
            <p className="mobile-page__feature-text">{text}</p>
          </div>
        ))}
      </div>

      {extraContent}

      {/* Why Cards */}
      {whyCards && whyCards.length > 0 && (
        <div className="mobile-page__why">
          {whyTitle && <p className="mobile-page__why-title">{whyTitle}</p>}
          {whyCards.map(({ title, text }) => (
            <div key={title} className="card mobile-page__why-card">
              <p className="mobile-page__why-card-title">{title}</p>
              <p className="mobile-page__why-card-text">{text}</p>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mobile-page__cta" style={{ backgroundImage: ctaBg }}>
        <p className="mobile-page__cta-title">
          {ctaTitle || t('common.ctaTitleDefault')}
        </p>
        <button
          type="button"
          className="mobile-page__cta-btn"
          onClick={() => navigate('/contact')}
        >
          {ctaButton || t('common.contactUs')}
        </button>
      </div>

      {/* Footer */}
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
