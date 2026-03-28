import { describe, it, expect } from 'vitest';

/**
 * Pure function that applies game speed multiplier to delta.
 * This is the logic used in GameScene and CombatScene update loops.
 */
function applyGameSpeed(delta: number, speed: number): number {
  return delta * speed;
}

describe('GameSpeed', () => {
  it('at 1x speed, tick receives original delta', () => {
    const delta = 16.67;
    const result = applyGameSpeed(delta, 1);
    expect(result).toBeCloseTo(16.67, 2);
  });

  it('at 2x speed, tick receives doubled delta', () => {
    const delta = 16.67;
    const result = applyGameSpeed(delta, 2);
    expect(result).toBeCloseTo(33.34, 2);
  });

  it('at 1x speed with varying delta values', () => {
    expect(applyGameSpeed(8, 1)).toBe(8);
    expect(applyGameSpeed(33, 1)).toBe(33);
  });

  it('at 2x speed with varying delta values', () => {
    expect(applyGameSpeed(8, 2)).toBe(16);
    expect(applyGameSpeed(33, 2)).toBe(66);
  });

  it('speed multiplier of 0 freezes time', () => {
    expect(applyGameSpeed(16.67, 0)).toBe(0);
  });
});
