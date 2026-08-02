import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChatPanel } from '../components/ChatPanel';
import { DocUpload } from '../components/DocUpload';
import { useAuth } from '../context/AuthProvider';
import { ingestDocument, publishBot } from '../lib/api';
import {
  buildEmbedSnippet,
  deleteDocument,
  fetchBot,
  fetchDocuments,
  type BotRecord,
  type StoredDocument,
  updateBot,
} from '../lib/data';
import { appOrigin, publicPath } from '../lib/paths';
import { SAMPLE_FAQ } from '../data/sampleKnowledge';
import { PLANS } from '../lib/plans';

export function BotWorkspacePage() {
  const { botId = '' } = useParams();
  const { user, profile, loading, profileLoading, refreshProfile } = useAuth();
  const [bot, setBot] = useState<BotRecord | null>(null);
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(true);
  const [uploading, setUploading] = useState(false);

  const origin = typeof window !== 'undefined' ? appOrigin() : '';

  const reload = async () => {
    if (!user) return;
    const [nextBot, nextDocs] = await Promise.all([
      fetchBot(user.id, botId),
      fetchDocuments(botId),
    ]);
    setBot(nextBot);
    setDocuments(nextDocs);
    await refreshProfile();
  };

  useEffect(() => {
    if (!user) {
      setBusy(false);
      return;
    }
    void reload().finally(() => setBusy(false));
  }, [user, botId]);

  if (loading || profileLoading) {
    return <main className="page-shell"><p className="muted">Loading bot…</p></main>;
  }
  if (!user || !profile) return <Navigate to="/login" replace />;
  if (busy) return <main className="page-shell"><p className="muted">Loading bot…</p></main>;
  if (!bot) return <Navigate to="/app" replace />;

  const plan = PLANS[profile.plan];
  const canChat = profile.messagesUsedThisMonth < plan.messagesPerMonth;
  const canUpload = documents.length < plan.documents;
  const knowledgeReady = bot.chunkCount > 0;
  const chatDisabledReason = !canChat
    ? 'Monthly answer limit reached. Upgrade to Pro for more answers.'
    : !knowledgeReady
      ? 'Knowledge is not indexed yet. Remove the doc and upload it again, or wait a moment while we re-index.'
      : undefined;
  const embedSnippet = buildEmbedSnippet(origin, bot.publicId);

  const handleReindexDemo = async () => {
    setUploading(true);
    try {
      for (const doc of documents) {
        await deleteDocument(doc.id);
      }
      await ingestDocument(bot.id, 'acme-faq.md', SAMPLE_FAQ);
      await reload();
      setNotice('Knowledge indexed. You can chat now.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Re-index failed');
    } finally {
      setUploading(false);
    }
  };

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await updateBot(user.id, bot.id, {
      name: String(form.get('name') ?? bot.name),
      welcome: String(form.get('welcome') ?? bot.welcome),
      themeColor: String(form.get('themeColor') ?? bot.themeColor),
      publicId: String(form.get('publicId') ?? bot.publicId),
    });
    await reload();
    setNotice('Settings saved.');
  };

  const handleUpload = async (fileName: string, text: string) => {
    if (!canUpload) {
      setNotice(`Your plan allows ${plan.documents} docs per bot. Upgrade to add more.`);
      return;
    }
    setUploading(true);
    try {
      await ingestDocument(bot.id, fileName, text);
      await reload();
      setNotice(`Added ${fileName} and generated embeddings.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async () => {
    try {
      const result = await publishBot(bot.id);
      setNotice(`Published ${result.publicId}. Widget is live via Supabase.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Publish failed');
    }
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
          <p className="muted">{profile.email}</p>
        </div>
      </aside>

      <main className="app-main workspace">
        <header className="page-heading inline">
          <div>
            <p className="eyebrow">Bot workspace</p>
            <h1>{bot.name}</h1>
          </div>
          <div className="toolbar">
            <button type="button" className="btn btn-secondary" onClick={() => void handlePublish()}>
              Publish bot
            </button>
            <button type="button" className="btn btn-primary" onClick={() => void copyEmbed()}>
              Copy embed
            </button>
          </div>
        </header>

        {notice ? <div className="notice">{notice}</div> : null}

        <div className="workspace-grid">
          <section className="panel-card stack">
            <h2>Settings</h2>
            <form className="stack" onSubmit={(event) => void saveSettings(event)}>
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
            <DocUpload disabled={!canUpload || uploading} onUpload={(name, text) => void handleUpload(name, text)} />
            {uploading ? <p className="muted">Saving and indexing knowledge in Supabase…</p> : null}
            <ul className="doc-list">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <div>
                    <strong>{doc.name}</strong>
                    <span className="muted">{Math.round(doc.size / 1024)} KB</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      void deleteDocument(doc.id)
                        .then(reload)
                        .then(() => setNotice(`Removed ${doc.name}.`));
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
              Widget calls Supabase Edge Functions for AI answers. Try{' '}
              <a href={publicPath('embed-demo.html')} target="_blank" rel="noreferrer">
                embed demo
              </a>
              .
            </p>
          </section>

          <section className="panel-card">
            <h2>Test chat</h2>
            {!knowledgeReady ? (
              <div className="notice stack">
                <p>Chat is locked until your docs are indexed for AI search (currently {bot.chunkCount} chunks).</p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={uploading}
                  onClick={() => void handleReindexDemo()}
                >
                  {uploading ? 'Indexing…' : 'Re-index demo FAQ'}
                </button>
              </div>
            ) : null}
            {!canChat ? (
              <div className="notice">
                Monthly answer limit reached.{' '}
                <Link to="/pricing">Upgrade to Pro</Link> for 2,000 answers.
              </div>
            ) : null}
            <ChatPanel
              botId={bot.id}
              welcome={bot.welcome}
              disabled={!canChat || !knowledgeReady}
              disabledReason={chatDisabledReason}
              onAnswered={refreshProfile}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
