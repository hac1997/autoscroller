# Phase 5: Balance & Economy Overhaul - Research

**Researched:** 2026-03-27
**Domain:** Game balance tuning, multi-material economy, data-driven JSON config changes
**Confidence:** HIGH

## Summary

Phase 5 is a comprehensive rebalance of all numerical values across combat, economy, meta-progression, and difficulty scaling. The biggest structural change is replacing the single `metaLoot` currency with a multi-material economy (6-8 material types) that ties terrain placement to material farming strategy. The second largest change is reworking all shop prices to use scaling formulas with caps instead of flat values.

The existing codebase is well-structured for this work. All balance values live in JSON data files, systems use pure functions on RunState, and the DI patterns (injectable RNG, structuredClone immutability) enable deterministic testing. The core challenge is not architectural -- it is getting the numbers right so that combat feels 5-8s, starter deck remains viable, early tiers are 1-3 runs to unlock, and late tiers require 10-20 runs.

**Primary recommendation:** Structure work as data-first (JSON rebalance), then type changes (metaLoot to materials Record), then system logic updates (scaling formulas, resource reset), then Storehouse building addition. Each layer builds on the previous.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Combat target: 5-8s fights** early game (loop 1-3), achieved via +50% enemy HP AND -25% card damage
- **50% stamina/mana recovery between combats** (not 100% as currently implemented in CMBT-10)
- **Starter deck (4x Strike, 4x Defend, Heavy Hit, Fireball) must remain viable** for loops 1-3 without upgrades
- **Card shop prices scale with loop**: Base 60g + per-loop scaling, with cap
- **Card removal: flat + escalating per use**: Base 50g, increases per removal in same run, with cap
- **Deck reorder: cheap, escalates steeply per use**: Steeper than removal, with cap
- **Relic pricing: rarity-based + loop scaling with cap**
- **Replace single metaLoot with 6-8 distinct materials**: Dual sourcing from terrain + enemy
- **Building recipes are per-building, not uniform**: Themed to each building
- **Early tiers: 1-3 runs to unlock; Late tiers: 10-20 runs per upgrade**
- **6 buildings total**: Forge, Library, Tavern, Workshop, Shrine, Storehouse (new)
- **Storehouse: dual purpose** -- material gathering boost AND death material retention
- **Default death penalty: keep 10% materials, 0% XP** (currently 25%/0% -- harsher)
- **Storehouse upgrades retention from 10% to 50%** in +5% increments (8 tiers of retention)
- **Loop growth: diminishing with 40-tile hard cap** (+3, +2, +2, +1, +1...)
- **All gold price scaling has caps** -- no price goes to infinity

### Claude's Discretion
- Exact card damage and enemy HP values after rebalance
- Exact material types and names (within 6-8 range)
- Material drop rates per terrain and enemy type
- Building recipe costs per tier (within early=cheap, late=expensive guideline)
- Storehouse tier structure (which tiers give gathering, which give retention, which give both)
- Gold scaling formulas and caps for cards, removal, reorder, relics
- Difficulty scaling curve shape (linear/exponential/soft-cap)
- Boss frequency and multiplier values
- Loop growth diminishing formula (within 40-tile cap)
- Synergy balance adjustments if needed
- Relic impact tuning
- Card rarity weight adjustments for rewards

### Deferred Ideas (OUT OF SCOPE)
- Material trading between types (convert 3 wood to 1 iron)
- Dynamic difficulty adjustment based on player performance
- Per-class material bonuses (Warrior finds more iron, Mage finds more crystal)
</user_constraints>

## Architecture Patterns

### Data Change Impact Map

The following table maps every change to the specific files and code locations that must be modified:

