import { PhoneDeviceFrame } from './PhoneDeviceFrame';
import { apkDownloadUrl } from '../lib/native';
import { publicPath } from '../lib/paths';
import { Reveal } from './Reveal';

const APP_FEATURES = [
  'Bots on the go',
  'Test answers',
  'Analytics',
  'Native UX',
];

const APP_SCREEN = publicPath('marketing/app-admin-mobile.png');

function AndroidIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.523 15.3414c-.5511 0-.9993-.4482-.9993-.9993s.4482-.9993.9993-.9993.9993.4482.9993.9993-.4482.9993-.9993.9993m-11.046 0c-.5511 0-.9993-.4482-.9993-.9993s.4482-.9993.9993-.9993.9993.4482.9993.9993-.4482.9993-.9993.9993m11.4045-6.02L18.8845 5.864a.416.416 0 0 0-.152-.567.416.416 0 0 0-.567.152l-2.022 3.503C15.5902 8.411 13.853 7.871 12 7.871s-3.5902.54-5.136 1.778L4.842 6.146a.416.416 0 0 0-.567-.152.416.416 0 0 0-.152.567l1.997 3.457C2.688 11.186.343 14.658 0 18.761h24c-.343-4.103-2.688-7.575-6.119-9.44" />
    </svg>
  );
}

export function AppPromoBlock() {
  const downloadHref = apkDownloadUrl();

  return (
    <Reveal delay={100}>
      <section className="app-promo app-promo--showcase" aria-labelledby="app-promo-heading">
        <div className="app-promo-copy">
          <p className="eyebrow">Android app</p>
          <h2 id="app-promo-heading">Manage your chatbots from your phone</h2>
          <p className="app-promo-lead">
            Same admin workspace on Android — bots, docs, chat, analytics, billing
          </p>
          <ul className="app-promo-features">
            {APP_FEATURES.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
          <div className="app-promo-actions">
            <a href={downloadHref} className="btn btn-primary btn-lg app-promo-download" download>
              <AndroidIcon />
              Download APK
            </a>
            <p className="muted app-promo-note">Direct install · Android 8+</p>
          </div>
        </div>
        <div className="app-promo-visual" aria-hidden="true">
          <PhoneDeviceFrame
            className="app-promo-phone phone-device--showcase"
            src={APP_SCREEN}
            alt=""
          />
        </div>
      </section>
    </Reveal>
  );
}
