---
phase: 04-content-meta-progression-persistence
plan: 04
subsystem: meta-progression
tags: [phaser, scene-routing, relic-types, meta-loot, cityhub]

# Dependency graph
requires:
  - phase: 04-03
    provides: DeathScene meta-loot banking, CityHubScene, MetaPersistence
provides:
  - BossExitScene safe exit with full meta-loot banking and CityHub routing
  - MainMenu and GameOverScene routing through CityHub for all new runs
  - RelicDefinition type matching flat declarative JSON format
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "All 'new run' flows route through CityHub (never directly to GameScene)"
    - "Legacy relic definitions with apply lambdas use LegacyRelicDefinition type"

key-files:
  created: []
  modified:
    - src/scenes/BossExitScene.ts
    - src/scenes/MainMenu.ts
    - src/scenes/GameOverScene.ts
    - src/data/types.ts
    - src/data/RelicDefinitions.ts
    - src/objects/RelicManager.ts

key-decisions:
  - "Legacy relic definitions renamed to LegacyRelicDefinition to coexist with new flat JSON RelicDefinition type"
  - "BossExitScene defaults bossesDefeated to 1 for safe exit (player just defeated a boss)"

patterns-established:
  - "New run routing: all entry points funnel through CityHub scene"
  - "Type coexistence: legacy imperative types use Legacy prefix, new declarative types match JSON schema"

requirements-completed: [META-01, RELC-01, RELC-02, RELC-03, RELC-04, META-02, META-03, META-04, CONT-01, CONT-02, CONT-03, CONT-04, PERS-02, PERS-03]

# Metrics
duration: 3min
completed: 2026-03-27
---

# Phase 04 Plan 04: Verification Gap Closure Summary

**BossExitScene safe exit banks 100% meta-loot via bankRunRewards, all new-run flows route through CityHub, RelicDefinition type matches flat JSON format**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-27T02:32:57Z
- **Completed:** 2026-03-27T02:35:38Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- BossExitScene safe exit now banks 100% meta-loot and XP, saves to IndexedDB, clears run state, and routes to CityHub
- MainMenu "New Run" and GameOverScene "New Run" both route to CityHub instead of GameScene
- RelicDefinition type updated to flat declarative format (trigger, effectType, stat, value) matching relics.json

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix BossExitScene safe exit to bank meta-loot and route to CityHub** - `2a85836` (fix)
2. **Task 2: Route MainMenu and GameOverScene to CityHub instead of GameScene** - `6b143be` (fix)
3. **Task 3: Fix RelicDefinition type to match declarative JSON format** - `e1265eb` (fix)

## Files Created/Modified
- `src/scenes/BossExitScene.ts` - Added bankRunRewards/saveMetaState imports, async confirmSelection with meta-loot banking, CityHub routing
- `src/scenes/MainMenu.ts` - Changed startNewRun() to route to CityHub
- `src/scenes/GameOverScene.ts` - Changed New Run button to route to CityHub
- `src/data/types.ts` - Replaced nested RelicEffectDefinition/effects[] with flat trigger/effectType/stat/value fields
- `src/data/RelicDefinitions.ts` - Renamed local types to LegacyRelicDefinition/LegacyRelicEffect
- `src/objects/RelicManager.ts` - Updated imports to use LegacyRelicDefinition type

## Decisions Made
- Legacy relic definitions with `apply` lambdas renamed to `LegacyRelicDefinition` to avoid conflict with new flat JSON `RelicDefinition` type from types.ts
- BossExitScene defaults `bossesDefeated` to 1 for safe exit since the player just defeated a boss to reach this screen

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed RelicManager imports after type rename**
- **Found during:** Task 3
- **Issue:** replace_all on RelicDefinition corrupted function names and module paths in RelicManager.ts
- **Fix:** Rewrote RelicManager.ts with correct imports (getRelicDefinition, LegacyRelicDefinition)
- **Files modified:** src/objects/RelicManager.ts
- **Verification:** tsc --noEmit shows no new errors
- **Committed in:** e1265eb (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor tooling error during rename, fixed immediately. No scope creep.

## Issues Encountered
- Pre-existing tsc errors (unused variables, test module resolution) unrelated to this plan's changes -- not addressed per scope boundary rules

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 04 verification gaps are now closed
- All meta-progression loops complete: safe exit, death, and new run all route through CityHub
- RelicDefinition type aligns with declarative JSON data format

## Self-Check: PASSED

All 6 modified files verified on disk. All 3 task commits (2a85836, 6b143be, e1265eb) verified in git history.

---
*Phase: 04-content-meta-progression-persistence*
*Completed: 2026-03-27*
