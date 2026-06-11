import { useNavigate } from 'react-router-dom';
import { ctaBg } from '../shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useBreakpoint } from '../hooks/useBreakpoint';
import '../components/FeaturePage.css';
import '../components/MobileFeaturePage.css';

import imgVector from '../assets/privacy-vector.svg';

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

function ContactRow({ label, value }) {
  return (
    <div className="complaints__contact-info-row">
      <div className="complaints__contact-info-icon" />
      <div className="complaints__contact-info-body">
        <p className="complaints__contact-info-label">{label}</p>
        <p className="complaints__contact-info-value">{value}</p>
      </div>
    </div>
  );
}

export default function Complaints() {
  const navigate = useNavigate();
  const bp = useBreakpoint();

  if (bp === 'mobile' || bp === 'tablet') {
    return (
      <div className="mobile-page">
        <Navbar />
        <div className="mobile-page__hero" style={{ backgroundImage: heroBgMobile }}>
          <p className="mobile-page__hero-title">Complaints</p>
          <p className="mobile-page__hero-subtitle">We did not meet your expectation?</p>
        </div>
        <div className="complaints__mobile-cards">
          <div className="card complaints__mobile-card">
            <p className="complaints__mobile-card-title">Submit a Complaint</p>
            <p className="complaints__mobile-card-text">Please send your complaint to us in writing via one of the following methods:</p>
            <ContactRow label="By Post" value="Dinaro d.o.o., Complaints Dept., Bravničarjeva ulica 13, 1000 Ljubljana, Slovenia" />
            <ContactRow label="By Email" value="complaints.eu@dinaro.eu" />
            <p className="complaints__mobile-footnote">
              The full appeal procedure is described in our{' '}
              <button type="button" onClick={() => navigate('/terms')} className="complaints__terms-link">
                Terms &amp; Conditions
              </button>.
            </p>
          </div>
          <div className="card complaints__mobile-card">
            <p className="complaints__mobile-card-title">How to file a complaint?</p>
            <p className="complaints__mobile-card-text">We will carefully investigate it and reach out directly via email if we need more information.</p>
            <p className="complaints__include-label">Please include:</p>
            <div className="complaints__bullet-list">
              {[
                'Your name, address, and email address;',
                'Description of the event and date it occurred;',
                'Any evidence supporting your claim;',
                'Your specific claim or request.',
              ].map(text => <Bullet key={text}>{text}</Bullet>)}
            </div>
          </div>
          <div className="card complaints__mobile-card">
            <p className="complaints__mobile-card-title">How long does it take?</p>
            <p className="complaints__mobile-card-text">
              Payment-related complaints resolved within <strong>15 business days</strong> (PSD2). Up to <strong>35 business days</strong> in complex cases.
            </p>
          </div>
          <div className="card complaints__mobile-card">
            <p className="complaints__mobile-card-title">Unhappy with the outcome?</p>
            <p className="complaints__mobile-card-text">
              File an initiative with Attorney Simona Goriup or contact the supervisory authority: <strong>Banka Slovenije</strong>, Slovenska 35, 1505 Ljubljana.
            </p>
          </div>
        </div>
        <div className="mobile-page__cta" style={{ backgroundImage: ctaBg }}>
          <p className="mobile-page__cta-title">Do you have questions?</p>
          <button type="button" className="mobile-page__cta-btn" onClick={() => navigate('/contact')}>
            Contact Us
          </button>
        </div>
        <div className="mobile-page__footer">
          <p className="mobile-page__footer-copy">© 2026 Dinaro. All Rights Reserved.</p>
          <div className="mobile-page__footer-links">
            {[
              { label: 'Terms & Conditions', href: '/terms' },
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Complaints', href: '/complaints' },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="mobile-page__footer-link">{label}</a>
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
          <p className="fp__hero-title">Complaints</p>
        </div>
      </div>

      <div className="complaints__content">
        {/* Submit card */}
        <div className="card complaints__card">
          <p className="complaints__heading">We did not meet your expectation?</p>
          <p className="complaints__lead">Please send your complaint to us in writing via one of the following methods:</p>
          <div className="complaints__contact-row">
            <div className="complaints__contact-col">
              <ContactRow label="By Post" value="Dinaro d.o.o., Complaints Dept., Bravničarjeva ulica 13, 1000 Ljubljana, Slovenia" />
            </div>
            <div className="complaints__contact-col--fixed">
              <ContactRow label="By Email" value="complaints.eu@dinaro.eu" />
            </div>
          </div>
          <p className="complaints__footnote">
            The full appeal procedure is described in our{' '}
            <button type="button" onClick={() => navigate('/terms')} className="complaints__terms-link">
              Terms &amp; Conditions
            </button>.
			  <br/>Dinaro will process the data included in your complaint to contact you and manage your case.
          </p>
        </div>

        {/* Two-column lower section */}
        <div className="complaints__two-col">
          <div className="complaints__left-col">
            <div className="card complaints__card">
              <p className="complaints__subheading">How to file a complaint?</p>
              <p className="complaints__text">We're sorry that you wish to raise a complaint. We will carefully investigate it and reach out directly via email if we need more information.</p>
              <p className="complaints__text">Our Customer Support will respond as soon as possible and at the latest within the statutory deadline.</p>
              <p className="complaints__include-label">Please include the following with your complaint:</p>
              <div className="complaints__bullet-list">
                <Bullet>Your name, surname, address, e-mail address and telephone number (or title and registered office if a legal entity);</Bullet>
                <Bullet>Description of the event, key facts, and the date it occurred;</Bullet>
                <Bullet>Any evidence supporting your claim, if available;</Bullet>
                <Bullet>Your specific claim or request, if relevant.</Bullet>
              </div>
              <p className="complaints__footnote-sm">
                Requests to rectify payment transaction errors are handled under the General Terms and Conditions of each product or service in force at the time.
              </p>
            </div>
          </div>

          <div className="complaints__right-col">
            <div className="card complaints__card">
              <p className="complaints__subheading">How long does it take to handle a complaint?</p>
              <p className="complaints__text">
                All complaints concerning payment services - such as transfers and card transactions - will be resolved within <strong>15 business days</strong>, per the European Payment Services Directive II (PSD2).
              </p>
              <p className="complaints__text">
                If we need more time to assess your complaint, we will let you know, but we must provide our final response within <strong>35 business days</strong>.
              </p>
              <p className="complaints__text">
                Should we not receive a requested response from you, we may close your complaint. If you contact us again after this, we will open a new file with a new reference number.
              </p>
            </div>

            <div className="card complaints__card">
              <p className="complaints__subheading">Unhappy with the outcome?</p>
              <p className="complaints__text">
                If you are not satisfied with our findings, you can file an initiative for out-of-court settlement of consumer disputes at Attorney Simona Goriup (Miklošičeva cesta 26, 1000 Ljubljana,{' '}
                <a href="https://www.goriup.si" target="_blank" rel="noopener noreferrer" style={{ color: '#044352' }}>www.goriup.si</a>).
              </p>
              <p className="complaints__text">
                You may also seek further advice from independent third parties or the supervisory authority: <strong>Banka Slovenije, Slovenska 35, 1505 Ljubljana, Slovenia</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fp__cta fp__cta--legal" style={{ backgroundImage: ctaBg }}>
        <p className="fp__cta-title">Do you have questions?</p>
        <button type="button" className="fp__cta-btn" onClick={() => navigate('/contact')}>
          <p className="fp__cta-btn-label">Contact Us</p>
        </button>
      </div>

      <Footer />
    </div>
  );
}
