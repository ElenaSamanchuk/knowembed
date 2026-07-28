import type { BotConfig } from '../types/bot';

export const DEMO_BOT: BotConfig = {
  id: 'demo-lead-qualifier',
  name: 'Lead qualifier',
  welcome: 'Hi! I can route you to the right next step in under a minute.',
  themeColor: '#2563eb',
  startNodeId: 'welcome',
  updatedAt: '2026-07-28T00:00:00.000Z',
  nodes: [
    {
      id: 'welcome',
      message: 'What are you building?',
      replies: [
        { label: 'Landing + embeddable widget', nextNodeId: 'landing' },
        { label: 'Full SaaS MVP', nextNodeId: 'saas' },
        { label: 'Book a call', url: 'https://t.me/ElaneDmitrievna' },
      ],
    },
    {
      id: 'landing',
      message: 'Great — we can ship a marketing page and embeddable chatbot in one sprint.',
      replies: [
        { label: 'See portfolio', url: 'https://elenasamanchuk.github.io/elena-samanchuk/' },
        { label: 'Start over', nextNodeId: 'welcome' },
      ],
    },
    {
      id: 'saas',
      message: 'For SaaS we focus on one core workflow first, then iterate weekly.',
      replies: [
        { label: 'Contact on Telegram', url: 'https://t.me/ElaneDmitrievna' },
        { label: 'Start over', nextNodeId: 'welcome' },
      ],
    },
  ],
};

export const SEED_BOTS: BotConfig[] = [DEMO_BOT];