| Change | JSON Files | TypeScript Systems | State Types |
|--------|-----------|-------------------|-------------|
| Combat rebalance (HP/damage) | `cards.json`, `enemies.json` | None (data-driven) | None |
| 50% resource reset | None | `CombatState.ts` (`createCombatState`) | None |
| Gold scaling formulas | `difficulty.json` (new fields) | `ShopSystem.ts` (all price methods) | None |
| Multi-material economy | `buildings.json` (recipe rework), new `materials.json` | `LootGenerator.ts`, `MetaProgressionSystem.ts`, `RunEndResolver.ts` | `MetaState.ts` (`metaLoot` -> `materials`), `EconomyState` in `RunState.ts` |
| Storehouse building | `buildings.json` (add storehouse) | `MetaProgressionSystem.ts` | `MetaState.ts` (add storehouse to buildings) |
| Death penalty rework | `difficulty.json` (change percentages) | `RunEndResolver.ts`, `MetaProgressionSystem.ts` | None |
| Difficulty curve | `difficulty.json` (new curve fields) | `DifficultyScaler.ts` | None |
| Loop growth diminishing | `difficulty.json` (new growth fields) | `DifficultyScaler.ts` or `LoopRunner.ts` | None |
| Terrain-material mapping | New `materials.json` or extend `terrain-enemies.json` | `LootGenerator.ts` | None |

### Recommended Project Structure for New Files

```
src/data/
  json/
    materials.json          # NEW: material definitions + terrain mapping
    buildings.json          # MODIFIED: multi-material costs, add storehouse
    cards.json              # MODIFIED: rebalanced damage values
    enemies.json            # MODIFIED: rebalanced HP values
    difficulty.json         # MODIFIED: new curve shape, loop growth config
    relics.json             # MODIFIED: impact tuning if needed
    synergies.json          # MODIFIED: bonus values if needed
  difficulty.json           # MODIFIED: scaling config, death penalty, material rates
src/state/
  MetaState.ts              # MODIFIED: metaLoot -> materials, add storehouse
  RunState.ts               # MODIFIED: add materials to economy or separate field
src/systems/
  ShopSystem.ts             # MODIFIED: scaling price formulas
  DifficultyScaler.ts       # MODIFIED: curve shape, loop growth
  LootGenerator.ts          # MODIFIED: material drops replace metaLoot
  MetaProgressionSystem.ts  # MODIFIED: multi-material costs, storehouse effects
  RunEndResolver.ts         # MODIFIED: per-material death penalty with storehouse check
```

### Pattern 1: Data-Driven Balance (Existing Pattern -- Extend)

**What:** All numerical values live in JSON; systems read JSON at import time via Vite static import.
**When to use:** Any balance value that might need tuning.
**Key insight:** The project already uses this pattern everywhere. Phase 5 extends it with new JSON fields -- no new pattern needed.

```typescript
// Current pattern in DifficultyScaler.ts -- extend, don't replace
import difficultyConfig from '../data/difficulty.json';
const config = difficultyConfig as DifficultyConfig;
```

### Pattern 2: Pure Functions on State (Existing Pattern)

**What:** Systems are stateless classes with static methods or pure exported functions that take state and return new state.
**When to use:** All system modifications in Phase 5.

```typescript
// ShopSystem pattern -- extend with loop parameter
static getCardPrice(basePrice: number, loopCount: number, config: PriceConfig): number {
  const scaled = basePrice + loopCount * config.cardPricePerLoop;
  return Math.min(scaled, config.cardPriceCap);
}
```

### Pattern 3: structuredClone for Immutable Updates (Existing Pattern)

**What:** MetaProgressionSystem uses `structuredClone(state)` before mutations.
**When to use:** All MetaState updates -- especially material deductions for building upgrades.

### Pattern 4: Material Economy as Record<string, number>

**What:** Replace `metaLoot: number` with `materials: Record<string, number>` in MetaState.
**When to use:** This is the core type change that cascades through all systems.

```typescript
// MetaState change
interface MetaState {
  // metaLoot: number;  // REMOVE
  materials: Record<string, number>;  // ADD
  // ...rest unchanged
}

// Building tier cost change
interface BuildingTierInfo {
  level: number;
  // cost: number;  // REMOVE
  cost: Record<string, number>;  // ADD -- e.g., { wood: 10, stone: 5 }
  unlocks: Record<string, string[]>;
}
```

