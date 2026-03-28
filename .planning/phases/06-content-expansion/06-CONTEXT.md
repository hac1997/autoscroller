# Phase 6: Content Expansion - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Expand game content significantly beyond v1 minimums to provide varied, replayable runs. Double the card pool (~30 cards), nearly double relics (~15), add boss variety (5 types), triple narrative events (~15), and introduce a basic card upgrade system. All new content uses existing JSON data formats and system patterns established in Phases 1-5. No new game mechanics or systems — only more content populating existing frameworks, plus card upgrades as the one new subsystem.

</domain>

<decisions>
## Implementation Decisions

### Content Targets
- **Cards: ~30 total** (currently 15). Add ~15 new cards across all categories (attack, defense, spell). New cards should fill missing strategic roles — AoE options, resource generators, conditional/combo enablers, high-risk/high-reward choices
- **Relics: ~15 total** (currently 8). Add ~7 new relics. Mix of stat-bonus relics and build-around relics that reward specific playstyles (e.g., "spell-heavy deck" relic, "thin deck" relic)
- **Bosses: 5 types** (currently 2-3 stat variants). Add boss types with distinct stat profiles and 1-2 simple attack patterns each (e.g., multi-hit attacks, periodic shields, enrage at low HP). Full unique mechanics (phases, immunities) deferred to v2 (BOSS-01)
- **Events: ~15 total** (currently 5). Add ~10 new narrative events using existing choice/effect system. Events should reference the multi-material economy (material rewards/costs) and occasionally offer relic or card choices
- **Card upgrade system (CONT-09)**: Basic upgrade path — each card has an upgraded version with improved values (more damage, lower cooldown, better effects). Upgrades happen at the shop or via specific events. Upgrade costs gold

### Card Design Direction
- **Fill strategic gaps**: Current cards lean toward straightforward damage/defense. New cards should enable distinct build archetypes:
  - **AoE specialist**: More cards that hit all enemies (currently only Whirlwind)
  - **Resource engine**: Cards that generate extra stamina/mana beyond natural regen
  - **Combo enablers**: Cards designed to synergize in specific sequences (expand synergy pairs from 6 to 10+)
  - **High-risk**: Cards with powerful effects but drawbacks (lose HP, discard next card, etc.)
  - **Utility**: Cards that buff/debuff without dealing direct damage (speed buffs, enemy slow, etc.)
- **Rarity tiers matter**: Common cards are reliable staples. Uncommon add specialization. Rare enable build-around strategies. Epic cards (new tier) are powerful but have significant costs/drawbacks
- **Epic rarity tier**: Add epic tier above rare. Epic cards have dramatic effects and steep costs. 3-4 epic cards total — each defines a build if found
- **Unlock gating**: New cards gated behind Forge building tiers (existing pattern). Epic cards require Forge tier 4-5

### Relic Design Philosophy
- **Two categories**: (1) Stat sticks — straightforward bonuses anyone wants (existing pattern). (2) Build-around — powerful when conditions met, mediocre otherwise
- **Build-around examples**: "When deck has 5 or fewer cards, +50% damage" (thin deck), "Spells cost 0 mana but deal 20% less" (spell spam), "First card each combat deals 3x damage" (opener focus)
- **Unlock gating**: New relics gated behind Shrine building tiers (existing pattern). Build-around relics at higher tiers
- **No relic synergies with each other**: Relics interact with cards/deck/combat, not with other relics. Keeps complexity manageable

### Boss Design
- **5 boss types with distinct identities**: Each boss has a unique stat profile AND 1-2 simple behavioral patterns
- **Behavioral patterns (not full mechanics)**: Implemented as flags/conditions in existing enemy AI, not new systems. Examples:
  - Enrage: Below 30% HP, attack speed doubles
  - Shield phase: Every 10s, gain temporary armor that blocks N damage
  - Multi-hit: Attacks hit 2-3 times at reduced damage
  - Drain: Attacks steal HP (heal boss)
  - Summon: Spawn 1 weak add mid-fight (uses existing enemy spawn)
- **Boss rewards scale with difficulty**: Higher-loop bosses drop more materials and better loot

### Event & Narrative Expansion
- **Material integration**: Events can cost and reward specific materials (not just gold/HP/cards). "Spend 5 iron to repair a bridge" → gain relic. Connects to Phase 5 economy
- **Event variety categories**: Combat-adjacent (buff/debuff before next fight), economic (trade resources), narrative (story choices with consequences), gamble (risk/reward with RNG)
- **No event chains**: Each event is self-contained. Event chains are v2 complexity
- **Curse integration**: Expand curse system — some events add curses (dead cards in deck) as tradeoff for powerful rewards. Currently only "pain" curse exists
- **Event weight/rarity**: Common events appear frequently, rare events are memorable. Controlled by weight in JSON

### Card Upgrade System
- **Upgrade = improved version of same card**: Strike → Strike+ (25 damage instead of 20, same cooldown). Shield Wall → Shield Wall+ (20 armor instead of 15)
- **Upgrade available at shop**: New shop action "Upgrade Card" — select a card, pay gold. Gold cost scales with card rarity
- **Events can offer upgrades**: Some events offer free or discounted card upgrades as rewards
- **Visual distinction**: Upgraded cards show a "+" suffix and slightly different color/border. No new art needed
- **One upgrade level only**: No Strike++ or multi-tier upgrades. Each card has exactly one upgraded form
- **Upgraded cards in JSON**: Each card entry gets an optional `upgraded` object with overridden values. Keeps data format simple

