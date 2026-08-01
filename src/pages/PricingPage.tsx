import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { useAuth } from '../context/AuthProvider';
import { upgradePlan } from '../lib/data';
import { PLANS } from '../lib/plans';

export function PricingPage() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const checkout = async (plan: 'starter' | 'pro') => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (plan === 'pro') {
      await upgradePlan(user.id, 'pro');
      await refreshProfile();
      navigate('/checkout?plan=pro');
      return;
    }
    navigate('/app');
  };

  return (
    <>
      <SiteHeader />
      <main className="page-shell">
        <header className="page-heading">
          <p className="eyebrow">Pricing</p>
          <h1>Simple plans for early-stage teams</h1>
          <p className="lead">Mock Stripe checkout. Plan limits enforced in Supabase Edge Functions.</p>
        </header>

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
              <button type="button" className="btn btn-primary" onClick={() => void checkout(plan.id)}>
                {plan.id === 'pro' ? 'Upgrade with Stripe test' : 'Use Starter'}
              </button>
            </article>
          ))}
        </section>

        <p className="muted center">
          Already signed in? <Link to="/app">Open dashboard</Link>
        </p>
      </main>
    </>
  );
}