### Anti-Patterns to Avoid
- **Mixing balance values in TypeScript code:** All tunable numbers belong in JSON. Do not hardcode scaling formulas with magic numbers in .ts files -- use config fields.
- **Breaking backward compatibility without migration:** MetaState has a `version` field. Incrementing it and adding a migration function for `metaLoot -> materials` is required so existing saves load correctly.
- **Touching CombatEngine internals for balance changes:** Card damage and enemy HP are data-driven. Do not modify CombatEngine.ts for balance tuning -- only for the 50% resource reset mechanic.

## Standard Stack

This phase requires no new libraries. All changes are to existing JSON data and TypeScript systems.

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| vitest | 4.1.2 | Test framework | Already installed |
| TypeScript | 5.2.2 | Type checking | Already installed |
| Phaser | 3.80.0 | Game engine | Already installed (no changes needed for Phase 5) |

**No new dependencies required.** Phase 5 is entirely data-driven tuning and system logic changes.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Price scaling formulas | Custom per-method math | Centralized config-driven formula in `ShopSystem` | One formula shape (base + loop * scale, capped) covers all cases -- cards, removal, reorder, relics |
| Material drop rates | Hardcoded rates per terrain | JSON lookup table in `materials.json` | Terrain-material mapping must be tunable without code changes |
| MetaState migration | Manual field renaming | Version-based migration function | `MetaState.version` already exists at v1; increment to v2 with automatic `metaLoot -> materials` conversion |
| Diminishing loop growth | Ad-hoc if/else chain | Config array or formula in `difficulty.json` | `[3, 2, 2, 1, 1, 1, ...]` is cleaner as data than code |

## Common Pitfalls

### Pitfall 1: Breaking Existing Saves (MetaState Migration)
**What goes wrong:** Changing `metaLoot: number` to `materials: Record<string, number>` breaks IndexedDB saves from Phase 4.
**Why it happens:** MetaState is persisted via idb-keyval. Old saves have `metaLoot`, not `materials`.
**How to avoid:** Increment `MetaState.version` to 2. Add migration: if loaded state has `metaLoot` and no `materials`, convert `metaLoot` to a starting material (e.g., distribute across basic materials or assign to a generic "essence" type). The `createDefaultMetaState()` factory must also be updated.
**Warning signs:** Game crashes on load after deploying Phase 5 changes.

### Pitfall 2: CombatState Resource Reset at Wrong Layer
**What goes wrong:** Implementing 50% reset in CombatEngine instead of CombatState factory.
**Why it happens:** `createCombatState()` currently resets stamina/mana to 100% (lines 46-47 of CombatState.ts). The 50% reset belongs HERE, not in the engine tick loop.
**How to avoid:** Change `createCombatState` to use `run.hero.currentStamina + (run.hero.maxStamina - run.hero.currentStamina) * 0.5` instead of `run.hero.maxStamina`. Same for mana. This means RunState must track current stamina/mana between combats (currently it only tracks max values via HeroState).
**Warning signs:** Resources always start at same level regardless of previous combat.

### Pitfall 3: RunState.economy Missing metaLoot Field
**What goes wrong:** `RunState.economy` currently has no `metaLoot` or `materials` field (it only has `gold`, `tilePoints`, `tileInventory`). The `metaLoot` tracking during runs is in `MetaState`, banked at run end.
**Why it happens:** Phase 3 design put meta-loot accumulation on MetaState, not RunState.
**How to avoid:** Add `materials: Record<string, number>` to `EconomyState` in RunState for in-run material tracking. At run end, `RunEndResolver` banks accumulated materials to MetaState (with death penalty applied).
**Warning signs:** Materials earned during a run are not tracked until banking.

