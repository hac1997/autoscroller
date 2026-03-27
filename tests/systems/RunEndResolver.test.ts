import { describe, it, expect } from 'vitest';
import { resolveRunEnd } from '../../src/systems/RunEndResolver';

describe('RunEndResolver', () => {
  it('safe exit returns full materials and all XP', () => {
    const result = resolveRunEnd('safe', { wood: 100, iron: 50 }, 50);
    expect(result).toEqual({ exitType: 'safe', materials: { wood: 100, iron: 50 }, xp: 50 });
  });

  it('death returns 10% materials and 0 XP (no storehouse)', () => {
    const result = resolveRunEnd('death', { wood: 100, iron: 50 }, 50);
    expect(result).toEqual({ exitType: 'death', materials: { wood: 10, iron: 5 }, xp: 0 });
  });

  it('safe exit with empty materials returns empty', () => {
    const result = resolveRunEnd('safe', {}, 0);
    expect(result).toEqual({ exitType: 'safe', materials: {}, xp: 0 });
  });

  it('death with odd amounts floors correctly', () => {
    const result = resolveRunEnd('death', { wood: 7 }, 30);
    // floor(7 * 0.10) = floor(0.7) = 0
    expect(result.materials.wood).toBe(0);
    expect(result.xp).toBe(0);
  });

  it('death with storehouseLevel=5 retains 25% materials', () => {
    const result = resolveRunEnd('death', { wood: 100, iron: 40 }, 50, 5);
    expect(result.materials.wood).toBe(25);
    expect(result.materials.iron).toBe(10);
    expect(result.xp).toBe(0);
  });

  it('death with storehouseLevel=8 retains 50% materials', () => {
    const result = resolveRunEnd('death', { essence: 100 }, 50, 8);
    expect(result.materials.essence).toBe(50);
  });
});
