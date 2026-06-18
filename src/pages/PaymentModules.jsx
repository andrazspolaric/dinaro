import { useNavigate } from 'react-router-dom';
import { ctaBg } from '../shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useT } from '../i18n/useT';
import '../components/FeaturePage.css';
import '../components/MobileFeaturePage.css';

import imgVector from '../assets/pm-vector.svg';
import imgCircle from '../assets/circle-pm.svg';

import imgMagento from '../assets/graphics/customers/acquiring/modules/magento.svg';
import imgWooCommerce from '../assets/graphics/customers/acquiring/modules/woocommerce.svg';
import imgOpenCard from '../assets/graphics/customers/acquiring/modules/opencard.svg';
import imgPrestShop from '../assets/graphics/customers/acquiring/modules/prestshop.svg';

const heroBg = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 1696 456' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/%3E%3Cdefs%3E%3CradialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-30 39.071 -76 -15.423 1148 228.26)'%3E%3Cstop stop-color='rgba(34,132,155,0.2)' offset='0'/%3E%3Cstop stop-color='rgba(34,132,155,0)' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E"), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

const heroBgMobile = `linear-gradient(44.5deg, rgb(4,67,82) 0%, rgba(4,67,82,0) 100%), linear-gradient(90deg, rgb(4,67,82) 0%, rgb(4,67,82) 100%)`;

// Plugin titles & URLs are not translatable.
const modules = [
  { title: 'Magento',     sub: 'Dinaro Plugin', href: 'https://gate.paywiser.eu/apis/plugins/Magento%20v2.0+',    logo: imgMagento },
  { title: 'WooCommerce', sub: 'Dinaro Plugin', href: 'https://gate.paywiser.eu/apis/plugins/WooCommerce%20v3.5+', logo: imgWooCommerce },
  { title: 'OpenCard',    sub: 'Dinaro Plugin', href: 'https://gate.paywiser.eu/apis/plugins/OpenCart%20v3.0+',     logo: imgOpenCard },
  { title: 'PrestShop',   sub: 'Dinaro Plugin', href: 'https://gate.paywiser.eu/apis/plugins/PrestaShop%20v1.7+',   logo: imgPrestShop },
];

function ModuleCard({ title, sub, href, logo, instructionsLabel }) {
  return (
    <div className="card pm__module-card">
      <div
        className="pm__module-thumb"
        style={logo ? { backgroundImage: `url(${logo})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : undefined}
      />
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

export default function PaymentModules() {
  const navigate = useNavigate();
  const bp = useBreakpoint();
  const t = useT();
  const instructionsLabel = t('paymentModules.instructions');

  if (bp === 'mobile' || bp === 'tablet') {
    return (
      <div className="mobile-page">
        <Navbar />
        <div className="mobile-page__hero" style={{ backgroundImage: heroBgMobile }}>
          <p className="mobile-page__hero-title">{t('paymentModules.heroTitle')}</p>
          <p className="mobile-page__hero-subtitle">{t('paymentModules.heroSubtitle')}</p>
        </div>
        <div className="pm__mobile-modules">
          {modules.map(({ title, sub, href }) => (
            <div key={title} className="card pm__mobile-module-card">
              <div className="pm__mobile-module-info">
                <p className="pm__mobile-module-title">{title}</p>
                <p className="pm__mobile-module-sub">{sub}</p>
              </div>
              <button type="button" className="pm__mobile-module-btn" onClick={() => window.open(href, '_blank')}>
                {instructionsLabel}
              </button>
            </div>
          ))}
        </div>
        <div className="mobile-page__cta" style={{ backgroundImage: ctaBg }}>
          <p className="mobile-page__cta-title">{t('paymentModules.ctaTitle')}</p>
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
          <p className="fp__hero-title">{t('paymentModules.heroTitle')}</p>
        </div>
      </div>

      <div className="pm__modules-grid">
        {modules.map(({ title, sub, href, logo }) => (
          <ModuleCard key={title} title={title} sub={sub} href={href} logo={logo} instructionsLabel={instructionsLabel} />
        ))}
      </div>

      <div className="fp__cta" style={{ backgroundImage: ctaBg }}>
        <p className="fp__cta-title">{t('paymentModules.ctaTitle')}</p>
        <button type="button" className="fp__cta-btn" onClick={() => navigate('/contact')}>
          <p className="fp__cta-btn-label">{t('common.contactUs')}</p>
        </button>
      </div>

      <Footer />
    </div>
  );
}
