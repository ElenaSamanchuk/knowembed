import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { PLANS } from '../lib/plans';

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="landing">
        <section className="hero-block">
          <p className="eyebrow">Docs → chatbot → embed</p>
          <h1>Turn company knowledge into an embeddable AI assistant.</h1>
          <p className="lead">
            Upload FAQ and policies to Supabase, test answers in a ChatGPT-like workspace,
            publish one script tag for your website. Built as a launch-ready MVP.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">
              Start free
            </Link>
            <Link to="/pricing" className="btn btn-ghost">
              View pricing
            </Link>
          </div>
        </section>

        <section className="feature-grid">
          <article className="feature-card">
            <h2>Upload knowledge</h2>
            <p>Drop FAQ, pricing, policies (.txt / .md). Chunks are stored in Postgres and indexed for search.</p>
          </article>
          <article className="feature-card">
            <h2>Chat inside the app</h2>
            <p>Validate answers before going live — Groq LLM with your doc context (real RAG pipeline).</p>
          </article>
          <article className="feature-card">
            <h2>Embed anywhere</h2>
            <p>Copy one script tag. Widget calls Supabase Edge Functions — same answers as in-app chat.</p>
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
          <h2>Written walkthrough instead of video</h2>
          <p>
            Full demo guide with screenshots: signup → upload → chat → publish → embed widget → pricing.
          </p>
          <div className="hero-actions">
            <Link to="/docs/demo.html" className="btn btn-ghost">
              Read demo guide
            </Link>
            <Link to="/login" className="btn btn-primary">
              Create account
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
