# Phase 6: Content Expansion - Research

**Researched:** 2026-03-28
**Domain:** Game content authoring (JSON data), card upgrade subsystem, boss behavioral patterns, event expansion
**Confidence:** HIGH

## Summary

Phase 6 is primarily a **content authoring phase** that leverages existing data-driven systems established in Phases 1-5. The codebase already has well-defined JSON schemas for cards, relics, enemies, events, synergies, curses, and buildings. The vast majority of work involves adding new JSON entries following existing patterns. The three areas requiring actual TypeScript code changes are: (1) card upgrade system in ShopSystem + CardResolver, (2) boss behavioral patterns in EnemyAI, and (3) new event effect types in EventResolver for material costs/rewards.

The existing architecture is highly favorable for this phase. All content is loaded via Vite static JSON imports through `DataLoader.ts`, filtered by unlock state via `UnlockManager.ts`, and consumed by pure TypeScript systems with no Phaser dependency. Adding new content entries automatically flows through existing pipelines (loot generation, shop display, collection registry, unlock gating). The main risk is not technical but design-related: ensuring new cards/relics create interesting build archetypes without breaking the Phase 5 balance tuning (5-8 second fights).

**Primary recommendation:** Structure work as JSON content waves first (cards, relics, bosses, events, synergies), then add the card upgrade subsystem (the only truly new mechanic), then extend boss AI behaviors. Keep content test suite updated incrementally.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Cards: ~30 total** (currently 15). Add ~15 new cards across all categories (attack, defense, spell). New cards should fill missing strategic roles -- AoE options, resource generators, conditional/combo enablers, high-risk/high-reward choices
- **Relics: ~15 total** (currently 8). Add ~7 new relics. Mix of stat-bonus relics and build-around relics that reward specific playstyles
- **Bosses: 5 types** (currently 2-3 stat variants). Add boss types with distinct stat profiles and 1-2 simple attack patterns each. Full unique mechanics deferred to v2 (BOSS-01)
- **Events: ~15 total** (currently 5). Add ~10 new narrative events using existing choice/effect system. Events should reference multi-material economy
- **Card upgrade system (CONT-09)**: Basic upgrade path -- each card has an upgraded version with improved values. Upgrades at shop or via events. Gold cost. One upgrade level only
- **Epic rarity tier**: New tier above rare. 3-4 epic cards total. Gated behind Forge tier 4-5
- **Boss behavioral patterns**: Enrage, Shield phase, Multi-hit, Drain, Summon -- implemented as flags/conditions in existing EnemyAI, not new systems
- **Event material integration**: Events can cost and reward specific materials
- **Curse expansion**: Some events add curses as tradeoffs. Currently only "pain" exists (3 more already in curses.json: wound, weakness, fragility)
- **No relic-to-relic synergies**: Relics interact with cards/deck/combat only
- **Unlock gating**: New cards via Forge building tiers, new relics via Shrine building tiers

### Claude's Discretion
- Exact new card stats, cooldowns, costs, and effects
- Exact new relic stat values and trigger conditions
- Boss stat profiles and behavioral thresholds
- Event narrative text, choices, and effect values
- Card upgrade value improvements and gold costs per rarity
- New synergy pair definitions (expand from 6 to 10+)
- Event weight/rarity distribution
- Curse card designs and effects
- Material costs/rewards in events
- Boss material drop rates and quantities
- Epic card specific designs

