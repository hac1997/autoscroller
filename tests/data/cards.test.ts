import { describe, it, expect, beforeAll } from 'vitest';
import cardsData from '../../src/data/json/cards.json';
import type { CardDefinition } from '../../src/data/types';

const cards: CardDefinition[] = cardsData.cards as CardDefinition[];

const EXPECTED_IDS = [
  'strike', 'heavy-hit', 'fury', 'berserker',
  'defend', 'shield-wall', 'fortify', 'iron-skin',
  'fireball', 'heal', 'arcane-shield', 'rejuvenate',
  'mana-drain', 'weaken',
];

describe('cards.json data validation', () => {
  it('should contain all 14 expected cards', () => {
    expect(cards).toHaveLength(14);
    const ids = cards.map((c) => c.id);
    for (const expectedId of EXPECTED_IDS) {
      expect(ids).toContain(expectedId);
    }
  });

  it('every card has cooldown as a number between 1.0 and 3.0', () => {
    for (const card of cards) {
      expect(card.cooldown).toBeTypeOf('number');
      expect(card.cooldown).toBeGreaterThanOrEqual(1.0);
      expect(card.cooldown).toBeLessThanOrEqual(3.0);
    }
  });

  it('every card has a valid targeting field', () => {
    const validTargeting = ['single', 'aoe', 'lowest-hp', 'random', 'self'];
    for (const card of cards) {
      expect(validTargeting).toContain(card.targeting);
    }
  });

  it('every card has a valid rarity field', () => {
    const validRarities = ['common', 'uncommon', 'rare'];
    for (const card of cards) {
      expect(card).toHaveProperty('rarity');
      expect(validRarities).toContain((card as any).rarity);
    }
  });

  it('specific cards have correct cooldown values', () => {
    const cooldownMap: Record<string, number> = {
      'strike': 1.2,
      'heavy-hit': 1.8,
      'fury': 2.2,
      'berserker': 3.0,
      'defend': 1.0,
      'shield-wall': 1.5,
      'fortify': 2.0,
      'iron-skin': 1.8,
      'fireball': 1.5,
      'heal': 2.0,
      'arcane-shield': 1.5,
      'rejuvenate': 1.2,
      'mana-drain': 1.0,
      'weaken': 1.8,
    };
    for (const card of cards) {
      expect(card.cooldown).toBe(cooldownMap[card.id]);
    }
  });
});
