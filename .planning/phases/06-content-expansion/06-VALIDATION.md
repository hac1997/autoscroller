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
| 06-01-01 | 01 | 1 | CONT-05 | unit | `npx vitest run src/data/__tests__/cards.test.ts` | ❌ W0 | ⬜ pending |
| 06-01-02 | 01 | 1 | CONT-06 | unit | `npx vitest run src/data/__tests__/relics.test.ts` | ❌ W0 | ⬜ pending |
| 06-01-03 | 01 | 1 | CONT-07 | unit | `npx vitest run src/data/__tests__/enemies.test.ts` | ❌ W0 | ⬜ pending |
| 06-02-01 | 02 | 1 | CONT-08 | unit | `npx vitest run src/data/__tests__/events.test.ts` | ❌ W0 | ⬜ pending |
| 06-02-02 | 02 | 1 | CONT-09 | unit | `npx vitest run src/systems/__tests__/card-upgrade.test.ts` | ❌ W0 | ⬜ pending |
| 06-03-01 | 03 | 2 | CONT-07 | unit | `npx vitest run src/systems/__tests__/boss-ai.test.ts` | ❌ W0 | ⬜ pending |
| 06-03-02 | 03 | 2 | CONT-05 | unit | `npx vitest run src/systems/__tests__/synergy.test.ts` | ❌ W0 | ⬜ pending |
| 06-04-01 | 04 | 3 | CONT-09 | unit | `npx vitest run src/scenes/__tests__/shop-upgrade.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Update existing content count assertions in tests (cards: 15→30, relics: 8→15, enemies: 9→14, events: 5→15)
- [ ] `src/data/__tests__/cards.test.ts` — card schema validation, rarity distribution, upgrade field presence
- [ ] `src/data/__tests__/relics.test.ts` — relic schema validation, trigger coverage
- [ ] `src/data/__tests__/enemies.test.ts` — boss behavioral pattern validation
- [ ] `src/data/__tests__/events.test.ts` — event schema, effect type coverage, material integration
- [ ] `src/systems/__tests__/card-upgrade.test.ts` — upgrade resolution, cost calculation
- [ ] `src/systems/__tests__/boss-ai.test.ts` — enrage/shield/multi-hit/drain/summon patterns
- [ ] `src/systems/__tests__/synergy.test.ts` — new synergy pair resolution

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