### Deferred Ideas (OUT OF SCOPE)
- Unique boss mechanics with phases and immunities (v2 BOSS-01)
- Event chains (multi-event story arcs)
- Card upgrade tiers beyond +1 (no Strike++)
- Relic-to-relic synergies
- Procedural event generation
- Per-class card pools

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-05 | 30+ cards with rare/epic tiers | Extend cards.json from 15 to ~30 entries. Add `epic` to CardDefinition rarity type. Add `upgraded` field per CONTEXT.md. Forge building needs tiers 5+ for epic cards |
| CONT-06 | 15+ relics | Extend relics.json from 8 to ~15 entries. Add build-around relics with new trigger/condition patterns. Shrine building needs tier 4+ for new relics |
| CONT-07 | 5+ boss types with unique mechanics | Extend enemies.json with 2+ new boss entries (currently 4 bosses). Add behavioral pattern fields (enrage, shield, multi-hit, drain, summon) to enemy schema. Extend EnemyAI to handle new patterns |
| CONT-08 | 15+ narrative events | Extend events.json from 5 to ~15 entries. Add new effect types (gain_material, lose_material, upgrade_card) to EventResolver. Add weight/rarity fields to event schema |
| CONT-09 | Card upgrade system | Add `upgraded` object to card JSON entries. Add `upgradeCard` method to ShopSystem. Extend CardResolver to apply upgrade bonuses. Add upgrade UI section to ShopScene |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | ~5.2 | Type safety for all new content types | Already in project |
| Phaser | ~3.80 | Scene rendering (ShopScene upgrade UI, CombatScene boss visuals) | Already in project |
| Vitest | ~4.1 | Content validation tests | Already in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vite | ~5.0 | Static JSON imports for all content data | Already in project, all JSON loaded at build time |

No new libraries needed. Phase 6 is entirely content + code within existing dependencies.

## Architecture Patterns

### Content File Structure (existing, extend in place)
```
src/data/json/
  cards.json          # 15 -> ~30 entries
  relics.json         # 8 -> ~15 entries
  enemies.json        # 9 -> ~12 entries (add 2-3 new bosses)
  events.json         # 5 -> ~15 entries
  synergies.json      # 6 -> 10+ entries
  curses.json         # 4 entries (already has wound, weakness, fragility)
  buildings.json      # Extend forge (tier 5+), shrine (tier 4+)
  materials.json      # May add boss-specific drop tables
```

### System Files to Modify
```
src/data/types.ts               # Add 'epic' rarity, upgrade types, boss behavior types
src/systems/ShopSystem.ts       # Add upgradeCard method + pricing
src/systems/combat/CardResolver.ts  # Apply upgrade bonuses during resolve
src/systems/combat/EnemyAI.ts   # Boss behavioral patterns (enrage, shield, etc.)
src/systems/combat/CombatState.ts   # Boss behavior fields on state
src/systems/EventResolver.ts    # New effect types: gain_material, lose_material, upgrade_card
src/scenes/ShopScene.ts         # Upgrade card UI section
```

### Pattern 1: Data-Driven Content (existing pattern)
**What:** All game content defined as JSON, loaded via DataLoader, typed via types.ts
**When to use:** Every new card, relic, enemy, event, synergy
**Example:**
```typescript
// cards.json -- new card follows exact existing schema
{
  "id": "whirlwind",
  "name": "Whirlwind",
  "description": "Deal 15 damage to all enemies. Costs 8 Stamina.",
  "category": "attack",
  "effects": [{ "type": "damage", "value": 15, "target": "enemy" }],
  "cost": { "stamina": 8 },
  "cooldown": 2.0,
  "targeting": "aoe",
  "rarity": "uncommon",
  "unlockSource": "forge",
  "unlockTier": 2,
  "upgraded": {
    "effects": [{ "type": "damage", "value": 22, "target": "enemy" }],
    "cost": { "stamina": 6 },
    "description": "Deal 22 damage to all enemies. Costs 6 Stamina."
  }
}
```

### Pattern 2: Card Upgrade via JSON Override
**What:** Each card entry gets an optional `upgraded` object containing only the fields that change
**When to use:** All upgradeable cards
**Example:**
```typescript
// In types.ts -- extend CardDefinition
export interface CardUpgrade {
  effects?: CardEffect[];
  cost?: CardCost;
  cooldown?: number;
  description?: string;
}

export interface CardDefinition {
  // ... existing fields
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';  // add epic
  upgraded?: CardUpgrade;  // optional upgrade data
}
```

