---
phase: 07-polish-release
plan: 03
subsystem: ui
tags: [phaser, camera-fade, style-constants, visual-consistency, transitions]

requires:
  - phase: 07-01
    provides: StyleConstants module with COLORS, FONTS, LAYOUT, createButton
  - phase: 07-02
    provides: Tutorial, settings, HUD animations, keyboard shortcuts
provides:
  - Camera fade transitions on all 13 full scene transitions
  - Visual consistency pass across all ~25 scenes using StyleConstants
  - Standardized button creation via createButton helper
  - Transition guard preventing double-transitions
affects: []

tech-stack:
  added: []
  patterns:
    - "fadeToScene helper pattern for guarded scene transitions"
    - "COLORS/FONTS/LAYOUT constants replacing all hardcoded style values"
    - "createButton helper replacing inline 7-line button patterns"

key-files:
  created: []
  modified:
    - src/scenes/MainMenu.ts
    - src/scenes/DeathScene.ts
    - src/scenes/PostCombatScene.ts
    - src/scenes/CityHubScene.ts
    - src/scenes/BossExitScene.ts
    - src/scenes/GameOverScene.ts
    - src/scenes/RewardScene.ts
    - src/scenes/GameScene.ts
    - src/scenes/CombatScene.ts
    - src/scenes/CollectionScene.ts
    - src/scenes/SelectionScene.ts
    - src/scenes/Boot.ts
    - src/scenes/Preloader.ts
    - src/scenes/ShopScene.ts
    - src/scenes/EventScene.ts
    - src/scenes/PauseScene.ts
    - src/scenes/DeckViewScene.ts
    - src/scenes/DeckCustomizationScene.ts
    - src/scenes/BuildingPanelScene.ts
    - src/scenes/TavernPanelScene.ts
    - src/scenes/RelicViewerScene.ts
    - src/scenes/ShopDeckEditor.ts
    - src/scenes/RestScene.ts
    - src/scenes/RestSiteScene.ts
    - src/scenes/TreasureScene.ts

key-decisions:
  - "fadeToScene helper uses private transitioning flag to prevent double-transition race conditions"
  - "Boot and Preloader get fadeIn only (no fadeOut needed for loading screens)"
  - "Overlay scenes keep instant show/hide without camera fades (modal pattern)"
  - "Game-mechanic-specific colors (boss exit green/red, tile type colors) left as-is, only standard palette replaced"

patterns-established:
  - "fadeToScene pattern: transitioning guard + fadeOut + camerafadeoutcomplete callback"
  - "All scenes import only the StyleConstants symbols they use"

requirements-completed: [POLISH-TRANSITIONS]

duration: 15min
completed: 2026-03-28
---

# Phase 07 Plan 03: Scene Transitions and Visual Consistency Summary

**Camera fade transitions on all full scenes with LAYOUT.fadeDuration, plus StyleConstants visual consistency pass across all 25 scenes replacing hardcoded colors, fonts, and button patterns**

## Performance

- **Duration:** 15 min
- **Started:** 2026-03-28T05:19:48Z
- **Completed:** 2026-03-28T05:35:00Z
- **Tasks:** 4 (3 auto + 1 auto-approved checkpoint)
- **Files modified:** 25

## Accomplishments
- Added fadeIn/fadeOut camera transitions to 11 full scenes with transition guard
- Added fadeIn-only to Boot and Preloader loading screens
- Replaced all hardcoded hex colors (0x1a1a2e, '#ffd700', 0x222222, etc.) with COLORS constants across 25 scene files
- Replaced inline font family strings with FONTS.family
- Standardized button creation using createButton helper (15+ buttons converted)
- Standardized panel alpha with LAYOUT.panelAlpha

## Task Commits

Each task was committed atomically:

1. **Task 1: Camera fade transitions to all full scenes** - `4de1264` (feat)
2. **Task 2: Visual consistency pass -- main flow scenes** - `1d8c47a` (feat)
3. **Task 3: Visual consistency pass -- overlay and utility scenes** - `ee93904` (feat)
4. **Task 4: Human verification checkpoint** - Auto-approved

## Files Created/Modified
- `src/scenes/MainMenu.ts` - fadeIn/fadeOut + transition guard
- `src/scenes/DeathScene.ts` - fadeIn/fadeOut + COLORS/FONTS + createButton
- `src/scenes/PostCombatScene.ts` - fadeIn/fadeOut + COLORS/FONTS + createButton
- `src/scenes/CityHubScene.ts` - fadeIn/fadeOut + COLORS/FONTS + createButton
- `src/scenes/BossExitScene.ts` - fadeIn/fadeOut + COLORS/FONTS
- `src/scenes/GameOverScene.ts` - fadeIn/fadeOut + COLORS/FONTS + createButton
- `src/scenes/RewardScene.ts` - fadeIn/fadeOut + COLORS/FONTS + createButton
- `src/scenes/GameScene.ts` - fadeIn/fadeOut + fadeToScene for run-exited
- `src/scenes/CombatScene.ts` - fadeIn/fadeOut + COLORS for VS divider and result text
- `src/scenes/CollectionScene.ts` - fadeIn/fadeOut + COLORS/FONTS
- `src/scenes/SelectionScene.ts` - fadeIn/fadeOut + COLORS/FONTS + createButton
- `src/scenes/Boot.ts` - fadeIn only
- `src/scenes/Preloader.ts` - fadeIn only
- `src/scenes/ShopScene.ts` - COLORS/FONTS + createButton
- `src/scenes/EventScene.ts` - COLORS/FONTS + createButton
- `src/scenes/PauseScene.ts` - COLORS/FONTS + createButton
- `src/scenes/DeckViewScene.ts` - COLORS/FONTS
- `src/scenes/DeckCustomizationScene.ts` - COLORS/FONTS + createButton
- `src/scenes/BuildingPanelScene.ts` - COLORS/FONTS + createButton
- `src/scenes/TavernPanelScene.ts` - COLORS/FONTS + createButton
- `src/scenes/RelicViewerScene.ts` - COLORS/FONTS + createButton
- `src/scenes/ShopDeckEditor.ts` - COLORS/FONTS
- `src/scenes/RestScene.ts` - COLORS/FONTS + createButton
- `src/scenes/RestSiteScene.ts` - COLORS/FONTS + createButton
- `src/scenes/TreasureScene.ts` - COLORS/FONTS + createButton

## Decisions Made
- fadeToScene helper uses private transitioning flag to prevent double-transition race conditions
- Boot and Preloader get fadeIn only (no fadeOut needed since they are loading screens)
- Overlay scenes keep instant show/hide without camera fades (modal pattern)
- Game-mechanic-specific colors (boss exit green/red, tile type colors, enemy colors) intentionally left as-is
- DeathScene fadeOut callback also stops GameScene before transitioning to CityHub

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- 2 pre-existing test failures (MetaState version 3 vs expected 2) unrelated to this plan's changes. Confirmed by running tests on stashed state.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 07 (polish-release) is now complete with all 3 plans executed
- All scenes have consistent visual styling and smooth transitions
- Game is ready for release verification

---
*Phase: 07-polish-release*
*Completed: 2026-03-28*
