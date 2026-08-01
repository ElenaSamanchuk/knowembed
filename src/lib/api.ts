import { supabase, functionsUrl } from './supabase';

async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not signed in');

  return {
    Authorization: `Bearer ${token}`,
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };
}

export async function ingestDocument(botId: string, name: string, content: string): Promise<void> {
  const response = await fetch(functionsUrl('ingest-document'), {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ botId, name, content }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? 'Failed to ingest document');
}

export async function createCheckoutSession(origin: string): Promise<string> {
  const response = await fetch(functionsUrl('create-checkout-session'), {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ origin }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? 'Checkout failed');
  return payload.url as string;
}

export async function chatWithBot(botId: string, message: string): Promise<string> {
  const response = await fetch(functionsUrl('chat'), {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ botId, message }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? 'Chat failed');
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  if (!answer) throw new Error('AI returned an empty answer. Check Groq API key in Supabase secrets.');
  return answer;
}

export async function publishBot(botId: string): Promise<{ publicId: string; branding: boolean }> {
  const response = await fetch(functionsUrl('publish-bot'), {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ botId }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? 'Publish failed');
  return payload;
}

export async function fetchPublicBot(publicId: string) {
  const url = `${functionsUrl('public-bot')}?public_id=${encodeURIComponent(publicId)}`;
  const response = await fetch(url, {
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? 'Bot not found');
  return payload as {
    public_id: string;
    name: string;
    welcome: string;
    theme_color: string;
    branding: boolean;
  };
}

export async function publicChat(publicId: string, message: string): Promise<string> {
  const response = await fetch(functionsUrl('public-chat'), {
    method: 'POST',
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicId, message }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? 'Chat failed');
  return payload.answer as string;
}