### Pattern 3: Boss Behavioral Patterns via Enemy Schema
**What:** Boss behaviors defined as JSON fields on enemy entries, interpreted by EnemyAI
**When to use:** All boss enemy entries with behavioral patterns
**Example:**
```typescript
// enemies.json -- boss with enrage behavior
{
  "id": "boss_dragon",
  "name": "Ancient Dragon",
  "type": "boss",
  "bossType": "dragon",
  "baseHP": 1200,
  "baseDefense": 25,
  "attack": {
    "damage": 30,
    "pattern": "scaling",
    "specialEffect": "multi_hit"
  },
  "behaviors": [
    { "type": "enrage", "hpThreshold": 0.3, "attackSpeedMultiplier": 2.0 },
    { "type": "shield", "interval": 10000, "shieldAmount": 50 }
  ],
  "attackCooldown": 2500,
  "goldReward": { "min": 130, "max": 200 },
  "materialReward": { "chance": 1.0, "bonusMaterial": "essence", "bonusAmount": { "min": 4, "max": 8 } }
}
```

### Pattern 4: Event Material Integration
**What:** New event effect types for material costs/rewards
**When to use:** Events that interact with the multi-material economy
**Example:**
```typescript
// events.json -- event with material costs
{
  "id": "wandering_blacksmith",
  "title": "Wandering Blacksmith",
  "description": "A blacksmith offers to reinforce your equipment.",
  "weight": 1.0,
  "choices": [
    {
      "text": "Pay 5 iron for +10 Max HP this run",
      "effects": [
        { "type": "lose_material", "material": "iron", "value": 5 },
        { "type": "gain_max_hp", "value": 10 }
      ],
      "requirement": { "minMaterial": { "iron": 5 } }
    },
    { "text": "Decline", "effects": [] }
  ]
}
```

### Anti-Patterns to Avoid
- **Hardcoding card stats in TypeScript:** ALL card data must live in cards.json. TypeScript code reads it generically
- **Adding new systems for boss behaviors:** Boss patterns must hook into existing EnemyAI tick loop, not create separate boss-specific classes
- **Breaking Phase 5 balance:** New cards should fit within the 5-8s fight time window. Validate with existing balance-validation.test.ts patterns
- **Duplicating card IDs:** Each card needs a unique ID. Upgraded cards are the same ID with `+` suffix in display only, NOT separate card entries
- **Separate upgrade tracking outside RunState:** Upgrade state must live in RunState (e.g., `deck.upgradedCards: string[]` tracking which card IDs are upgraded)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Content validation | Manual checking of JSON | Vitest content.test.ts assertions | Already have content test suite -- extend it |
| Card availability filtering | Custom filter per feature | `UnlockManager.getAvailableCards()` | Already filters by MetaState unlock lists |
| Relic availability filtering | Custom filter per feature | `UnlockManager.getAvailableRelics()` | Same pattern as cards |
| Card effect resolution | Per-card switch statements | `CardResolver.applyEffect()` | Generic effect handler already exists |
| Event effect application | Per-event logic | `EventResolver.resolveEventChoice()` | Extend with new effect types |
| Loot generation | Custom drop logic | `LootGenerator.rollTreasureLoot()` | Already weighted, unlock-aware |
| Random number generation | Math.random() | `SeededRNG` / injectable RNG | Deterministic testing established pattern |

## Common Pitfalls

### Pitfall 1: Breaking Existing Content Tests
**What goes wrong:** Adding new content causes existing assertions to fail (e.g., `relics.json has exactly 8 entries`)
**Why it happens:** Tests use exact counts instead of minimum counts
**How to avoid:** Update content.test.ts assertions from `toBe(8)` to `toBeGreaterThanOrEqual(15)` when expanding content. Do this FIRST before adding content
**Warning signs:** Test failures on `npx vitest run tests/content/content.test.ts`

### Pitfall 2: Card Upgrade State Not Persisted
**What goes wrong:** Upgraded cards revert to base version on save/load
**Why it happens:** Upgrade state not added to RunState serialization
**How to avoid:** Add `upgradedCards: string[]` to RunState deck section. Ensure idb-keyval serialization round-trips correctly
**Warning signs:** Upgrades disappear after browser refresh

