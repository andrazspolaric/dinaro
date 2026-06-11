import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useT } from '../i18n/useT';
import '../components/FeaturePage.css';

export default function NotFound() {
  const navigate = useNavigate();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile' || bp === 'tablet';
  const t = useT();
  return (
    <div className={`not-found${isMobile ? ' not-found--mobile' : ''}`}>
      <Navbar />
      <div className="not-found__content">
        <p className="not-found__code">{t('notFound.code')}</p>
        <p className="not-found__title">{t('notFound.title')}</p>
        <p className="not-found__body">{t('notFound.body')}</p>
        <button type="button" className="not-found__btn" onClick={() => navigate('/')}>
          {t('notFound.home')}
        </button>
      </div>
    </div>
  );
}
