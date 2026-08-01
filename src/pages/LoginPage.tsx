import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      setError('Account created, but no session was returned. Try signing in instead.');
      setMode('sign-in');
      return;
    }

    navigate('/app', { replace: true });
  };

  return (
    <>
      <SiteHeader />
      <main className="page-shell narrow">
        <header className="page-heading">
          <p className="eyebrow">Sign in</p>
          <h1>Start building your embeddable bot</h1>
          <p className="lead">Supabase Postgres + Groq AI with your docs as context.</p>
        </header>

        <form className="panel-card stack" onSubmit={(event) => void submit(event)}>
          <label className="field">
            <span>Work email</span>
            <input
              type="email"
              required
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
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
      </main>
    </>
  );
}
