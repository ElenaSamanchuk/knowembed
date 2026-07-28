import { useEffect, useRef, useState } from 'react';
import { composeAnswer } from '../lib/rag';
import type { TextChunk } from '../lib/rag';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ChatPanelProps = {
  botName: string;
  welcome: string;
  chunks: TextChunk[];
  disabled?: boolean;
  onSend?: () => void;
};

export function ChatPanel({ botName, welcome, chunks, disabled, onSend }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: welcome },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = async () => {
    const question = input.trim();
    if (!question || disabled || thinking) return;

    setInput('');
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: 'user', content: question },
    ]);
    setThinking(true);
    onSend?.();

    await new Promise((resolve) => window.setTimeout(resolve, 450));

    const answer = composeAnswer(question, chunks, botName);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: 'assistant', content: answer },
    ]);
    setThinking(false);
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-bubble chat-bubble--${message.role}`}>
            {message.content}
          </div>
        ))}
        {thinking ? <div className="chat-bubble chat-bubble--assistant">Searching docs…</div> : null}
        <div ref={endRef} />
      </div>
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
