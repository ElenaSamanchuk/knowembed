import type { BotConfig } from '../types/bot';

const STORAGE_KEY = 'boxbot:drafts';

export function loadDrafts(): BotConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BotConfig[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDrafts(bots: BotConfig[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bots));
}

export function downloadJson(bot: BotConfig): void {
  const blob = new Blob([JSON.stringify(bot, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${bot.id}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function buildEmbedSnippet(origin: string, botId: string): string {
  return `<script src="${origin}/widget.js" data-bot-id="${botId}" defer></script>`;
}

export function buildPublishInstructions(botId: string): string {
  return [
    'Publish checklist:',
    `1. Save exported JSON as public/bots/${botId}.json`,
    '2. Run npm run build and deploy dist/ (Vercel, GitHub Pages, etc.)',
    `3. Embed: ${buildEmbedSnippet('https://YOUR-DOMAIN', botId)}`,
    '4. Open embed-demo.html locally or on deploy to verify the widget.',
  ].join('\n');
}
