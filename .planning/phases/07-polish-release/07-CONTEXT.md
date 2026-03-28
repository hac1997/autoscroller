# Phase 7: Polish & Release - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Final v1 polish pass: update the tutorial to reflect actual gameplay, add minimal sound feedback via Web Audio API, standardize UI styling and scene transitions across all scenes, expose essential settings, and close remaining requirement gaps (CMBT-05, PLSH-01 status updates). No new game mechanics — only improving the experience of existing features for release readiness.

</domain>

<decisions>
## Implementation Decisions

### Tutorial & Onboarding
- **Step-through text screens** — reuse existing TutorialScene pattern (click/SPACE to advance)
- **Content covers core loop only**: tile placement, deck ordering, auto-combat basics, shop actions (buy/remove/reorder/upgrade). No deep strategy tips
- **Fix outdated text**: remove heir system reference, update tile color descriptions to match actual tile types (shop=gold, rest=blue, combat=red, event=purple, treasure=yellow, boss=dark red)
- **Triggers on first run only**: check a `tutorialSeen` flag on MetaState. Skippable via "Skip Tutorial" button
- **Language: English** — consistent with all existing game UI text

### Audio & Sound Effects
- **Web Audio API tones only — no audio file assets**: Generate simple synth tones programmatically (sine/square waves with envelopes). Zero asset pipeline overhead
- **Priority SFX events**: combat hit (short thud), card play (soft click), gold gain (coin chime), button click (subtle tick), hero death (low drone), loop completion (ascending tone), boss encounter (warning tone)
- **No background music in v1**: Deferred to PLSH-03 (v2). AudioManager.playMusic remains a no-op
- **Volume control**: Single SFX volume slider in SettingsScene. Mute toggle. Persisted in MetaState or localStorage

### UI Polish & Transitions
- **Scene transitions: camera fade** — Phaser `cameras.main.fadeIn/fadeOut` (300-500ms) on all scene starts/stops. Universal, consistent feel
- **Visual consistency pass**: Define a shared style constants object (colors, font sizes, panel dimensions) and apply across all ~25 scenes. Current ad-hoc hex values (#1a1a2e, #222222, #ffd700, #aaaaaa, #ffffff) become named constants
- **Button hover/interaction**: Standardize hover color change + optional scale tween (1.0 → 1.05) on all interactive text buttons
- **Stat change animations**: Tweened number counters on gold/HP/material changes in HUD (count up/down over 300ms rather than instant)
- **Fixed 800x600 canvas**: No responsive resize for v1. Current setup preserved

### Settings & Quality of Life
- **Settings exposed**: SFX volume (slider 0-100%), game speed (1x/2x toggle — doubles LoopRunner tick delta), auto-save toggle (on by default)
- **Keyboard shortcuts**: ESC = pause/back navigation, SPACE = continue/advance in dialogues and post-combat. Already partially implemented
- **Save management in settings**: "Delete Run" (clears current run, keeps meta) and "Reset All Progress" (clears meta + run, with double confirmation). Both already partially exist
- **Game speed**: 2x speed multiplies deltaMs passed to LoopRunner and CombatEngine. Simple multiplier, no animation changes needed

### Requirement Status Updates
- **CMBT-05 (post-combat summary)**: Already implemented in PostCombatScene — shows damage dealt/received, cards played, combos, XP earned. Mark as complete
- **PLSH-01 (death screen stats)**: Already implemented in DeathScene — shows loops completed, damage dealt, cards played, combos, cause of death, material retention. Mark as complete

### Claude's Discretion
- Exact Web Audio API tone parameters (frequency, waveform, envelope shape)
- Style constants values (exact hex colors, font sizes, spacing)
- Fade duration and tween easing curves
- Tutorial text wording and number of screens
- Game speed implementation details (which systems get the multiplier)
- Settings UI layout within SettingsScene

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Game Design
- `.planning/PROJECT.md` — Core value, visual style ("simplificado/minimalista"), platform (web/Phaser), game name ("Rogue Scroll")

### Requirements
- `.planning/REQUIREMENTS.md` — CMBT-05 (post-combat summary), PLSH-01 (death screen stats), v2 polish reqs (PLSH-02 tutorial, PLSH-03 sound, PLSH-04 art, PLSH-05 save export)

### Existing Polish Code
- `src/scenes/TutorialScene.ts` — Current placeholder tutorial (5 text screens, outdated content, needs rewrite)
- `src/audio/AudioManager.ts` — Placeholder audio singleton (console.log only, has volume/enable API skeleton)
- `src/scenes/SettingsScene.ts` — Current settings scene (check for existing volume/toggle UI)
- `src/scenes/PostCombatScene.ts` — Already implements CMBT-05 (battle summary with stats)
- `src/scenes/DeathScene.ts` — Already implements PLSH-01 (death screen with run statistics)
- `src/scenes/MainMenu.ts` — Main menu with continue/new run flow

### UI Components
- `src/ui/LoopHUD.ts` — In-game HUD (material display, stats)
- `src/ui/CombatHUD.ts` — Combat HUD
- `src/ui/CardVisual.ts` — Card rendering (has upgrade visual from Phase 6)
- `src/ui/HUDManager.ts` — HUD management

### State
- `src/state/MetaState.ts` — Meta-progression state (needs tutorialSeen flag, possibly audio prefs)
- `src/state/RunState.ts` — Run state structure

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AudioManager`: Singleton with volume/enable API — replace console.log internals with Web Audio API
- `TutorialScene`: Scene structure with step-through navigation — rewrite content, keep navigation pattern
- `SettingsScene`: Existing settings scene — extend with volume slider and game speed toggle
- All scenes use consistent Phaser text buttons with hover effects — standardize into shared helper

### Established Patterns
- Scenes use `cameras.main.setBackgroundColor(0x1a1a2e)` — dark blue background is the standard
- Button pattern: text + setInteractive + pointerover/pointerout/pointerdown handlers — repeated in every scene
- Overlay pattern: rectangle backdrop + content + delayed interactivity (100ms) — used for modals
- State persistence via MetaPersistence (idb-keyval) for MetaState, SaveManager for RunState
- Pure systems with injectable dependencies — LoopRunner and CombatEngine accept deltaMs parameter (game speed hook)

### Integration Points
- `LoopRunner.tick(deltaMs)` — multiply deltaMs for game speed
- `CombatEngine.tick(deltaMs)` — multiply deltaMs for game speed
- `MetaState` — add tutorialSeen flag and audio preferences
- Every scene's `create()` — add fadeIn, standardize styles
- Every scene's transition calls — add fadeOut before scene.start

</code_context>

<specifics>
## Specific Ideas

- Web Audio API tones are zero-dependency and bundle-friendly — a single utility file can generate all needed SFX with oscillator nodes and gain envelopes
- Style constants file prevents color/font drift across 25+ scenes and makes future theming trivial
- Camera fade transitions give the game a polished feel with ~10 lines of code per scene
- Game speed 2x is a common roguelike QoL feature — experienced players want to speed through early loops
- Tutorial should feel like part of the game, not a separate experience — same dark background, same button style

</specifics>

<deferred>
## Deferred Ideas

- Background music and full soundtrack — PLSH-03 (v2)
- Visual art overhaul / sprite assets — PLSH-04 (v2)
- Save export/import functionality — PLSH-05 (v2)
- Responsive canvas / resolution scaling — future QoL
- Accessibility features (colorblind mode, screen reader) — future
- Achievement/statistics tracking beyond single run — future

</deferred>

---

*Phase: 07-polish-release*
*Context gathered: 2026-03-28 via auto mode*
