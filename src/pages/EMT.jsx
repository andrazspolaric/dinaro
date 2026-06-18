import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ctaBg } from '../shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { MobileFeaturePage } from '../components/MobileFeaturePage';
import { useT } from '../i18n/useT';
import '../components/FeaturePage.css';

import imgVector from '../assets/world-map.svg';

const heroBg = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 1696 456' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/%3E%3Cdefs%3E%3CradialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-30 39.071 -76 -15.423 1148 228.26)'%3E%3Cstop stop-color='rgba(34,132,155,0.2)' offset='0'/%3E%3Cstop stop-color='rgba(34,132,155,0)' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

const FEATURE_SIDES = ['right', 'left', 'right', 'left', 'right', 'left'];

function ReportsSection({ heading, intro, trigger, columns, rows, modalTitle, modalBody, modalClose, variant = 'desktop' }) {
  const [open, setOpen] = useState(false);
  const isMobile = variant === 'mobile';
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const gridCols = isMobile ? '1fr auto' : '1.1fr 1.6fr 1.4fr';

  return (
    <>
      {!isMobile && (
        <div className="fp__feature-row">
          <div className="fp__feature-text-side">
            <div className="fp__feature-text-inner">
              <p className="fp__feature-tag">REPORTS</p>
              <p className="fp__feature-title">{heading}</p>
              {intro && <p className="fp__feature-body">{intro}</p>}
              <button
                type="button"
                onClick={() => setOpen(true)}
                style={{
                  background: '#044352',
                  color: 'white',
                  border: 0,
                  borderRadius: 999,
                  padding: '14px 32px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 500,
                  fontSize: 15,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 24,
                  alignSelf: 'flex-start',
                }}
              >
                <span>{trigger}</span>
                <ArrowGlyph />
              </button>
            </div>
          </div>
          <div className="card fp__feature-card-side">
            <div className="fp__feature-card-thumb" />
          </div>
        </div>
      )}
      {isMobile && (
        <div className="card mobile-page__feature-card" style={{ margin: '16px 16px 0' }}>
          <p className="mobile-page__feature-tag">REPORTS</p>
          <p className="mobile-page__feature-title">{heading}</p>
          {intro && <p className="mobile-page__feature-text">{intro}</p>}
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{
              background: '#044352',
              color: 'white',
              border: 0,
              borderRadius: 999,
              padding: '12px 24px',
              cursor: 'pointer',
              fontFamily: 'var(--font-inter)',
              fontWeight: 500,
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 20,
              alignSelf: 'flex-start',
            }}
          >
            <span>{trigger}</span>
            <ArrowGlyph />
          </button>
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="emt-reports-modal-title"
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(4, 67, 82, 0.55)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: 20,
              maxWidth: 720,
              width: '100%',
              maxHeight: 'calc(85vh / var(--viewport-zoom, 1))',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 60px rgba(4, 67, 82, 0.35)',
              fontFamily: 'var(--font-inter)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={modalClose}
              style={{
                position: 'absolute', top: 14, right: 14,
                width: 32, height: 32, borderRadius: '50%',
                background: 'transparent', border: 0, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#044352',
                zIndex: 1,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <div style={{ padding: '36px 32px 16px' }}>
              <h3 id="emt-reports-modal-title" style={{
                margin: 0, marginBottom: 10,
                fontWeight: 600, fontSize: 22, lineHeight: 1.3, color: '#044352',
              }}>{modalTitle}</h3>
              <p style={{
                margin: 0,
                fontWeight: 400, fontSize: 14, lineHeight: 1.6, color: 'rgba(0,0,0,0.65)',
              }}>{modalBody}</p>
            </div>

            <div style={{ overflowY: 'auto', padding: '0 32px 16px' }}>
              {!isMobile && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: gridCols,
                  gap: 24,
                  padding: '12px 0',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.45)',
                  borderBottom: '1px solid rgba(0,0,0,0.08)',
                }}>
                  <span>{columns.period}</span>
                  <span>{columns.document}</span>
                  <span>{columns.date}</span>
                </div>
              )}

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {rows.map((row, i) => (
                  <li
                    key={`${row.period}-${i}`}
                    style={{
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      display: 'grid',
                      gridTemplateColumns: gridCols,
                      gap: isMobile ? 8 : 24,
                      alignItems: isMobile ? 'flex-start' : 'center',
                      padding: isMobile ? '14px 0' : '16px 0',
                      fontFamily: 'var(--font-inter)',
                      color: '#044352',
                    }}
                  >
                    {isMobile ? (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 15, color: '#044352' }}>{row.period}</span>
                          <span style={{ fontWeight: 400, fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>{row.document}</span>
                          <span style={{ fontWeight: 400, fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{row.date}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span style={{ fontWeight: 600, fontSize: 15 }}>{row.period}</span>
                        <span style={{ fontWeight: 400, fontSize: 14, color: 'rgba(0,0,0,0.75)' }}>{row.document}</span>
                        <span style={{ fontWeight: 400, fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>{row.date}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              padding: '16px 32px 24px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              justifyContent: 'flex-end',
              background: 'white',
            }}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  background: '#044352', color: 'white',
                  border: 0, borderRadius: 999,
                  padding: '12px 28px', cursor: 'pointer',
                  fontFamily: 'var(--font-inter)', fontWeight: 500, fontSize: 14,
                }}
              >{modalClose}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ArrowGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FaqSection({ heading, items, variant = 'desktop' }) {
  const [open, setOpen] = useState(0);
  const isMobile = variant === 'mobile';
  return (
    <section style={{
      maxWidth: 880,
      margin: isMobile ? '64px 16px 0' : '120px auto 0',
      padding: isMobile ? '0 8px' : '0 24px',
    }}>
      <h2 style={{
        textAlign: 'center',
        fontFamily: 'var(--font-inter)',
        fontWeight: 400,
        fontSize: isMobile ? 32 : 40,
        color: '#1a1a1a',
        margin: 0,
        marginBottom: isMobile ? 32 : 56,
      }}>{heading}</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item, i) => {
          const isOpen = i === open;
          return (
            <li key={item.q} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 0,
                  padding: isMobile ? '20px 0' : '24px 0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 24,
                  textAlign: 'left',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 500,
                  fontSize: isMobile ? 16 : 18,
                  lineHeight: 1.4,
                  color: '#044352',
                }}
              >
                <span>{item.q}</span>
                <span style={{
                  flexShrink: 0,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isOpen ? 'rgba(124, 208, 217, 0.18)' : 'transparent',
                  transition: 'background 150ms ease',
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 150ms ease',
                  }}>
                    <path d="M2 5l5 5 5-5" stroke="#044352" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <p style={{
                  margin: 0,
                  padding: isMobile ? '0 0 20px' : '0 0 24px',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 400,
                  fontSize: isMobile ? 14 : 16,
                  lineHeight: 1.7,
                  color: 'rgba(0,0,0,0.6)',
                  maxWidth: 760,
                }}>{item.a}</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

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

export default function EMT({ variant = 'v1' }) {
  const navigate = useNavigate();
  const bp = useBreakpoint();
  const t = useT();
  const ns = variant === 'v2' ? 'emtV2' : 'emt';
  const heroBadge = variant === 'v2' ? null : t(`${ns}.heroBadge`);
  const heroSubtitle = variant === 'v2' ? t(`${ns}.heroSubtitle`) : null;
  const features = t(`${ns}.features`).map((f, i) => ({ ...f, cardSide: FEATURE_SIDES[i] }));
  const ctaTitle = t(`${ns}.ctaTitle`);
  const faq = variant === 'v2' ? t(`${ns}.faq`) : null;
  const reports = variant === 'v2' ? t(`${ns}.reports`) : null;

  if (bp === 'mobile' || bp === 'tablet') {
    return (
      <MobileFeaturePage
        heroTitle={t(`${ns}.heroTitle`)}
        heroSubtitle={heroSubtitle}
        heroExtra={heroBadge && <span className="mobile-page__hero-badge">{heroBadge}</span>}
        features={features}
        extraContent={(faq || reports) && (
          <>
            {reports && <ReportsSection {...reports} variant="mobile" />}
            {faq && <FaqSection heading={faq.heading} items={faq.items} variant="mobile" />}
          </>
        )}
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
          <p className="fp__hero-title">{t(`${ns}.heroTitle`)}</p>
          {heroSubtitle && <p className="fp__hero-subtitle">{heroSubtitle}</p>}
          {heroBadge && <span className="fp__hero-badge">{heroBadge}</span>}
        </div>
      </div>
      <div className="fp__features">
        {features.map(({ cardSide, tag, title, text, image }) => (
          <FeatureRow key={tag} cardSide={cardSide} tag={tag} title={title} text={text} image={image} />
        ))}
        {reports && <ReportsSection {...reports} />}
      </div>
      {faq && <FaqSection heading={faq.heading} items={faq.items} />}
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
