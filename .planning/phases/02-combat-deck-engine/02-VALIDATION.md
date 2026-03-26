---
phase: 2
slug: combat-deck-engine
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-25
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (installed in Phase 1 Wave 0) |
| **Config file** | vitest.config.ts (from Phase 1) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | CMBT-01 | unit | `npx vitest run tests/systems/combat/combat-engine.test.ts -t "auto-play"` | No -- Wave 0 | ⬜ pending |
| 02-01-02 | 01 | 1 | CMBT-02 | unit | `npx vitest run tests/systems/combat/combat-engine.test.ts -t "cooldown"` | No -- Wave 0 | ⬜ pending |
| 02-01-03 | 01 | 1 | CMBT-06 | unit | `npx vitest run tests/systems/combat/combat-engine.test.ts -t "reshuffle"` | No -- Wave 0 | ⬜ pending |
| 02-01-04 | 01 | 1 | CMBT-07 | unit | `npx vitest run tests/data/cards.test.ts -t "category"` | No -- Wave 0 | ⬜ pending |
| 02-01-05 | 01 | 1 | CMBT-08 | unit | `npx vitest run tests/systems/combat/card-resolver.test.ts -t "cost"` | No -- Wave 0 | ⬜ pending |
| 02-01-06 | 01 | 1 | CMBT-09 | unit | `npx vitest run tests/systems/combat/combat-engine.test.ts -t "regen"` | No -- Wave 0 | ⬜ pending |
| 02-01-07 | 01 | 1 | CMBT-10 | unit | `npx vitest run tests/systems/combat/combat-state.test.ts -t "reset"` | No -- Wave 0 | ⬜ pending |
| 02-01-08 | 01 | 1 | CMBT-11 | unit | `npx vitest run tests/systems/combat/card-resolver.test.ts -t "targeting"` | No -- Wave 0 | ⬜ pending |
| 02-01-09 | 01 | 1 | CMBT-12 | unit | `npx vitest run tests/systems/combat/enemy-ai.test.ts` | No -- Wave 0 | ⬜ pending |
| 02-02-01 | 02 | 1 | DECK-01 | unit | `npx vitest run tests/systems/deck/deck-system.test.ts -t "add free"` | No -- Wave 0 | ⬜ pending |
| 02-02-02 | 02 | 1 | DECK-02 | unit | `npx vitest run tests/systems/deck/deck-system.test.ts -t "removal cost"` | No -- Wave 0 | ⬜ pending |
| 02-02-03 | 02 | 1 | DECK-03 | unit | `npx vitest run tests/systems/deck/deck-system.test.ts -t "reorder"` | No -- Wave 0 | ⬜ pending |
| 02-02-04 | 02 | 1 | DECK-04 | unit | `npx vitest run tests/systems/combat/synergy.test.ts -t "trigger"` | No -- Wave 0 | ⬜ pending |
| 02-02-05 | 02 | 1 | DECK-05 | unit | `npx vitest run tests/systems/combat/synergy.test.ts -t "no match"` | No -- Wave 0 | ⬜ pending |
| 02-02-06 | 02 | 1 | DECK-06 | unit | `npx vitest run tests/systems/combat/synergy.test.ts -t "class restriction"` | No -- Wave 0 | ⬜ pending |
| 02-02-07 | 02 | 1 | DECK-07 | unit | `npx vitest run tests/state/runstate.test.ts -t "deck order"` | No -- Wave 0 | ⬜ pending |
| 02-02-08 | 02 | 1 | DECK-08 | unit | `npx vitest run tests/systems/deck/loot-system.test.ts` | No -- Wave 0 | ⬜ pending |
| 02-03-01 | 03 | 2 | CMBT-03 | unit | `npx vitest run tests/systems/combat/combat-state.test.ts -t "deck visible"` | No -- Wave 0 | ⬜ pending |
| 02-03-02 | 03 | 2 | CMBT-04 | unit | `npx vitest run tests/systems/combat/synergy.test.ts -t "visual"` | No -- Wave 0 | ⬜ pending |
| 02-03-03 | 03 | 2 | CMBT-05 | unit | `npx vitest run tests/systems/combat/combat-stats.test.ts` | No -- Wave 0 | ⬜ pending |
| 02-03-04 | 03 | 2 | HERO-01 | unit | `npx vitest run tests/systems/hero/warrior.test.ts -t "base stats"` | No -- Wave 0 | ⬜ pending |
| 02-03-05 | 03 | 2 | HERO-02 | unit | `npx vitest run tests/systems/hero/xp-system.test.ts` | No -- Wave 0 | ⬜ pending |
| 02-03-06 | 03 | 2 | HERO-03 | unit | `npx vitest run tests/systems/hero/passive-skills.test.ts` | No -- Wave 0 | ⬜ pending |
| 02-03-07 | 03 | 2 | HERO-04 | unit | `npx vitest run tests/systems/combat/synergy.test.ts -t "warrior exclusive"` | No -- Wave 0 | ⬜ pending |
| 02-03-08 | 03 | 2 | PLSH-01 | manual | Visual verification -- death screen shows loops, damage, cards, cause of death | N/A | ⬜ pending |

---

## Wave 0 Requirements

- [ ] `tests/systems/combat/combat-engine.test.ts` -- CombatEngine tick, card play, cooldown, reshuffle, regen
- [ ] `tests/systems/combat/combat-state.test.ts` -- CombatState creation, resource reset, deck visibility
- [ ] `tests/systems/combat/card-resolver.test.ts` -- Effect application, cost payment, targeting
- [ ] `tests/systems/combat/enemy-ai.test.ts` -- Independent timer, attack patterns
- [ ] `tests/systems/combat/synergy.test.ts` -- Pair detection, class restriction, no false positives
- [ ] `tests/systems/combat/combat-stats.test.ts` -- Stats accumulation accuracy
- [ ] `tests/systems/deck/deck-system.test.ts` -- Add, remove (cost), reorder operations
- [ ] `tests/systems/deck/loot-system.test.ts` -- Weighted rarity generation
- [ ] `tests/systems/hero/warrior.test.ts` -- Base stats, starter deck
- [ ] `tests/systems/hero/xp-system.test.ts` -- Earn, bank, lose XP logic
- [ ] `tests/systems/hero/passive-skills.test.ts` -- Threshold unlocking, stat modification, conditional triggers
- [ ] `tests/data/cards.test.ts` -- Card JSON schema validation (cooldown, targeting, rarity fields present)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Death screen displays run statistics | PLSH-01 | Visual UI layout, text content verification | Trigger hero death in combat, verify death screen shows: loops completed, total damage dealt, cards played, combos triggered, cause of death |
| Card queue visibility during combat | CMBT-03 | Visual rendering of card queue panel | Start combat, verify entire deck order is visible in the card queue UI panel |
| Synergy combo visual highlight | CMBT-04 | Visual effects (glow, COMBO! text, color) | Place synergy pair consecutively in deck, start combat, verify COMBO! text flash and glow when pair resolves |
| Drag-and-drop deck reorder | DECK-03 | Phaser input/drag interaction | Open shop reorder UI, drag a card to new position, verify deck order updates |
| Post-combat summary screen | CMBT-05 | Visual layout and content rendering | Win a combat, verify summary shows damage dealt/received, cards played, combos triggered |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