### Pitfall 4: Dual difficulty.json Files
**What goes wrong:** There are TWO difficulty config files: `src/data/difficulty.json` (runtime scaling) and `src/data/json/difficulty.json` (difficulty mode presets). Editing the wrong one.
**Why it happens:** Phase 3 created `src/data/difficulty.json` for runtime config. Phase 4 created `src/data/json/difficulty.json` for difficulty mode presets (normal/hard).
**How to avoid:** Runtime scaling (percentPerLoop, bossMultiplier, death penalty, material rates, loop growth) goes in `src/data/difficulty.json`. Difficulty mode presets (shopCost multipliers, enemy HP multipliers) go in `src/data/json/difficulty.json`. Both may need changes but for different reasons.
**Warning signs:** Changes to scaling don't take effect, or mode-specific multipliers break.

### Pitfall 5: ShopSystem Local RunState Interface
**What goes wrong:** ShopSystem.ts defines its OWN local `RunState` interface (line 16-21) instead of importing from `src/state/RunState.ts`.
**Why it happens:** Likely a shortcut during Phase 3 to avoid import cycles.
**How to avoid:** When modifying ShopSystem for gold scaling, either update the local interface to include `loop.count` for loop-based pricing, or refactor to import the real RunState type. The local interface currently lacks `loop` and `relics` shape needed for scaling formulas.
**Warning signs:** TypeScript errors when trying to access `runState.loop.count` in price calculations.

### Pitfall 6: Starter Deck Viability After Damage Nerf
**What goes wrong:** Reducing card damage by 25% makes starter deck unable to kill loop 1 enemies before HP runs out.
**Why it happens:** Both sides (enemy HP up, card damage down) compound. If enemies have +50% HP and cards do -25% damage, effective TTK doubles.
**How to avoid:** Run the math: Starter deck DPS = (4*Strike@7.5 + 4*Defend@0 + HeavyHit@15 + Fireball@11.25) / total_cooldown_time. Compare to enemy EHP at loop 1. Target 5-8s means total enemy HP / deck DPS should be in that range. Test with the actual combat engine tick simulation.
**Warning signs:** Fights consistently exceed 10s at loop 1, or hero dies to loop 1 slimes.

## Code Examples

### Example 1: Scaling Price Formula (ShopSystem)

```typescript
// New config fields in difficulty.json (or a new pricing.json)
interface PricingConfig {
  cardBasePrice: number;        // 60
  cardPricePerLoop: number;     // e.g., 8
  cardPriceCap: number;         // e.g., 150

  removeBasePrice: number;      // 50
  removeEscalation: number;     // 25 per use
  removeCap: number;            // e.g., 200

  reorderBasePrice: number;     // 15
  reorderEscalation: number;    // 20 per use (steeper than removal)
  reorderCap: number;           // e.g., 150

  relicPriceByRarity: Record<string, number>;  // common: 80, rare: 150, epic: 250, legendary: 400
  relicPricePerLoop: number;    // e.g., 10
  relicPriceCap: Record<string, number>;        // per-rarity caps
}

// Implementation pattern
static getCardPrice(loopCount: number, config: PricingConfig): number {
  return Math.min(
    config.cardBasePrice + loopCount * config.cardPricePerLoop,
    config.cardPriceCap
  );
}

static getRemovalPrice(removalCount: number, config: PricingConfig): number {
  return Math.min(
    config.removeBasePrice + removalCount * config.removeEscalation,
    config.removeCap
  );
}
```

### Example 2: Material Drop System (LootGenerator)

```typescript
// materials.json structure
interface MaterialConfig {
  materials: Array<{
    id: string;          // "wood", "stone", "iron", "bone", "herbs", "crystal", "gems", "essence"
    name: string;
    description: string;
    rarity: "common" | "uncommon" | "rare";
  }>;
  terrainDrops: Record<string, {
    primary: string;     // main material from this terrain
    secondary?: string;  // rare secondary drop
    baseAmount: { min: number; max: number };
    secondaryChance: number;
  }>;
  enemyBonusDrops: Record<string, {
    material: string;
    amount: { min: number; max: number };
    chance: number;      // 0-1
  }>;
  bossDrops: {
    material: string;    // "gems" or "essence"
    amount: { min: number; max: number };
  };
}

// Replace rollMetaLoot with rollMaterialDrops
export function rollMaterialDrops(
  source: 'terrain' | 'enemy' | 'boss',
  terrainKey: string,
  loopCount: number,
  rng: RNG = activeRNG
): Record<string, number> {
  const drops: Record<string, number> = {};
  // ... lookup from materials.json config
  return drops;
}
```

