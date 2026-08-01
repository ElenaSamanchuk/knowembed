import { describe, expect, it } from 'vitest';
import { chunkText, scoreChunks } from '../../src/lib/chunkText';
import { SAMPLE_FAQ } from '../../src/data/sampleKnowledge';

describe('chunkText', () => {
  it('splits FAQ into multiple chunks', () => {
    const chunks = chunkText(SAMPLE_FAQ, 'doc-1', 'acme-faq.md');
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.every((chunk) => chunk.documentName === 'acme-faq.md')).toBe(true);
  });

  it('returns empty array for blank input', () => {
    expect(chunkText('   ', 'doc-1', 'empty.md')).toEqual([]);
  });
});

describe('scoreChunks', () => {
  const chunks = chunkText(SAMPLE_FAQ, 'doc-1', 'acme-faq.md').map((chunk) => chunk.content);

  it('ranks shipping chunk for shipping question', () => {
    const ranked = scoreChunks(chunks, 'How long is shipping?');
    expect(ranked[0]?.toLowerCase()).toContain('shipping');
  });

  it('ranks returns chunk for return question', () => {
    const ranked = scoreChunks(chunks, 'Can I return an item?');
    expect(ranked[0]?.toLowerCase()).toContain('return');
  });
});
