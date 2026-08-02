import { Link } from 'react-router-dom';
import { FaqAccordion } from '../components/FaqAccordion';
import { PageMeta } from '../components/PageMeta';
import { Reveal } from '../components/Reveal';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { publicPath } from '../lib/paths';
import { PLANS } from '../lib/plans';

const STEPS = [
  { n: '01', title: 'Upload your docs', text: 'FAQ, policies, PDFs — indexed for AI search' },
  { n: '02', title: 'Test answers', text: 'ChatGPT-style workspace powered by your content' },
  { n: '03', title: 'Embed in one line', text: 'Shadow DOM widget — no layout conflicts' },
];

const FEATURES = [
  {
    title: 'Answers from your content',
    text: 'RAG over Postgres chunks — no hallucinated policies or prices',
  },
  {
    title: 'PDF & markdown upload',
    text: 'Drop knowledge files; optional vector search when embeddings are enabled',
  },
  {
    title: 'Stripe-ready billing',
    text: 'Starter free forever. Pro unlocks more bots, docs, and white-label widget',
  },
  {
    title: 'Analytics built in',
    text: 'Track questions, answers, and widget usage from the dashboard',
  },
  {
    title: 'Secure by default',
    text: 'Supabase Auth, row-level security, and server-side plan limits',
  },
  {
    title: 'Works on any site',
    text: 'One script tag. Isolated styles. Mobile-friendly chat launcher',
  },
];

const USE_CASES = [
  { title: 'E-commerce', text: 'Shipping, returns, sizing — answered before checkout support' },
  { title: 'SaaS help', text: 'Onboarding and billing FAQs without opening a ticket' },
  { title: 'Agencies', text: 'Ship a branded bot for each client from one workspace' },
];

const FAQ = [
  {
    q: 'Do I need a credit card to start?',
    a: 'No. Starter is free — create an account, upload docs, and embed your first bot',
  },
  {
    q: 'What file types can I upload?',
    a: 'Markdown and plain text today, plus PDF upload in the workspace. Content is chunked and stored in Supabase',
  },
  {
    q: 'How does embedding work?',
    a: 'Publish your bot, copy a short script snippet, and paste it before </body> on any site',
  },
  {
    q: 'Is this a mock UI?',
    a: 'No — real auth, database, AI answers, Stripe checkout, and a live widget backed by Edge Functions',
  },
];

export function LandingPage() {
  return (
    <>
      <PageMeta
        title="Embeddable AI chatbot from your docs"
        description="KnowEmbed turns FAQs and docs into an embeddable AI support widget. Upload knowledge, test chat, publish to any site — free Starter plan."
        path="/"
      />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="landing">
        <Reveal>
          <section className="hero-block hero-block--mvp">
            <div className="hero-copy">
              <p className="mvp-badge">Docs → chatbot → embed</p>
              <h1>
                Turn your docs into an AI bot{' '}
                <span className="gradient-text">your customers can embed</span>
              </h1>
              <p className="lead lead--spaced">
                Answer FAQs 24/7 from your own knowledge base. Upload content, preview answers in-app,
                then drop a lightweight widget on any website — one script tag
              </p>
              <div className="stack-badges" aria-label="Tech stack">
                <span>Supabase</span>
                <span>Groq AI</span>
                <span>Stripe</span>
                <span>Edge Functions</span>
              </div>
              <div className="hero-actions">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Start free
                </Link>
                <Link to="/pricing" className="btn btn-ghost btn-lg">
                  View pricing
                </Link>
                <a href={publicPath('embed-demo.html')} className="btn btn-ghost btn-lg">
                  See live demo
                </a>
              </div>
            </div>
            <div className="hero-panel panel-card">
              <p className="eyebrow">How it works</p>
              <ol className="pipeline-list">
                {STEPS.map((step) => (
                  <li key={step.n}>
                    <span className="pipeline-num">{step.n}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p className="muted">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section className="use-cases" aria-labelledby="use-cases-heading">
            <h2 id="use-cases-heading" className="section-title">
              Built for teams who answer the same questions daily
            </h2>
            <div className="use-case-grid">
              {USE_CASES.map((item) => (
                <article key={item.title} className="use-case-card">
                  <h3>{item.title}</h3>
                  <p className="muted">{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={120}>
          <section className="feature-grid feature-grid--six" aria-labelledby="features-heading">
            <h2 id="features-heading" className="section-title section-title--full">
              Everything you need to ship — not a slide deck
            </h2>
            {FEATURES.map((feature) => (
              <article key={feature.title} className="feature-card">
                <h3>{feature.title}</h3>
                <p className="muted">{feature.text}</p>
              </article>
            ))}
          </section>
        </Reveal>

        <Reveal delay={160}>
          <section className="pricing-section" aria-labelledby="pricing-heading">
            <h2 id="pricing-heading" className="section-title">
              Simple pricing
            </h2>
            <p className="lead section-lead section-lead--spaced">
              Start free. Upgrade when you need more bots and white-label embed
            </p>
            <div className="pricing-grid landing-pricing">
              {Object.values(PLANS).map((plan) => (
                <article
                  key={plan.id}
                  className={`price-card ${plan.id === 'pro' ? 'price-card--featured' : ''}`}
                >
                  <h3>{plan.name}</h3>
                  <p className="price-value">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    {plan.price > 0 ? <span> / month</span> : null}
                  </p>
                  <ul>
                    {plan.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Link
                    to={plan.id === 'pro' ? '/pricing' : '/signup'}
                    className="btn btn-primary btn-block"
                  >
                    {plan.id === 'pro' ? 'See Pro details' : 'Get started free'}
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={200}>
          <section className="faq-section" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="section-title">
              Frequently asked questions
            </h2>
            <FaqAccordion items={FAQ} />
          </section>
        </Reveal>

        <Reveal delay={240}>
          <section className="cta-band">
          <h2>See how it works — step by step</h2>
          <p>User guide with screenshots: sign up, upload docs, test chat, embed, and upgrade</p>
          <div className="hero-actions cta-band-actions">
            <Link to="/guide" className="btn btn-ghost btn-lg cta-ghost">
              Read user guide
            </Link>
              <Link to="/signup" className="btn btn-primary btn-lg cta-primary">
                Create account
              </Link>
            </div>
          </section>
        </Reveal>
      </main>
      <SiteFooter />
    </>
  );
}
