---
phase: 6
slug: content-expansion
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | CONT-05/06/07/08 | unit | `npx vitest run tests/content/content.test.ts` | ✅ (update assertions) | ⬜ pending |
| 06-01-02 | 01 | 1 | CONT-05/06/07/08 | unit | `npx vitest run tests/content/content.test.ts --reporter=verbose` | ✅ | ⬜ pending |
| 06-02-01 | 02 | 2 | CONT-09 | unit | `npx vitest run tests/systems/ShopSystem.test.ts tests/systems/combat/card-resolver.test.ts` | ✅ | ⬜ pending |
| 06-02-02 | 02 | 2 | CONT-07/08 | unit | `npx vitest run tests/systems/combat/enemy-ai.test.ts tests/systems/EventResolver.test.ts` | ✅ | ⬜ pending |
| 06-03-01 | 03 | 3 | CONT-09 | unit | `npx vitest run --reporter=verbose` | ✅ | ⬜ pending |
| 06-03-02 | 03 | 3 | ALL | checkpoint | Human visual verification | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Update existing content count assertions in `tests/content/content.test.ts` (cards: 15→30, relics: 8→15, events: 5→15)
- [ ] Add schema validation tests for new fields (epic rarity, upgraded object, behaviors array, material event effects)
- [ ] Existing test files cover all system extensions: `tests/systems/ShopSystem.test.ts`, `tests/systems/combat/card-resolver.test.ts`, `tests/systems/combat/enemy-ai.test.ts`, `tests/systems/EventResolver.test.ts`

*Note: `tests/content/content.test.ts` already exists — needs assertion count updates, not creation.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Card upgrade visual distinction in CombatScene | CONT-09 | Phaser rendering | Open shop, upgrade a card, enter combat, verify + suffix and border color |
| Boss behavioral patterns visible in combat | CONT-07 | Phaser rendering + timing | Fight each boss type, verify enrage/shield/etc. triggers visually |
| New event narrative text quality | CONT-08 | Subjective quality | Read through each new event, verify choices make sense and rewards are balanced |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
