import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { PLANS } from '../lib/plans';

const STEPS = [
  { n: '01', title: 'Upload docs', text: 'FAQ, pricing, policies → Postgres chunks' },
  { n: '02', title: 'Test with AI', text: 'ChatGPT-like workspace, Groq LLM + your context' },
  { n: '03', title: 'Embed on site', text: 'One script tag, Shadow DOM widget' },
];

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="landing">
        <section className="hero-block hero-block--mvp">
          <div className="hero-copy">
            <p className="mvp-badge">Launch-ready MVP · not a mockup</p>
            <p className="eyebrow">Docs → chatbot → embed</p>
            <h1>
              Ship an AI support bot{' '}
              <span className="gradient-text">your customers can embed.</span>
            </h1>
            <p className="lead lead--spaced">
              KnowEmbed turns your docs into an embeddable AI assistant — Supabase backend, RAG chat,
              Stripe billing, and a Shadow DOM widget you can drop on any site.
            </p>
            <div className="stack-badges">
              <span>Supabase</span>
              <span>Groq AI</span>
              <span>Stripe</span>
              <span>Edge Functions</span>
            </div>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">
                Start free
              </Link>
              <Link to="/pricing" className="btn btn-ghost btn-lg">
                View pricing
              </Link>
            </div>
          </div>
          <div className="hero-panel panel-card">
            <p className="eyebrow">Live pipeline</p>
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

        <section className="feature-grid">
          <article className="feature-card">
            <h2>Real database</h2>
            <p>Auth, bots, documents, chunks in Supabase Postgres with RLS — not localStorage.</p>
          </article>
          <article className="feature-card">
            <h2>Real AI</h2>
            <p>Retrieve chunks from DB, generate answers with Groq Llama 3.3 (free tier).</p>
          </article>
          <article className="feature-card">
            <h2>Real billing</h2>
            <p>Stripe Checkout test mode for Pro. Limits enforced server-side.</p>
          </article>
        </section>

        <section className="pricing-grid landing-pricing">
          {Object.values(PLANS).map((plan) => (
            <article key={plan.id} className={`price-card ${plan.id === 'pro' ? 'price-card--featured' : ''}`}>
              <h2>{plan.name}</h2>
              <p className="price-value">
                {plan.price === 0 ? 'Free' : `$${plan.price}`}
                {plan.price > 0 ? <span> / month</span> : null}
              </p>
              <ul>
                {plan.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="cta-band">
          <h2>Full written walkthrough — no video required</h2>
          <p>Step-by-step guide with screenshots for Paralect review and your portfolio.</p>
          <div className="hero-actions cta-band-actions">
            <Link to="/guide" className="btn btn-ghost btn-lg cta-ghost">
              Read demo guide
            </Link>
            <Link to="/login" className="btn btn-primary btn-lg cta-primary">
              Create account
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
