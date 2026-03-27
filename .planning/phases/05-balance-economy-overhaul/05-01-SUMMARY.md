---
phase: 05-balance-economy-overhaul
plan: 01
subsystem: data, state, economy
tags: [materials, balance, migration, json, metastate, economy]

# Dependency graph
requires:
  - phase: 04-content-meta-progression-persistence
    provides: MetaState v1, buildings.json, RunState, card/enemy/relic JSON data
provides:
  - MetaState v2 with materials Record and storehouse building
  - migrateMetaState() v1->v2 migration function
  - materials.json with 7 material types and drop mappings
  - Rebalanced card damage (~20% reduction), enemy HP (~30% increase)
  - Multi-material building costs with storehouse (8 tiers)
  - Pricing config, loop growth schedule, death penalty in difficulty.json
  - EconomyState.materials for in-run material tracking
  - PricingConfig, LoopGrowthConfig, MaterialDropConfig type interfaces
affects: [05-02, 05-03, 05-04, combat-engine, loot-system, shop-system]

# Tech tracking
tech-stack:
  added: []
  patterns: [multi-material-economy, record-based-costs, state-migration]

key-files:
  created:
    - src/data/json/materials.json
    - tests/state/meta-migration.test.ts
  modified:
    - src/state/MetaState.ts
    - src/state/RunState.ts
    - src/data/types.ts
    - src/data/json/cards.json
    - src/data/json/enemies.json
    - src/data/json/buildings.json
    - src/data/json/relics.json
    - src/data/json/synergies.json
    - src/data/difficulty.json
    - src/data/json/difficulty.json
    - src/systems/MetaProgressionSystem.ts

key-decisions:
  - "Multi-material costs use Record<string, number> for flexible recipe system"
  - "Migration converts metaLoot to materials.essence (backward-compatible)"
  - "Compound balance: ~20% damage nerf + ~30% HP buff = ~2x TTK increase (5-8s target)"
  - "Storehouse building has 8 tiers mixing gathering boost and death retention"
  - "Death penalty reduced from 25% to 10% material retention (materials harder to earn)"

patterns-established:
  - "Record<string, number> for all material/cost fields (not single number)"
  - "State migration pattern: migrateMetaState(raw) -> MetaState for save compat"
  - "Building cost affordability check iterates over cost entries per material"

requirements-completed: [BAL-TYPES, BAL-DATA, BAL-MIGRATION]

# Metrics
duration: 11min
completed: 2026-03-27
---

# Phase 05 Plan 01: Data Foundation and Type System Summary

**MetaState v2 with multi-material economy, 7-material drop system, and combat rebalance targeting 2x TTK increase**

## Performance

- **Duration:** 11 min
- **Started:** 2026-03-27T19:20:48Z
- **Completed:** 2026-03-27T19:31:23Z
- **Tasks:** 3
- **Files modified:** 22

## Accomplishments
- MetaState v2 type system with materials Record, storehouse building, and v1->v2 migration
- Complete material economy data: 7 materials, terrain drops, enemy bonus drops, boss drops
- Combat rebalance: ~20% card damage reduction + ~30% enemy HP increase for 5-8s fight target
- Multi-material building costs with 6 buildings (including new Storehouse with 8 tiers)
- Pricing, loop growth, and death penalty configs in difficulty.json
- 9 migration tests covering null, undefined, v1->v2, passthrough, and field preservation

## Task Commits

Each task was committed atomically:

1. **Task 1: Update MetaState and RunState types with material economy + migration** - `7d494ab` (feat)
2. **Task 2: Create materials.json and rebalance all JSON data files** - `eea887f` (feat)
3. **Task 3: MetaState migration tests** - `fd90c85` (test)

## Files Created/Modified
- `src/state/MetaState.ts` - MetaState v2 with materials, storehouse, migrateMetaState()
- `src/state/RunState.ts` - EconomyState.materials for in-run tracking
- `src/data/types.ts` - PricingConfig, LoopGrowthConfig, MaterialDropConfig interfaces
- `src/data/json/materials.json` - 7 material types with terrain/enemy/boss drop mappings
- `src/data/json/cards.json` - Rebalanced damage values (~20% reduction)
- `src/data/json/enemies.json` - Rebalanced HP (~30% increase), materialReward field
- `src/data/json/buildings.json` - Multi-material costs, storehouse building (8 tiers)
- `src/data/json/relics.json` - Common relics slightly tuned down
- `src/data/json/synergies.json` - Bonus damage reduced ~20%
- `src/data/difficulty.json` - Pricing config, loop growth, 10% death penalty
- `src/data/json/difficulty.json` - Mode presets with updated shop costs
- `src/systems/MetaProgressionSystem.ts` - Multi-material cost checking/deduction
- `tests/state/meta-migration.test.ts` - 9 migration test cases

## Decisions Made
- Used ~20% damage nerf + ~30% HP buff (not 25%/50% from CONTEXT) to achieve 2x TTK without overshooting
- Storehouse building alternates gathering boost and death retention effects across 8 tiers
- Death penalty reduced from 25% to 10% since materials are harder to earn individually
- Building costs themed by material affinity (Forge=iron+crystal, Library=wood+bone, etc.)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed downstream metaLoot references broken by MetaState v2**
- **Found during:** Task 1 (MetaState type update)
- **Issue:** Removing metaLoot field broke CityHubScene, BuildingPanelScene, MetaProgressionSystem, BossExitScene, DeathScene, and 6 test files
- **Fix:** Updated all direct MetaState.metaLoot references to use materials Record, converted bankRunRewards to accept Record<string, number>, added materials:{} to all test EconomyState fixtures
- **Files modified:** CityHubScene.ts, BuildingPanelScene.ts, MetaProgressionSystem.ts, BossExitScene.ts, DeathScene.ts, 6 test files
- **Verification:** TypeScript compiles (no new errors), all affected tests pass
- **Committed in:** 7d494ab (Task 1 commit)

**2. [Rule 3 - Blocking] Implemented multi-material cost deduction in upgradeBuilding**
- **Found during:** Task 2 (buildings.json cost format change)
- **Issue:** upgradeBuilding compared against numeric cost but buildings now use Record<string, number>
- **Fix:** Implemented per-material affordability check and deduction loop
- **Files modified:** MetaProgressionSystem.ts
- **Verification:** MetaProgressionSystem tests pass with correct material deduction
- **Committed in:** eea887f (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes necessary for type consistency. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All type contracts established for Plans 02-04 to implement against
- materials.json ready for MaterialDropSystem (Plan 02)
- Pricing config ready for ShopSystem rework (Plan 03)
- Building costs ready for multi-material purchasing UI (Plan 03/04)
- Migration function ready for MetaPersistence integration (Plan 02)

---
*Phase: 05-balance-economy-overhaul*
*Completed: 2026-03-27*

## Self-Check: PASSED
- All 9 key files verified present on disk
- All 3 task commits verified: 7d494ab, eea887f, fd90c85