### Example 3: MetaState Migration

```typescript
export function migrateMetaState(raw: any): MetaState {
  if (!raw.version || raw.version < 2) {
    // v1 -> v2: metaLoot -> materials
    const materials: Record<string, number> = {};
    // Convert old metaLoot to generic essence
    if (typeof raw.metaLoot === 'number') {
      materials['essence'] = raw.metaLoot;
    }
    return {
      ...raw,
      materials,
      buildings: {
        ...raw.buildings,
        storehouse: { level: 0 },  // Add new building
      },
      version: 2,
    };
  }
  return raw as MetaState;
}
```

### Example 4: 50% Resource Reset Between Combats

```typescript
// In CombatState.ts -- modify createCombatState
export function createCombatState(run: RunState, enemy: EnemyDefinition): CombatState {
  // 50% recovery: current + 50% of (max - current)
  const staminaRecovery = run.hero.currentStamina +
    Math.floor((run.hero.maxStamina - run.hero.currentStamina) * 0.5);
  const manaRecovery = run.hero.currentMana +
    Math.floor((run.hero.maxMana - run.hero.currentMana) * 0.5);

  return {
    // ...
    heroStamina: staminaRecovery,
    heroMana: manaRecovery,
    // ...
  };
}
```

**IMPORTANT:** This requires RunState.hero to persist `currentStamina` and `currentMana` between combats. Currently `createCombatState` ignores run stamina/mana and always uses max. The RunState hero already has `currentStamina` and `currentMana` fields -- we need to ensure they are written back after combat ends.

### Example 5: Diminishing Loop Growth

```typescript
// In difficulty.json
{
  "loopGrowth": {
    "schedule": [3, 2, 2, 1, 1],  // growth per boss kill (repeats last value)
    "maxTileLength": 40            // hard cap
  }
}

// In system code
export function getLoopGrowth(bossKillCount: number, config: LoopGrowthConfig): number {
  const idx = Math.min(bossKillCount, config.schedule.length - 1);
  return config.schedule[idx];
}

export function getLoopLength(baseTileLength: number, bossKillCount: number, config: LoopGrowthConfig): number {
  let length = baseTileLength;
  for (let i = 0; i < bossKillCount; i++) {
    length += getLoopGrowth(i, config);
  }
  return Math.min(length, config.maxTileLength);
}
```

## Combat Balance Analysis

### Current Numbers (Pre-Rebalance)

**Hero base stats:** 100 HP, 50 Stamina, 30 Mana, 1 Strength
**Starter deck (10 cards):**
- 4x Strike: 10 dmg, 1.0s cooldown, no cost
- 4x Defend: 5 armor, 1.0s cooldown, no cost
- 1x Heavy Hit: 20 dmg, 1.5s cooldown, 5 stamina
- 1x Fireball: 15 dmg, 1.5s cooldown, 5 mana

**Starter deck DPS estimate (single target, no synergies):**
- Total damage per cycle: 4(10) + 20 + 15 = 75 damage
- Total cooldown per cycle: 4(1.0) + 4(1.0) + 1.5 + 1.5 = 11s
- Effective DPS: ~6.8 dmg/s

**Weakest enemy (Slime, loop 1):** 100 HP, 8 dmg/2.5s = 3.2 DPS
- Current TTK: ~14.7s (already longer than stated "~2s" -- the CONTEXT.md "~2s" likely refers to player perception or a different measurement)

### Post-Rebalance Target

