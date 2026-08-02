import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { FaqAccordion } from '../components/FaqAccordion';
import { PageMeta } from '../components/PageMeta';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { useAuth } from '../context/AuthProvider';
import { createCheckoutSession } from '../lib/api';
import { isNativeApp } from '../lib/native';
import { appOrigin } from '../lib/paths';
import { PLANS } from '../lib/plans';

const FAQ = [
  {
    q: 'What happens on Starter?',
    a: 'You get one bot, three docs, and 50 answers per month — enough to validate the full embed flow',
  },
  {
    q: 'Can I cancel Pro anytime?',
    a: 'Yes. Billing runs through Stripe; downgrade when your subscription period ends',
  },
  {
    q: 'Are limits enforced?',
    a: 'Yes — bots, documents, and monthly answers are checked server-side in Edge Functions',
  },
];

function PricingContent({
  error,
  busy,
  onCheckout,
}: {
  error: string;
  busy: boolean;
  onCheckout: (plan: 'starter' | 'pro') => void;
}) {
  return (
    <>
      <header className="page-heading page-heading--spaced">
        <p className="eyebrow">Pricing</p>
        <h1>Start free. Scale when embed traffic grows</h1>
        <p className="lead lead--spaced">
          Every plan includes the full pipeline: upload docs, in-app chat, publish, and embed.
          Pro upgrades through Stripe Checkout (test mode today)
        </p>
      </header>

      {error ? <div className="notice notice--error">{error}</div> : null}

      <section className="pricing-grid" aria-label="Plans">
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
            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={busy && plan.id === 'pro'}
              onClick={() => onCheckout(plan.id)}
            >
              {plan.id === 'pro' ? (busy ? 'Redirecting to Stripe…' : 'Upgrade to Pro') : 'Use Starter'}
            </button>
          </article>
        ))}
      </section>

      <section className="panel-card stack billing-note">
        <h2>Stripe test mode</h2>
        <p className="muted">
          Use test card <code>4242 4242 4242 4242</code>, any future expiry, any CVC. No real charges while
          you evaluate the product
        </p>
      </section>

      <section className="faq-section faq-section--compact" aria-labelledby="pricing-faq">
        <h2 id="pricing-faq" className="section-title">
          Pricing FAQ
        </h2>
        <FaqAccordion items={FAQ} />
      </section>

      <p className="muted center section-foot">
        Already signed in? <Link to="/app">Open dashboard</Link>
      </p>
    </>
  );
}

export function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const native = isNativeApp();

  const checkout = async (plan: 'starter' | 'pro') => {
    if (!user) {
      navigate('/signup');
      return;
    }
    if (plan === 'starter') {
      navigate('/app');
      return;
    }

    setError('');
    setBusy(true);
    try {
      const url = await createCheckoutSession(appOrigin());
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setBusy(false);
    }
  };

  const meta = (
    <PageMeta
      title="Pricing"
      description="KnowEmbed Starter is free. Pro adds more bots, docs, white-label widget, and 2,000 AI answers per month. Stripe Checkout in test mode."
      path="/pricing"
    />
  );

  if (native) {
    return (
      <>
        {meta}
        <AppShell active="upgrade">
          <PricingContent error={error} busy={busy} onCheckout={(plan) => void checkout(plan)} />
        </AppShell>
      </>
    );
  }

  return (
    <>
      {meta}
      <SiteHeader />
      <main className="page-shell">
        <PricingContent error={error} busy={busy} onCheckout={(plan) => void checkout(plan)} />
      </main>
      <SiteFooter />
    </>
  );
}
