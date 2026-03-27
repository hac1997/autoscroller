---
phase: 04-content-meta-progression-persistence
verified: 2026-03-26T23:45:00Z
status: human_needed
score: 14/14 must-haves verified
re_verification: true
  previous_status: gaps_found
  previous_score: 11/14
  gaps_closed:
    - "BossExitScene safe exit now banks 100% meta-loot/XP via bankRunRewards('safe') and routes to CityHub"
    - "MainMenu startNewRun() and GameOverScene New Run both route to CityHub, not GameScene"
    - "RelicDefinition type in types.ts matches flat declarative JSON format; DataLoader cast compiles cleanly"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Verify full City Hub loop: boot game -> MainMenu New Run -> CityHub -> Tavern -> run -> death -> CityHub"
    expected: "CityHub shows 5 buildings in cross layout. Tavern allows seed entry. After death, Return to City lands on CityHub."
    why_human: "Phaser scene transitions and visual layout require browser runtime"
  - test: "Verify BossExitScene safe exit banks meta-loot and shows Return to City"
    expected: "Choosing Exit Run at boss screen routes to CityHub with run rewards banked"
    why_human: "Requires reaching a boss in gameplay; cannot be verified statically"
  - test: "Verify CityHub 5 buildings render in cross layout with correct hover behavior"
    expected: "5 colored rectangles with F/L/T/W/S icons, hover shows building name, click opens panel"
    why_human: "Visual layout and Phaser interaction requires browser runtime"
  - test: "Verify BuildingPanelScene upgrade preview shows locked items as silhouettes with hints"
    expected: "Locked unlock items show '???' and 'Unlock via Forge Lv.N' hint text"
    why_human: "Phaser rendering requires browser runtime"
  - test: "Verify CollectionScene 5 tabs with card/relic silhouettes for locked content"
    expected: "Locked cards show '???' name and 'Unlock via Forge Lv.1' hint. Tabs switch grid layout."
    why_human: "Phaser tab rendering requires browser runtime"
  - test: "Verify RelicHudStrip tooltip appears on hover during gameplay"
    expected: "Hovering a relic icon shows name, effect, and unlock source in tooltip above the icon"
    why_human: "Phaser pointer events require browser runtime"
---

# Phase 4: Content & Meta-Progression Persistence Verification Report

**Phase Goal:** The game has enough content for varied runs, permanent progression between runs, and reliable save/load across sessions.
**Verified:** 2026-03-26T23:45:00Z
**Status:** human_needed
**Re-verification:** Yes -- after gap closure plan 04-04

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | cards.json contains 15+ cards with id, name, category, cooldown, rarity, effects, optional unlockSource | VERIFIED | 15 entries confirmed; all have cooldown field; 4 starters have no unlockSource |
| 2 | relics.json contains 8 relics with id, name, rarity, trigger, effectType, optional unlockSource/unlockTier | VERIFIED | 8 entries; 3 commons have no unlockSource |
| 3 | enemies.json contains 6 base + 3 boss variants (tank, berserker, mage) | VERIFIED | 9 entries; boss_tank, boss_berserker, boss_mage with bossType field |
| 4 | events.json contains 5 events migrated from EventDefinitions.ts | VERIFIED | 5 entries including mysterious_merchant |
| 5 | buildings.json defines 5 buildings with 3-5 upgrade tiers (shrine maxLevel 3) | VERIFIED | forge/library/tavern/workshop/shrine present; shrine maxLevel=3 |
| 6 | MetaState interface exported with all required fields, createDefaultMetaState() works | VERIFIED | 331 tests pass; MetaState, RunHistoryEntry, createDefaultMetaState all exported |
| 7 | SeededRNG produces identical sequences from same seed string | VERIFIED | cyrb53+mulberry32 implementation; RNG tests pass |
| 8 | MetaPersistence reads/writes MetaState to separate IndexedDB store 'autoscroller-meta' | VERIFIED | createStore('autoscroller-meta', 'meta-state'); persistence tests pass |
| 9 | UnlockManager filters cards/relics/tiles by MetaState, always including no-unlockSource items | VERIFIED | getAvailableCards/getAvailableRelics/getAvailableTiles all use `!item.unlockSource` filter |
| 10 | MetaProgressionSystem upgrades buildings (deduct meta-loot, populate unlocks), banks run rewards (100%/25%), checks passive unlocks | VERIFIED | All MetaProgressionSystem tests pass; lootMultiplier and xpMultiplier correct |
| 11 | Phase 3 loot systems (LootGenerator, ShopSystem, EventResolver, TreasureSystem) call UnlockManager | VERIFIED | All 4 systems import getAvailableCards/getAvailableRelics |
| 12 | Player sees 5 clickable buildings in CityHubScene (META-01 visual hub) -- CityHub is reachable from MainMenu | VERIFIED | CityHubScene fully implemented; MainMenu.startNewRun() routes to 'CityHub'; GameOverScene New Run also routes to 'CityHub' |
| 13 | BossExitScene safe exit banks meta-loot and routes to CityHub | VERIFIED | bankRunRewards('safe'), saveMetaState, clearRun all called; this.scene.start('CityHub'); zero 'GameOverScene' references remain |
| 14 | TypeScript compiles without relic-type errors | VERIFIED | types.ts RelicDefinition has flat trigger/effectType fields; DataLoader.ts line 47 cast compiles without error; no relic-related tsc errors |

