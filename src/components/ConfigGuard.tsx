import type { ReactNode } from 'react';

export function ConfigGuard({ children }: { children: ReactNode }) {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (url && key) {
    return children;
  }

  return (
    <main className="page-shell narrow">
      <section className="panel-card stack">
        <p className="eyebrow">Deploy config</p>
        <h1>Supabase env vars missing</h1>
        <p className="muted">
          The app built without <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code>. Add them in your host settings and redeploy.
        </p>
        <p className="muted">
          <strong>Vercel:</strong>{' '}
          <a
            href="https://vercel.com/docs/projects/environment-variables"
            target="_blank"
            rel="noreferrer"
          >
            Project → Settings → Environment Variables
          </a>
        </p>
      </section>
    </main>
  );
}