With -25% card damage and +50% enemy HP:
- New Strike: ~7-8 dmg
- New Heavy Hit: ~15 dmg
- New Fireball: ~11 dmg
- New starter DPS: ~5.1 dmg/s
- New Slime HP: ~150
- New TTK vs Slime: ~29s -- **too long**

**Key insight:** Applying both +50% HP and -25% damage simultaneously overshoots the 5-8s target significantly. The rebalance needs careful calibration. Options:
1. Smaller HP increase (~20%) with -25% damage nerf
2. Full HP increase with only ~10% damage nerf
3. Reduce the number of defensive cards in cycle (Defend cards add 0 DPS but consume cooldown time)

**Recommendation:** Start with moderate changes, test via combat engine simulation, iterate. The exact values are in Claude's discretion -- but the planner should allocate a task specifically for combat math validation.

### Resource Pressure at 50% Reset

With 50% stamina/mana recovery between fights:
- After fight 1: stamina = 50% of max = 25 (if fully depleted)
- Heavy Hit (5 stamina) usable 5 times before running dry
- Fireball (5 mana) usable 3 times at 15 mana (50% of 30)
- After 3 consecutive fights: resources are thin, rest tiles become critical

This creates the desired attrition pressure.

## State of the Art

| Old Approach (Phase 1-4) | New Approach (Phase 5) | Impact |
|--------------------------|------------------------|--------|
| `metaLoot: number` single currency | `materials: Record<string, number>` multi-material | All meta-progression costs, drops, banking, death penalty affected |
| Flat shop prices (60g cards, 30g reorder, 75/deckSize removal) | Scaling formulas with loop/use count + caps | ShopSystem complete rework |
| 100% stamina/mana reset between combats | 50% recovery between combats | CombatState factory change, RunState must persist resources |
| 25% meta-loot on death | 10% materials on death (upgradeable to 50% via Storehouse) | RunEndResolver + Storehouse integration |
| Fixed loop growth (+3 per boss) | Diminishing growth with 40-tile cap | DifficultyScaler or LoopRunner change |
| 5 buildings, single-cost tiers | 6 buildings, multi-material recipe tiers | buildings.json rework + MetaProgressionSystem update |

## Open Questions

1. **Stamina/Mana Persistence Between Combats**
   - What we know: `createCombatState()` currently resets to max. RunState.hero has `currentStamina`/`currentMana` fields.
   - What's unclear: Where does the combat result write back to RunState? Need to find the scene-level code that bridges CombatEngine results back to RunState.hero.
   - Recommendation: Search for the combat-end handler that updates RunState. The 50% reset depends on RunState tracking post-combat resource levels.

2. **Two difficulty.json Files**
   - What we know: `src/data/difficulty.json` has runtime config; `src/data/json/difficulty.json` has mode presets.
   - What's unclear: Whether mode presets should override Phase 5 scaling config (e.g., hard mode has different scaling caps).
   - Recommendation: Keep both files. Phase 5 modifies `src/data/difficulty.json` for runtime config. Mode presets can multiply on top.

3. **Material Economy Exact Numbers**
   - What we know: 6-8 materials, dual sourcing terrain+enemy, early tiers 1-3 runs, late tiers 10-20 runs.
   - What's unclear: Exact quantities per drop, building recipe costs -- these determine entire progression curve.
   - Recommendation: Design a "material budget" spreadsheet logic: materials-per-run-average * runs-to-unlock = tier cost. Work backward from "1-3 runs for tier 1" and "10-20 runs for max tier."

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements -> Test Map