**Score: 14/14 truths verified**

---

## Gap Closure Verification

### Gap 1: BossExitScene safe exit -- CLOSED

`src/scenes/BossExitScene.ts` now imports `bankRunRewards` from `MetaProgressionSystem` and `loadMetaState`/`saveMetaState` from `MetaPersistence`. The `confirmSelection()` method is async and the safe exit branch calls `bankRunRewards(..., 'safe', ..., metaState)`, awaits `saveMetaState(updatedState)`, calls `clearRun()`, stops both scenes, and routes to `'CityHub'`. Zero occurrences of `'GameOverScene'` remain in the file.

### Gap 2: MainMenu CityHub routing -- CLOSED

`src/scenes/MainMenu.ts` `startNewRun()` ends with `this.scene.start('CityHub')`. The only remaining `'GameScene'` reference (line 68) is in `continueRun()`, which correctly resumes an in-progress run. `src/scenes/GameOverScene.ts` New Run button (line 65) also routes to `'CityHub'`. Main Menu button keeps `'MainMenu'` routing unchanged.

### Gap 3: RelicDefinition TypeScript type -- CLOSED

`src/data/types.ts` RelicDefinition interface (lines 96-113) has flat declarative fields: `trigger: RelicTrigger`, `effectType: string`, `stat?`, `stats?`, `value?`, `condition?`, `duration?`, `once_per?`. The old nested `effects: RelicEffectDefinition[]` is gone. `src/data/RelicDefinitions.ts` renamed local interfaces to `LegacyRelicDefinition` and `LegacyRelicEffect`. `src/objects/RelicManager.ts` imports `LegacyRelicDefinition`. `npx tsc --noEmit` produces zero relic-related errors; `src/data/DataLoader.ts` line 47 cast compiles cleanly.

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/data/json/cards.json` | 15 cards with cooldown, rarity, unlockSource | VERIFIED | 15 IDs; all required fields present |
| `src/data/json/relics.json` | 8 relics with declarative effectType format | VERIFIED | 8 IDs; 3 commons no unlockSource; 5 gated |
| `src/data/json/enemies.json` | 9 enemies including 3 boss variants | VERIFIED | boss_tank, boss_berserker, boss_mage present |
| `src/data/json/events.json` | 5 events | VERIFIED | 5 IDs including mysterious_merchant |
| `src/data/json/buildings.json` | 5 buildings with tier costs and unlocks | VERIFIED | shrine maxLevel=3 |
| `src/data/json/passives.json` | 5 warrior passive nodes | VERIFIED | 5 warrior passives with xpCost |
| `src/state/MetaState.ts` | MetaState, RunHistoryEntry, createDefaultMetaState | VERIFIED | All 3 exported |
| `src/systems/SeededRNG.ts` | SeededRNG class with cyrb53+mulberry32 | VERIFIED | cyrb53, mulberry32, random/intRange/pick/shuffle |
| `src/systems/MetaPersistence.ts` | IndexedDB via idb-keyval separate store | VERIFIED | 'autoscroller-meta' store name |
| `src/systems/UnlockManager.ts` | getAvailableCards/Relics/Tiles | VERIFIED | All 3 functions exported |
| `src/systems/MetaProgressionSystem.ts` | upgradeBuilding, bankRunRewards, checkPassiveUnlocks, getBuildingTierData | VERIFIED | All 4 functions exported |
| `src/systems/CollectionRegistry.ts` | getCollectionStatus, getCompletionPercent, getItemDetails | VERIFIED | All 3 functions exported |
| `src/scenes/CityHubScene.ts` | 5 buildings, cross layout, loadMetaState | VERIFIED | loadMetaState import; buildings at correct positions |
| `src/scenes/BuildingPanelScene.ts` | upgradeBuilding, saveMetaState, getBuildingTierData | VERIFIED | All 3 system imports present |
| `src/scenes/TavernPanelScene.ts` | SeededRNG, seed input, Start Run button, run history | VERIFIED | SeededRNG, DOM input, run history display |
| `src/scenes/CollectionScene.ts` | getCollectionStatus, 5 tabs (Cards/Relics/Tiles/Events/Bosses) | VERIFIED | TAB_NAMES const with all 5 tabs |
| `src/ui/RelicHudStrip.ts` | Compact relic display with scroll factor 0, depth 100 | VERIFIED | setScrollFactor(0), setDepth(100) |
| `src/ui/RelicTooltip.ts` | show/hide methods | VERIFIED | show() and hide() methods present |
| `src/ui/SeedDisplay.ts` | click-to-copy clipboard | VERIFIED | navigator.clipboard.writeText present |
| `src/ui/UnlockCelebration.ts` | playUnlockCelebration with tweens | VERIFIED | scale/alpha tweens, auto-destroy |
| `src/scenes/DeathScene.ts` | bankRunRewards import, Meta-Loot row, Return to City | VERIFIED | bankRunRewards, saveMetaState imported; Return to City button |
| `src/scenes/BossExitScene.ts` | bankRunRewards + saveMetaState + CityHub routing | VERIFIED (WAS FAILED) | All imports present; async confirmSelection; routes to 'CityHub' |
| `src/scenes/MainMenu.ts` | startNewRun routes to CityHub | VERIFIED (WAS FAILED) | Line 127: this.scene.start('CityHub') |
| `src/scenes/GameOverScene.ts` | New Run routes to CityHub | VERIFIED (WAS FAILED) | Line 65: this.scene.start('CityHub') |
| `src/data/types.ts` | RelicDefinition with flat trigger/effectType fields | VERIFIED (WAS FAILED) | Lines 96-113: trigger, effectType, stat, stats, value fields; no effects[] |
| `src/data/RelicDefinitions.ts` | Legacy types renamed to LegacyRelicDefinition | VERIFIED (WAS FAILED) | LegacyRelicDefinition, LegacyRelicEffect; RELICS uses LegacyRelicDefinition |
| `src/objects/RelicManager.ts` | Uses LegacyRelicDefinition | VERIFIED | Line 1: imports LegacyRelicDefinition |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/systems/MetaPersistence.ts` | `src/state/MetaState.ts` | imports MetaState + createDefaultMetaState | WIRED | Confirmed in initial verification |
| `src/data/json/buildings.json` | `src/data/json/cards.json` | forge tiers reference card IDs in unlocks | WIRED | Confirmed in initial verification |
| `src/systems/UnlockManager.ts` | `src/data/json/cards.json` | filters by unlockSource + unlockedCards | WIRED | Confirmed in initial verification |
| `src/systems/MetaProgressionSystem.ts` | `src/data/json/buildings.json` | reads tier costs/unlocks | WIRED | Confirmed in initial verification |
| `src/systems/LootGenerator.ts` | `src/systems/UnlockManager.ts` | calls getAvailableCards/getAvailableRelics | WIRED | Confirmed in initial verification |
| `src/systems/ShopSystem.ts` | `src/systems/UnlockManager.ts` | buildAvailableCardIds/RelicIds helpers | WIRED | Confirmed in initial verification |
| `src/scenes/CityHubScene.ts` | `src/systems/MetaPersistence.ts` | loadMetaState() in create() | WIRED | Confirmed in initial verification |
| `src/scenes/BuildingPanelScene.ts` | `src/systems/MetaProgressionSystem.ts` | upgradeBuilding + getBuildingTierData | WIRED | Confirmed in initial verification |
| `src/scenes/CollectionScene.ts` | `src/systems/CollectionRegistry.ts` | getCollectionStatus + getCompletionPercent | WIRED | Confirmed in initial verification |
| `src/scenes/TavernPanelScene.ts` | `src/systems/SeededRNG.ts` | new SeededRNG on Start Run | WIRED | Confirmed in initial verification |
| `src/scenes/BossExitScene.ts` | `src/systems/MetaProgressionSystem.ts` | import bankRunRewards | WIRED (WAS NOT_WIRED) | Line 5: import { bankRunRewards } from '../systems/MetaProgressionSystem' |
| `src/scenes/BossExitScene.ts` | `src/systems/MetaPersistence.ts` | import loadMetaState, saveMetaState | WIRED (WAS NOT_WIRED) | Line 6: import { loadMetaState, saveMetaState } from '../systems/MetaPersistence' |
| `src/scenes/MainMenu.ts` | `src/scenes/CityHubScene.ts` | scene.start('CityHub') | WIRED (WAS NOT_WIRED) | Line 127: this.scene.start('CityHub') |
| `src/scenes/GameOverScene.ts` | `src/scenes/CityHubScene.ts` | scene.start('CityHub') | WIRED (NEW) | Line 65: this.scene.start('CityHub') |
| `src/data/DataLoader.ts` | `src/data/types.ts` | RelicDefinition cast | WIRED (WAS BROKEN) | Line 47: relics = relicsData as RelicDefinition[] now compiles; no tsc error |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| CONT-01 | 04-01 | ~15 unique cards with distinct stats, cooldowns, targeting | SATISFIED | 15 cards in cards.json with cooldown field and category targeting |
| CONT-02 | 04-01 | ~8 relics with unique passive effects | SATISFIED | 8 relics in relics.json with declarative effectType |
| CONT-03 | 04-01 | 2-3 boss types | SATISFIED | 3 boss variants: boss_tank, boss_berserker, boss_mage |
| CONT-04 | 04-01 | ~5 narrative events with choices | SATISFIED | 5 events in events.json including mysterious_merchant |
| RELC-01 | 04-01, 04-03 | Passive relic items with unique effects (Slay the Spire style) | SATISFIED | 8 relics with passive/trigger mechanics; RelicHudStrip shows them during runs |
| RELC-02 | 04-02, 04-03 | Relics can modify cooldowns, stats, and combat mechanics | SATISFIED | Relics have effectType: stat_bonus, stat_multiplier etc.; MetaProgressionSystem unlocks them |
| RELC-03 | 04-02 | Relics obtained from drops, shop, and events | SATISFIED | LootGenerator, ShopSystem, EventResolver all wired to UnlockManager |
| RELC-04 | 04-01 | ~8 relics available in v1 | SATISFIED | Exactly 8 relics defined |
| META-01 | 04-03, 04-04 | Visual hub (camp/village) between runs displaying unlocks and progression | SATISFIED | CityHubScene implemented and now reachable: MainMenu New Run -> CityHub; BossExitScene safe exit -> CityHub; GameOverScene New Run -> CityHub; DeathScene Return to City -> CityHub |
| META-02 | 04-02 | Permanent unlock of new cards into loot pool | SATISFIED | upgradeBuilding populates unlockedCards; UnlockManager filters loot pool by unlock list |
| META-03 | 04-02 | Permanent unlock of new tile types | SATISFIED | upgradeBuilding (workshop) populates unlockedTiles; getAvailableTiles includes them |
| META-04 | 04-02 | Class XP and passive skill tree persist across runs | SATISFIED | classXP.warrior banked on safe exit; checkPassiveUnlocks on threshold; MetaPersistence saves to IndexedDB |
| PERS-02 | 04-01 | Meta-progression data persists across sessions | SATISFIED | MetaPersistence uses idb-keyval 'autoscroller-meta' store; DeathScene and BossExitScene both save on run end |
| PERS-03 | 04-01 | Seeded RNG for reproducible runs | SATISFIED | SeededRNG with cyrb53+mulberry32; TavernPanelScene passes seed to Game scene |

