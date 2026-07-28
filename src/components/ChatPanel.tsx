import { useEffect, useRef, useState } from 'react';
import { chatWithBot } from '../lib/api';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ChatPanelProps = {
  botId: string;
  welcome: string;
  disabled?: boolean;
  onAnswered?: () => void;
};

export function ChatPanel({ botId, welcome, disabled, onAnswered }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: welcome },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = async () => {
    const question = input.trim();
    if (!question || disabled || thinking) return;

    setInput('');
    setError('');
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: 'user', content: question },
    ]);
    setThinking(true);

    try {
      const answer = await chatWithBot(botId, question);
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: answer },
      ]);
      onAnswered?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chat failed');
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-bubble chat-bubble--${message.role}`}>
            {message.content}
          </div>
        ))}
        {thinking ? <div className="chat-bubble chat-bubble--assistant">Searching docs with AI…</div> : null}
        <div ref={endRef} />
      </div>
      {error ? <p className="form-error chat-error">{error}</p> : null}
      <form
        className="chat-input-row"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about pricing, shipping, returns…"
          disabled={disabled || thinking}
        />
        <button type="submit" className="btn btn-primary" disabled={disabled || thinking}>
          Send
        </button>
      </form>
    </div>
  );
}
