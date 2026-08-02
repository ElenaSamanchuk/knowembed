import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { createBot, fetchBots, type BotRecord } from '../lib/data';
import { PLANS } from '../lib/plans';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading, signOut } = useAuth();
  const [bots, setBots] = useState<BotRecord[]>([]);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!user) {
      setBusy(false);
      return;
    }

    void fetchBots(user.id)
      .then(setBots)
      .finally(() => setBusy(false));
  }, [user]);

  if (loading || profileLoading || busy) {
    return <main className="page-shell"><p className="muted">Loading workspace…</p></main>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!profile) {
    return (
      <main className="page-shell narrow">
        <div className="panel-card stack">
          <h2>Could not load your profile</h2>
          <p className="muted">Try signing out and back in. If this keeps happening, check Supabase profiles table.</p>
          <button type="button" className="btn btn-primary" onClick={() => void signOut().then(() => navigate('/login'))}>
            Back to sign in
          </button>
        </div>
      </main>
    );
  }

  const plan = PLANS[profile.plan];

  const handleCreate = async () => {
    if (bots.length >= plan.bots) {
      setNotice(`Your plan includes ${plan.bots} bot(s). Upgrade to Pro for more.`);
      return;
    }
    const bot = await createBot(user.id, `Bot ${bots.length + 1}`);
    navigate(`/app/bots/${bot.id}`);
  };

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <Link to="/" className="brand">
          KnowEmbed
        </Link>
        <nav className="app-nav">
          <span className="app-nav-item active">Bots</span>
          <Link to="/app/analytics" className="app-nav-item">
            Analytics
          </Link>
          <Link to="/pricing" className="app-nav-item">
            Upgrade
          </Link>
        </nav>
        <div className="sidebar-foot">
          <p className="plan-badge">{plan.name} plan</p>
          <p className="muted">{profile.email}</p>
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => void signOut().then(() => navigate('/login'))}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="app-main">
        <header className="page-heading inline">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Your chatbots</h1>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => void handleCreate()}>
            New chatbot
          </button>
        </header>

        {notice ? <div className="notice">{notice}</div> : null}

        <section className="usage-strip">
          <span>{profile.messagesUsedThisMonth} / {plan.messagesPerMonth} answers this month</span>
          <span>{bots.length} / {plan.bots} bots</span>
        </section>

        {bots.length === 0 ? (
          <div className="panel-card empty-state">
            <h2>No bots yet</h2>
            <p className="muted">Upload docs, test chat, embed on your site.</p>
            <button type="button" className="btn btn-primary" onClick={() => void handleCreate()}>
              Create first bot
            </button>
          </div>
        ) : (
          <section className="bot-grid">
            {bots.map((bot) => (
              <Link key={bot.id} to={`/app/bots/${bot.id}`} className="bot-card">
                <strong>{bot.name}</strong>
                <span className="muted">{bot.documentCount} docs · {bot.chunkCount} chunks</span>
                <code>{bot.publicId}</code>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
