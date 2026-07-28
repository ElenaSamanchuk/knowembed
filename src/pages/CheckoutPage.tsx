import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { useAuth } from '../context/AuthProvider';
import { PLANS } from '../lib/plans';

export function CheckoutPage() {
  const [params] = useSearchParams();
  const { user, profile, loading } = useAuth();
  const planId = params.get('plan') === 'pro' ? 'pro' : 'starter';
  const plan = PLANS[planId];

  if (loading) return <main className="page-shell"><p className="muted">Loading…</p></main>;
  if (!user || !profile) return <Navigate to="/login" replace />;

  return (
    <>
      <SiteHeader />
      <main className="page-shell narrow">
        <header className="page-heading">
          <p className="eyebrow">Stripe test checkout</p>
          <h1>Upgrade to {plan.name}</h1>
          <p className="lead">Mock billing flow. Your Supabase profile plan is already updated.</p>
        </header>

        <section className="panel-card stack checkout-card">
          <div className="checkout-line">
            <span>{plan.name} subscription</span>
            <strong>{plan.price === 0 ? 'Free' : `$${plan.price} / month`}</strong>
          </div>
          <div className="checkout-line muted">
            <span>Test card</span>
            <code>4242 4242 4242 4242</code>
          </div>
          <div className="checkout-success">
            Payment simulated — your workspace is now on <strong>{profile.plan}</strong>.
          </div>
          <Link to="/app" className="btn btn-primary">
            Back to dashboard
          </Link>
        </section>
      </main>
    </>
  );
}
