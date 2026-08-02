import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { useAuth } from '../context/AuthProvider';
import { createCheckoutSession } from '../lib/api';
import { appOrigin } from '../lib/paths';
import { PLANS } from '../lib/plans';

export function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const checkout = async (plan: 'starter' | 'pro') => {
    if (!user) {
      navigate('/login');
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

  return (
    <>
      <SiteHeader />
      <main className="page-shell">
        <header className="page-heading page-heading--spaced">
          <p className="eyebrow">Pricing</p>
          <h1>Plans for launch-ready teams</h1>
          <p className="lead lead--spaced">
            Pro upgrades through Stripe Checkout (test mode). Plan limits are enforced in Supabase Edge Functions.
          </p>
        </header>

        {error ? <div className="notice notice--error">{error}</div> : null}

        <section className="pricing-grid">
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
                onClick={() => void checkout(plan.id)}
              >
                {plan.id === 'pro' ? (busy ? 'Redirecting to Stripe…' : 'Upgrade to Pro') : 'Use Starter'}
              </button>
            </article>
          ))}
        </section>

        <section className="panel-card stack billing-note">
          <h2>Stripe test mode</h2>
          <p className="muted">
            Use test card <code>4242 4242 4242 4242</code>, any future expiry, any CVC. No real charges.
          </p>
        </section>

        <p className="muted center section-foot">
          Already signed in? <Link to="/app">Open dashboard</Link>
        </p>
      </main>
    </>
  );
}
