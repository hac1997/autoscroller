---
phase: 03
slug: loop-tile-world
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (to be installed in Wave 0) |
| **Config file** | `vitest.config.ts` (Wave 0 creates) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | LOOP-01 | unit | `npx vitest run tests/systems/LoopRunner.test.ts -t "traversal"` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | LOOP-02 | unit | `npx vitest run tests/systems/LoopRunner.test.ts -t "planning"` | ❌ W0 | ⬜ pending |
| 03-01-03 | 01 | 1 | LOOP-03 | unit | `npx vitest run tests/systems/SynergyResolver.test.ts` | ❌ W0 | ⬜ pending |
| 03-01-04 | 01 | 1 | LOOP-04 | unit | `npx vitest run tests/systems/LoopRunner.test.ts -t "terrain spawn"` | ❌ W0 | ⬜ pending |
| 03-01-05 | 01 | 1 | LOOP-05 | unit | `npx vitest run tests/systems/DifficultyScaler.test.ts` | ❌ W0 | ⬜ pending |
| 03-01-06 | 01 | 1 | LOOP-06 | unit | `npx vitest run tests/systems/LoopRunner.test.ts -t "boss"` | ❌ W0 | ⬜ pending |
| 03-01-07 | 01 | 1 | LOOP-07 | unit | `npx vitest run tests/systems/RunEndResolver.test.ts -t "safe exit"` | ❌ W0 | ⬜ pending |
| 03-01-08 | 01 | 1 | LOOP-08 | unit | `npx vitest run tests/systems/RunEndResolver.test.ts -t "death"` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 1 | TILE-01 | unit | `npx vitest run tests/systems/LoopRunner.test.ts -t "tile points"` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 1 | TILE-02 | unit | `npx vitest run tests/systems/LootGenerator.test.ts -t "tile drop"` | ❌ W0 | ⬜ pending |
| 03-02-03 | 02 | 1 | TILE-03 | unit | `npx vitest run tests/systems/ShopSystem.test.ts -t "tile sell"` | ❌ W0 | ⬜ pending |
| 03-02-04 | 02 | 1 | TILE-04 | unit | `npx vitest run tests/systems/TileRegistry.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-05 | 02 | 1 | TILE-05 | unit | `npx vitest run tests/systems/LoopRunner.test.ts -t "placement"` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 2 | SPEC-01 | integration | manual-only (Phaser scene rendering) | n/a | ⬜ pending |
| 03-03-02 | 03 | 2 | SPEC-02 | unit | `npx vitest run tests/systems/EventResolver.test.ts` | ❌ W0 | ⬜ pending |
| 03-03-03 | 03 | 2 | SPEC-03 | unit | `npx vitest run tests/systems/RestSiteSystem.test.ts` | ❌ W0 | ⬜ pending |
| 03-03-04 | 03 | 2 | SPEC-04 | unit | `npx vitest run tests/systems/LootGenerator.test.ts -t "treasure"` | ❌ W0 | ⬜ pending |
| 03-03-05 | 03 | 2 | SPEC-05 | integration | manual-only (CombatEngine + scene flow) | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm install -D vitest` — install Vitest as devDependency
- [ ] `vitest.config.ts` — basic config pointing to `tests/` directory
- [ ] `tests/systems/LoopRunner.test.ts` — stubs for LOOP-01, LOOP-02, LOOP-04, LOOP-06, TILE-01, TILE-05
- [ ] `tests/systems/SynergyResolver.test.ts` — stubs for LOOP-03
- [ ] `tests/systems/DifficultyScaler.test.ts` — stubs for LOOP-05
- [ ] `tests/systems/RunEndResolver.test.ts` — stubs for LOOP-07, LOOP-08
- [ ] `tests/systems/LootGenerator.test.ts` — stubs for TILE-02, SPEC-04
- [ ] `tests/systems/TileRegistry.test.ts` — stubs for TILE-04
- [ ] `tests/systems/ShopSystem.test.ts` — stubs for TILE-03
- [ ] `tests/systems/EventResolver.test.ts` — stubs for SPEC-02
- [ ] `tests/systems/RestSiteSystem.test.ts` — stubs for SPEC-03

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Shop scene reads/writes RunState for deck mgmt + relic buy + tile sell | SPEC-01 | Phaser scene rendering + overlay interaction | Launch game, enter shop tile, verify all 5 shop actions work (buy card, remove card, reorder deck, buy relic, sell tile) |
| Boss combat uses scaled boss stats, triggers exit choice on win | SPEC-05 | CombatEngine + Phaser scene flow + overlay transition | Play to loop 5, defeat boss, verify exit choice screen appears with correct loot/XP display |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
