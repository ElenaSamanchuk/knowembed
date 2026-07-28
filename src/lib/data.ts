import type { PlanId } from './plans';
import { SAMPLE_FAQ } from '../data/sampleKnowledge';
import { ingestDocument } from './api';
import { supabase } from './supabase';

export type Profile = {
  id: string;
  email: string;
  plan: PlanId;
  messagesUsedThisMonth: number;
};

export type BotRecord = {
  id: string;
  publicId: string;
  name: string;
  welcome: string;
  themeColor: string;
  createdAt: string;
  updatedAt: string;
  documentCount: number;
  chunkCount: number;
};

export type StoredDocument = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
};

function mapProfile(row: {
  id: string;
  email: string;
  plan: string;
  messages_used_this_month: number;
}): Profile {
  return {
    id: row.id,
    email: row.email,
    plan: row.plan === 'pro' ? 'pro' : 'starter',
    messagesUsedThisMonth: row.messages_used_this_month,
  };
}

function mapBot(row: {
  id: string;
  public_id: string;
  name: string;
  welcome: string;
  theme_color: string;
  created_at: string;
  updated_at: string;
  documents?: { count: number }[];
  chunks?: { count: number }[];
}): BotRecord {
  return {
    id: row.id,
    publicId: row.public_id,
    name: row.name,
    welcome: row.welcome,
    themeColor: row.theme_color,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    documentCount: row.documents?.[0]?.count ?? 0,
    chunkCount: row.chunks?.[0]?.count ?? 0,
  };
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, plan, messages_used_this_month')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return mapProfile(data);
}

export async function fetchBots(userId: string): Promise<BotRecord[]> {
  const { data, error } = await supabase
    .from('bots')
    .select(`
      id,
      public_id,
      name,
      welcome,
      theme_color,
      created_at,
      updated_at,
      documents(count),
      chunks(count)
    `)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapBot(row as Parameters<typeof mapBot>[0]));
}

export async function fetchBot(userId: string, botId: string): Promise<BotRecord | null> {
  const { data, error } = await supabase
    .from('bots')
    .select(`
      id,
      public_id,
      name,
      welcome,
      theme_color,
      created_at,
      updated_at,
      documents(count),
      chunks(count)
    `)
    .eq('id', botId)
    .eq('owner_id', userId)
    .single();

  if (error || !data) return null;
  return mapBot(data as Parameters<typeof mapBot>[0]);
}

export async function fetchDocuments(botId: string): Promise<StoredDocument[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('id, name, size_bytes, uploaded_at')
    .eq('bot_id', botId)
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    size: row.size_bytes,
    uploadedAt: row.uploaded_at,
  }));
}

export async function createBot(userId: string, name: string): Promise<BotRecord> {
  const publicId = `bot-${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from('bots')
    .insert({
      owner_id: userId,
      public_id: publicId,
      name,
      welcome: `Hi! Ask me anything about ${name}.`,
      theme_color: '#1d4ed8',
    })
    .select(`
      id,
      public_id,
      name,
      welcome,
      theme_color,
      created_at,
      updated_at,
      documents(count),
      chunks(count)
    `)
    .single();

  if (error || !data) throw error ?? new Error('Failed to create bot');
  return mapBot(data as Parameters<typeof mapBot>[0]);
}

export async function updateBot(
  userId: string,
  botId: string,
  patch: Partial<Pick<BotRecord, 'name' | 'welcome' | 'themeColor' | 'publicId'>>,
): Promise<void> {
  const { error } = await supabase
    .from('bots')
    .update({
      name: patch.name,
      welcome: patch.welcome,
      theme_color: patch.themeColor,
      public_id: patch.publicId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', botId)
    .eq('owner_id', userId);

  if (error) throw error;
}

export async function deleteDocument(documentId: string): Promise<void> {
  const { error } = await supabase.from('documents').delete().eq('id', documentId);
  if (error) throw error;
}

export async function upgradePlan(userId: string, plan: PlanId): Promise<void> {
  const { error } = await supabase.from('profiles').update({ plan }).eq('id', userId);
  if (error) throw error;
}

export async function ensureDemoBot(userId: string): Promise<void> {
  const bots = await fetchBots(userId);
  if (bots.length > 0) return;

  const bot = await createBot(userId, 'Store Assistant');
  await updateBot(userId, bot.id, {
    publicId: 'demo-store-assistant',
    welcome: 'Hi! Ask me about shipping, returns, pricing, or support hours.',
    themeColor: '#1d4ed8',
  });
  await ingestDocument(bot.id, 'acme-faq.md', SAMPLE_FAQ);
}

export function buildEmbedSnippet(origin: string, publicId: string): string {
  const apiUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
  return `<script src="${origin}/widget.js" data-bot-id="${publicId}" data-api="${apiUrl}" data-anon-key="${anonKey}" defer></script>`;
}
