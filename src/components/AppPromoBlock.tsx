import { apkDownloadUrl } from '../lib/native';
import { publicPath } from '../lib/paths';
import { Reveal } from './Reveal';

const APP_FEATURES = [
  { title: 'Bots on the go', text: 'Create, publish, and manage chatbots from your phone' },
  { title: 'Test answers', text: 'ChatGPT-style workspace with your knowledge base' },
  { title: 'Analytics', text: 'Track widget questions and in-app usage' },
  { title: 'Native UX', text: 'Bottom tabs, safe areas, and hardware back support' },
];

const PHONE_MOCKUP = publicPath('marketing/app-phone-mockup.png');

function AndroidIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.41c.01.08.02.17.02.25 0 .55-.45 1-1 1s-1-.45-1-1c0-.08.01-.16.02-.24l-.97-.68C11.34 2.08 10.71 2 10.08 2 9.45 2 8.82 2.08 8.4 2.41l-.97.68c.01.08.02.16.02.24 0 .55-.45 1-1 1s-1-.45-1-1c0-.09.01-.17.02-.25l-1.04-.73C3.64 1.64 2 3.52 2 5.75V6h20v-.25c0-2.23-1.64-4.11-3.83-4.98l-1.04.73z" />
    </svg>
  );
}

function PhoneMockup() {
  return (
    <figure className="app-promo-device" aria-label="KnowEmbed Android app — bots dashboard">
      <img
        className="app-promo-device__mockup"
        src={PHONE_MOCKUP}
        alt="KnowEmbed on Android — dashboard with bots, analytics, and upgrade tabs"
        width={600}
        height={1296}
        loading="lazy"
        decoding="async"
      />
    </figure>
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