All 14 requirement IDs satisfied. No orphaned requirements found.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| Multiple test files | Various | Pre-existing TS6133 unused-variable errors and test module resolution errors | Info | 30 total tsc errors; none are in production source files modified by this phase. The 5 test failures (cards.test.ts, loot-system.test.ts, combat-engine.test.ts) are pre-existing -- confirmed identical before and after 04-04 by git stash check. No regressions introduced. |

No production-code anti-patterns or stubs were found in the files modified by plan 04-04.

---

## Test Suite Status

| Metric | Value | Notes |
|--------|-------|-------|
| Total tests | 336 | Expanded from the 62 cited in the initial plan (many new test files were added) |
| Passing | 331 | |
| Failing | 5 | Pre-existing; identical before and after 04-04 (verified via git stash) |
| Affected files | cards.test.ts, loot-system.test.ts, combat-engine.test.ts | Test expectation mismatches for card count (14 vs 15) and cooldown values -- test data out of date with content additions |

The 5 pre-existing failures do not affect Phase 4 goal achievement. They are test-data staleness issues unrelated to the three gaps that were closed.

---

## Human Verification Required

### 1. Full City Hub Loop

**Test:** Start the game. Click New Run from MainMenu. Verify CityHub loads with 5 buildings in cross layout. Click Tavern. Enter a seed and start a run. Die. Click Return to City. Verify CityHub loads again.
**Expected:** CityHub is the between-run home. Meta-loot balance top-left, "Warrior Lv.0" top-right, Collection button bottom-left.
**Why human:** Phaser scene transitions and visual layout require browser runtime.

