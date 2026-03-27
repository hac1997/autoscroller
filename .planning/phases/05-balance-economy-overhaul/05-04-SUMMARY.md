---
phase: 05-balance-economy-overhaul
plan: 04
subsystem: ui, systems, persistence
tags: [materials, economy, metaLoot-removal, migration, stamina, mana, shop-pricing]

requires:
  - phase: 05-01
    provides: MetaState v2 with materials, migrateMetaState, multi-material building costs
  - phase: 05-03
    provides: rollMaterialDrops, ShopSystem scaling prices, getStorehouseEffects, RunEndResolver, DifficultyScaler

provides:
  - All scenes display materials instead of metaLoot
  - HUD shows compact material counts
  - MetaPersistence calls migrateMetaState for v1->v2 migration
  - CombatScene writes back stamina/mana for 50% recovery
  - BuildingPanelScene shows multi-material costs with per-material affordability
  - ShopScene uses scaling prices from ShopSystem
  - Storehouse building visible in CityHub

affects: [06-content-expansion, 07-polish-release]

tech-stack:
  added: []
  patterns: [material-economy-display, compact-hud-abbreviations, per-material-cost-affordability]

key-files:
  created: []
  modified:
    - src/systems/MetaPersistence.ts
    - src/systems/EventResolver.ts
    - src/systems/TreasureSystem.ts
    - src/scenes/BossExitScene.ts
    - src/scenes/DeathScene.ts
    - src/scenes/CityHubScene.ts
    - src/scenes/BuildingPanelScene.ts
    - src/scenes/ShopScene.ts
    - src/scenes/GameScene.ts
    - src/scenes/EventScene.ts
    - src/scenes/TreasureScene.ts
    - src/scenes/CombatScene.ts
    - src/ui/LoopHUD.ts

key-decisions:
  - "Storehouse building positioned at x:500 y:400 in CityHub layout (6th building)"
  - "LoopHUD material abbreviations: W/S/I/C/B/H/E for wood/stone/iron/crystal/bone/herbs/essence"
  - "DeathScene loads MetaState to get storehouse level for accurate retention percentage"

patterns-established:
  - "Materials adapter: scenes use run.economy.materials directly, no metaLoot fallback"
  - "Cost affordability: per-material green/red coloring in BuildingPanelScene"

requirements-completed: [BAL-INTEGRATION, BAL-MIGRATION]

duration: 8min
completed: 2026-03-27
---

# Phase 05 Plan 04: Material Economy Integration Summary

**All scenes, HUD, and persistence wired to multi-material economy with v1->v2 save migration and stamina/mana write-back for 50% combat recovery**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-27T19:44:55Z
- **Completed:** 2026-03-27T19:52:36Z
- **Tasks:** 3 (of 4; Task 4 is human-verify checkpoint)
- **Files modified:** 14

## Accomplishments
- Replaced all active metaLoot references across 13 source files with multi-material economy
- MetaPersistence now calls migrateMetaState for automatic v1->v2 save migration
- CombatScene writes back heroStamina and heroMana after combat, enabling 50% recovery between fights
- BuildingPanelScene shows per-material costs with green/red affordability indicators
- CityHub displays per-material inventory and includes Storehouse as 6th building
- LoopHUD shows compact material counts (W:15 S:8 I:12 C:3)
- ShopScene uses scaling prices from ShopSystem with loop count

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire material economy into backend systems and persistence** - `de398d2` (feat)
2. **Task 2a: Update economy-data scenes** - `2d0b0c1` (feat)
3. **Task 2b: Update shop/flow scenes, HUD, and stamina write-back** - `e880202` (feat)

**Auto-fix commit:** `7d4b8a7` (fix: TreasureSystem test metaLoot -> materials)

## Files Created/Modified
- `src/systems/MetaPersistence.ts` - Now calls migrateMetaState on IndexedDB load
- `src/systems/EventResolver.ts` - RunState interface uses materials instead of metaLoot
- `src/systems/TreasureSystem.ts` - RunState interface uses materials instead of metaLoot
- `src/scenes/BossExitScene.ts` - Shows per-material rewards, 10% death penalty text
- `src/scenes/DeathScene.ts` - Shows per-material retention with storehouse percentage
- `src/scenes/CityHubScene.ts` - Displays material inventory, storehouse building added
- `src/scenes/BuildingPanelScene.ts` - Multi-material cost display with affordability colors
- `src/scenes/ShopScene.ts` - Uses scaling prices, removed metaLoot from adapter
- `src/scenes/GameScene.ts` - Materials sync instead of metaLoot sync
- `src/scenes/EventScene.ts` - Removed metaLoot from adapter
- `src/scenes/TreasureScene.ts` - Removed metaLoot from adapter
- `src/scenes/CombatScene.ts` - Writes back currentStamina and currentMana after combat
- `src/ui/LoopHUD.ts` - Compact material display with abbreviations
- `tests/systems/TreasureSystem.test.ts` - Updated test fixture to use materials

## Decisions Made
- Storehouse building positioned at x:500 y:400 in CityHub, shrine moved to x:300 y:400 to accommodate
- LoopHUD uses single-letter abbreviations for materials (W/S/I/C/B/H/E), shows top 4
- DeathScene loads MetaState to get storehouse level for accurate retention percentage display
- Reorder price in ShopScene now uses ShopSystem.getReorderPrice instead of hardcoded 30g

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated TreasureSystem test fixture**
- **Found during:** Task 2b verification
- **Issue:** TreasureSystem.test.ts still used `metaLoot: 0` in makeRunState, causing TypeScript error after interface change
- **Fix:** Changed to `materials: {}` to match updated RunState interface
- **Files modified:** tests/systems/TreasureSystem.test.ts
- **Verification:** Tests pass (same pre-existing failures only)
- **Committed in:** 7d4b8a7

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary fix for test consistency. No scope creep.

## Issues Encountered
- Pre-existing test failures in loot-system.test.ts (3 tests) and combat-engine.test.ts (2 tests) unrelated to this plan's changes
- Pre-existing TypeScript warnings (unused variables, test type mismatches) not caused by this plan

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 05 balance/economy overhaul is complete pending human visual verification (Task 3 checkpoint)
- All systems, scenes, and HUD use material economy
- Ready for Phase 06 content expansion once verified

## Self-Check: PASSED

All 13 modified files verified present. All 4 commit hashes verified in git log.

---
*Phase: 05-balance-economy-overhaul*
*Completed: 2026-03-27*
