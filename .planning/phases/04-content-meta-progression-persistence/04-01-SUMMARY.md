---
phase: 04-content-meta-progression-persistence
plan: 01
subsystem: data, persistence
tags: [json, indexeddb, idb-keyval, prng, mulberry32, meta-progression]

# Dependency graph
requires:
  - phase: 01-architecture-foundation
    provides: idb-keyval persistence pattern, JSON data loading via Vite
  - phase: 03-loop-tile-world
    provides: existing card/relic/enemy/event TS definitions to migrate
provides:
  - 6 JSON content data files (cards, relics, enemies, events, buildings, passives)
  - MetaState interface and createDefaultMetaState() for cross-run persistence
  - SeededRNG class for deterministic reproducible runs
  - MetaPersistence module for IndexedDB meta-state storage
affects: [04-02, 04-03, city-hub-scene, unlock-manager, loot-filtering]

# Tech tracking
tech-stack:
  added: []
  patterns: [declarative relic effects with effectType/trigger/condition, building tier unlock system, cyrb53+mulberry32 seeded PRNG]

key-files:
  created:
    - src/data/json/buildings.json
    - src/data/json/passives.json
    - src/state/MetaState.ts
    - src/systems/SeededRNG.ts
    - src/systems/MetaPersistence.ts
    - tests/content/content.test.ts
    - tests/systems/SeededRNG.test.ts
    - tests/systems/MetaPersistence.test.ts
  modified:
    - src/data/json/cards.json
    - src/data/json/relics.json
    - src/data/json/enemies.json

key-decisions:
  - "Relic format changed from effects[] array to flat top-level trigger/effectType for simpler runtime resolution"
  - "All card unlocks gated via forge building (not library) to consolidate unlock sources"
  - "arcane_crystal reclassified as common (was rare in original) per user decision for 3 always-available relics"

patterns-established:
  - "Building tier data: JSON objects with level, cost, unlocks map, description"
  - "Declarative relic effects: top-level trigger, effectType, condition, stat, value fields"
  - "MetaState separate from RunState with version field for schema migration"

requirements-completed: [CONT-01, CONT-02, CONT-03, CONT-04, RELC-01, RELC-04, PERS-02, PERS-03]

# Metrics
duration: 5min
completed: 2026-03-26
---

# Phase 04 Plan 01: Content Data + Meta-Progression Infrastructure Summary

**15 cards, 8 relics, 9 enemies, 5 events, 5 buildings, 5 passives as JSON data; MetaState type; SeededRNG with cyrb53+mulberry32; MetaPersistence via idb-keyval**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-26T22:12:32Z
- **Completed:** 2026-03-26T22:17:31Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- All game content populated as JSON data files with unlock gating metadata (unlockSource/unlockTier)
- MetaState interface defined with buildings, metaLoot, classXP, unlock arrays, runHistory, version
- SeededRNG produces deterministic sequences from string seeds via cyrb53 hash + mulberry32 PRNG
- MetaPersistence reads/writes MetaState to separate IndexedDB store with schema migration support
- 29 unit tests validating content counts, required fields, unlock gating, RNG determinism, and persistence roundtrip

## Task Commits

Each task was committed atomically:

1. **Task 1: JSON content data files + MetaState type + passives data** - `f949803` (feat)
2. **Task 2: SeededRNG + MetaPersistence + unit tests** - `7fe3d23` (feat)

## Files Created/Modified
- `src/data/json/cards.json` - 15 cards with cooldown, rarity, unlockSource (4 starter always available)
- `src/data/json/relics.json` - 8 relics with declarative effectType format (3 common always available)
- `src/data/json/enemies.json` - 9 enemies including 3 boss variants (tank, berserker, mage) with metaLootReward
- `src/data/json/events.json` - 5 events (unchanged, already in correct format)
- `src/data/json/buildings.json` - 5 buildings with tier costs, unlocks, and descriptions
- `src/data/json/passives.json` - 5 warrior passive nodes with xpCost and stat effects
- `src/state/MetaState.ts` - MetaState, RunHistoryEntry interfaces, createDefaultMetaState()
- `src/systems/SeededRNG.ts` - Deterministic PRNG with string seed support
- `src/systems/MetaPersistence.ts` - IndexedDB persistence for MetaState via idb-keyval
- `tests/content/content.test.ts` - 19 content validation tests
- `tests/systems/SeededRNG.test.ts` - 7 RNG determinism tests
- `tests/systems/MetaPersistence.test.ts` - 3 persistence roundtrip tests

## Decisions Made
- Relic format changed from nested effects[] array to flat top-level trigger/effectType fields for simpler runtime resolution
- All card unlock gating uses forge building as unlock source (not library), consolidating card unlocks to a single building
- arcane_crystal reclassified from rare to common per user decision that 3-4 common relics should always be available
- Passives use xpCost (explicit cost field) instead of xpThreshold (milestone-based) for more flexible progression

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All content data and infrastructure ready for Plan 02 (meta-progression hub scene, unlock manager)
- MetaState type available for CityHubScene to read/write building levels
- SeededRNG ready to replace Math.random() in game systems
- Building tier data ready for upgrade UI implementation

---
*Phase: 04-content-meta-progression-persistence*
*Completed: 2026-03-26*
