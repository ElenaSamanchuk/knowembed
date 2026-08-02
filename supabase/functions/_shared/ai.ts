import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import { createEmbedding } from './embeddings.ts';

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GEMINI_MODELS = ['gemini-1.5-flash', 'gemini-1.5-flash-8b'] as const;
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
  limit = 8,
): Promise<string[]> {
  const queryEmbedding = await createEmbedding(query);
  if (queryEmbedding) {
    const { data: matches, error } = await serviceClient.rpc('match_chunks', {
      p_bot_id: botId,
      p_query_embedding: queryEmbedding,
      p_match_count: limit,
    });
    if (!error && matches?.length) {
      return matches.map((row: { content: string }) => row.content);
    }
  }

  const { data: chunks, error } = await serviceClient
    .from('chunks')
    .select('content')
    .eq('bot_id', botId);

  if (error) throw error;
  if (!chunks?.length) return [];

  const terms = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((term) => term.length > 1);

  const expandedTerms = [...terms];
  for (const term of terms) {
    if (term.endsWith('ing') && term.length > 5) expandedTerms.push(term.slice(0, -3));
    if (term.endsWith('ies') && term.length > 4) expandedTerms.push(term.slice(0, -3) + 'y');
    if (term.endsWith('s') && term.length > 3) expandedTerms.push(term.slice(0, -1));
  }

  const scored = chunks
    .map((chunk) => {
      const haystack = chunk.content.toLowerCase();
      const score = expandedTerms.reduce((total, term) => {
        if (haystack.includes(term)) return total + 2;
        if (term.length > 4 && haystack.includes(term.slice(0, 4))) return total + 1;
        return total;
      }, 0);
      return { content: chunk.content, score };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score);

  if (scored.length > 0) {
    return scored.slice(0, limit).map((item) => item.content);
  }

  return chunks.slice(0, limit).map((chunk) => chunk.content);
}

async function answerWithGroq(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: Deno.env.get('GROQ_MODEL')?.trim() || GROQ_MODEL,
      temperature: 0.35,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq chat failed: ${error}`);
  }

  const payload = await response.json();
  const text = payload.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq returned an empty answer');
  return text as string;
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
  let lastError = 'Gemini quota exceeded';

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
            temperature: 0.35,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      lastError = `Gemini chat failed (${model}): ${error}`;
      const retryable = response.status === 429 || error.includes('RESOURCE_EXHAUSTED');
      if (retryable) continue;
      throw new Error(lastError);
    }

    const payload = await response.json();
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return text as string;
  }

  throw new Error(lastError);
}

async function answerWithOpenAI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_CHAT_MODEL,
      temperature: 0.35,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
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

export async function answerWithContext(
  question: string,
  botName: string,
  contextBlocks: string[],
): Promise<string> {
  const groqKey = Deno.env.get('GROQ_API_KEY');
  const geminiKey = Deno.env.get('GEMINI_API_KEY');
  const openaiKey = Deno.env.get('OPENAI_API_KEY');

  if (!contextBlocks.length) {
    return `I couldn't find this in ${botName}'s knowledge base yet. Upload FAQ or product docs and try again.`;
  }

  const context = contextBlocks.join('\n\n---\n\n');
  const systemPrompt =
    `You are ${botName}'s knowledgeable AI support assistant. Answer using ONLY the provided context.\n` +
    '- Be conversational, helpful, and precise — like a smart support agent who read the docs\n' +
    '- For multi-part questions, address each part in order\n' +
    '- If the exact answer is not in context, say what related info you do have and suggest contacting support\n' +
    '- Never invent prices, dates, policies, or product details not stated in the context\n' +
    '- Keep answers concise (2–5 sentences) unless the user asks for detail';
  const userPrompt = `Context from knowledge base:\n${context}\n\nCustomer question: ${question}\n\nAnswer:`;

  if (groqKey) {
    return answerWithGroq(groqKey, systemPrompt, userPrompt);
  }

  if (geminiKey) {
    return answerWithGemini(geminiKey, systemPrompt, userPrompt);
  }

  if (openaiKey) {
    return answerWithOpenAI(openaiKey, systemPrompt, userPrompt);
  }

  throw new Error(
    'Add GROQ_API_KEY (free) in Supabase Edge Function secrets. Get one at https://console.groq.com/keys',
  );
}

export const PLAN_LIMITS = {
  starter: { bots: 1, documents: 3, messagesPerMonth: 50 },
  pro: { bots: 5, documents: 20, messagesPerMonth: 2000 },
} as const;
