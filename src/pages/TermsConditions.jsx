import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ctaBg } from '../shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useBreakpoint } from '../hooks/useBreakpoint';
import '../components/FeaturePage.css';
import '../components/MobileFeaturePage.css';

import imgVector from '../assets/terms-vector.svg';
import { useA11yState } from '../components/AccessibilityToggle';
import { useT } from '../i18n/useT';
import slSections from '../data/termsData.js';
import enSections from '../data/termsDataEn.js';

const heroBg = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 1696 456' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/%3E%3Cdefs%3E%3CradialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-30 39.071 -76 -15.423 1148 228.26)'%3E%3Cstop stop-color='rgba(34,132,155,0.2)' offset='0'/%3E%3Cstop stop-color='rgba(34,132,155,0)' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

const heroBgMobile = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function buildSlugs(items) {
  const seen = new Map();
  return items.map(({ title }) => {
    const base = slugify(title) || 'section';
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  });
}

function indexFromHash(slugs, hash) {
  if (!hash) return 0;
  const slug = hash.replace(/^#/, '');
  const i = slugs.indexOf(slug);
  return i >= 0 ? i : 0;
}

export default function TermsConditions() {
  const navigate = useNavigate();
  const bp = useBreakpoint();
  const { language } = useA11yState();
  const t = useT();
  const sections = language === 'sl' ? slSections : enSections;
  const slugs = useMemo(() => buildSlugs(sections), [sections]);
  const [rawIndex, setRawIndex] = useState(() =>
    indexFromHash(slugs, typeof window !== 'undefined' ? window.location.hash : '')
  );
  // Switching language swaps the section list, so an index from the longer
  // Slovenian list may overshoot the English one.
  const activeIndex = Math.min(rawIndex, sections.length - 1);
  const setActiveIndex = setRawIndex;

  useEffect(() => {
    const onHashChange = () => setActiveIndex(indexFromHash(slugs, window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [slugs]);

  const selectSection = (i, e) => {
    if (e) e.preventDefault();
    setActiveIndex(i);
    const newHash = `#${slugs[i]}`;
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
    }
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { title, html } = sections[activeIndex];

  if (bp === 'mobile' || bp === 'tablet') {
    return (
      <div className="mobile-page">
        <Navbar />
        <div className="mobile-page__hero" style={{ backgroundImage: heroBgMobile }}>
          <p className="mobile-page__hero-title">{t('footer.terms')}</p>
        </div>
        <div className="terms__mobile-tabs">
          {sections.map(({ title: t }, i) => (
            <a
              key={slugs[i]}
              href={`#${slugs[i]}`}
              onClick={(e) => selectSection(i, e)}
              className={`terms__mobile-tab${i === activeIndex ? ' terms__mobile-tab--active' : ''}`}
            >
              {t}
            </a>
          ))}
        </div>
        <div className="fp__content-mobile">
          <p className="terms__mobile-section-title">{title}</p>
          <div
            className="terms-content fp__content-mobile-text"
            dangerouslySetInnerHTML={{ __html: html }}
          />
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
          <p className="fp__hero-title">{t('footer.terms')}</p>
        </div>
      </div>

      <style>{`@keyframes termsFade { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }`}</style>

      <div className="terms__layout">
        <nav className="terms__sidebar" aria-label="Terms sections">
          {sections.map(({ title: t }, i) => (
            <a
              key={slugs[i]}
              href={`#${slugs[i]}`}
              onClick={(e) => selectSection(i, e)}
              className={`terms__nav-item${i === activeIndex ? ' terms__nav-item--active' : ''}`}
              aria-current={i === activeIndex ? 'true' : undefined}
            >
              {t}
            </a>
          ))}
        </nav>
        <div className="terms__main">
          <p key={`title-${activeIndex}`} className="terms__section-title" style={{ animation: 'termsFade 0.3s ease forwards' }}>
            {title}
          </p>
          <div
            key={`body-${activeIndex}`}
            className="terms-content terms__section-body"
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ animation: 'termsFade 0.3s ease forwards' }}
          />
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
