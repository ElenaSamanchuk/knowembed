export async function createEmbedding(text: string): Promise<number[] | null> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) return null;

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: Deno.env.get('OPENAI_EMBED_MODEL')?.trim() || 'text-embedding-3-small',
      input: text.slice(0, 8000),
    }),
  });

  if (!response.ok) {
    console.warn('OpenAI embedding failed:', await response.text());
    return null;
  }

  const payload = await response.json();
  const vector = payload.data?.[0]?.embedding;
  return Array.isArray(vector) ? (vector as number[]) : null;
}

export async function createEmbeddings(texts: string[]): Promise<Array<number[] | null>> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey || !texts.length) return texts.map(() => null);

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: Deno.env.get('OPENAI_EMBED_MODEL')?.trim() || 'text-embedding-3-small',
      input: texts.map((text) => text.slice(0, 8000)),
    }),
  });

  if (!response.ok) {
    console.warn('OpenAI batch embedding failed:', await response.text());
    return texts.map(() => null);
  }

  const payload = await response.json();
  const rows = payload.data ?? [];
  return texts.map((_, index) => {
    const row = rows.find((item: { index: number }) => item.index === index);
    return Array.isArray(row?.embedding) ? (row.embedding as number[]) : null;
  });
}

export async function logChatEvent(
  serviceClient: import('jsr:@supabase/supabase-js@2').SupabaseClient,
  params: { botId: string; ownerId: string; source: 'app' | 'widget'; question: string },
) {
  await serviceClient.from('chat_events').insert({
    bot_id: params.botId,
    owner_id: params.ownerId,
    source: params.source,
    question: params.question.slice(0, 500),
  });
}
