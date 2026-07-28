import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="landing">
        <section className="hero-block">
          <p className="eyebrow">Docs → chatbot → embed</p>
          <h1>Turn company knowledge into an embeddable AI assistant.</h1>
          <p className="lead">
            Upload docs, test answers in a ChatGPT-like workspace, paste one script on your site.
            Built as a launch-ready MVP for support and lead qualification.
          </p>
          <div className="hero-actions">
            <Link to="/app" className="btn btn-primary">
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
            <p>Drop FAQ, pricing, policies, onboarding docs. We chunk and index them for answers.</p>
          </article>
          <article className="feature-card">
            <h2>Chat inside the app</h2>
            <p>Validate answers before going live — same experience your website visitors will get.</p>
          </article>
          <article className="feature-card">
            <h2>Embed anywhere</h2>
            <p>Copy one script tag. Widget loads your published bot bundle from a static JSON endpoint.</p>
          </article>
        </section>

        <section className="cta-band">
          <h2>Ready for a real launch workflow</h2>
          <p>Starter is free. Pro removes branding and raises limits. Stripe test checkout included.</p>
          <Link to="/login" className="btn btn-primary">
            Create account
          </Link>
        </section>
      </main>
    </>
  );
}
