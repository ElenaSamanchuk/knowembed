const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHAT_MODEL = 'gpt-4o-mini';

export function chunkText(text: string, documentId: string, documentName: string, size = 700) {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [] as Array<{ id: string; documentId: string; documentName: string; content: string }>;

  const paragraphs = normalized.split(/\n{2,}/);
  const chunks: Array<{ id: string; documentId: string; documentName: string; content: string }> = [];
  let buffer = '';

  const flush = () => {
    const content = buffer.trim();
    if (!content) return;
    chunks.push({
      id: `${documentId}-${chunks.length}`,
      documentId,
      documentName,
      content,
    });
    buffer = '';
  };

  for (const paragraph of paragraphs) {
    const next = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    if (next.length <= size) {
      buffer = next;
      continue;
    }
    flush();
    if (paragraph.length <= size) {
      buffer = paragraph;
      continue;
    }
    for (let index = 0; index < paragraph.length; index += size) {
      chunks.push({
        id: `${documentId}-${chunks.length}`,
        documentId,
        documentName,
        content: paragraph.slice(index, index + size),
      });
    }
  }

  flush();
  return chunks;
}

export async function embedText(text: string): Promise<number[]> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI embeddings failed: ${error}`);
  }

  const payload = await response.json();
  return payload.data[0].embedding as number[];
}

export async function answerWithContext(
  question: string,
  botName: string,
  contextBlocks: string[],
): Promise<string> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const context = contextBlocks.join('\n\n---\n\n');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            `You are ${botName}'s support assistant. Answer ONLY using the provided context. ` +
            'If the answer is not in the context, say you do not know and suggest contacting support. ' +
            'Keep answers concise, friendly, and accurate.',
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI chat failed: ${error}`);
  }

  const payload = await response.json();
  return payload.choices[0].message.content as string;
}

export const PLAN_LIMITS = {
  starter: { bots: 1, documents: 3, messagesPerMonth: 50 },
  pro: { bots: 5, documents: 20, messagesPerMonth: 2000 },
} as const;
