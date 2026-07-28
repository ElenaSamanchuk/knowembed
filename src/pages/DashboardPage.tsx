import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  canCreateBot,
  createBot,
  getBots,
  getSessionUser,
  signOut,
} from '../lib/store';
import { PLANS } from '../lib/plans';

export function DashboardPage() {
  const navigate = useNavigate();
  const user = getSessionUser();
  const [bots, setBots] = useState(() => getBots());
  const [notice, setNotice] = useState('');

  if (!user) return <Navigate to="/login" replace />;

  const plan = PLANS[user.plan];

  const handleCreate = () => {
    if (!canCreateBot(user)) {
      setNotice(`Starter includes ${plan.bots} bot. Upgrade to Pro for more.`);
      return;
    }
    const bot = createBot(`Bot ${bots.length + 1}`);
    setBots(getBots());
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
          <Link to="/pricing" className="app-nav-item">
            Upgrade
          </Link>
        </nav>
        <div className="sidebar-foot">
          <p className="plan-badge">{plan.name} plan</p>
          <p className="muted">{user.email}</p>
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => {
              signOut();
              navigate('/login');
            }}
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
          <button type="button" className="btn btn-primary" onClick={handleCreate}>
            New chatbot
          </button>
        </header>

        {notice ? <div className="notice">{notice}</div> : null}

        <section className="usage-strip">
          <span>{user.messagesUsedThisMonth} / {plan.messagesPerMonth} answers this month</span>
          <span>{bots.length} / {plan.bots} bots</span>
        </section>

        {bots.length === 0 ? (
          <div className="panel-card empty-state">
            <h2>No bots yet</h2>
            <p className="muted">Upload docs, test chat, embed on your site.</p>
            <button type="button" className="btn btn-primary" onClick={handleCreate}>
              Create first bot
            </button>
          </div>
        ) : (
          <section className="bot-grid">
            {bots.map((bot) => (
              <Link key={bot.id} to={`/app/bots/${bot.id}`} className="bot-card">
                <strong>{bot.name}</strong>
                <span className="muted">{bot.documents.length} docs · {bot.chunks.length} chunks</span>
                <code>{bot.publicId}</code>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
