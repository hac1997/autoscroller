---
phase: 01-architecture-foundation
plan: 01
subsystem: architecture
tags: [eventbus, runstate, json-data, vitest, typescript, nanoid]

# Dependency graph
requires: []
provides:
  - "Typed EventBus (on/off/emit/removeAllListeners/listenerCount) for cross-system communication"
  - "JSON-serializable RunState with hero/deck/loop/economy/relics domains"
  - "Shared data types (CardDefinition, EnemyDefinition, TileTypeConfig, RelicDefinition, etc.)"
  - "DataLoader with typed accessors for all 9 static game data files"
  - "vitest test infrastructure with 29 passing tests"
affects: [01-02-PLAN, 01-03-PLAN, 02-combat-deck-system, 03-loop-world-system, 04-content-meta-progression-persistence]

# Tech tracking
tech-stack:
  added: [vitest, fake-indexeddb]
  patterns: [typed-eventbus, json-serializable-state, vite-static-json-import, record-over-map]

key-files:
  created:
    - src/core/EventBus.ts
    - src/state/RunState.ts
    - src/data/types.ts
    - src/data/DataLoader.ts
    - src/data/json/cards.json
    - src/data/json/enemies.json
    - src/data/json/tiles.json
    - src/data/json/relics.json
    - src/data/json/events.json
    - src/data/json/curses.json
    - src/data/json/difficulty.json
    - src/data/json/hero-stats.json
    - src/data/json/enemy-drops.json
    - vitest.config.ts
    - tests/core/eventbus.test.ts
    - tests/state/runstate.test.ts
    - tests/memory/listener-leak.test.ts
    - tests/data/dataloader.test.ts
  modified:
    - package.json
    - tsconfig.json

key-decisions:
  - "Used Map<string, Set<Function>> internally for EventBus (O(1) add/remove, no duplicate listeners)"
  - "Record<string, number> instead of Map for all RunState inventory fields (JSON-serializable)"
  - "Relic effects stored as JSON params instead of apply functions (data-driven, serializable)"
  - "Vite static JSON import for DataLoader instead of runtime fetch (simpler, bundled)"

patterns-established:
  - "EventBus pattern: typed event interface, on/off/emit, module-level singleton"
  - "RunState pattern: plain objects only, string IDs for references, Record over Map"
  - "Data layer pattern: JSON files + typed DataLoader with loadAllData() guard"

requirements-completed: [ARCH-02, ARCH-03, ARCH-04]

# Metrics
duration: 7min
completed: 2026-03-26
---

# Phase 1 Plan 01: Core Infrastructure Summary

**Typed EventBus with listener tracking, JSON-serializable RunState replacing 4 singletons, 9 static data JSON files with typed DataLoader, vitest configured with 29 tests green**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-26T18:42:59Z
- **Completed:** 2026-03-26T18:49:47Z
- **Tasks:** 2
- **Files modified:** 21

## Accomplishments
- EventBus class with typed GameEvents interface covering combat, hero, economy, deck, loop, relic, persistence, and run lifecycle events
- RunState interface with hero/deck/loop/economy/relics domains fully JSON-serializable (zero Map usage, zero class instances)
- All 14 cards, 6 enemies, 8 tiles, 8 relics, 5 events, 4 curses, difficulty configs, hero stats, and enemy drop tables migrated to JSON
- DataLoader with typed accessors and loadAllData() guard pattern
- vitest test infrastructure with 29 passing tests across 4 test files

## Task Commits

Each task was committed atomically:

1. **Task 0: Wave 0 -- Test infrastructure + EventBus + RunState types** - `cfe325a` (feat)
2. **Task 1: Static data migration -- JSON files + DataLoader** - `5e03684` (feat)

## Files Created/Modified
- `src/core/EventBus.ts` - Typed event emitter with on/off/emit/removeAllListeners/listenerCount
- `src/state/RunState.ts` - Central RunState interface, factory, and module-level accessor
- `src/data/types.ts` - Shared type definitions for all data schemas (CardDefinition, EnemyDefinition, etc.)
- `src/data/DataLoader.ts` - Typed JSON data loading with accessors for all 9 data domains
- `src/data/json/cards.json` - 14 card definitions with cooldown and targeting fields
- `src/data/json/enemies.json` - 6 enemy definitions
- `src/data/json/tiles.json` - 8 tile type configurations
- `src/data/json/relics.json` - 8 relic definitions with JSON-serializable effect params
- `src/data/json/events.json` - 5 event definitions with choices
- `src/data/json/curses.json` - 4 curse definitions
- `src/data/json/difficulty.json` - Normal and hard difficulty configs
- `src/data/json/hero-stats.json` - Default hero stats (maxHP=100, maxStamina=50, maxMana=30)
- `src/data/json/enemy-drops.json` - Card and tile drop tables per enemy type
- `vitest.config.ts` - Test configuration with node environment
- `tests/core/eventbus.test.ts` - 7 EventBus tests including no-Phaser-import check
- `tests/state/runstate.test.ts` - 7 RunState tests including JSON round-trip
- `tests/memory/listener-leak.test.ts` - 2 listener leak prevention tests (50 cycles)
- `tests/data/dataloader.test.ts` - 13 DataLoader smoke tests
- `package.json` - Added vitest, fake-indexeddb devDeps and test script
- `tsconfig.json` - Added tests to include array

## Decisions Made
- Used `Map<string, Set<Function>>` internally for EventBus to prevent duplicate listeners and provide O(1) removal
- All RunState fields use `Record<string, number>` instead of `Map` for JSON serialization compatibility
- Relic effects stored as declarative JSON params (e.g., `{ stat: "maxHP", delta: 15 }`) instead of `apply` functions -- enables serialization and data-driven relic system
- Used Vite static JSON import (bundled at build time) instead of runtime fetch for DataLoader
- CardDefinition extended with `cooldown: number` and `targeting` fields for Phase 2 combat system

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Transient Windows/OneDrive file lock caused one test run to fail with `UNKNOWN: unknown error, read` -- resolved on retry

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- EventBus, RunState, and DataLoader are ready for Plan 02 (scene refactoring) and Plan 03 (persistence)
- All contracts exported as specified in plan must_haves
- Zero Phaser imports in core/state/data layer verified

## Self-Check: PASSED

All 18 files verified present. Both task commits (cfe325a, 5e03684) verified in git log.

---
*Phase: 01-architecture-foundation*
*Completed: 2026-03-26*
