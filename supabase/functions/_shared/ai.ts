import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-8b',
  'gemini-2.0-flash',
] as const;
const OPENAI_CHAT_MODEL = 'gpt-4o-mini';

export function chunkText(text: string, documentId: string, documentName: string, size = 700) {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return [] as Array<{ id: string; documentId: string; documentName: string; content: string }>;
  }

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

export async function findRelevantChunks(
  serviceClient: SupabaseClient,
  botId: string,
  query: string,
  limit = 5,
): Promise<string[]> {
  const { data: chunks, error } = await serviceClient
    .from('chunks')
    .select('content')
    .eq('bot_id', botId);

  if (error) throw error;
  if (!chunks?.length) return [];

  const terms = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((term) => term.length > 2);

  const scored = chunks
    .map((chunk) => {
      const haystack = chunk.content.toLowerCase();
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { content: chunk.content, score };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score);

  if (scored.length > 0) {
    return scored.slice(0, limit).map((item) => item.content);
  }

  return chunks.slice(0, limit).map((chunk) => chunk.content);
}

function answerFromChunks(botName: string, question: string, contextBlocks: string[]): string {
  if (!contextBlocks.length) {
    return `I couldn't find this in ${botName}'s knowledge base yet. Upload FAQ or product docs and try again.`;
  }

  const terms = question
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((term) => term.length > 2);

  const lines = contextBlocks
    .flatMap((block) => block.split('\n'))
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));

  const scored = lines
    .map((line) => {
      const haystack = line.toLowerCase();
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { line, score };
    })
    .sort((left, right) => right.score - left.score);

  const best = scored.find((item) => item.score > 0)?.line ?? lines[0];
  if (!best) {
    return contextBlocks[0].replace(/^#+\s+/gm, '').trim();
  }

  return best;
}

function geminiModelsToTry(): string[] {
  const preferred = Deno.env.get('GEMINI_MODEL')?.trim();
  if (preferred) return [preferred, ...GEMINI_MODELS.filter((model) => model !== preferred)];
  return [...GEMINI_MODELS];
}

async function answerWithGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string | null> {
  for (const model of geminiModelsToTry()) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      const retryable = response.status === 429 || error.includes('RESOURCE_EXHAUSTED');
      if (retryable) continue;
      throw new Error(`Gemini chat failed (${model}): ${error}`);
    }

    const payload = await response.json();
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return text as string;
  }

  return null;
}

async function answerWithOpenAI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string | null> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_CHAT_MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    const retryable = response.status === 429 || error.includes('insufficient_quota');
    if (retryable) return null;
    throw new Error(`OpenAI chat failed: ${error}`);
  }

  const payload = await response.json();
  return payload.choices[0].message.content as string;
}

export async function answerWithContext(
  question: string,
  botName: string,
  contextBlocks: string[],
): Promise<string> {
  const geminiKey = Deno.env.get('GEMINI_API_KEY');
  const openaiKey = Deno.env.get('OPENAI_API_KEY');

  const context = contextBlocks.join('\n\n---\n\n');
  const systemPrompt =
    `You are ${botName}'s support assistant. Answer ONLY using the provided context. ` +
    'If the answer is not in the context, say you do not know and suggest contacting support. ' +
    'Keep answers concise, friendly, and accurate.';
  const userPrompt = `Context:\n${context}\n\nQuestion: ${question}`;

  if (geminiKey) {
    const geminiAnswer = await answerWithGemini(geminiKey, systemPrompt, userPrompt);
    if (geminiAnswer) return geminiAnswer;
  }

  if (openaiKey) {
    const openaiAnswer = await answerWithOpenAI(openaiKey, systemPrompt, userPrompt);
    if (openaiAnswer) return openaiAnswer;
  }

  if (!contextBlocks.length) {
    if (!geminiKey && !openaiKey) {
      throw new Error(
        'Add GEMINI_API_KEY (free) or OPENAI_API_KEY in Supabase Edge Function secrets',
      );
    }
    return `I couldn't find this in ${botName}'s knowledge base yet. Upload FAQ or product docs and try again.`;
  }

  return answerFromChunks(botName, question, contextBlocks);
}

export const PLAN_LIMITS = {
  starter: { bots: 1, documents: 3, messagesPerMonth: 50 },
  pro: { bots: 5, documents: 20, messagesPerMonth: 2000 },
} as const;
