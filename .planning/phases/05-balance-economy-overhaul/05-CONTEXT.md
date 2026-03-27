# Phase 5: Balance & Economy Overhaul - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Rebalance all numerical values across combat, gold economy, meta-progression materials, and difficulty scaling. Replace the single meta-loot currency with a multi-material economy (6-8 material types). Retune combat to produce 5-8s fights. Introduce partial resource reset between combats. Implement scaling/escalating gold prices with caps. Add a 6th building (Storehouse) for gathering boost and death retention. Adjust difficulty curve and loop growth. This phase modifies existing JSON data files and system logic — no new game mechanics, only tuning existing ones plus the material economy rework.

</domain>

<decisions>
## Implementation Decisions

### Combat Balance
- **Target fight duration: 5-8s** for early game (loop 1-3). Currently ~2s. Achieved via both raising enemy HP (~50%) AND lowering card damage (~25%). Neither enemies nor hero feel extreme individually
- **Partial resource reset between fights**: Stamina and mana recover 50% between combats (not 100% as in Phase 2). HP still persists. This adds cross-fight attrition pressure — resource-heavy decks (lots of spells/heavy attacks) feel the burn after 2-3 fights. Rest tiles become more valuable
- **Starter deck viability**: With rebalanced numbers, the starter deck (4x Strike, 4x Defend, Heavy Hit, Fireball) must still be viable for loops 1-3 without upgrades

