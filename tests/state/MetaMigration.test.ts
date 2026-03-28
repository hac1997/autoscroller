import { describe, it, expect } from 'vitest';
import { createDefaultMetaState, migrateMetaState } from '../../src/state/MetaState';

describe('MetaState v3 defaults', () => {
  it('createDefaultMetaState returns version 3', () => {
    expect(createDefaultMetaState().version).toBe(3);
  });

  it('createDefaultMetaState has tutorialSeen === false', () => {
    expect(createDefaultMetaState().tutorialSeen).toBe(false);
  });

  it('createDefaultMetaState has audioPrefs.sfxVolume === 1', () => {
    expect(createDefaultMetaState().audioPrefs.sfxVolume).toBe(1);
  });

  it('createDefaultMetaState has audioPrefs.sfxEnabled === true', () => {
    expect(createDefaultMetaState().audioPrefs.sfxEnabled).toBe(true);
  });

  it('createDefaultMetaState has gameSpeed === 1', () => {
    expect(createDefaultMetaState().gameSpeed).toBe(1);
  });

  it('createDefaultMetaState has autoSave === true', () => {
    expect(createDefaultMetaState().autoSave).toBe(true);
  });
});

describe('MetaState v3 migration paths', () => {
  it('v2 object without new fields migrates to v3 with defaults', () => {
    const v2 = {
      buildings: {
        forge: { level: 1 },
        library: { level: 0 },
        tavern: { level: 0 },
        workshop: { level: 0 },
        shrine: { level: 0 },
        storehouse: { level: 0 },
      },
      materials: { wood: 5 },
      classXP: { warrior: 50 },
      passivesUnlocked: [],
      unlockedCards: [],
      unlockedRelics: [],
      unlockedTiles: [],
      runHistory: [],
      totalRuns: 3,
      version: 2,
    };

    const result = migrateMetaState(v2);
    expect(result.version).toBe(3);
    expect(result.tutorialSeen).toBe(false);
    expect(result.audioPrefs).toEqual({ sfxVolume: 1, sfxEnabled: true });
    expect(result.gameSpeed).toBe(1);
    expect(result.autoSave).toBe(true);
  });

  it('v2 object with tutorialSeen: true preserves it', () => {
    const v2 = {
      buildings: {
        forge: { level: 0 },
        library: { level: 0 },
        tavern: { level: 0 },
        workshop: { level: 0 },
        shrine: { level: 0 },
        storehouse: { level: 0 },
      },
      materials: {},
      classXP: { warrior: 0 },
      passivesUnlocked: [],
      unlockedCards: [],
      unlockedRelics: [],
      unlockedTiles: [],
      runHistory: [],
      totalRuns: 0,
      tutorialSeen: true,
      version: 2,
    };

    const result = migrateMetaState(v2);
    expect(result.tutorialSeen).toBe(true);
  });

  it('v1 object migrates all the way to v3', () => {
    const v1 = {
      buildings: {
        forge: { level: 0 },
        library: { level: 0 },
        tavern: { level: 0 },
        workshop: { level: 0 },
        shrine: { level: 0 },
      },
      metaLoot: 50,
      classXP: { warrior: 0 },
      passivesUnlocked: [],
      unlockedCards: [],
      unlockedRelics: [],
      unlockedTiles: [],
      runHistory: [],
      totalRuns: 0,
      version: 1,
    };

    const result = migrateMetaState(v1);
    expect(result.version).toBe(3);
    expect(result.materials).toEqual({ essence: 50 });
    expect(result.tutorialSeen).toBe(false);
    expect(result.audioPrefs).toEqual({ sfxVolume: 1, sfxEnabled: true });
    expect(result.gameSpeed).toBe(1);
    expect(result.autoSave).toBe(true);
  });

  it('v3 object returns unchanged', () => {
    const v3 = {
      buildings: {
        forge: { level: 2 },
        library: { level: 1 },
        tavern: { level: 0 },
        workshop: { level: 1 },
        shrine: { level: 0 },
        storehouse: { level: 3 },
      },
      materials: { iron: 10 },
      classXP: { warrior: 200 },
      passivesUnlocked: [],
      unlockedCards: ['fury'],
      unlockedRelics: [],
      unlockedTiles: [],
      runHistory: [],
      totalRuns: 5,
      tutorialSeen: true,
      audioPrefs: { sfxVolume: 0.5, sfxEnabled: false },
      gameSpeed: 2,
      autoSave: false,
      version: 3,
    };

    const result = migrateMetaState(v3);
    expect(result).toEqual(v3);
  });
});
