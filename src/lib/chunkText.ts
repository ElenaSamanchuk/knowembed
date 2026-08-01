export type TextChunk = {
  id: string;
  documentId: string;
  documentName: string;
  content: string;
};

export function chunkText(
  text: string,
  documentId: string,
  documentName: string,
  size = 700,
): TextChunk[] {
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

export function scoreChunks(chunks: string[], query: string): string[] {
  const terms = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((term) => term.length > 2);

  const scored = chunks
    .map((content) => {
      const haystack = content.toLowerCase();
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { content, score };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score);

  if (scored.length > 0) {
    return scored.map((item) => item.content);
  }

  return chunks.slice(0, 3);
}