### Pitfall 3: Boss Behaviors Conflicting with Existing Patterns
**What goes wrong:** Boss enrage/shield behaviors interact poorly with existing `scaling`/`conditional` attack patterns
**Why it happens:** Both the base pattern and behavioral overlay modify damage/cooldown
**How to avoid:** Behaviors apply as multipliers AFTER base pattern calculation, not before. Clear separation of concerns
**Warning signs:** Bosses dealing unexpected damage values

### Pitfall 4: Epic Cards Accessible Too Early
**What goes wrong:** Epic cards appear in loot pools without Forge tier 4-5
**Why it happens:** `UnlockManager.getAvailableCards()` already gates by `unlockSource`/`unlockTier`, but epic cards must have these fields set correctly
**How to avoid:** Every epic card MUST have `"unlockSource": "forge", "unlockTier": 5` (or 4). Validate in content tests
**Warning signs:** Epic cards showing up in early runs

### Pitfall 5: Event Material Requirements Not Checked
**What goes wrong:** Events with material costs succeed even when player lacks materials
**Why it happens:** `isChoiceAvailable()` currently only checks `minGold` and `minHP`, not materials
**How to avoid:** Extend requirement checking in EventResolver to include `minMaterial: Record<string, number>`
**Warning signs:** "Spend 5 iron" event works with 0 iron

### Pitfall 6: Synergy Pairs Using Upgrade IDs
**What goes wrong:** Synergies stop working for upgraded cards
**Why it happens:** If upgraded cards use different IDs (e.g., `strike+`), synergy lookup fails
**How to avoid:** Upgraded cards keep the same base ID. The `upgraded` flag is tracked separately in RunState, not in the card ID
**Warning signs:** Upgrading Shield Wall breaks the Shield Wall -> Fury synergy

### Pitfall 7: Forge/Shrine Building Tier Overflow
**What goes wrong:** Adding forge tier 5+ for epic cards but buildings.json `maxLevel` is 4
**Why it happens:** Forgot to update `maxLevel` and add new tier entries
**How to avoid:** Update buildings.json `forge.maxLevel` to 5 or 6, add corresponding tier entries with appropriate material costs
**Warning signs:** Cannot upgrade forge past tier 4

## Code Examples

### Extending CardDefinition for Upgrades
```typescript
// src/data/types.ts -- modifications needed
export interface CardUpgrade {
  effects?: CardEffect[];
  cost?: CardCost;
  cooldown?: number;
  description?: string;
}

export interface CardDefinition {
  id: string;
  name: string;
  description: string;
  category: CardCategory;
  effects: CardEffect[];
  cost?: CardCost;
  cooldown: number;
  targeting: 'single' | 'aoe' | 'lowest-hp' | 'random' | 'self';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';  // add epic
  unlockSource?: string;
  unlockTier?: number;
  upgraded?: CardUpgrade;  // upgrade data overlay
}
```

### ShopSystem.upgradeCard
```typescript
// src/systems/ShopSystem.ts -- new method
static getUpgradePrice(rarity: string): number {
  const basePrices: Record<string, number> = {
    common: 50, uncommon: 80, rare: 120, epic: 200
  };
  return basePrices[rarity] ?? 100;
}

static upgradeCard(
  runState: RunState,
  cardId: string,
  upgradedCards: string[],
  price: number
): boolean {
  if (runState.economy.gold < price) return false;
  if (upgradedCards.includes(cardId)) return false;  // already upgraded
  runState.economy.gold -= price;
  upgradedCards.push(cardId);
  return true;
}
```

### CardResolver Upgrade Bonus Application
```typescript
// In CardResolver.resolve() -- apply upgrade bonuses
// After getting card from DataLoader, check if card is upgraded:
const isUpgraded = state.upgradedCards?.includes(card.id);
const effectiveEffects = isUpgraded && card.upgraded?.effects
  ? card.upgraded.effects
  : card.effects;
const effectiveCost = isUpgraded && card.upgraded?.cost
  ? card.upgraded.cost
  : card.cost;
```

