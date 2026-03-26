import { describe, it, expect } from 'vitest';
import { getAvailableCards, getAvailableRelics, getAvailableTiles } from '../../src/systems/UnlockManager';

describe('UnlockManager', () => {
  describe('getAvailableCards', () => {
    it('returns only cards with no unlockSource when unlockedCards is empty', () => {
      const cards = getAvailableCards([]);
      // Cards without unlockSource: strike, heavy-hit, defend, fireball = 4 starters
      expect(cards.length).toBe(4);
      const ids = cards.map(c => c.id);
      expect(ids).toContain('strike');
      expect(ids).toContain('heavy-hit');
      expect(ids).toContain('defend');
      expect(ids).toContain('fireball');
      // Should NOT contain gated cards
      expect(ids).not.toContain('fury');
      expect(ids).not.toContain('berserker');
    });

    it('returns starters plus fury when unlockedCards includes fury', () => {
      const cards = getAvailableCards(['fury']);
      const ids = cards.map(c => c.id);
      expect(ids).toContain('strike');
      expect(ids).toContain('fury');
      expect(cards.length).toBe(5); // 4 starters + fury
    });

    it('returns all 15 cards when all gated cards are unlocked', () => {
      const allGatedIds = [
        'fury', 'berserker', 'shield-wall', 'fortify', 'iron-skin',
        'heal', 'arcane-shield', 'rejuvenate', 'mana-drain', 'weaken',
        'counter-strike',
      ];
      const cards = getAvailableCards(allGatedIds);
      expect(cards.length).toBe(15);
    });
  });

  describe('getAvailableRelics', () => {
    it('returns only relics with no unlockSource when unlockedRelics is empty', () => {
      const relics = getAvailableRelics([]);
      // bronze_scale, energy_potion, arcane_crystal = 3 always available
      expect(relics.length).toBe(3);
      const ids = relics.map(r => r.id);
      expect(ids).toContain('bronze_scale');
      expect(ids).toContain('energy_potion');
      expect(ids).toContain('arcane_crystal');
    });

    it('returns starters plus warrior_spirit when unlocked', () => {
      const relics = getAvailableRelics(['warrior_spirit']);
      expect(relics.length).toBe(4);
      const ids = relics.map(r => r.id);
      expect(ids).toContain('bronze_scale');
      expect(ids).toContain('warrior_spirit');
    });

    it('returns all 8 relics when all gated relics are unlocked', () => {
      const allGatedIds = [
        'warrior_spirit', 'iron_will', 'berserker_ring',
        'demon_heart', 'phoenix_feather',
      ];
      const relics = getAvailableRelics(allGatedIds);
      expect(relics.length).toBe(8);
    });
  });

  describe('getAvailableTiles', () => {
    it('returns only base tile types when unlockedTiles is empty', () => {
      const tiles = getAvailableTiles([]);
      const ids = tiles.map(t => t.id);
      expect(ids).toContain('basic');
      expect(ids).toContain('combat_forest');
      expect(ids).toContain('shop');
      expect(ids).toContain('rest');
      expect(ids).toContain('event');
      expect(ids).toContain('treasure');
      expect(ids).toContain('boss');
      expect(ids).not.toContain('graveyard');
      expect(tiles.length).toBe(7);
    });

    it('returns base tiles plus graveyard when unlocked', () => {
      const tiles = getAvailableTiles(['graveyard']);
      const ids = tiles.map(t => t.id);
      expect(ids).toContain('graveyard');
      expect(tiles.length).toBe(8);
    });
  });
});
