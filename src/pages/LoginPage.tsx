import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { ensureDemoWorkspace } from '../lib/seed';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes('@')) return;
    ensureDemoWorkspace(normalized);
    navigate('/app');
  };

  return (
    <>
      <SiteHeader />
      <main className="page-shell narrow">
        <header className="page-heading">
          <p className="eyebrow">Sign in</p>
          <h1>Start building your embeddable bot</h1>
          <p className="lead">Demo auth stores session locally. Production uses Supabase auth.</p>
        </header>

        <form className="panel-card stack" onSubmit={submit}>
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
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>

        <p className="muted center">
          No account yet? Just enter email — we create a demo workspace instantly.
        </p>
      </main>
    </>
  );
}
