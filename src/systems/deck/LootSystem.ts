// Card reward generation with weighted rarity.
// No Phaser dependency. Uses DataLoader for card pool.

import { getAllCards } from '../../data/DataLoader';
import type { CardDefinition } from '../../data/types';

// ── Constants ───────────────────────────────────────────────

export const CARD_REWARD_CHANCE_NORMAL = 0.7;
export const CARD_REWARD_CHANCE_ELITE = 1.0;
export const CARD_REWARD_CHANCE_BOSS = 1.0;

// ── RNG Interface ───────────────────────────────────────────

export interface RNG {
  next(): number;
}

// ── Rarity Weights ──────────────────────────────────────────

const RARITY_WEIGHTS = [
  { rarity: 'common' as const, cumWeight: 60 },
  { rarity: 'uncommon' as const, cumWeight: 90 },
  { rarity: 'rare' as const, cumWeight: 100 },
];

// ── Should Offer Reward ─────────────────────────────────────

/**
 * Determine whether a card reward should be offered after combat.
 * Normal enemies: 70% chance. Elite/Boss: always.
 */
export function shouldOfferReward(
  enemyType: 'normal' | 'elite' | 'boss',
  rng: RNG,
): boolean {
  if (enemyType === 'elite' || enemyType === 'boss') return true;
  return rng.next() < CARD_REWARD_CHANCE_NORMAL;
}

// ── Generate Card Reward ────────────────────────────────────

/**
 * Generate a set of card reward options with weighted rarity.
 * Common 60%, Uncommon 30%, Rare 10%.
 */
export function generateCardReward(
  rng: RNG,
  count: number = 3,
  excludeIds: string[] = [],
): string[] {
  const allCards = getAllCards().filter(
    (c: CardDefinition) => !excludeIds.includes(c.id),
  );

  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const roll = rng.next() * 100;
    let targetRarity = 'common';
    for (const rw of RARITY_WEIGHTS) {
      if (roll < rw.cumWeight) {
        targetRarity = rw.rarity;
        break;
      }
    }
    const pool = allCards.filter(
      (c: CardDefinition) => (c as CardDefinition & { rarity?: string }).rarity === targetRarity,
    );
    if (pool.length > 0) {
      result.push(pool[Math.floor(rng.next() * pool.length)].id);
    }
  }
  return result;
}