### Boss Behavior in EnemyAI
```typescript
// src/systems/combat/EnemyAI.ts -- extend attack method
private applyBehaviors(state: CombatState, damage: number): number {
  let modifiedDamage = damage;

  // Enrage: below HP threshold, multiply attack speed
  if (state.enemyBehaviors?.enrage) {
    const { hpThreshold, attackSpeedMultiplier } = state.enemyBehaviors.enrage;
    if (state.enemyHP / state.enemyMaxHP <= hpThreshold) {
      // Reduce cooldown timer restoration
      state.enemyAttackCooldownModifier = 1 / attackSpeedMultiplier;
    }
  }

  // Shield: periodic armor gain
  if (state.enemyBehaviors?.shield) {
    // Handled in tick() with interval timer
  }

  // Multi-hit: split into multiple hits
  if (state.enemyBehaviors?.multiHit) {
    // Return reduced per-hit damage; caller loops
  }

  return modifiedDamage;
}
```

### New Event Effect Types in EventResolver
```typescript
// Extend the switch in resolveEventChoice:
case 'lose_material': {
  const material = (effect as any).material;
  const amount = typeof val === 'number' ? val : 0;
  const current = runState.economy.materials[material] ?? 0;
  runState.economy.materials[material] = Math.max(0, current - amount);
  descriptions.push(`Lost ${amount} ${material}`);
  appliedEffects.push({ type: 'lose_material', value: amount, applied: true });
  break;
}
case 'gain_material': {
  const material = (effect as any).material;
  const amount = typeof val === 'number' ? val : 0;
  runState.economy.materials[material] = (runState.economy.materials[material] ?? 0) + amount;
  descriptions.push(`Gained ${amount} ${material}`);
  appliedEffects.push({ type: 'gain_material', value: amount, applied: true });
  break;
}
case 'upgrade_card': {
  // Upgrade a random card in deck
  descriptions.push('A card in your deck was upgraded!');
  appliedEffects.push({ type: 'upgrade_card', value: 'random', applied: true });
  break;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 3 boss stat variants | 5 boss types with behavioral patterns | Phase 6 | Each boss feels distinct in auto-combat |
| Cards have no upgrade path | Single-tier upgrade system (+suffix) | Phase 6 | More shop engagement, deck power growth |
| Events use only gold/HP | Events use multi-material economy | Phase 6 | Tile placement decisions feed back into events |
| 3 rarity tiers (common/uncommon/rare) | 4 rarity tiers (+epic) | Phase 6 | Late-game chase items for experienced players |
| Curses are no-op placeholder | Curses function as dead cards with effects | Phase 6 | Risk/reward event choices have real consequences |

## Open Questions

1. **How should upgraded card state be stored in RunState?**
   - What we know: RunState has `deck.active: string[]` for card order. Cards are referenced by ID.
   - What's unclear: Whether to add `deck.upgradedCards: string[]` or use a modified ID scheme (e.g., `strike+`)
   - Recommendation: Use `deck.upgradedCards: string[]` to avoid breaking synergy lookups that use base card IDs. The `+` suffix is display-only

2. **Should new events have a weight/rarity field for selection?**
   - What we know: `getRandomEvent()` currently picks uniformly random from all events
   - What's unclear: Whether to add a `weight` field now or keep uniform selection
   - Recommendation: Add `weight: number` (default 1.0) to event schema. Common events get weight 2-3, rare events get 0.5. Simple weighted random selection

3. **How do boss-specific loot tables work?**
   - What we know: `LootGenerator.rollMaterialDrops('boss', ...)` gives generic boss drops from materials.json
   - What's unclear: Whether each boss type should have unique drop tables
   - Recommendation: Add per-bossType drop overrides in materials.json. Higher-loop bosses get multiplied drops via existing loopCount parameter

4. **Should add_curse event effect be implemented or remain no-op?**
   - What we know: EventResolver has `add_curse` as no-op placeholder. curses.json has 4 curse definitions with typed effects
   - What's unclear: How curses integrate into the deck (are they actual cards in deck.active?)
   - Recommendation: Curses ARE cards added to deck.active. CombatEngine checks if card is a curse (via DataLoader), applies curse effect instead of normal card resolve, and continues

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1 |
| Config file | vitest.config.ts |
| Quick run command | `npx vitest run tests/content/content.test.ts` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-05 | 30+ cards with valid schema, epic tier exists | unit | `npx vitest run tests/content/content.test.ts -t "cards.json"` | Exists (needs update) |
| CONT-06 | 15+ relics with valid schema, build-around relics present | unit | `npx vitest run tests/content/content.test.ts -t "relics.json"` | Exists (needs update) |
| CONT-07 | 5+ boss types with behavioral patterns | unit | `npx vitest run tests/content/content.test.ts -t "enemies.json"` | Exists (needs update) |
| CONT-08 | 15+ events with valid schema, material effects | unit | `npx vitest run tests/content/content.test.ts -t "events.json"` | Exists (needs update) |
| CONT-09 | Card upgrade system works in shop | unit | `npx vitest run tests/systems/ShopSystem.test.ts` | Exists (needs extension) |
| CONT-09 | Upgraded cards apply bonus in combat | unit | `npx vitest run tests/systems/combat/card-resolver.test.ts` | Exists (needs extension) |
| CONT-07 | Boss behaviors (enrage, shield) function | unit | `npx vitest run tests/systems/combat/enemy-ai.test.ts` | Exists (needs extension) |
| CONT-08 | Event material effects resolve correctly | unit | `npx vitest run tests/systems/EventResolver.test.ts` | Exists (needs extension) |

### Sampling Rate
- **Per task commit:** `npx vitest run tests/content/content.test.ts`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Update `tests/content/content.test.ts` -- change exact counts to Phase 6 minimums (30 cards, 15 relics, 5 boss types, 15 events, 10 synergies)
- [ ] Add epic rarity validation to content tests
- [ ] Add card upgrade schema validation (upgraded field)
- [ ] Add boss behavior schema validation (behaviors array)
- [ ] Add event weight field validation
- [ ] Add synergy count >= 10 assertion

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection of all JSON data files, TypeScript systems, and type definitions
- `src/data/types.ts` -- all content type definitions (CardDefinition already has `upgraded?: boolean` and `upgradeBonus?` fields)
- `src/data/json/cards.json` -- 15 cards, schema verified
- `src/data/json/relics.json` -- 8 relics, flat trigger/effectType schema verified
- `src/data/json/enemies.json` -- 9 enemies (4 bosses with bossType), schema verified
- `src/data/json/events.json` -- 5 events, choice/effect schema verified
- `src/data/json/synergies.json` -- 6 synergy pairs, cardA/cardB/bonus schema verified
- `src/data/json/curses.json` -- 4 curses (pain, wound, weakness, fragility)
- `src/systems/combat/EnemyAI.ts` -- existing pattern/specialEffect handling verified
- `src/systems/combat/CardResolver.ts` -- effect application pipeline verified
- `src/systems/EventResolver.ts` -- event resolution with add_curse no-op confirmed
- `src/systems/ShopSystem.ts` -- static methods, adapter pattern confirmed
- `tests/content/content.test.ts` -- existing content validation test suite

### Secondary (MEDIUM confidence)
- `.planning/phases/05-balance-economy-overhaul/05-CONTEXT.md` -- Phase 5 balance targets (5-8s fights, multi-material economy) referenced in CONTEXT.md

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all existing libraries
- Architecture: HIGH -- extending well-established data-driven patterns with full codebase inspection
- Pitfalls: HIGH -- identified from direct code reading (exact count assertions, no-op placeholders, missing unlock gates)
- Content design: MEDIUM -- discretion items (exact stats, synergy pairs) require playtesting iteration

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable -- content authoring patterns unlikely to change)
