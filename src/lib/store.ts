import { PLANS, type PlanId } from './plans';
import { chunkText, type TextChunk } from './rag';

export type StoredDocument = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
};

export type BotRecord = {
  id: string;
  publicId: string;
  name: string;
  welcome: string;
  themeColor: string;
  documents: StoredDocument[];
  chunks: TextChunk[];
  createdAt: string;
  updatedAt: string;
};

export type UserRecord = {
  email: string;
  plan: PlanId;
  messagesUsedThisMonth: number;
  billingCycleStart: string;
};

type Database = {
  user: UserRecord | null;
  bots: BotRecord[];
};

const STORAGE_KEY = 'knowembed:v1';

function emptyDb(): Database {
  return { user: null, bots: [] };
}

function readDb(): Database {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDb();
    const parsed = JSON.parse(raw) as Database;
    return {
      user: parsed.user ?? null,
      bots: Array.isArray(parsed.bots) ? parsed.bots : [],
    };
  } catch {
    return emptyDb();
  }
}

function writeDb(db: Database): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function getSessionUser(): UserRecord | null {
  return readDb().user;
}

export function signIn(email: string): UserRecord {
  const db = readDb();
  const user: UserRecord = db.user ?? {
    email,
    plan: 'starter',
    messagesUsedThisMonth: 0,
    billingCycleStart: new Date().toISOString(),
  };
  user.email = email;
  db.user = user;
  writeDb(db);
  return user;
}

export function signOut(): void {
  const db = readDb();
  db.user = null;
  writeDb(db);
}

export function getBots(): BotRecord[] {
  return readDb().bots;
}

export function getBot(botId: string): BotRecord | undefined {
  return readDb().bots.find((bot) => bot.id === botId);
}

export function canCreateBot(user: UserRecord): boolean {
  const plan = PLANS[user.plan];
  return getBots().length < plan.bots;
}

export function canUploadDocument(user: UserRecord, bot: BotRecord): boolean {
  const plan = PLANS[user.plan];
  return bot.documents.length < plan.documents;
}

export function canSendMessage(user: UserRecord): boolean {
  const plan = PLANS[user.plan];
  return user.messagesUsedThisMonth < plan.messagesPerMonth;
}

export function incrementMessageUsage(): void {
  const db = readDb();
  if (!db.user) return;
  db.user.messagesUsedThisMonth += 1;
  writeDb(db);
}

export function upgradePlan(plan: PlanId): UserRecord {
  const db = readDb();
  if (!db.user) throw new Error('Not signed in');
  db.user.plan = plan;
  writeDb(db);
  return db.user;
}

export function createBot(name: string): BotRecord {
  const db = readDb();
  const publicId = `bot-${Date.now().toString(36)}`;
  const bot: BotRecord = {
    id: crypto.randomUUID(),
    publicId,
    name,
    welcome: `Hi! Ask me anything about ${name}.`,
    themeColor: '#1d4ed8',
    documents: [],
    chunks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.bots.unshift(bot);
  writeDb(db);
  return bot;
}

export function updateBot(botId: string, patch: Partial<Pick<BotRecord, 'name' | 'welcome' | 'themeColor' | 'publicId'>>): BotRecord {
  const db = readDb();
  const bot = db.bots.find((item) => item.id === botId);
  if (!bot) throw new Error('Bot not found');
  Object.assign(bot, patch, { updatedAt: new Date().toISOString() });
  writeDb(db);
  return bot;
}

export function addDocument(botId: string, fileName: string, text: string): BotRecord {
  const db = readDb();
  const bot = db.bots.find((item) => item.id === botId);
  if (!bot) throw new Error('Bot not found');

  const documentId = crypto.randomUUID();
  const chunks = chunkText(text, documentId, fileName);
  bot.documents.unshift({
    id: documentId,
    name: fileName,
    size: text.length,
    uploadedAt: new Date().toISOString(),
  });
  bot.chunks = [...chunks, ...bot.chunks];
  bot.updatedAt = new Date().toISOString();
  writeDb(db);
  return bot;
}

export function deleteDocument(botId: string, documentId: string): BotRecord {
  const db = readDb();
  const bot = db.bots.find((item) => item.id === botId);
  if (!bot) throw new Error('Bot not found');
  bot.documents = bot.documents.filter((doc) => doc.id !== documentId);
  bot.chunks = bot.chunks.filter((chunk) => chunk.documentId !== documentId);
  bot.updatedAt = new Date().toISOString();
  writeDb(db);
  return bot;
}

export type PublishedBot = {
  id: string;
  name: string;
  welcome: string;
  themeColor: string;
  branding: boolean;
  chunks: TextChunk[];
};

export function buildPublishedBot(bot: BotRecord, branding: boolean): PublishedBot {
  return {
    id: bot.publicId,
    name: bot.name,
    welcome: bot.welcome,
    themeColor: bot.themeColor,
    branding,
    chunks: bot.chunks,
  };
}

export function downloadPublishedBot(payload: PublishedBot): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${payload.id}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function buildEmbedSnippet(origin: string, publicId: string): string {
  return `<script src="${origin}/widget.js" data-bot-id="${publicId}" defer></script>`;
}
