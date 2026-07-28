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
    highlights: ['1 chatbot', '3 knowledge docs', '50 answers / month', 'Embed widget with badge'],
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
      '5 chatbots',
      '20 docs each',
      '2,000 answers / month',
      'Remove widget branding',
      'Priority support',
    ],
  },
};