### Gold Economy — Scaling Prices
- **Card shop prices scale with loop**: Base 60g + scaling per loop (Claude's discretion on exact formula), with a cap. Early game is generous for deck building, late game forces tough choices
- **Card removal: flat + escalating per use**: Base cost (e.g., 50g), increases by a fixed amount each removal in the same run (1st removal 50g, 2nd 75g, 3rd 100g, etc.). Deck thinning is viable but not trivial. Has a cap
- **Deck reorder: cheap but scales highly per use**: Starts cheap, escalates more steeply than removal per use in the same run. Also has a cap. Encourages planning reorder sessions rather than constant micro-adjustments
- **Relic pricing: rarity-based + loop scaling with cap**: Common relics have lower base price, rare/epic/legendary scale up. Per-loop scaling is steeper for higher rarities. All prices have caps to prevent absurd costs
- **All gold price scaling has caps**: No price goes to infinity. Claude determines appropriate cap values per category

### Meta-Progression — Multi-Material Economy
- **Replace single meta-loot with 6-8 distinct materials**: Real resources like wood, stone, iron, bone, herbs, crystal, plus rare drops (gems from bosses, essence from elites). Each material has identity and sourcing
- **Dual sourcing: terrain + enemy**: Terrains give base materials per loop completion (forest = wood, graveyard = bone, swamp = herbs, volcano = iron, etc.). Enemies on those terrains give bonus material drops. Tile placement becomes a material farming strategy
- **Building recipes are per-building, not uniform**: Some buildings need 1 material in high quantity at tier 1, others need 2 materials in smaller amounts at tier 1. Claude designs each building's recipe to match its theme (e.g., Forge needs iron + crystal, Workshop needs wood + stone)
- **Early tiers: cheap (1-3 runs)**: First upgrades on any building achievable in 1-3 runs. Player sees progress immediately
- **Late tiers: expensive (10-20 runs per upgrade)**: Final building tiers require significant farming across multiple terrains. Multi-material recipes force diverse run strategies
- **6 buildings total** (was 5): Forge, Library, Tavern, Workshop, Shrine, Storehouse (new)

### Storehouse (New 6th Building)
- **Dual purpose**: Material gathering boost AND death material retention. Some tiers give both, some give just one. Higher cost to reflect its economic multiplier value
- **Gathering boost**: Percentage increase to all material drops (exact values Claude's discretion, but meaningful — e.g., +10-25% per relevant tier)
- **Death retention scaling**: Default death retention is 10% (very punishing). Storehouse upgrades retention from 10% to 50% in increments of +5% per relevant tier (8 tiers of retention to go from 10% to 50%)
- **Premium pricing**: Storehouse tiers cost more than equivalent tiers on other buildings because it's a multiplier investment — spending materials to earn materials faster

### Death Penalty
- **Default: keep 10% of all materials, 0% XP**: Very harsh. Safe boss exit is the intended way to bank progress
- **Storehouse upgrades retention to max 50%**: Through Storehouse building tiers, retention scales from 10% to 50%. Even fully upgraded, death still costs half your materials
- **XP: still 0% on death** (Phase 2/3 decision preserved). XP only banks on safe boss exit

### Difficulty Curve
- **Scaling curve: Claude's discretion**: Whether linear, exponential, or soft-cap — Claude picks what creates the best risk/reward arc given the rebalanced combat numbers
- **Boss frequency and multiplier: Claude's discretion**: Whether to keep 5-loop/2x, change to more frequent/weaker, or scale multiplier per successive boss — Claude decides based on target run length
- **Loop growth: diminishing with 40-tile cap**: Growth per boss kill decreases over time (+3, +2, +2, +1, +1...) and hard caps at 40 tiles. Player plays for a while before reaching final loop length. Late loops feel epic but not absurdly long

### Claude's Discretion
- Exact card damage and enemy HP values after rebalance
- Exact material types and names (within 6-8 range)
- Material drop rates per terrain and enemy type
- Building recipe costs per tier (within early=cheap, late=expensive guideline)
- Storehouse tier structure (which tiers give gathering, which give retention, which give both)
- Gold scaling formulas and caps for cards, removal, reorder, relics
- Difficulty scaling curve shape (linear/exponential/soft-cap)
- Boss frequency and multiplier values
- Loop growth diminishing formula (within 40-tile cap)
- Synergy balance adjustments if needed
- Relic impact tuning
- Card rarity weight adjustments for rewards

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Game Design
- `.planning/PROJECT.md` — Core value, key decisions, constraints, game references (Loop Hero, StS, auto-battlers)

### Requirements
- `.planning/REQUIREMENTS.md` — All v1 requirements. Phase 5 touches combat (CMBT-*), deck (DECK-*), loop (LOOP-*), and meta (META-*) balance

### Prior Phase Contexts
- `.planning/phases/01-architecture-foundation/01-CONTEXT.md` — RunState shape, IndexedDB persistence, JSON data files, auto-save strategy
- `.planning/phases/02-combat-deck-engine/02-CONTEXT.md` — Card cooldowns 1.0-3.0s, synergy pairs, warrior class XP, deck management costs, combat pacing
- `.planning/phases/03-loop-tile-world/03-CONTEXT.md` — Loop traversal, tile economy, difficulty scaling, boss exit decision, meta-loot tracking, special tiles
- `.planning/phases/04-content-meta-progression-persistence/04-CONTEXT.md` — City hub, 5 buildings, unlock system, seeded RNG, content population

### Current Data Files (to be rebalanced)
- `src/data/json/cards.json` — 15 cards with cooldowns, costs, damage values (all subject to rebalance)
- `src/data/json/enemies.json` — 9 enemies with HP, damage, gold/meta-loot rewards (all subject to rebalance)
- `src/data/json/relics.json` — 8 relics with stat effects (impact tuning)
- `src/data/json/synergies.json` — 6 synergy pairs with bonus values (balance check)
- `src/data/json/buildings.json` — 5 buildings with tier costs (rework to multi-material + add Storehouse)
- `src/data/json/difficulty.json` — Scaling config (rework difficulty curve, loop growth)
- `src/data/difficulty.json` — Loop-level difficulty config (percentPerLoop, bossMultiplier, metaLoot rates — all subject to rework)

### Systems to Modify
- `src/systems/ShopSystem.ts` — Gold prices, removal/reorder cost formulas, relic pricing
- `src/systems/DifficultyScaler.ts` — Enemy scaling, loop speed, difficulty config
- `src/systems/LootGenerator.ts` — Material drops (replace meta-loot with multi-material), drop rates
- `src/systems/MetaProgressionSystem.ts` — Building upgrades (multi-material costs)
- `src/systems/RunEndResolver.ts` — Death penalty (10% materials, 0% XP), safe exit banking

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ShopSystem.ts`: Static methods for buy/sell/remove/reorder — extend with scaling price formulas and caps
- `DifficultyScaler.ts`: `scaleEnemyForLoop()` with configurable percentPerLoop/bossMultiplier — modify curve shape
- `LootGenerator.ts`: Injectable RNG, weighted loot tables — extend to produce material drops instead of single meta-loot
- `MetaProgressionSystem.ts`: structuredClone-based immutable updates, building tier system — rework costs to multi-material
- `RunEndResolver.ts`: Handles death/safe-exit reward calculation — rework for per-material retention percentages

### Established Patterns
- All balance values live in JSON data files — change values without touching system logic where possible
- Systems use pure functions on RunState — rebalance can be largely data-driven
- Injectable RNG in LootGenerator and combat — enables deterministic testing of new balance values
- DifficultyConfig is a single JSON object consumed by DifficultyScaler — extend with new fields for curve shape

### Integration Points
- `RunState.economy` currently has `{ gold, tilePoints, metaLoot }` — rework `metaLoot` to `materials: Record<string, number>`
- `MetaState` building levels and costs — rework costs from single number to `Record<string, number>` material recipes
- Combat system resource reset — modify to 50% recovery instead of 100%
- All shop price calculations centralized in ShopSystem — single point of change for scaling formulas

</code_context>

<specifics>
## Specific Ideas

- Multi-material economy turns tile placement into material farming strategy — "I need wood, so I'll place more forests this run"
- Storehouse as multiplier investment creates a meta-decision: invest materials now to earn more later, or spend on content unlocks immediately
- 10% default death retention is brutal on purpose — safe boss exit is THE way to progress. Storehouse upgrades to 50% are a long-term investment that softens the blow
- Scaling gold prices with caps prevent both trivially easy shopping and impossibly expensive late-game
- Escalating removal/reorder costs per use (not per loop) mean the player can always afford the first one but must plan carefully for multiples
- 50% stamina/mana reset between fights makes deck composition matter more — a deck full of expensive spells will struggle across a long loop
- Diminishing loop growth with 40-tile cap means late-game loops are consistently long without becoming absurd

</specifics>

<deferred>
## Deferred Ideas

- Material trading between material types (e.g., convert 3 wood to 1 iron) — could be a Storehouse feature but adds complexity
- Dynamic difficulty adjustment based on player performance — v2 consideration
- Per-class material bonuses (Warrior finds more iron, Mage finds more crystal) — future when more classes exist

</deferred>

---

*Phase: 05-balance-economy-overhaul*
*Context gathered: 2026-03-27*