### 2. BossExitScene Safe Exit Meta-Loot

**Test:** Play a run to a boss. Choose Exit Run in BossExitScene. Verify meta-loot/XP are banked and scene transitions to CityHub.
**Expected:** Meta-loot balance in CityHub increases by the run's earnings. Run history entry created.
**Why human:** Requires reaching a boss in gameplay; cannot be verified statically.

### 3. Building Upgrade Full Loop

**Test:** From CityHub, click Forge. Verify upgrade panel. If meta-loot available, click Upgrade. Verify UnlockCelebration animation plays. Verify Forge tier increases and new cards appear in Collection.
**Expected:** Animated "New Unlock!" text, card names shown, Forge level incremented in CityHub.
**Why human:** Animation timing, visual feedback, and panel close/reopen cycle require browser runtime.

### 4. Tavern Seed Input and Run Start

**Test:** Click Tavern in CityHub. Enter a specific seed (e.g. "test123"), click Start Run. Return to Tavern. Enter same seed again.
**Expected:** Run starts with that seed. Seed displayed in bottom-right HUD. Run history updates after run ends.
**Why human:** Seed determinism requires runtime; clipboard/toast requires browser.

### 5. Collection Scene Silhouettes

**Test:** Open Collection from CityHub. Cards tab should show 4 unlocked starter cards (strike, defend, heavy-hit, fireball) and 11 locked cards as silhouettes with "Unlock via Forge" hints.
**Expected:** Locked cards show dark background, "???" name, unlock hint text.
**Why human:** Phaser graphics and text rendering require browser runtime.

