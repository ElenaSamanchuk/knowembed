import { Link } from 'react-router-dom';
import { publicPath } from '../lib/paths';
import { SiteHeader } from '../components/SiteHeader';

type GuideStep = {
  title: string;
  body: string;
  expected: string;
  shot: string;
};

const STEPS: GuideStep[] = [
  {
    title: 'Landing & pricing',
    body: 'Open the marketing site. Confirm hero, MVP badge, feature cards, and Starter / Pro plans.',
    expected: 'Clear value prop; links to Sign in and Pricing work.',
    shot: '/docs/screenshots/01-landing.png',
  },
  {
    title: 'Create account',
    body: 'Sign up with email + password (min 6 chars). Supabase auth creates your profile.',
    expected: 'Redirect to Dashboard with seeded Store Assistant bot.',
    shot: '/docs/screenshots/02-signup.png',
  },
  {
    title: 'Index knowledge',
    body: 'Open Store Assistant. If chat is locked, click Re-index demo FAQ. Confirm acme-faq.md.',
    expected: 'Chunks stored in Postgres; chat input enabled.',
    shot: '/docs/screenshots/03-knowledge.png',
  },
  {
    title: 'Test in-app chat',
    body: 'Ask: “How long is shipping?” and “What is the return policy?”',
    expected: 'Groq answers from FAQ context (3–5 days shipping, 30-day returns).',
    shot: '/docs/screenshots/04-chat.png',
  },
  {
    title: 'Publish bot',
    body: 'Click Publish bot. Copy embed snippet from workspace.',
    expected: 'public_id demo-store-assistant available for widget.',
    shot: '/docs/screenshots/05-publish.png',
  },
  {
    title: 'Embed widget',
    body: 'Open /embed-demo.html — chat launcher bottom-right on a sample store page.',
    expected: 'Same answers as in-app; Powered by KnowEmbed on Starter.',
    shot: '/docs/screenshots/06-embed.png',
  },
  {
    title: 'Upgrade with Stripe',
    body: 'Pricing → Upgrade to Pro → Stripe Checkout (test card 4242…). Webhook sets plan in DB.',
    expected: 'Pro limits + no widget branding after re-publish.',
    shot: '/docs/screenshots/07-stripe.png',
  },
];

function Shot({ alt, src }: { alt: string; src: string }) {
  return (
    <figure className="guide-shot">
      <img className="guide-shot-img" src={src} alt={alt} loading="lazy" />
    </figure>
  );
}

export function DemoGuidePage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell guide-page">
        <header className="page-heading page-heading--spaced">
          <p className="eyebrow">Paralect deliverable</p>
          <h1>Demo guide</h1>
          <p className="lead lead--spaced">
            Written walkthrough with expected results and screenshots from the live demo flow.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">
              Start demo
            </Link>
            <a href={publicPath('embed-demo.html')} className="btn btn-ghost">
              Open embed demo
            </a>
            <a href={publicPath('case.html')} className="btn btn-ghost">
              Portfolio case
            </a>
          </div>
        </header>

        <section className="panel-card stack guide-meta">
          <h2>Stack</h2>
          <p className="muted">
            Supabase Auth + Postgres · Edge Functions · Groq LLM · Stripe Checkout (test) · React app · Shadow DOM widget
          </p>
        </section>

        <ol className="guide-steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="panel-card guide-step">
              <p className="eyebrow">Step {index + 1}</p>
              <h2>{step.title}</h2>
              <p>{step.body}</p>
              <p className="guide-expected">
                <strong>Expected:</strong> {step.expected}
              </p>
              <Shot alt={step.title} src={step.shot} />
            </li>
          ))}
        </ol>

        <section className="panel-card stack">
          <h2>Portfolio angle</h2>
          <p>
            Position as <strong>full-stack MVP</strong>: backend (Supabase + Edge Functions), AI integration (RAG + Groq),
            payments (Stripe webhooks), embeddable widget, PDF ingest, pgvector search, and analytics.
          </p>
        </section>
      </main>
    </>
  );
}
