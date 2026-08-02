import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { supabase } from '../lib/supabase';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-up');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const normalized = email.trim().toLowerCase();
    const response =
      mode === 'sign-up'
        ? await supabase.auth.signUp({ email: normalized, password })
        : await supabase.auth.signInWithPassword({ email: normalized, password });

    setLoading(false);

    if (response.error) {
      setError(response.error.message);
      return;
    }

    if (!response.data.session) {
      setError('Account created — check your email if confirmation is required, then sign in.');
      setMode('sign-in');
      return;
    }

    navigate('/app', { replace: true });
  };

  return (
    <>
      <PageMeta
        title="Sign in"
        description="Create a free KnowEmbed account. Upload docs, test your AI chatbot, and embed it on any website."
        path="/login"
        noIndex
      />
      <SiteHeader />
      <main className="page-shell narrow">
        <header className="page-heading page-heading--spaced">
          <p className="eyebrow">{mode === 'sign-up' ? 'Get started' : 'Welcome back'}</p>
          <h1>Start building your embeddable bot</h1>
          <p className="lead lead--spaced">
            Free Starter plan — no card required. Your workspace includes a demo bot so you can chat
            in under a minute.
          </p>
        </header>

        <form className="panel-card stack" onSubmit={(event) => void submit(event)}>
          <label className="field">
            <span>Work email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
            />
          </label>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'sign-up' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="muted center">
          {mode === 'sign-up' ? 'Already have an account?' : 'New here?'}{' '}
          <button
            type="button"
            className="link-button"
            onClick={() => setMode(mode === 'sign-up' ? 'sign-in' : 'sign-up')}
          >
            {mode === 'sign-up' ? 'Sign in' : 'Create account'}
          </button>
        </p>

        <p className="muted center trust-note">
          Secured by Supabase Auth. We only use your email to run your workspace.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
