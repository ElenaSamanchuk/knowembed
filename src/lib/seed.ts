import { SAMPLE_FAQ } from '../data/sampleKnowledge';
import { createBot, addDocument, getBots, signIn, updateBot } from './store';

export function ensureDemoWorkspace(email: string): void {
  signIn(email);
  if (getBots().length > 0) return;

  const bot = createBot('Store Assistant');
  updateBot(bot.id, {
    publicId: 'demo-store-assistant',
    welcome: 'Hi! Ask me about shipping, returns, pricing, or support hours.',
    themeColor: '#5089fd',
  });
  addDocument(bot.id, 'acme-faq.md', SAMPLE_FAQ);
}
