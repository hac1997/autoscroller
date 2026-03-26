import { describe, it, expect } from 'vitest';
import { createDefaultMetaState } from '../../src/state/MetaState';
import {
  getCollectionStatus,
  getCompletionPercent,
  getItemDetails,
} from '../../src/systems/CollectionRegistry';

describe('CollectionRegistry', () => {
  describe('getCollectionStatus', () => {
    it('returns cards total=15 and unlocked count matching cards with no unlockSource', () => {
      const state = createDefaultMetaState();
      const status = getCollectionStatus(state);
      expect(status.cards.total).toBe(15);
      // Starter cards (no unlockSource): strike, heavy-hit, defend, fireball = 4
      expect(status.cards.unlocked).toBe(4);
    });

    it('returns cards total=15 and unlocked=15 when all cards are unlocked', () => {
      const state = createDefaultMetaState();
      state.unlockedCards = [
        'fury', 'berserker', 'shield-wall', 'fortify', 'iron-skin',
        'heal', 'arcane-shield', 'rejuvenate', 'mana-drain', 'weaken',
        'counter-strike',
      ];
      const status = getCollectionStatus(state);
      expect(status.cards.total).toBe(15);
      expect(status.cards.unlocked).toBe(15);
    });

    it('returns relics total=8 and unlocked=3 for default state (3 commons always available)', () => {
      const state = createDefaultMetaState();
      const status = getCollectionStatus(state);
      expect(status.relics.total).toBe(8);
      expect(status.relics.unlocked).toBe(3);
    });

    it('returns bosses total matching boss-type enemies in data', () => {
      const state = createDefaultMetaState();
      const status = getCollectionStatus(state);
      // enemies.json has 4 bosses: boss_demon, boss_tank, boss_berserker, boss_mage
      expect(status.bosses.total).toBe(4);
    });

    it('returns events total=5', () => {
      const state = createDefaultMetaState();
      const status = getCollectionStatus(state);
      expect(status.events.total).toBe(5);
    });

    it('returns tiles with base tiles unlocked and unlockable tiles locked', () => {
      const state = createDefaultMetaState();
      const status = getCollectionStatus(state);
      expect(status.tiles.total).toBe(10); // 7 base + 3 unlockable
      expect(status.tiles.unlocked).toBe(7); // only base tiles
    });
  });

  describe('getCompletionPercent', () => {
    it('returns 0-100 integer for default state', () => {
      const state = createDefaultMetaState();
      const percent = getCompletionPercent(state);
      expect(percent).toBeGreaterThanOrEqual(0);
      expect(percent).toBeLessThanOrEqual(100);
      expect(Number.isInteger(percent)).toBe(true);
    });

    it('returns higher percent when more items are unlocked', () => {
      const defaultState = createDefaultMetaState();
      const unlockedState = createDefaultMetaState();
      unlockedState.unlockedCards = ['fury', 'berserker', 'shield-wall'];
      unlockedState.unlockedRelics = ['warrior_spirit'];
      expect(getCompletionPercent(unlockedState)).toBeGreaterThan(getCompletionPercent(defaultState));
    });
  });

  describe('getItemDetails', () => {
    it('returns card data with isUnlocked=false and unlockHint for gated card', () => {
      const state = createDefaultMetaState();
      const details = getItemDetails('fury', state);
      expect(details).toBeDefined();
      expect(details!.id).toBe('fury');
      expect(details!.isUnlocked).toBe(false);
      expect(details!.unlockHint).toContain('Forge');
    });

    it('returns card data with isUnlocked=true for unlocked card', () => {
      const state = createDefaultMetaState();
      state.unlockedCards = ['fury'];
      const details = getItemDetails('fury', state);
      expect(details!.isUnlocked).toBe(true);
    });

    it('returns card data with isUnlocked=true for starter card', () => {
      const state = createDefaultMetaState();
      const details = getItemDetails('strike', state);
      expect(details!.isUnlocked).toBe(true);
      expect(details!.unlockHint).toBeUndefined();
    });

    it('returns undefined for unknown item', () => {
      const state = createDefaultMetaState();
      const details = getItemDetails('nonexistent', state);
      expect(details).toBeUndefined();
    });
  });
});
