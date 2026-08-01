import { useEffect } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { useAuth } from '../context/AuthProvider';
import { PLANS } from '../lib/plans';

export function CheckoutPage() {
  const [params] = useSearchParams();
  const { user, profile, loading, refreshProfile } = useAuth();
  const success = params.get('success') === '1';
  const planId = params.get('plan') === 'pro' || success ? 'pro' : 'starter';
  const plan = PLANS[planId];

  useEffect(() => {
    if (success) void refreshProfile();
  }, [success, refreshProfile]);

  if (loading) return <main className="page-shell"><p className="muted">Loading…</p></main>;
  if (!user || !profile) return <Navigate to="/login" replace />;

  return (
    <>
      <SiteHeader />
      <main className="page-shell narrow">
        <header className="page-heading page-heading--spaced">
          <p className="eyebrow">{success ? 'Payment successful' : 'Checkout'}</p>
          <h1>{success ? `Welcome to ${plan.name}` : `Upgrade to ${plan.name}`}</h1>
          <p className="lead lead--spaced">
            {success
              ? 'Stripe confirmed your subscription. Your workspace limits are updated via webhook.'
              : 'Complete checkout on the pricing page to upgrade.'}
          </p>
        </header>

        <section className="panel-card stack checkout-card">
          <div className="checkout-line">
            <span>{plan.name} subscription</span>
            <strong>{plan.price === 0 ? 'Free' : `$${plan.price} / month`}</strong>
          </div>
          {success ? (
            <div className="checkout-success">
              Active plan: <strong>{profile.plan}</strong>. Pro removes widget branding and raises limits.
            </div>
          ) : (
            <p className="muted">No active checkout session. Start from pricing.</p>
          )}
          <Link to="/app" className="btn btn-primary btn-block">
            Back to dashboard
          </Link>
        </section>
      </main>
    </>
  );
}
