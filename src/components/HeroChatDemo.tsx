import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { fetchPublicBot, publicChat } from '../lib/api';

const DEMO_PUBLIC_ID = 'demo-store-assistant';

const SUGGESTED_QUESTIONS = [
  'How long is shipping?',
  'What is the return policy?',
  'Do you ship internationally?',
] as const;

type DemoMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function HeroChatDemo() {
  const [botName, setBotName] = useState('Store Assistant');
  const [themeColor, setThemeColor] = useState('#5089fd');
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [ready, setReady] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchPublicBot(DEMO_PUBLIC_ID)
      .then((bot) => {
        if (cancelled) return;
        setBotName(bot.name);
        setThemeColor(bot.theme_color || '#5089fd');
        setMessages([{ id: 'welcome', role: 'assistant', content: bot.welcome }]);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = 'Hi! Ask me about shipping, returns, or sizing.';
        setMessages([{ id: 'welcome', role: 'assistant', content: fallback }]);
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const ask = useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || thinking) return;

      setInput('');
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'user', content: text },
      ]);
      setThinking(true);

      try {
        const answer = await publicChat(DEMO_PUBLIC_ID, text);
        setMessages((current) => [
          ...current,
          { id: crypto.randomUUID(), role: 'assistant', content: answer },
        ]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Chat failed';
        setMessages((current) => [
          ...current,
          { id: crypto.randomUUID(), role: 'assistant', content: `Sorry — ${message}` },
        ]);
      } finally {
        setThinking(false);
      }
    },
    [thinking],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void ask(input);
  };

  return (
    <div className="hero-chat-demo">
      <div className="hero-chat-demo__shell">
        <div className="hero-chat-demo__context">
          <span className="hero-chat-demo__store">Still · demo store</span>
          <span className="hero-chat-demo__live">Live bot</span>
        </div>
        <section className="hero-chat-demo__panel" aria-label="Try the demo chatbot">
          <header className="hero-chat-demo__head">
            <div
              className="hero-chat-demo__avatar"
              style={{ background: themeColor }}
              aria-hidden="true"
            />
            <div className="hero-chat-demo__head-copy">
              <strong>{botName}</strong>
              <span>Answers from uploaded FAQ</span>
            </div>
          </header>

          <div className="hero-chat-demo__messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`hero-chat-demo__msg hero-chat-demo__msg--${message.role}`}
                style={
                  message.role === 'user' ? { background: themeColor } : undefined
                }
              >
                {message.content}
              </div>
            ))}
            {thinking ? (
              <div className="hero-chat-demo__msg hero-chat-demo__msg--assistant hero-chat-demo__typing">
                <span />
                <span />
                <span />
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="hero-chat-demo__chips" role="group" aria-label="Suggested questions">
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                className="hero-chat-demo__chip"
                disabled={!ready || thinking}
                onClick={() => void ask(question)}
              >
                {question}
              </button>
            ))}
          </div>

          <form className="hero-chat-demo__composer" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about shipping, returns, sizing…"
              disabled={!ready || thinking}
              aria-label="Message"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!ready || thinking || !input.trim()}
              style={{ background: themeColor }}
            >
              Send
            </button>
          </form>

          <p className="hero-chat-demo__badge">Same widget your visitors see on any site</p>
        </section>
      </div>
    </div>
  );
}
