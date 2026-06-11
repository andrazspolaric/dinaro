import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { usePreloadRoute } from '../hooks/usePreloadRoute';
import { LANGUAGES, setA11yLanguage, useA11yState } from './AccessibilityToggle';
import { useT } from '../i18n/useT';
import footerDinaro from '../footer-dinaro.svg';
import './Footer.css';

export function LanguageDropdown({isMobile = false}) {
  const {language} = useA11yState();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // No point offering a selector while only one language is live
  if (LANGUAGES.length < 2) return null;

  const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const CurrentFlag = current.Flag;

  return (
    <div className={`footer__lang ${open ? 'is-open' : ''} ${isMobile ? 'footer__lang--mobile' : ''}`} ref={ref}>
      <button
        type="button"
        className="footer__lang-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="footer__lang-flag" aria-hidden="true"><CurrentFlag/></span>
        <span className="footer__lang-label">{current.label}</span>
        <svg
          className="footer__lang-chevron"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <ul className="footer__lang-menu" role="listbox">
          {LANGUAGES.map((lang) => {
            const Flag = lang.Flag;
            const isActive = lang.code === language;
            return (
              <li key={lang.code} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  className={`footer__lang-option ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    setA11yLanguage(lang.code);
                    setOpen(false);
                  }}
                >
                  <span className="footer__lang-flag" aria-hidden="true"><Flag/></span>
                  <span>{lang.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function Footer() {
  const navigate = useNavigate();
  const preloadRoute = usePreloadRoute();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile' || bp === 'tablet';
  const t = useT();

  return (
    <footer className={`footer ${isMobile ? 'footer--mobile' : ''}`}>
      <div className="footer__watermark">
        <img src={footerDinaro} alt="" />
      </div>

      <div className="footer__content">
        <p className="footer__copyright">{t('footer.copyright')}</p>

        <nav className="footer__nav">
          <button
            type="button"
            className="footer__nav-link"
            onMouseEnter={() => preloadRoute('/terms')}
            onClick={() => navigate('/terms')}
          >
            {t('footer.terms')}
          </button>
          <button
            type="button"
            className="footer__nav-link"
            onMouseEnter={() => preloadRoute('/complaints')}
            onClick={() => navigate('/complaints')}
          >
            {t('footer.complaints')}
          </button>
          <button
            type="button"
            className="footer__nav-link"
            onMouseEnter={() => preloadRoute('/privacy-policy')}
            onClick={() => navigate('/privacy-policy')}
          >
            {t('footer.privacy')}
          </button>
          <LanguageDropdown isMobile={isMobile}/>
        </nav>
      </div>
    </footer>
  );
}
