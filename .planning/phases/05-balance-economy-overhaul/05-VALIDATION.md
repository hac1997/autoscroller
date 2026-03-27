---
phase: 5
slug: balance-economy-overhaul
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts (or vite.config.ts) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~10 seconds |

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
| TBD | TBD | TBD | Combat rebalance | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | Resource reset 50% | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | Gold scaling prices | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | Multi-material economy | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | Storehouse building | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | Death penalty rework | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | Difficulty curve | unit | `npx vitest run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Test stubs for combat DPS validation (card damage * cooldown cycle vs enemy HP = target fight duration)
- [ ] Test stubs for resource reset between combats (50% stamina/mana recovery)
- [ ] Test stubs for gold scaling price formulas (cards, removal, reorder, relics with caps)
- [ ] Test stubs for multi-material drop calculations (terrain + enemy sourcing)
- [ ] Test stubs for building recipe validation (multi-material costs)
- [ ] Test stubs for death penalty calculation (10% base, Storehouse upgrades to 50%)
- [ ] Test stubs for difficulty scaling curve (enemy stat progression per loop)
- [ ] Test stubs for MetaState migration (v1 metaLoot:number → v2 materials:Record)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Combat feels 5-8s | Combat balance | Subjective timing | Run starter deck vs Slime on loop 1, time the fight |
| Shop prices feel fair | Gold economy | Subjective UX | Play through 3 loops, check if purchases feel meaningful |
| Material drops feel rewarding | Material economy | Subjective UX | Complete a loop with mixed terrains, check material variety |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
