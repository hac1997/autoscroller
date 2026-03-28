---
phase: 06-content-expansion
plan: 03
subsystem: ui
tags: [phaser, shop, combat, events, card-upgrade]

# Dependency graph
requires:
  - phase: 06-02
    provides: "Card upgrade system in ShopSystem, upgradedCards on DeckState/CombatState, boss behaviors in EnemyAI, event resolver with upgrade_card/add_curse"
provides:
  - "Card upgrade UI tab in ShopScene with gold cost display and upgrade action"
  - "Upgraded card visual distinction (+ suffix, gold color) in combat card queue"
  - "Event upgrade_card effect handling in EventScene (random non-upgraded card)"
affects: [07-polish-release]

# Tech tracking
tech-stack:
  added: []
  patterns: ["CardVisual checks upgradedCards from RunState for display-only decoration"]

key-files:
  created: []
  modified:
    - src/scenes/ShopScene.ts
    - src/scenes/EventScene.ts
    - src/ui/CardVisual.ts

key-decisions:
  - "Upgrade visual implemented in CardVisual (shared component) rather than CombatScene directly -- all card displays get upgrade markers automatically"
  - "ShopScene upgrade calls ShopSystem.upgradeCard with run cast to ShopSystem RunState interface -- fields match without adapter"
  - "EventScene handles upgrade_card post-resolution by picking random non-upgraded card from active deck"

patterns-established:
  - "CardVisual upgrade check: try/catch getRun() for safe access outside active run context"

requirements-completed: [CONT-05, CONT-06, CONT-09]

# Metrics
duration: 2min
completed: 2026-03-28
---

# Phase 6 Plan 03: Card Upgrade UI & Content Verification Summary

**Card upgrade tab in ShopScene with per-rarity gold pricing, upgraded card "+" suffix and gold color in combat queue via CardVisual, and EventScene upgrade_card effect handling**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-28T04:13:04Z
- **Completed:** 2026-03-28T04:15:22Z
- **Tasks:** 2 (1 auto + 1 checkpoint auto-approved)
- **Files modified:** 3

## Accomplishments
- ShopScene now has Upgrade section showing player's deck cards with rarity-based gold costs and one-click upgrade
- CardVisual renders upgraded cards with "+" name suffix and gold (#ffd700) text color across all card displays (combat queue, shop, etc.)
- EventScene handles upgrade_card event effect by selecting a random non-upgraded card and adding it to upgradedCards
- Materials sync added to EventScene (was previously skipped in adapter sync-back)
- Full test suite passes (411 tests, 39 files)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add card upgrade UI to ShopScene and upgrade visual to CombatScene** - `8972b64` (feat)
2. **Task 2: Human-verify checkpoint** - Auto-approved (no commit needed)

## Files Created/Modified
- `src/scenes/ShopScene.ts` - Added buildUpgradeSection with card list, gold costs, and ShopSystem.upgradeCard integration; shifted Relics/Tiles sections down
- `src/scenes/EventScene.ts` - Added upgrade_card effect handling post-resolution; added materials sync-back from adapter
- `src/ui/CardVisual.ts` - Added upgradedCards check from RunState for "+" suffix and gold name color

## Decisions Made
- Implemented upgrade visual in CardVisual (shared component) rather than modifying CombatScene directly -- this means any view that renders cards via createCardVisual automatically shows upgrade markers
- ShopScene upgrade bypasses the adapter pattern and passes RunState directly (cast as any) since ShopSystem.upgradeCard only accesses deck.upgradedCards and economy.gold which exist on the real RunState
- EventScene upgrade_card picks a random non-upgraded card rather than letting user choose (matching the plan spec for event-based upgrades)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added materials sync-back in EventScene**
- **Found during:** Task 1 (EventScene upgrade_card handling)
- **Issue:** EventScene comment said "Materials are not modified by events" but gain_material/lose_material effects DO modify materials on the adapter
- **Fix:** Added materials sync-back from adapter to RunState after resolveEventChoice
- **Files modified:** src/scenes/EventScene.ts
- **Verification:** Code inspection confirms materials now sync correctly
- **Committed in:** 8972b64 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Essential fix for material event effects to persist. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Full Phase 6 content expansion complete: cards, relics, bosses, events, synergies, card upgrades, curse system
- Ready for Phase 7 (Polish & Release)

---
*Phase: 06-content-expansion*
*Completed: 2026-03-28*

## Self-Check: PASSED
