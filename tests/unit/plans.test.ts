import { describe, expect, it } from 'vitest';
import { PLANS } from '../../src/lib/plans';

describe('PLANS', () => {
  it('defines starter and pro with expected limits', () => {
    expect(PLANS.starter.bots).toBe(1);
    expect(PLANS.starter.documents).toBe(3);
    expect(PLANS.starter.messagesPerMonth).toBe(50);
    expect(PLANS.starter.branding).toBe(true);

    expect(PLANS.pro.bots).toBe(5);
    expect(PLANS.pro.documents).toBe(20);
    expect(PLANS.pro.messagesPerMonth).toBe(2000);
    expect(PLANS.pro.branding).toBe(false);
  });
});
