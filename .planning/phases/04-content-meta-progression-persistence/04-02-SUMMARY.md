---
phase: 04-content-meta-progression-persistence
plan: 02
subsystem: game-systems
tags: [meta-progression, unlock-manager, collection-registry, loot-filtering, building-upgrades]

# Dependency graph
requires:
  - phase: 03-loop-tile-world
    provides: LootGenerator, ShopSystem, EventResolver, TreasureSystem loot systems
  - phase: 04-content-meta-progression-persistence (plan 01)
    provides: JSON data files (cards, relics, buildings, passives, enemies, events)
provides:
  - UnlockManager with loot pool filtering by MetaState unlock lists
  - MetaProgressionSystem with building upgrades, run-end banking, passive unlocks
  - CollectionRegistry with collection status tracking for all content categories
  - Phase 3 loot systems wired to filter by MetaState unlock state (RELC-03)
affects: [04-content-meta-progression-persistence plan 03, ui-scenes, persistence]

# Tech tracking
tech-stack:
  added: []
  patterns: [pure-function-systems, structuredClone-immutability, optional-parameter-backward-compat]

key-files:
  created:
    - src/systems/UnlockManager.ts
    - src/systems/MetaProgressionSystem.ts
    - src/systems/CollectionRegistry.ts
    - src/state/MetaState.ts
    - src/data/json/buildings.json
    - src/data/json/passives.json
    - tests/systems/UnlockManager.test.ts
    - tests/systems/MetaProgressionSystem.test.ts
    - tests/systems/CollectionRegistry.test.ts
  modified:
    - src/systems/LootGenerator.ts
    - src/systems/ShopSystem.ts
    - src/systems/EventResolver.ts
    - src/systems/TreasureSystem.ts
    - src/data/json/cards.json
    - src/data/json/relics.json

key-decisions:
  - "MetaState, buildings.json, passives.json created as Plan 01 dependencies (Rule 3 auto-fix)"
  - "Cards/relics JSON extended with unlockSource/unlockTier fields for gated content"
  - "UnlockManager uses pure functions filtering by string[] unlock lists (no Phaser dependency)"
  - "structuredClone used for immutable state updates in MetaProgressionSystem"
  - "Backward-compatible optional unlockState parameter in all Phase 3 loot systems"

patterns-established:
  - "Pure function systems: MetaState in, MetaState out (no side effects)"
  - "Optional parameter backward compatibility: existing callers work without changes"
  - "unlockSource field pattern: items without unlockSource are always available (starters)"

requirements-completed: [RELC-02, RELC-03, META-02, META-03, META-04]

# Metrics
duration: 7min
completed: 2026-03-26
---

# Phase 04 Plan 02: Meta Progression Systems Summary

**Pure TypeScript unlock filtering, building upgrades, run-end banking, passive skill unlocks, and collection tracking -- wired into Phase 3 loot systems for RELC-03**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-26T22:12:02Z
- **Completed:** 2026-03-26T22:19:07Z
- **Tasks:** 4
- **Files modified:** 15

## Accomplishments
- UnlockManager filters cards/relics/tiles by MetaState unlock lists (starters always available)
- MetaProgressionSystem handles building upgrades (meta-loot deduction, unlock population), run-end banking (100%/25% loot, XP loss on death), and passive skill unlocks (XP threshold checks)
- CollectionRegistry reports total/unlocked counts for all 5 content categories with completion percentage
- Phase 3 loot systems (LootGenerator, ShopSystem, EventResolver, TreasureSystem) now filter pools by MetaState unlock state
- 33 new unit tests across 3 test files, all passing

## Task Commits

Each task was committed atomically:

1. **Task 1: UnlockManager** - `54dda51` (feat) - loot pool filtering by MetaState + 8 tests
2. **Task 2: MetaProgressionSystem** - `955ea19` (feat) - building upgrades, banking, passives + 13 tests
3. **Task 3: CollectionRegistry** - `f73d2a5` (feat) - collection status tracking + 12 tests
4. **Task 4: Wire UnlockManager into Phase 3** - `62194c2` (feat) - LootGenerator, ShopSystem, EventResolver, TreasureSystem wiring

_Tasks 1-3 followed TDD flow (RED/GREEN phases)_

