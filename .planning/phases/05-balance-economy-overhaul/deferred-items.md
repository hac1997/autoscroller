# Deferred Items - Phase 05

## Pre-existing Test Failures (out of scope)

These failures exist before Plan 03 changes and are caused by Plan 01 card data modifications:

1. `tests/data/cards.test.ts` - expects 14 cards but cards.json now has 15; cooldown values changed
2. `tests/systems/deck/loot-system.test.ts` - card rarity pools changed (fury now common, shield-wall now rare)
3. `tests/systems/combat/combat-engine.test.ts` - card cooldown values changed from 1.2 to 1

## Scene-layer metaLoot References (out of scope for Plan 03)

The following scene/UI files still reference `metaLoot` and need updating in a future plan:
- src/scenes/DeathScene.ts
- src/scenes/BossExitScene.ts
- src/scenes/GameScene.ts
- src/scenes/ShopScene.ts
- src/scenes/EventScene.ts
- src/scenes/TreasureScene.ts
- src/systems/EventResolver.ts
- src/systems/TreasureSystem.ts
- src/ui/LoopHUD.ts
