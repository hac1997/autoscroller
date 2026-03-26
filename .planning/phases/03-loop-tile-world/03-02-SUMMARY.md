---
phase: 03-loop-tile-world
plan: 02
subsystem: game-systems
tags: [shop, rest, events, treasure, boss, deckbuilding, tile-economy, json-data]

requires:
  - phase: 03-loop-tile-world/03-01
    provides: TileRegistry, LoopRunner, DifficultyScaler, LootGenerator, RunEndResolver
provides:
  - ShopSystem with buy/remove/reorder cards, buy relics, sell tiles
  - RestSiteSystem with 3-choice rest (heal/train/meditate)
  - EventResolver loading 5 events from JSON with choice validation and effect resolution
  - TreasureSystem rolling and applying loot to RunState
  - BossSystem with scaled combat trigger, meta-loot award, exit choice data
  - 3 JSON data files (events, treasure-tables, rest-config)
affects: [03-loop-tile-world/03-03, overlay-scenes, ui-integration]

tech-stack:
  added: []
  patterns: [pure-ts-systems, json-data-driven, injectable-rng, static-class-methods]

key-files:
  created:
    - src/systems/ShopSystem.ts
    - src/systems/RestSiteSystem.ts
    - src/systems/EventResolver.ts
    - src/systems/TreasureSystem.ts
    - src/systems/BossSystem.ts
    - src/data/events.json
    - src/data/treasure-tables.json
    - src/data/rest-config.json
    - tests/systems/ShopSystem.test.ts
    - tests/systems/RestSiteSystem.test.ts
    - tests/systems/EventResolver.test.ts
    - tests/systems/TreasureSystem.test.ts
    - tests/systems/BossSystem.test.ts
  modified: []

key-decisions:
  - "ShopSystem uses static methods on a class (pure functions operating on RunState) for namespace grouping"
  - "RestSiteSystem accepts injectable rng parameter for deterministic testing of meditate/train"
  - "EventResolver migrates events from EventDefinitions.ts to events.json for data-driven approach"
  - "Placeholder relic IDs (mysterious_amulet, ancient_relic) used for event/treasure relic resolution until relic system is complete"
  - "add_curse effect is a no-op placeholder returning applied:false"

patterns-established:
  - "Static class pattern: ShopSystem groups related shop operations as static methods"
  - "JSON config pattern: rest-config.json externalizes tunable game parameters"
  - "Effect resolution pattern: EventResolver applies typed effects (gain_hp, lose_gold, etc.) to RunState with applied flag"

requirements-completed: [LOOP-02, TILE-03, TILE-05, SPEC-01, SPEC-02, SPEC-03, SPEC-04, SPEC-05]

duration: 4min
completed: 2026-03-26
---

# Phase 03 Plan 02: Special Tile Systems Summary

**5 pure TS special tile systems (Shop, Rest, Event, Treasure, Boss) with 3 JSON data configs and 49 passing tests**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-26T20:27:57Z
- **Completed:** 2026-03-26T20:32:00Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- ShopSystem handles all deck management (buy/remove/reorder cards), relic purchases, and tile selling at 50% TP value
- RestSiteSystem provides 3-choice rest site logic: heal 30% HP, train +2 card damage, meditate +5 max stamina/mana
- EventResolver loads 5 narrative events from JSON, validates choice requirements (gold/HP), and resolves 8 effect types
- TreasureSystem rolls loot via LootGenerator and applies gold/card/relic/tile items to RunState
- BossSystem triggers scaled boss combat, awards meta-loot, and provides exit choice data (safe exit vs continue)

## Task Commits

Each task was committed atomically:

1. **Task 1: ShopSystem + RestSiteSystem + JSON configs + tests** - `06e2157` (feat)
2. **Task 2: EventResolver + TreasureSystem + BossSystem + JSON data + tests** - `3b68c73` (feat)

## Files Created/Modified
- `src/systems/ShopSystem.ts` - Shop operations: buy/remove/reorder cards, buy relics, sell tiles
- `src/systems/RestSiteSystem.ts` - Rest site 3-choice system with injectable RNG
- `src/systems/EventResolver.ts` - Event choice resolution from JSON with 8 effect types
- `src/systems/TreasureSystem.ts` - Treasure loot roll and application to RunState
- `src/systems/BossSystem.ts` - Boss encounter trigger, meta-loot award, exit choice data
- `src/data/events.json` - 5 event definitions with choices and effects
- `src/data/treasure-tables.json` - Treasure loot table weights and ranges
- `src/data/rest-config.json` - Rest site config values (hpRecoveryPercent, trainDamageBonus, meditateBonusAmount)
- `tests/systems/ShopSystem.test.ts` - 17 test cases for shop operations
- `tests/systems/RestSiteSystem.test.ts` - 7 test cases for rest site choices
- `tests/systems/EventResolver.test.ts` - 14 test cases for event resolution
- `tests/systems/TreasureSystem.test.ts` - 6 test cases for treasure loot
- `tests/systems/BossSystem.test.ts` - 5 test cases for boss system

## Decisions Made
- ShopSystem uses static methods on a class for namespace grouping (pure functions operating on RunState)
- RestSiteSystem accepts injectable rng parameter for deterministic testing of meditate/train choices
- EventResolver migrates events from EventDefinitions.ts to events.json for data-driven approach
- Placeholder relic IDs used for event/treasure relic resolution until relic system is complete
- add_curse effect is a no-op placeholder returning applied:false

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Pre-existing test failure in `tests/systems/hero/warrior.test.ts` (WARRIOR_STARTER_DECK order mismatch) - out of scope, not caused by this plan's changes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 5 special tile systems ready for overlay scene integration in Plan 03
- Systems are pure TypeScript with no Phaser dependency, ready to be called from Phaser scenes
- Placeholder relic IDs will need resolution when relic definitions are finalized

---
*Phase: 03-loop-tile-world*
*Completed: 2026-03-26*