## Files Created/Modified
- `src/systems/UnlockManager.ts` - Pure functions: getAvailableCards, getAvailableRelics, getAvailableTiles
- `src/systems/MetaProgressionSystem.ts` - upgradeBuilding, bankRunRewards, checkPassiveUnlocks, getBuildingTierData
- `src/systems/CollectionRegistry.ts` - getCollectionStatus, getCompletionPercent, getItemDetails
- `src/state/MetaState.ts` - MetaState interface, RunHistoryEntry, createDefaultMetaState
- `src/data/json/buildings.json` - 5 buildings (forge, library, tavern, workshop, shrine) with tier costs/unlocks
- `src/data/json/passives.json` - Warrior passive skills with XP cost thresholds
- `src/data/json/cards.json` - Added unlockSource/unlockTier to 11 gated cards, counter-strike added
- `src/data/json/relics.json` - Added unlockSource/unlockTier to 5 gated relics
- `src/systems/LootGenerator.ts` - rollTreasureLoot accepts optional unlockState, picks from filtered pools
- `src/systems/ShopSystem.ts` - buildAvailableCardIds/buildAvailableRelicIds helpers
- `src/systems/EventResolver.ts` - resolveEventChoice filters card/relic rewards by unlock state
- `src/systems/TreasureSystem.ts` - openTreasure passes unlockState through to rollTreasureLoot
- `tests/systems/UnlockManager.test.ts` - 8 tests
- `tests/systems/MetaProgressionSystem.test.ts` - 13 tests
- `tests/systems/CollectionRegistry.test.ts` - 12 tests

## Decisions Made
- Created MetaState.ts, buildings.json, passives.json as Plan 01 dependencies (these are pure data/type definitions needed by this plan's systems)
- Extended cards.json with unlockSource/unlockTier fields: 4 starters always available, 11 gated behind forge/library upgrades
- Extended relics.json with unlockSource/unlockTier: 3 commons always available, 5 gated behind shrine upgrades
- Used structuredClone for immutable state updates in MetaProgressionSystem (pure function pattern)
- All Phase 3 wiring uses optional parameters defaulting to empty arrays for backward compatibility

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created Plan 01 data dependencies**
- **Found during:** Task 1 (UnlockManager)
- **Issue:** MetaState.ts, buildings.json, passives.json did not exist (Plan 01 artifacts)
- **Fix:** Created the three files with interfaces and data matching plan specifications
- **Files modified:** src/state/MetaState.ts, src/data/json/buildings.json, src/data/json/passives.json
- **Verification:** All imports resolve, tests pass
- **Committed in:** 54dda51 (Task 1 commit)

**2. [Rule 1 - Bug] Added unlockSource fields to cards.json and relics.json**
- **Found during:** Task 1 (UnlockManager)
- **Issue:** Existing cards.json and relics.json had no unlockSource fields, making filtering impossible
- **Fix:** Added unlockSource/unlockTier to 11 cards and 5 relics based on building tier data
- **Files modified:** src/data/json/cards.json, src/data/json/relics.json
- **Verification:** UnlockManager tests correctly filter starter vs gated content
- **Committed in:** 54dda51 (Task 1 commit)

**3. [Rule 1 - Bug] Adjusted boss count in CollectionRegistry test**
- **Found during:** Task 3 (CollectionRegistry)
- **Issue:** enemies.json was enriched with 3 additional bosses (4 total), test expected 1
- **Fix:** Updated test assertion to expect 4 bosses matching actual data
- **Files modified:** tests/systems/CollectionRegistry.test.ts
- **Verification:** Test passes with correct count
- **Committed in:** f73d2a5 (Task 3 commit)

---

**Total deviations:** 3 auto-fixed (2 blocking, 1 bug)
**Impact on plan:** All auto-fixes necessary for execution. Plan 01 dependencies created minimally. No scope creep.

## Issues Encountered
- Pre-existing test failure in tests/systems/combat/combat-engine.test.ts (heroCooldownTimer assertion) -- unrelated to Phase 4 changes, out of scope

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 3 meta-progression systems ready for UI integration (Plan 03)
- UnlockManager wiring complete -- Phase 3 loot systems filter by MetaState
- MetaState persistence (save/load to IndexedDB) needed in Plan 03

## Self-Check: PASSED

All 9 created files verified on disk. All 4 task commits (54dda51, 955ea19, f73d2a5, 62194c2) verified in git log.

---
*Phase: 04-content-meta-progression-persistence*
*Completed: 2026-03-26*
