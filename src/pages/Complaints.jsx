import { useNavigate } from 'react-router-dom';
import { ctaBg } from '../shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useT } from '../i18n/useT';
import '../components/FeaturePage.css';
import '../components/MobileFeaturePage.css';

import imgVector from '../assets/privacy-vector.svg';

import iconPost from '../assets/graphics/complaints/post.svg';
import iconEmail from '../assets/graphics/complaints/email.svg';

const heroBg = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 1696 456' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/%3E%3Cdefs%3E%3CradialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-30 39.071 -76 -15.423 1148 228.26)'%3E%3Cstop stop-color='rgba(34,132,155,0.2)' offset='0'/%3E%3Cstop stop-color='rgba(34,132,155,0)' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

const heroBgMobile = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

function Bullet({ children }) {
  return (
    <div className="complaints__bullet-item">
      <div className="complaints__bullet-dot" />
      <p className="complaints__text">{children}</p>
    </div>
  );
}

function ContactRow({ label, value, icon }) {
  return (
    <div className="complaints__contact-info-row">
      <div
        className="complaints__contact-info-icon"
        style={icon ? { background: `url(${icon}) center/contain no-repeat`, border: 'none' } : undefined}
      />
      <div className="complaints__contact-info-body">
        <p className="complaints__contact-info-label">{label}</p>
        <p className="complaints__contact-info-value">{value}</p>
      </div>
    </div>
  );
}

// Some paragraphs carry <strong>/<a> markup straight from the copy deck.
function HtmlText({ className, html }) {
  return <p className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Complaints() {
  const navigate = useNavigate();
  const bp = useBreakpoint();
  const t = useT();
  const c = t('complaintsPage');

  if (bp === 'mobile' || bp === 'tablet') {
    return (
      <div className="mobile-page">
        <Navbar />
        <div className="mobile-page__hero" style={{ backgroundImage: heroBgMobile }}>
          <p className="mobile-page__hero-title">{c.heroTitle}</p>
          <p className="mobile-page__hero-subtitle">{c.heroSubtitle}</p>
        </div>
        <div className="complaints__mobile-cards">
          <div className="card complaints__mobile-card">
            <p className="complaints__mobile-card-title">{c.mobile.submitTitle}</p>
            <p className="complaints__mobile-card-text">{c.lead}</p>
            <ContactRow label={c.byPostLabel} value={c.byPostValue} icon={iconPost} />
            <ContactRow label={c.byEmailLabel} value={c.byEmailValue} icon={iconEmail} />
            <p className="complaints__mobile-footnote">
              {c.footnotePre}
              <button type="button" onClick={() => navigate('/terms')} className="complaints__terms-link">
                {c.footnoteLink}
              </button>.
            </p>
          </div>
          <div className="card complaints__mobile-card">
            <p className="complaints__mobile-card-title">{c.how.heading}</p>
            <p className="complaints__mobile-card-text">{c.mobile.howText}</p>
            <p className="complaints__include-label">{c.mobile.includeLabel}</p>
            <div className="complaints__bullet-list">
              {(Array.isArray(c.mobile?.bullets) ? c.mobile.bullets : []).map(text => <Bullet key={text}>{text}</Bullet>)}
            </div>
          </div>
          <div className="card complaints__mobile-card">
            <p className="complaints__mobile-card-title">{c.mobile.durationTitle}</p>
            <HtmlText className="complaints__mobile-card-text" html={c.mobile.durationText} />
          </div>
          <div className="card complaints__mobile-card">
            <p className="complaints__mobile-card-title">{c.outcome.heading}</p>
            <HtmlText className="complaints__mobile-card-text" html={c.mobile.outcomeText} />
          </div>
        </div>
        <div className="mobile-page__cta" style={{ backgroundImage: ctaBg }}>
          <p className="mobile-page__cta-title">{t('common.questionsTitle')}</p>
          <button type="button" className="mobile-page__cta-btn" onClick={() => navigate('/contact')}>
            {t('common.contactUs')}
          </button>
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

  return (
    <div className="fp">
      <Navbar />

      <div className="fp__hero">
        <div className="fp__hero-bg" style={{ backgroundImage: heroBg }} />
        <div className="fp__hero-vector-wrap">
          <img alt="" className="fp__hero-vector" src={imgVector} />
        </div>
        <div className="fp__hero-text">
          <p className="fp__hero-title">{c.heroTitle}</p>
        </div>
      </div>

      <div className="complaints__content">
        {/* Submit card */}
        <div className="card complaints__card">
          <p className="complaints__heading">{c.heroSubtitle}</p>
          <p className="complaints__lead">{c.lead}</p>
          <div className="complaints__contact-row">
            <div className="complaints__contact-col">
              <ContactRow label={c.byPostLabel} value={c.byPostValue} icon={iconPost} />
            </div>
            <div className="complaints__contact-col--fixed">
              <ContactRow label={c.byEmailLabel} value={c.byEmailValue} icon={iconEmail} />
            </div>
          </div>
          <p className="complaints__footnote">
            {c.footnotePre}
            <button type="button" onClick={() => navigate('/terms')} className="complaints__terms-link">
              {c.footnoteLink}
            </button>.
            <br/>{c.footnoteData}
          </p>
        </div>

        {/* Two-column lower section */}
        <div className="complaints__two-col">
          <div className="complaints__left-col">
            <div className="card complaints__card">
              <p className="complaints__subheading">{c.how.heading}</p>
              <p className="complaints__text">{c.how.p1}</p>
              <p className="complaints__text">{c.how.p2}</p>
              <p className="complaints__include-label">{c.how.includeLabel}</p>
              <div className="complaints__bullet-list">
                {(Array.isArray(c.how?.bullets) ? c.how.bullets : []).map(text => <Bullet key={text}>{text}</Bullet>)}
              </div>
              <p className="complaints__footnote-sm">{c.how.footnote}</p>
            </div>
          </div>

          <div className="complaints__right-col">
            <div className="card complaints__card">
              <p className="complaints__subheading">{c.duration.heading}</p>
              <HtmlText className="complaints__text" html={c.duration.p1} />
              <HtmlText className="complaints__text" html={c.duration.p2} />
              <p className="complaints__text">{c.duration.p3}</p>
            </div>

            <div className="card complaints__card">
              <p className="complaints__subheading">{c.outcome.heading}</p>
              <HtmlText className="complaints__text" html={c.outcome.p1} />
              <HtmlText className="complaints__text" html={c.outcome.p2} />
            </div>
          </div>
        </div>
      </div>

      <div className="fp__cta fp__cta--legal" style={{ backgroundImage: ctaBg }}>
        <p className="fp__cta-title">{t('common.questionsTitle')}</p>
        <button type="button" className="fp__cta-btn" onClick={() => navigate('/contact')}>
          <p className="fp__cta-btn-label">{t('common.contactUs')}</p>
        </button>
      </div>

      <Footer />
    </div>
  );
}
