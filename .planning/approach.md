# v1.0 Release Approach

## Current State
- Phases 1-4 complete (core loop, combat, loot/shop/events, meta-progression)
- Phase 4 has 3 verification gaps (blockers)
- Balance needs overhaul for long-run autoscroller design
- City completion should take days/weeks, not a weekend

---

## Execution Plan

### Step 1: Fix Phase 4 Gaps
**Command:** `/gsd:plan-phase 4 --gaps`
**What it fixes:**
1. BossExitScene safe exit — no meta-loot banking, routes to GameOverScene instead of CityHub
2. MainMenu → CityHub routing — MainMenu bypasses CityHub entirely
3. RelicDefinition type mismatch — relics.json format doesn't match TypeScript interface

**Then:** `/gsd:execute-phase 4` (runs only gap closure plans)

---

### Step 2: Add Phases 5-7 to Roadmap
**Command:** `/gsd:add-phase` (×3)

#### Phase 5: Balance & Economy Overhaul
- Reduce difficulty scaling 10% → 5% per loop
- Reduce boss multiplier 2.0x → 1.5x
- Gradual enemy composition (loops 3/7/12/20 instead of all at loop 5)
- Hero base defense 0 → 5
- Stamina/mana regen 2/1 → 3/2 per 3s
- Loop speed scaling 2% → 1% per loop
- Death penalty: 25% ML/0% XP → 50% ML/25% XP
- Expand all buildings to 8-10 tiers with exponential costs
- Total city cost: 25,000-40,000 ML (weeks of play)
- Add streak bonus (consecutive safe exits +10% ML)
- Scale meta-loot drops with loop count (longer runs = better rate)

#### Phase 6: Content Expansion
- New cards (15-20 additional, across new archetypes)
- New relics (10-15 additional, with synergy chains)
- New enemies (5-8, with unique mechanics per terrain)
- New events (8-12, with meaningful choices)
- New terrains and tile types
- Hero abilities/skill tree expansion
- Synergy system deepening (cross-card combos, relic+card combos)
- **Requires Q&A sessions** to design cards, relics, synergies, etc.

#### Phase 7: Polish & Release
- Tutorial flow (first-run guidance, mechanic introductions)
- Audio hooks (SFX triggers, music zones)
- Visual feedback (damage numbers, screen shake, particle effects)
- Settings screen (volume, speed, accessibility)
- Performance optimization (long-run memory, asset management)
- Final integration testing
- Release build configuration

---

### Step 3: Content Design Sessions (before Phase 6 planning)
Deep Q&A sessions to decide:
- [ ] Card designs (names, costs, effects, rarities, unlock sources)
- [ ] Relic designs (triggers, effects, synergy chains)
- [ ] Enemy designs (stats, specials, terrain associations)
- [ ] Event designs (choices, outcomes, risk/reward)
- [ ] Hero abilities and passive skill tree
- [ ] Terrain and tile type designs
- [ ] Synergy matrix (what combos with what)
- [ ] Unlock progression (what unlocks when, from which building)

---

## Balance Design Philosophy

**Core principle:** Each run should feel incrementally rewarding. Short runs (30 min) unlock something small. Long runs (3+ hours) make meaningful progress on one building tier. Full city completion = 2-4 weeks of daily play.

**Forge cost curve (example):**

| Tier | Cost | Cumulative | Safe 10-loop runs needed |
|------|------|-----------|--------------------------|
| 1 | 50 | 50 | 1-2 |
| 2 | 150 | 200 | 4-5 |
| 3 | 400 | 600 | 12-15 |
| 4 | 800 | 1,400 | 28-35 |
| 5 | 1,200 | 2,600 | 52-65 |
| 6 | 1,800 | 4,400 | 88-110 |
| 7 | 2,500 | 6,900 | 138-172 |
| 8 | 3,500 | 10,400 | 208-260 |

**Smoother mob progression:**
- Loops 1-3: Slimes/Goblins only (tutorial zone)
- Loops 4-6: Orcs introduced gradually
- Loops 7-10: Mages mix in
- Loops 11-15: Elite Knights appear
- Loop 16+: All enemy types, scaling intensifies
- Bosses every 5 loops, 1.5x multiplier (not 2.0x)

---

## Decision Log
- **GSD for:** gap closure, phase planning, execution, verification
- **Manual Q&A for:** content design (cards, relics, synergies) before Phase 6 planning
- **Approach chosen:** fix gaps → add phases → design content → plan → execute
