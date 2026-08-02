import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { publicPath } from '../lib/paths';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

type GuideStep = {
  title: string;
  body: string;
  result: string;
  shot: string;
};

const STEPS: GuideStep[] = [
  {
    title: 'Create your account',
    body: 'Go to Sign up, enter email and password (at least 6 characters), and click Create account',
    result: 'You land on the Dashboard with a ready-made Store Assistant bot',
    shot: 'docs/screenshots/02-signup.png',
  },
  {
    title: 'Add knowledge to your bot',
    body: 'Open Store Assistant from the dashboard. Upload your own .txt, .md, or PDF — or click Re-index demo FAQ to load the sample store FAQ',
    result: 'Your documents appear in the list and the chat input becomes active',
    shot: 'docs/screenshots/03-knowledge.png',
  },
  {
    title: 'Test answers in the app',
    body: 'In Test chat, ask questions your customers would ask — for example “How long is shipping?” or “What is the return policy?”',
    result: 'The bot replies using your uploaded content, not generic AI guesses',
    shot: 'docs/screenshots/04-chat.png',
  },
  {
    title: 'Customize and publish',
    body: 'Set bot name, welcome message, and theme color in Settings. Click Publish bot, then Copy embed to grab the script snippet',
    result: 'Your bot gets a public id and is ready to embed on any website',
    shot: 'docs/screenshots/05-publish.png',
  },
  {
    title: 'Embed on your site',
    body: 'Paste the snippet before </body> on your site. To preview, open the embed demo — the chat launcher appears bottom-right',
    result: 'Visitors get the same answers as in your workspace; Starter plans show a small KnowEmbed badge',
    shot: 'docs/screenshots/06-embed.png',
  },
  {
    title: 'Track usage and upgrade',
    body: 'Open Analytics to see questions from in-app chat and the widget. On Pricing, upgrade to Pro for more bots, docs, and a white-label widget',
    result: 'Pro unlocks higher limits; Stripe test checkout uses card 4242 4242 4242 4242',
    shot: 'docs/screenshots/07-stripe.png',
  },
];

function Shot({ alt, src }: { alt: string; src: string }) {
  return (
    <figure className="guide-shot">
      <img className="guide-shot-img" src={src} alt={alt} loading="lazy" width={800} height={450} />
    </figure>
  );
}

export function DemoGuidePage() {
  return (
    <>
      <PageMeta
        title="User guide"
        description="How to use KnowEmbed: sign up, upload docs, test AI chat, publish your bot, embed it on your site, and upgrade your plan."
        path="/guide"
      />
      <SiteHeader />
      <main className="page-shell guide-page">
        <header className="page-heading page-heading--spaced">
          <p className="eyebrow">User guide</p>
          <h1>How to use KnowEmbed</h1>
          <p className="lead lead--spaced">
            Step-by-step instructions from first sign-up to a live embed on your site — with screenshots
            at each stage
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary">
              Create account
            </Link>
            <Link to="/app" className="btn btn-ghost">
              Open dashboard
            </Link>
            <a href={publicPath('embed-demo.html')} className="btn btn-ghost">
              See embed demo
            </a>
          </div>
        </header>

        <section className="panel-card stack guide-meta">
          <h2>Before you start</h2>
          <ul className="guide-checklist muted">
            <li>Free Starter plan — no credit card</li>
            <li>One bot, up to 3 documents, 50 AI answers per month</li>
            <li>Demo bot Store Assistant is created automatically when you sign up</li>
          </ul>
        </section>

        <ol className="guide-steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="panel-card guide-step">
              <p className="eyebrow">Step {index + 1}</p>
              <h2>{step.title}</h2>
              <p>{step.body}</p>
              <p className="guide-expected">
                <strong>You should see:</strong> {step.result}
              </p>
              <Shot alt={step.title} src={publicPath(step.shot)} />
            </li>
          ))}
        </ol>

        <section className="panel-card stack guide-help">
          <h2>Need help?</h2>
          <p className="muted">
            Check plan limits on the dashboard usage strip. If chat is disabled, make sure documents
            are indexed or you have not reached your monthly answer limit
          </p>
          <div className="hero-actions">
            <Link to="/pricing" className="btn btn-ghost">
              View pricing
            </Link>
            <Link to="/login" className="btn btn-ghost">
              Sign in
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