### 6. RelicHudStrip Tooltip During Gameplay

**Test:** Start a run and acquire a relic. Hover over a relic icon in the HUD strip.
**Expected:** Tooltip appears showing relic name, effect description, and unlock source.
**Why human:** Phaser pointer events require browser runtime.

---

## Re-verification Summary

All three gaps identified in the initial verification are now closed:

**Gap 1 (BossExitScene safe exit) -- CLOSED.** `BossExitScene.confirmSelection()` is now async. The safe exit branch imports and calls `bankRunRewards(..., 'safe', ...)`, awaits `saveMetaState`, calls `clearRun()`, and routes to `'CityHub'`. The erroneous `'GameOverScene'` routing is gone entirely.

**Gap 2 (MainMenu bypasses CityHub) -- CLOSED.** `MainMenu.startNewRun()` now routes to `'CityHub'`. `GameOverScene` New Run button also routes to `'CityHub'`. The full loop is now: Boot -> MainMenu -> CityHub -> Tavern -> Game -> Death/BossExit -> CityHub. `continueRun()` correctly keeps its `'GameScene'` routing for resuming in-progress runs.

**Gap 3 (RelicDefinition TypeScript type mismatch) -- CLOSED.** `src/data/types.ts` RelicDefinition interface has flat `trigger`/`effectType` fields matching relics.json. The old nested `effects: RelicEffectDefinition[]` is removed. Legacy RELICS const in `RelicDefinitions.ts` uses `LegacyRelicDefinition`. `DataLoader.ts` line 47 cast compiles without error. Zero relic-related tsc errors.

No regressions were introduced. The 5 test suite failures are pre-existing and confirmed unchanged by git stash comparison.

Phase 4 goal is fully achieved at the code level. Remaining items are browser-runtime verifications.

---

_Verified: 2026-03-26T23:45:00Z_
_Verifier: Claude (gsd-verifier)_
_Re-verification: Yes -- after gap closure plan 04-04_
