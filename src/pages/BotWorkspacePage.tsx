import { FormEvent, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChatPanel } from '../components/ChatPanel';
import { DocUpload } from '../components/DocUpload';
import { PLANS } from '../lib/plans';
import {
  addDocument,
  buildEmbedSnippet,
  buildPublishedBot,
  canSendMessage,
  canUploadDocument,
  deleteDocument,
  downloadPublishedBot,
  getBot,
  getSessionUser,
  incrementMessageUsage,
  updateBot,
} from '../lib/store';

export function BotWorkspacePage() {
  const { botId = '' } = useParams();
  const user = getSessionUser();
  const [tick, setTick] = useState(0);
  const [notice, setNotice] = useState('');

  const bot = useMemo(() => getBot(botId), [botId, tick]);
  const plan = user ? PLANS[user.plan] : PLANS.starter;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  if (!user) return <Navigate to="/login" replace />;
  if (!bot) return <Navigate to="/app" replace />;

  const refresh = () => setTick((value) => value + 1);
  const canChat = canSendMessage(user);
  const canUpload = canUploadDocument(user, bot);
  const embedSnippet = buildEmbedSnippet(origin, bot.publicId);
  const published = buildPublishedBot(bot, plan.branding);

  const saveSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateBot(bot.id, {
      name: String(form.get('name') ?? bot.name),
      welcome: String(form.get('welcome') ?? bot.welcome),
      themeColor: String(form.get('themeColor') ?? bot.themeColor),
      publicId: String(form.get('publicId') ?? bot.publicId),
    });
    refresh();
    setNotice('Settings saved.');
  };

  const handleUpload = (fileName: string, text: string) => {
    if (!canUpload) {
      setNotice(`Your plan allows ${plan.documents} docs per bot. Upgrade to add more.`);
      return;
    }
    addDocument(bot.id, fileName, text);
    refresh();
    setNotice(`Added ${fileName}.`);
  };

  const handlePublish = () => {
    if (!bot.chunks.length) {
      setNotice('Upload at least one knowledge doc before publishing.');
      return;
    }
    downloadPublishedBot(published);
    setNotice(
      `Downloaded ${bot.publicId}.json — place it in public/bots/ before deploy so the widget can load it.`,
    );
  };

  const copyEmbed = async () => {
    await navigator.clipboard.writeText(embedSnippet);
    setNotice('Embed snippet copied.');
  };

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <Link to="/" className="brand">
          KnowEmbed
        </Link>
        <nav className="app-nav">
          <Link to="/app" className="app-nav-item">
            ← All bots
          </Link>
        </nav>
        <div className="sidebar-foot">
          <p className="plan-badge">{plan.name}</p>
          <p className="muted">{user.email}</p>
        </div>
      </aside>

      <main className="app-main workspace">
        <header className="page-heading inline">
          <div>
            <p className="eyebrow">Bot workspace</p>
            <h1>{bot.name}</h1>
          </div>
          <div className="toolbar">
            <button type="button" className="btn btn-secondary" onClick={handlePublish}>
              Publish JSON
            </button>
            <button type="button" className="btn btn-primary" onClick={copyEmbed}>
              Copy embed
            </button>
          </div>
        </header>

        {notice ? <div className="notice">{notice}</div> : null}

        <div className="workspace-grid">
          <section className="panel-card stack">
            <h2>Settings</h2>
            <form className="stack" onSubmit={saveSettings}>
              <label className="field">
                <span>Bot name</span>
                <input name="name" defaultValue={bot.name} required />
              </label>
              <label className="field">
                <span>Public ID</span>
                <input name="publicId" defaultValue={bot.publicId} required />
              </label>
              <label className="field">
                <span>Welcome message</span>
                <textarea name="welcome" defaultValue={bot.welcome} rows={3} />
              </label>
              <label className="field">
                <span>Theme color</span>
                <input name="themeColor" type="color" defaultValue={bot.themeColor} />
              </label>
              <button type="submit" className="btn btn-secondary">
                Save settings
              </button>
            </form>

            <h2>Knowledge docs</h2>
            <DocUpload disabled={!canUpload} onUpload={handleUpload} />
            <ul className="doc-list">
              {bot.documents.map((doc) => (
                <li key={doc.id}>
                  <div>
                    <strong>{doc.name}</strong>
                    <span className="muted">{Math.round(doc.size / 1024)} KB</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      deleteDocument(bot.id, doc.id);
                      refresh();
                      setNotice(`Removed ${doc.name}.`);
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <h2>Embed snippet</h2>
            <pre className="code-block">{embedSnippet}</pre>
            <p className="muted">
              Widget loads <code>/bots/{bot.publicId}.json</code>. Try{' '}
              <a href="/embed-demo.html" target="_blank" rel="noreferrer">
                embed demo
              </a>
              .
            </p>
          </section>

          <section className="panel-card">
            <h2>Test chat</h2>
            {!canChat ? (
              <div className="notice">
                Monthly answer limit reached.{' '}
                <Link to="/pricing">Upgrade to Pro</Link> for 2,000 answers.
              </div>
            ) : null}
            <ChatPanel
              botName={bot.name}
              welcome={bot.welcome}
              chunks={bot.chunks}
              disabled={!canChat || !bot.chunks.length}
              onSend={() => {
                incrementMessageUsage();
                refresh();
              }}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
