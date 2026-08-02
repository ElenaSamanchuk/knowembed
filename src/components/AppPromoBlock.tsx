import { apkDownloadUrl } from '../lib/native';
import { Reveal } from './Reveal';

const APP_FEATURES = [
  { title: 'Bots on the go', text: 'Create, publish, and manage chatbots from your phone' },
  { title: 'Test answers', text: 'ChatGPT-style workspace with your knowledge base' },
  { title: 'Analytics', text: 'Track widget questions and in-app usage' },
  { title: 'Native UX', text: 'Bottom tabs, safe areas, and hardware back support' },
];

function AndroidIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.6 9.5h1.4a1 1 0 0 1 1 1v7.2a1.4 1.4 0 0 1-1.4 1.4h-1.4V9.5Zm-12 0H4.2A1.4 1.4 0 0 0 2.8 10.9v7.2a1 1 0 0 0 1 1h1.4V9.5Zm2.2-3.2 1-1.8a.35.35 0 0 1 .6 0l1 1.8a6.8 6.8 0 0 1 4.8 0l1-1.8a.35.35 0 0 1 .6 0l1 1.8a6.9 6.9 0 0 1 3.2 5.8H6.6a6.9 6.9 0 0 1 3.2-5.8Z" />
    </svg>
  );
}

function PhoneMockup() {
  return (
    <div className="app-promo-phone" aria-hidden="true">
      <div className="app-promo-phone-notch" />
      <div className="app-promo-phone-screen">
        <div className="app-promo-phone-topbar">
          <span>KnowEmbed</span>
          <span className="app-promo-phone-badge">Pro</span>
        </div>
        <div className="app-promo-phone-card">
          <p className="app-promo-phone-label">Your bots</p>
          <strong>Still Store Support</strong>
          <span className="app-promo-phone-pill">Published</span>
        </div>
        <div className="app-promo-phone-card app-promo-phone-card--muted">
          <p className="app-promo-phone-label">Draft</p>
          <strong>FAQ Assistant</strong>
        </div>
        <div className="app-promo-phone-tabbar">
          <span className="active">Bots</span>
          <span>Analytics</span>
          <span>Upgrade</span>
        </div>
      </div>
    </div>
  );
}

export function AppPromoBlock() {
  const downloadHref = apkDownloadUrl();

  return (
    <Reveal delay={100}>
      <section className="app-promo" aria-labelledby="app-promo-heading">
        <div className="app-promo-copy">
          <p className="eyebrow">Android app</p>
          <h2 id="app-promo-heading">Manage your chatbots from your phone</h2>
          <p className="section-lead app-promo-lead">
            Native Android app with the same admin workspace — bots, knowledge upload, test chat,
            analytics, and billing. Built with Capacitor for a polished mobile UX
          </p>
          <ul className="app-promo-features">
            {APP_FEATURES.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <div className="app-promo-actions">
            <a href={downloadHref} className="btn btn-primary btn-lg app-promo-download" download>
              <AndroidIcon />
              Download APK
            </a>
            <p className="muted app-promo-note">
              Direct install · Android 8+ · No Play Store required
            </p>
          </div>
        </div>
        <PhoneMockup />
      </section>
    </Reveal>
  );
}
