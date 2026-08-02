export type BotReply = {
  label: string;
  nextNodeId?: string;
  url?: string;
};

export type BotNode = {
  id: string;
  message: string;
  replies: BotReply[];
};

export type BotConfig = {
  id: string;
  name: string;
  welcome: string;
  themeColor: string;
  startNodeId: string;
  nodes: BotNode[];
  updatedAt: string;
};

export function createEmptyBot(name = 'New bot'): BotConfig {
  const startId = 'start';
  return {
    id: slugify(name) || `bot-${Date.now()}`,
    name,
    welcome: 'Hi! How can we help you today?',
    themeColor: '#5089fd',
    startNodeId: startId,
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: startId,
        message: 'What would you like to do?',
        replies: [{ label: 'Learn more', nextNodeId: startId }],
      },
    ],
  };
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function validateBot(bot: BotConfig): string[] {
  const errors: string[] = [];
  if (!bot.id.trim()) errors.push('Bot ID is required.');
  if (!bot.name.trim()) errors.push('Bot name is required.');
  if (!bot.nodes.some((node) => node.id === bot.startNodeId)) {
    errors.push('Start node must exist in the flow.');
  }
  bot.nodes.forEach((node) => {
    node.replies.forEach((reply) => {
      if (reply.url) return;
      if (!reply.nextNodeId) {
        errors.push(`Reply "${reply.label}" in node "${node.id}" needs a target.`);
        return;
      }
      if (!bot.nodes.some((item) => item.id === reply.nextNodeId)) {
        errors.push(`Reply "${reply.label}" points to missing node "${reply.nextNodeId}".`);
      }
    });
  });
  return errors;
}
