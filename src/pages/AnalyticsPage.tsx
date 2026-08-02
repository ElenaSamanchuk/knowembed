import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { fetchChatAnalytics, type ChatAnalytics } from '../lib/data';

export function AnalyticsPage() {
  const { user, profile, loading, profileLoading } = useAuth();
  const [stats, setStats] = useState<ChatAnalytics | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!user) {
      setBusy(false);
      return;
    }
    void fetchChatAnalytics()
      .then(setStats)
      .finally(() => setBusy(false));
  }, [user]);

  if (loading || profileLoading) {
    return <main className="page-shell"><p className="muted">Loading analytics…</p></main>;
  }

  if (!user || !profile) {
    return (
      <main className="page-shell">
        <p className="muted">
          <Link to="/login">Sign in</Link> to view analytics.
        </p>
      </main>
    );
  }

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <Link to="/" className="brand">
          KnowEmbed
        </Link>
        <nav className="app-nav">
          <Link to="/app" className="app-nav-item">
            ← Dashboard
          </Link>
        </nav>
        <div className="sidebar-foot">
          <p className="plan-badge">{profile.plan === 'pro' ? 'Pro' : 'Starter'}</p>
          <p className="muted">{profile.email}</p>
        </div>
      </aside>

      <main className="app-main workspace">
        <header className="page-heading">
          <p className="eyebrow">v2</p>
          <h1>Analytics</h1>
          <p className="lead">Messages from in-app chat and embedded widget (last 30 days).</p>
        </header>

        {busy ? <p className="muted">Loading stats…</p> : null}

        {stats ? (
          <>
            <section className="stats-grid">
              <article className="panel-card stat-card">
                <p className="muted">Total questions</p>
                <p className="stat-value">{stats.totalMessages}</p>
              </article>
              <article className="panel-card stat-card">
                <p className="muted">Last 7 days</p>
                <p className="stat-value">{stats.messagesLast7Days}</p>
              </article>
              <article className="panel-card stat-card">
                <p className="muted">In-app chat</p>
                <p className="stat-value">{stats.appMessages}</p>
              </article>
              <article className="panel-card stat-card">
                <p className="muted">Widget</p>
                <p className="stat-value">{stats.widgetMessages}</p>
              </article>
            </section>

            <section className="panel-card stack">
              <h2>Top questions</h2>
              {stats.topQuestions.length ? (
                <ul className="analytics-list">
                  {stats.topQuestions.map((item) => (
                    <li key={item.question}>
                      <span>{item.question}</span>
                      <strong>{item.count}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No questions logged yet. Test chat or embed widget to populate analytics.</p>
              )}
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
