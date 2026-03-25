# Phase 1: Architecture Foundation - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Extract all game logic from Phaser scenes into pure TypeScript systems, centralize run state into a single serializable object (RunState), establish a typed EventBus for cross-system communication, and implement IndexedDB persistence for run state. Establish memory cleanup conventions for 1h+ runs. This is a clean rewrite — existing scenes and singletons will be replaced, not incrementally refactored.

</domain>

<decisions>
## Implementation Decisions

### RunState Shape
- **Nested by domain**: `{ hero: {hp, stamina, mana}, deck: {cards, order}, loop: {count, tiles, difficulty}, economy: {gold, tilePoints}, relics: [...] }`
- RunState must be JSON-serializable (single source of truth for save/load)
- **Co-op design**: Claude's discretion — individual player state (hero/deck) vs shared state (loop/tiles/economy), whatever makes the architecture cleanest for future multiplayer

### Existing Code Fate
- **Clean rewrite** — do not incrementally refactor existing scenes. Rewrite from scratch with correct architecture
- **All singletons migrated at once** — `getDeckManager()`, `getRelicManager()`, `resetGold()`, `getTileCount()`, etc. all replaced by RunState in a single pass
- **All scenes recreated** — existing 16 scenes will be rebuilt as thin wrappers over pure systems. No preservation of current scene code

### Static Data
- **JSON external files** — card definitions, enemy definitions, tile definitions, relic definitions migrated from TypeScript const to runtime-loadable JSON files. Enables editing/balancing without recompiling

### Persistence Strategy
- **Auto-save on key events**: after combat, after shop, after boss, after loop completion — moments where state changes significantly
- **Mid-combat browser close**: player returns to the tile (pre-combat state). Combat restarts from zero
- **1 active run**: single save slot, no multiple runs
- IndexedDB via idb-keyval for structured persistence

### Event Granularity
- **Fine-grained events**: `card-played`, `damage-dealt`, `gold-gained`, `tile-placed`, `enemy-spawned`, `synergy-triggered`, etc.
- **No event logging** — EventBus is pure dispatch, no built-in log/replay system
- Typed EventBus with TypeScript generics for type-safe event payloads

### Claude's Discretion
- Exact RunState interface structure (nested domain grouping is decided, internal shape is flexible)
- Co-op state split strategy (individual vs shared)
- EventBus implementation pattern (singleton class, module-level emitter, or DI)
- Object pooling strategy for memory management
- Scene lifecycle cleanup patterns
- Whether to use idb-keyval directly or wrap it

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Architecture Research
- `.planning/research/ARCHITECTURE.md` — Component boundaries, data flow, thin-scene pattern, EventBus + RunState code examples, build order
- `.planning/research/PITFALLS.md` — Memory leak prevention, singleton state blocking multiplayer, God Scene anti-pattern

### Game Design
- `.planning/GDD.md` — Full game design document in pt-br, stats, formulas, card/enemy/relic definitions
- `.planning/PROJECT.md` — Core value, key decisions, constraints

### Requirements
- `.planning/REQUIREMENTS.md` — ARCH-01..04, PERS-01 mapped to this phase

### Stack
- `.planning/research/STACK.md` — Phaser 3.90.0, TypeScript, Vite, idb-keyval recommendations

</canonical_refs>

<code_context>
## Existing Code Insights

### Current State (to be replaced)
- `src/scenes/Game.ts` (~440 lines) — God Scene with loop, tiles, HUD, player movement all mixed
- `src/scenes/CombatScene.ts` (~300 lines) — Full combat engine inside a Phaser scene
- `src/data/DeckManager.ts` — Singleton via `getDeckManager()`, used in 6+ files
- `src/data/Currency.ts` — Module-level gold state via `resetGold()`/`addGold()`
- `src/objects/RelicManager.ts` — Singleton via `getRelicManager()`, used in 4+ files
- `src/data/TileInventory.ts` — Module-level tile state via `resetTileInventory()`/`getTileCount()`

### Singletons to Eliminate (12+ files depend on these)
- `getDeckManager()` — DeckManager, CombatScene, DeckCustomization, RewardScene, ShopScene
- `getRelicManager()` — RelicManager, Game, RelicViewerScene, ShopScene
- `resetGold()`/`addGold()` — Currency, CombatScene, EventScene, Game, ShopScene
- `getTileCount()`/`resetTileInventory()` — TileInventory, Game

### Static Data Files (to migrate to JSON)
- `src/data/CardDefinitions.ts` — 14 cards
- `src/data/EnemyDefinitions.ts` — 6 enemy types
- `src/data/RelicDefinitions.ts` — 8 relics
- `src/data/TileTypes.ts` — tile type configs
- `src/data/EventDefinitions.ts` — 5 events
- `src/data/CurseDefinitions.ts` — 4 curses
- `src/data/DifficultyConfig.ts` — difficulty scaling formulas
- `src/data/EnemyDrops.ts` — drop tables
- `src/data/HeroStats.ts` — hero base stats

### 16 Scenes Registered (all to be recreated as thin wrappers)
Boot, Preloader, MainMenu, TutorialScene, Game, CombatScene, RewardScene, ShopScene, RestScene, EventScene, PauseScene, SettingsScene, GameOverScene, DeckCustomizationScene, RelicViewerScene, SelectionScene

### Integration Points
- `src/main.ts` — Phaser config, scene registration
- `src/effects/CombatEffects.ts` — Visual effects (particles, screen shake, floating numbers)
- `src/ui/HUDManager.ts` — HUD overlay
- `src/objects/Player.ts` — Player sprite and movement
- `src/objects/MapManager.ts` — Tile map rendering

</code_context>

<specifics>
## Specific Ideas

- Clean rewrite approach chosen deliberately — user prefers starting fresh over incremental refactoring
- All singletons in one pass to avoid mixed old/new state patterns
- JSON data files to enable rapid balancing iteration without recompilation

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-architecture-foundation*
*Context gathered: 2026-03-25*
