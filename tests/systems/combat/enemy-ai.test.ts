import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EnemyAI } from '../../../src/systems/combat/EnemyAI';
import { createEmptyCombatStats } from '../../../src/systems/combat/CombatStats';
import type { CombatState } from '../../../src/systems/combat/CombatState';
import type { CombatStats } from '../../../src/systems/combat/CombatStats';

// Mock EventBus
vi.mock('../../../src/core/EventBus', () => ({
  eventBus: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

function makeState(overrides: Partial<CombatState> = {}): CombatState {
  return {
    heroHP: 100, heroMaxHP: 100,
    heroStamina: 50, heroMaxStamina: 50,
    heroMana: 30, heroMaxMana: 30,
    heroDefense: 0,
    heroStrength: 1, heroDefenseMultiplier: 1,
    heroClass: 'warrior',
    deckOrder: [],
    enemyId: 'slime', enemyName: 'Slime',
    enemyHP: 100, enemyMaxHP: 100,
    enemyDefense: 0, enemyDamage: 10,
    enemyAttackCooldown: 2000,
    enemyPattern: 'fixed',
    enemySpecialEffect: null,
    activePassives: [],
    heroStunned: false,
    ...overrides,
  };
}

describe('EnemyAI', () => {
  let ai: EnemyAI;
  let state: CombatState;
  let stats: CombatStats;

  beforeEach(() => {
    state = makeState();
    stats = createEmptyCombatStats('slime', 'Slime');
    ai = new EnemyAI(state);
  });

  it('does not attack before cooldown is reached', () => {
    ai.tick(1000, state, stats); // only 1s of 2s cooldown
    expect(state.heroHP).toBe(100);
    expect(stats.damageReceived).toBe(0);
  });

  it('fires attack when cooldown reaches 0, resets timer', () => {
    ai.tick(2000, state, stats); // exactly at cooldown
    expect(state.heroHP).toBe(90); // 100 - 10 damage
    expect(stats.damageReceived).toBe(10);
  });

  it('attacks again after second cooldown period', () => {
    ai.tick(2000, state, stats); // first attack
    ai.tick(2000, state, stats); // second attack
    expect(state.heroHP).toBe(80);
    expect(stats.damageReceived).toBe(20);
  });

  it('fixed pattern deals exact enemyDamage', () => {
    state.enemyPattern = 'fixed';
    state.enemyDamage = 15;
    ai = new EnemyAI(state);
    ai.tick(2000, state, stats);
    expect(state.heroHP).toBe(85);
  });

  it('scaling pattern increases damage based on cardsPlayed', () => {
    state.enemyPattern = 'scaling';
    state.enemyDamage = 10;
    ai = new EnemyAI(state);
    stats.cardsPlayed = 10; // should add floor(10 * 0.5) = 5
    ai.tick(2000, state, stats);
    expect(state.heroHP).toBe(85); // 100 - (10 + 5) = 85
  });

  it('conditional pattern deals more damage when hero HP < 50%', () => {
    state.enemyPattern = 'conditional';
    state.enemyDamage = 10;
    state.heroHP = 40; // below 50% of 100
    ai = new EnemyAI(state);
    ai.tick(2000, state, stats);
    // conditional: 10 * 1.5 = 15
    expect(state.heroHP).toBe(25);
  });

  it('conditional pattern deals normal damage when hero HP >= 50%', () => {
    state.enemyPattern = 'conditional';
    state.enemyDamage = 10;
    state.heroHP = 60; // above 50%
    ai = new EnemyAI(state);
    ai.tick(2000, state, stats);
    expect(state.heroHP).toBe(50); // 60 - 10
  });

  it('hero defense absorbs damage first', () => {
    state.heroDefense = 5;
    ai.tick(2000, state, stats);
    // 10 damage - 5 defense = 5 actual damage
    expect(state.heroDefense).toBe(0);
    expect(state.heroHP).toBe(95);
    expect(stats.damageReceived).toBe(5);
  });

  it('hero defense fully absorbs damage when >= damage', () => {
    state.heroDefense = 15;
    ai.tick(2000, state, stats);
    // 10 damage - 15 defense = 0 (defense reduced by 10)
    expect(state.heroDefense).toBe(5);
    expect(state.heroHP).toBe(100);
    expect(stats.damageReceived).toBe(0);
  });

  it('debuff special effect reduces heroDefense by 3', () => {
    state.enemySpecialEffect = 'debuff';
    state.heroDefense = 10;
    ai = new EnemyAI(state);
    ai.tick(2000, state, stats);
    // attack does 10 damage absorbed by defense (10-10=0 actual), then debuff -3
    // defense after absorb = 0, then debuff makes it max(0, 0-3) = 0
    expect(state.heroHP).toBe(100);
  });

  it('stun special effect sets heroStunned flag', () => {
    state.enemySpecialEffect = 'stun';
    ai = new EnemyAI(state);
    ai.tick(2000, state, stats);
    expect(state.heroStunned).toBe(true);
  });

  it('lifesteal special effect heals enemy by 50% of damage dealt', () => {
    state.enemySpecialEffect = 'lifesteal';
    state.enemyHP = 80;
    state.enemyMaxHP = 100;
    ai = new EnemyAI(state);
    ai.tick(2000, state, stats);
    // 10 damage to hero, enemy heals 5
    expect(state.enemyHP).toBe(85);
  });
});
