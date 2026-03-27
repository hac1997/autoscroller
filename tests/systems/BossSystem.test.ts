import { describe, it, expect, afterEach } from 'vitest';
import { triggerBossCombat, onBossVictory, getBossExitChoiceData } from '../../src/systems/BossSystem';
import { setRNG, resetRNG } from '../../src/systems/LootGenerator';

function makeRunState() {
  return {
    hero: { hp: 100, maxHp: 100, stamina: 50, maxStamina: 50, mana: 30, maxMana: 30, xp: 200 },
    deck: { cards: [], order: ['strike', 'defend'] },
    loop: { count: 3, length: 15, tiles: [], positionInLoop: 0, difficultyMultiplier: 1.2 },
    economy: { gold: 100, tilePoints: 5, materials: { essence: 20, crystal: 10 } },
    tileInventory: [],
    relics: [],
  };
}

describe('BossSystem', () => {
  afterEach(() => {
    resetRNG();
  });

  it('triggerBossCombat returns scaled boss stats with isBoss=true', () => {
    const run = makeRunState();
    const encounter = triggerBossCombat(run);
    expect(encounter.isBoss).toBe(true);
    expect(encounter.enemyId).toBe('boss_demon');
    expect(encounter.scaledStats.hp).toBeGreaterThan(0);
    expect(encounter.scaledStats.damage).toBeGreaterThan(0);
  });

  it('triggerBossCombat scales stats with loop count', () => {
    const run1 = makeRunState();
    run1.loop.count = 1;
    const enc1 = triggerBossCombat(run1);

    const run5 = makeRunState();
    run5.loop.count = 5;
    const enc5 = triggerBossCombat(run5);

    expect(enc5.scaledStats.hp).toBeGreaterThan(enc1.scaledStats.hp);
  });

  it('onBossVictory awards boss material drops to runState', () => {
    // Boss drops: essence 3-6, crystal 2-4 with rng=0 -> min values
    setRNG({ next: () => 0 });
    const run = makeRunState();
    const origEssence = run.economy.materials.essence;
    const result = onBossVictory(run);
    expect(result.materialsAwarded.essence).toBeGreaterThanOrEqual(3);
    expect(result.materialsAwarded.crystal).toBeGreaterThanOrEqual(2);
    expect(run.economy.materials.essence).toBe(origEssence + result.materialsAwarded.essence);
  });

  it('getBossExitChoiceData returns safe exit with full materials', () => {
    const run = makeRunState();
    const data = getBossExitChoiceData(run);
    expect(data.safeExitReward.exitType).toBe('safe');
    expect(data.safeExitReward.materials).toEqual(run.economy.materials);
    expect(data.safeExitReward.xp).toBe(run.hero.xp);
  });

  it('getBossExitChoiceData returns continue risk warning string', () => {
    const run = makeRunState();
    const data = getBossExitChoiceData(run);
    expect(data.continueRisk).toContain('Death');
    expect(data.continueRisk.length).toBeGreaterThan(0);
  });
});