Phase 5 has no formal requirement IDs (post-v1). Using functional requirements from CONTEXT.md:

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BAL-01 | Combat 5-8s with starter deck vs loop 1 enemies | unit | `npx vitest run tests/systems/combat/balance-validation.test.ts -t "fight duration"` | No -- Wave 0 |
| BAL-02 | 50% stamina/mana recovery between combats | unit | `npx vitest run tests/systems/combat/combat-state.test.ts -t "resource reset"` | Partial -- file exists, test case needed |
| BAL-03 | Card shop prices scale with loop count | unit | `npx vitest run tests/systems/ShopSystem.test.ts -t "scaling"` | Partial -- file exists |
| BAL-04 | Removal/reorder cost escalates per use with cap | unit | `npx vitest run tests/systems/ShopSystem.test.ts -t "escalation"` | Partial -- file exists |
| BAL-05 | Material drops from terrain and enemies | unit | `npx vitest run tests/systems/LootGenerator.test.ts -t "material"` | Partial -- file exists |
| BAL-06 | Building upgrades cost multi-material recipes | unit | `npx vitest run tests/systems/MetaProgressionSystem.test.ts -t "material cost"` | Partial -- file exists |
| BAL-07 | Death penalty: 10% materials, 0% XP | unit | `npx vitest run tests/systems/RunEndResolver.test.ts -t "death penalty"` | Partial -- file exists |
| BAL-08 | Storehouse gathering boost and death retention | unit | `npx vitest run tests/systems/MetaProgressionSystem.test.ts -t "storehouse"` | No -- Wave 0 |
| BAL-09 | Loop growth diminishing with 40-tile cap | unit | `npx vitest run tests/systems/DifficultyScaler.test.ts -t "loop growth"` | Partial -- file exists |
| BAL-10 | MetaState v1->v2 migration (metaLoot to materials) | unit | `npx vitest run tests/state/meta-migration.test.ts` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose` (full suite, < 30s)
- **Per wave merge:** Same (fast enough for full suite)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/systems/combat/balance-validation.test.ts` -- covers BAL-01 (combat duration simulation)
- [ ] `tests/state/meta-migration.test.ts` -- covers BAL-10 (MetaState v1->v2 migration)
- [ ] Update `tests/systems/combat/combat-state.test.ts` -- add BAL-02 (50% resource reset)
- [ ] Update `tests/systems/ShopSystem.test.ts` -- add BAL-03, BAL-04 (scaling prices)
- [ ] Update `tests/systems/LootGenerator.test.ts` -- add BAL-05 (material drops)
- [ ] Update `tests/systems/MetaProgressionSystem.test.ts` -- add BAL-06, BAL-08 (multi-material costs, storehouse)
- [ ] Update `tests/systems/RunEndResolver.test.ts` -- add BAL-07 (10% death penalty)
- [ ] Update `tests/systems/DifficultyScaler.test.ts` -- add BAL-09 (diminishing loop growth)

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis of all files listed in CONTEXT.md canonical references
- `src/systems/ShopSystem.ts` -- current flat pricing implementation
- `src/systems/DifficultyScaler.ts` -- current linear scaling
- `src/systems/LootGenerator.ts` -- current metaLoot drop system
- `src/systems/MetaProgressionSystem.ts` -- current single-currency building upgrades
- `src/systems/RunEndResolver.ts` -- current 25%/0% death penalty
- `src/systems/combat/CombatState.ts` -- current 100% resource reset
- `src/systems/combat/CombatEngine.ts` -- tick-driven combat loop
- `src/state/MetaState.ts` -- current state shape with `metaLoot: number`
- `src/state/RunState.ts` -- current economy shape
- All JSON data files (cards, enemies, buildings, difficulty, relics, synergies, terrain-enemies)

### Secondary (MEDIUM confidence)
- Combat DPS calculations are estimates based on card data and cooldowns; actual combat has regen, synergies, and conditional effects that alter outcomes
- The "~2s fight" claim from CONTEXT.md may be inaccurate -- raw DPS math suggests ~15s for Slime at loop 1; actual testing needed

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, existing codebase fully analyzed
- Architecture: HIGH - all systems read, all data files mapped, patterns documented
- Combat balance math: MEDIUM - theoretical DPS calculations need combat engine simulation to validate
- Pitfalls: HIGH - save migration, dual config files, resource persistence identified from direct code reading

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (stable -- internal game project, no external dependency changes)
