import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { isNativeApp } from '../lib/native';
import { supabase } from '../lib/supabase';

type LoginPageProps = {
  mode: 'sign-in' | 'sign-up';
};

export function LoginPage({ mode }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === 'sign-up';
  const native = isNativeApp();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const normalized = email.trim().toLowerCase();
    const response = isSignUp
      ? await supabase.auth.signUp({ email: normalized, password })
      : await supabase.auth.signInWithPassword({ email: normalized, password });

    setLoading(false);

    if (response.error) {
      setError(response.error.message);
      return;
    }

    if (!response.data.session) {
      setError('Account created — check your email if confirmation is required, then sign in');
      navigate('/login', { replace: true });
      return;
    }

    navigate('/app', { replace: true });
  };

  return (
    <>
      <PageMeta
        title={isSignUp ? 'Create account' : 'Sign in'}
        description={
          isSignUp
            ? 'Create a free KnowEmbed account. Upload docs, test your AI chatbot, and embed it on any website.'
            : 'Sign in to your KnowEmbed workspace.'
        }
        path={isSignUp ? '/signup' : '/login'}
        noIndex
      />
      {native ? null : <SiteHeader />}
      <main className={`page-shell narrow${native ? ' native-auth-shell' : ''}`}>
        <header className="page-heading page-heading--spaced">
          <p className="eyebrow">{isSignUp ? 'Get started' : 'Welcome back'}</p>
          <h1>{isSignUp ? 'Create your embeddable bot' : 'Sign in to your workspace'}</h1>
          <p className="lead lead--spaced">
            {isSignUp
              ? 'Free Starter plan — no card required. Your workspace includes a demo bot so you can chat in under a minute'
              : 'Continue where you left off — bots, docs, and embed snippets are saved in your account'}
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
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
            />
          </label>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="muted center">
          {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
          <Link to={isSignUp ? '/login' : '/signup'} className="link-button">
            {isSignUp ? 'Sign in' : 'Create account'}
          </Link>
        </p>

        <p className="muted center trust-note">
          Secured by Supabase Auth. We only use your email to run your workspace
        </p>
      </main>
      {native ? null : <SiteFooter />}
    </>
  );
}

export function SignUpPage() {
  return <LoginPage mode="sign-up" />;
}

export function SignInPage() {
  return <LoginPage mode="sign-in" />;
}

/** Legacy query-param redirects */
export function LoginRedirect() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  if (mode === 'sign-in') return <Navigate to="/login" replace />;
  return <Navigate to="/signup" replace />;
}
