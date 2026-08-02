export type PlanId = 'starter' | 'pro';

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  period: string;
  bots: number;
  documents: number;
  messagesPerMonth: number;
  branding: boolean;
  highlights: string[];
};

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'forever',
    bots: 1,
    documents: 3,
    messagesPerMonth: 50,
    branding: true,
    highlights: [
      '1 chatbot for your site',
      'Up to 3 knowledge docs',
      '50 AI answers / month',
      'Widget with KnowEmbed badge',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    period: 'month',
    bots: 5,
    documents: 20,
    messagesPerMonth: 2000,
    branding: false,
    highlights: [
      '5 chatbots — multi-brand or clients',
      '20 docs per bot',
      '2,000 AI answers / month',
      'Remove widget branding',
      'Priority email support',
    ],
  },
};