### Claude's Discretion
- Exact new card stats, cooldowns, costs, and effects
- Exact new relic stat values and trigger conditions
- Boss stat profiles and behavioral thresholds (enrage %, shield timing, etc.)
- Event narrative text, choices, and effect values
- Card upgrade value improvements (how much better is Strike+ vs Strike)
- Upgrade gold costs per rarity tier
- New synergy pair definitions (which cards combo)
- Event weight/rarity distribution
- Curse card designs and effects
- Material costs/rewards in events
- Boss material drop rates and quantities
- Epic card specific designs

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Game Design
- `.planning/PROJECT.md` — Core value (deckbuilding strategy), game references (Loop Hero, StS), constraints

### Requirements
- `.planning/REQUIREMENTS.md` — v2 content targets: CONT-05 (30+ cards), CONT-06 (15+ relics), CONT-07 (5+ bosses), CONT-08 (15+ events), CONT-09 (card upgrades)

### Prior Phase Contexts
- `.planning/phases/02-combat-deck-engine/02-CONTEXT.md` — Card cooldowns 1.0-3.0s, synergy system, combat pacing
- `.planning/phases/04-content-meta-progression-persistence/04-CONTEXT.md` — Content design decisions, unlock gating via buildings, collection screen, relic triggers
- `.planning/phases/05-balance-economy-overhaul/05-CONTEXT.md` — Multi-material economy, combat balance (5-8s fights), scaling gold prices, Storehouse

### Current Content Data (to be expanded)
- `src/data/json/cards.json` — 15 cards with id/name/description/category/effects/cooldown/targeting/rarity/unlockSource
- `src/data/json/relics.json` — 8 relics with id/name/trigger/effectType/rarity/unlockSource
- `src/data/json/enemies.json` — 9 enemies with baseHP/attack/materialReward/type (normal/elite/boss)
- `src/data/json/events.json` — 5 events with choices/effects/requirements
- `src/data/json/synergies.json` — 6 synergy pairs with trigger/bonus definitions
- `src/data/json/buildings.json` — 6 buildings with tier costs and unlock effects
- `src/data/json/curses.json` — Curse card definitions (expand for new event curses)

### Systems That Need Extension
- `src/systems/ShopSystem.ts` — Add card upgrade action alongside buy/remove/reorder
- `src/systems/combat/CombatEngine.ts` — Boss behavioral patterns (enrage, shield, multi-hit)
- `src/systems/LootGenerator.ts` — Boss-specific loot tables, upgraded card drops
- `src/systems/SynergyResolver.ts` — New synergy pair definitions
- `src/systems/UnlockManager.ts` — Epic tier cards, new relic unlock gates
- `src/scenes/ShopScene.ts` — Upgrade card UI

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `cards.json` format: All fields established (id, name, description, category, effects, cooldown, targeting, rarity, unlockSource, unlockTier) — new cards follow same schema
- `relics.json` format: Flat trigger/effectType pattern — new relics follow same schema
- `enemies.json` format: baseHP/attack/materialReward — extend with behavioral pattern fields for bosses
- `events.json` format: Choice array with effects/requirements — new events follow same schema
- `synergies.json` format: Pair-based synergy definitions — add new pairs following same format
- `ShopSystem.ts`: Static pure methods for all shop actions — extend with upgradeCard method
- `CombatEngine.ts`: Tick-based combat loop — boss behaviors hook into existing tick cycle
- `SynergyResolver.ts`: Resolves sequential card synergies — already supports N pairs

### Established Patterns
- All content is data-driven JSON — new content is primarily JSON authoring
- Card effects use `{ type, value, target }` — new effect types extend this pattern
- Relic triggers are string-based (`passive`, `card_played`, `damage_taken`, `combat_start`) — add new triggers as needed
- Enemy attack patterns use `pattern` field (`fixed`, `random`, `conditional`) — extend for boss behaviors
- Unlock gating via `unlockSource`/`unlockTier` on cards and relics — same pattern for new content

### Integration Points
- `LootGenerator` filters by unlock state — new content automatically respects existing gating
- `CollectionRegistry` shows all content — new cards/relics appear automatically
- `CombatScene` renders card queue — upgraded cards need visual distinction (+ suffix, border color)
- `ShopScene` has buy/remove/reorder actions — add upgrade tab/action
- `PostCombatScene` shows rewards — no changes needed if new content uses existing formats

</code_context>

<specifics>
## Specific Ideas

- Card upgrades add replayability by giving players a reason to revisit the shop beyond buying/removing cards
- Build-around relics create "aha" moments — finding the right relic for your deck changes the run's trajectory
- Boss behavioral patterns (enrage, shield phase) add tactical interest without full unique mechanics — the auto-combat plays differently against each boss type
- Material-integrated events make tile placement decisions feed back into event outcomes — "I placed forests for wood, and now this event wants wood"
- Epic rarity tier gives experienced players something to chase in late runs — rare enough to be exciting, powerful enough to reshape a build
- Expanding from 6 to 10+ synergy pairs means more viable deck combinations — not just the obvious Shield → Counter-Attack paths

</specifics>

<deferred>
## Deferred Ideas

- Unique boss mechanics with phases and immunities — v2 (BOSS-01)
- Event chains (multi-event story arcs) — v2 complexity
- Card upgrade tiers beyond +1 (Strike++, etc.) — not needed for v1 depth
- Relic-to-relic synergies — keeps v1 complexity manageable
- Procedural event generation — hand-crafted events are better for quality control
- Per-class card pools (mage-only cards, etc.) — v2 when more classes exist (CLAS-01, CLAS-02)

</deferred>

---

*Phase: 06-content-expansion*
*Context gathered: 2026-03-28 via auto mode*
