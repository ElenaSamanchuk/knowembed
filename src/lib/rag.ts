export type TextChunk = {
  id: string;
  documentId: string;
  documentName: string;
  content: string;
};

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'is', 'it', 'with', 'as', 'at',
  'be', 'by', 'from', 'that', 'this', 'what', 'how', 'when', 'where', 'why', 'can', 'you', 'your',
]);

export function chunkText(text: string, documentId: string, documentName: string, size = 700): TextChunk[] {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  const paragraphs = normalized.split(/\n{2,}/);
  const chunks: TextChunk[] = [];
  let buffer = '';

  const flush = () => {
    const content = buffer.trim();
    if (!content) return;
    chunks.push({
      id: `${documentId}-${chunks.length}`,
      documentId,
      documentName,
      content,
    });
    buffer = '';
  };

  for (const paragraph of paragraphs) {
    const next = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    if (next.length <= size) {
      buffer = next;
      continue;
    }
    flush();
    if (paragraph.length <= size) {
      buffer = paragraph;
      continue;
    }
    for (let index = 0; index < paragraph.length; index += size) {
      chunks.push({
        id: `${documentId}-${chunks.length}`,
        documentId,
        documentName,
        content: paragraph.slice(index, index + size),
      });
    }
  }

  flush();
  return chunks;
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

export function retrieveRelevantChunks(query: string, chunks: TextChunk[], limit = 3): TextChunk[] {
  if (!chunks.length) return [];
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return chunks.slice(0, limit);

  const scored = chunks
    .map((chunk) => {
      const chunkTokens = new Set(tokenize(chunk.content));
      const score = queryTokens.reduce((sum, token) => sum + (chunkTokens.has(token) ? 1 : 0), 0);
      return { chunk, score };
    })
    .sort((left, right) => right.score - left.score);

  const best = scored.filter((item) => item.score > 0).slice(0, limit);
  if (best.length) return best.map((item) => item.chunk);
  return chunks.slice(0, limit);
}

export function composeAnswer(query: string, chunks: TextChunk[], botName: string): string {
  const relevant = retrieveRelevantChunks(query, chunks);
  if (!relevant.length) {
    return `I couldn't find this in ${botName}'s knowledge base yet. Try uploading FAQ, pricing, or product docs, or rephrase your question.`;
  }

  const excerpt = relevant.map((chunk) => chunk.content).join('\n\n');
  return [
    `Based on ${botName}'s uploaded docs:`,
    '',
    excerpt,
    '',
    `If you need more detail about "${query.trim()}", ask a follow-up question.`,
  ].join('\n');
}
