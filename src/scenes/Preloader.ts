import { Scene } from 'phaser';
import { saveManager } from '../core/SaveManager';
import { eventBus } from '../core/EventBus';
import { LAYOUT } from '../ui/StyleConstants';
import { SCENE_KEYS } from '../state/SceneKeys';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  preload(): void {
    // Tile sprites — single 256x256 all-in-one diorama per tile (decorations
    // baked in). No more bg_* overlay layer; one image fully represents the
    // tile. Phaser downscales to TILE_SIZE at draw time.
    this.load.image('tile_basic', 'assets/map/tiles/tile_basic.webp');
    this.load.image('tile_forest', 'assets/map/tiles/tile_forest.webp');
    this.load.image('tile_graveyard', 'assets/map/tiles/tile_graveyard.webp');
    this.load.image('tile_swamp', 'assets/map/tiles/tile_swamp.webp');
    this.load.image('tile_desert', 'assets/map/tiles/tile_desert.webp');
    this.load.image('tile_lava', 'assets/map/tiles/tile_lava.webp');


    // Reserved-slot sprites: sparse extension of each combat terrain. The
    // reserved sprite is picked at render time based on the slot's host
    // terrain (set by LoopRunner.recomputeReservations).
    const reservedIds = ['forest', 'graveyard', 'swamp', 'desert', 'lava'];
    for (const id of reservedIds) {
      this.load.image(`tile_reserved_${id}`, `assets/map/tiles/tile_reserved_${id}.webp`);
    }

    // Hero warrior assets
    this.load.image('hero_idle',  'assets/characters/hero/idle/idle_1.webp');
    this.load.image('hero_shadow', 'assets/characters/hero/shadow.webp');
    this.load.image('glossary_book_icon', 'assets/ui/glossary/book_icon.webp');
    this.load.image('glossary_panel_bg', 'assets/ui/glossary/panel_bg.webp');
    this.load.image('timer_panel', 'assets/scenes/combat/timer-panel.webp');
    this.load.image('hero_idle2', 'assets/characters/hero/idle/idle_2.webp');
    this.load.spritesheet('hero_walk',   'assets/characters/hero/scrolling/spritesheet.webp', { frameWidth: 512, frameHeight: 512 });
    this.load.spritesheet('hero_attack', 'assets/characters/hero/attack/attack.webp', { frameWidth: 532, frameHeight: 568 });
    this.load.spritesheet('hero_channel', 'assets/characters/hero/cast_debuff/cast_debuff_spritesheet.webp', { frameWidth: 512, frameHeight: 512 });
    this.load.spritesheet('hero_battle_stance', 'assets/characters/hero/battle_stance/battle_stance_spritesheet.webp', { frameWidth: 512, frameHeight: 556 });
    this.load.spritesheet('hero_defend', 'assets/characters/hero/defend/defend_spritesheet.webp', { frameWidth: 512, frameHeight: 512 });
    this.load.spritesheet('hero_chibi_warrior', 'assets/characters/hero/pocket/spritesheet.webp', { frameWidth: 512, frameHeight: 512 });
    // Warrior selection preview (2-frame idle, 500x437 per frame)
    this.load.spritesheet('warrior_select', 'assets/characters/hero/selection/spritesheet.webp', { frameWidth: 500, frameHeight: 437 });

    // Mage selection preview (7-frame idle, 386x514 per frame; sheet is 2702x514)
    this.load.spritesheet('mage_select', 'assets/characters/mage/selection/spritesheet.webp', { frameWidth: 386, frameHeight: 514 });
    // Mage combat spritesheets (4-frame idle, 6-frame attack; 768×768 per frame)
    this.load.spritesheet('mage_idle',         'assets/characters/mage/battle_stance/spritesheet.webp',       { frameWidth: 768, frameHeight: 768, endFrame: 3 });
    this.load.spritesheet('mage_attack',       'assets/characters/mage/attack/spritesheet.webp',              { frameWidth: 768, frameHeight: 768, endFrame: 5 });
    this.load.spritesheet('mage_battle_stance','assets/characters/mage/battle_stance/spritesheet.webp',       { frameWidth: 768, frameHeight: 768, endFrame: 3 });
    this.load.spritesheet('mage_defend',       'assets/characters/mage/defense/spritesheet.webp',             { frameWidth: 768, frameHeight: 768, endFrame: 3 });
    this.load.spritesheet('mage_cast_debuff',  'assets/characters/mage/cast_debuff/spritesheet.webp',          { frameWidth: 768, frameHeight: 768, endFrame: 3 });
    // Mage scrolling animation (10-frame run, 512×512 per frame)
    this.load.spritesheet('mage_walk',   'assets/characters/mage/scrolling/spritesheet.webp', { frameWidth: 512, frameHeight: 512 });

    this.load.image('mage_defeat_bg',    'assets/scenes/death/mage_defeat.jpg');
    this.load.spritesheet('hero_chibi_mage', 'assets/characters/mage/pocket/spritesheet.webp', { frameWidth: 256, frameHeight: 256, endFrame: 5 });
    this.load.image('warrior_defeat_bg', 'assets/scenes/death/warrior_defeat.jpg');

    // Monster static images — `hasFrame2` flags entries that ship a second
    // animation frame on disk. The `_1.png` suffix in `file` auto-derives the
    // `_2.png` path via the regex below. Entries without a `_2` variant (most
    // single-frame portraits) skip the second load to keep the console clean.
    const staticMonsters: Array<{ id: string; folder: string; file: string; hasFrame2?: boolean; frameCount?: number }> = [
      // Cemetery
      { id: 'corpse_eater',         folder: 'cemetery', file: 'corpse eater_1.webp',         hasFrame2: true },
      { id: 'pocket_cat',           folder: 'cemetery', file: 'pocket cat.webp' },
      { id: 'skeleton',             folder: 'cemetery', file: 'skeleton_1.webp',             hasFrame2: true },
      { id: 'vampire',              folder: 'cemetery', file: 'vampire_1.webp',              hasFrame2: true },
      { id: 'werewolf',             folder: 'cemetery', file: 'werewolf_1.webp',             hasFrame2: true },
      { id: 'zombie',               folder: 'cemetery', file: 'zombie.webp' },
      // Default-terrain bosses. doom_knight has art (default/doom_knight_*.png).
      // iron_golem and lizard_king are live in enemies.json but have NO sprite
      // on disk — they render the missing-texture placeholder until art is added
      // (iron_golem could reuse boss/iron_golem_*.png).
      { id: 'doom_knight',          folder: 'default',  file: 'doom_knight_1.webp',          hasFrame2: true },
      // Desert
      { id: 'baby_dragon',          folder: 'desert',   file: 'baby dragon_1.webp',          hasFrame2: true },
      { id: 'mutated_salamander',   folder: 'desert',   file: 'mutated_salamander_1.webp',   hasFrame2: true },
      { id: 'scorpion',             folder: 'desert',   file: 'scorpion_1.webp',             hasFrame2: true },
      // Forest. ancient_tree and mush have art (forest/*.png). giant_spider and
      // giant_spider_2 are live enemies in enemies.json but have NO sprite on
      // disk yet — they show the missing-texture placeholder until art is added.
      // ogre's surviving art lives under 'a melhorar/'.
      { id: 'ancient_tree',         folder: 'forest',   file: 'ancient tree_1.webp',         hasFrame2: true },
      { id: 'mush',                 folder: 'forest',   file: 'mush_1.webp',                 hasFrame2: true },
      // Lava — note: ids preserve the legacy `forge_slime`/`lava_golen`
      // spellings used in enemies.json; the disk files now use underscored
      // `forge_slime_*.png` / `lava_golem_*.png` after PR #12's rename.
      { id: 'forge_slime',          folder: 'lava',     file: 'forge_slime_1.webp',          hasFrame2: true },
      { id: 'lava_golem',           folder: 'lava',     file: 'lava_golem_1.webp',           hasFrame2: true },
      { id: 'fire_elemental',       folder: 'lava',     file: 'fire_elemental_1.webp',       hasFrame2: true },
      // Swamp
      { id: 'depths_horror',        folder: 'swamp',    file: 'depths_horror_1.webp',        hasFrame2: true },
      { id: 'toxic_gooze',          folder: 'swamp',    file: 'toxic gooze_1.webp',          hasFrame2: true },
      { id: 'venomous_kobra',       folder: 'swamp',    file: 'venomous_kobra_1.webp',       hasFrame2: true },
      // Green Field
      { id: 'slime',               folder: 'green_field', file: 'slime_1.webp',              hasFrame2: true },
      { id: 'red_slime',           folder: 'green_field', file: 'red_slime_1.webp',          hasFrame2: true },
      { id: 'earth_dragon',        folder: 'green_field', file: 'earth_dragon_1.webp',       hasFrame2: true },
      // Root
      { id: 'lost_lizard',          folder: '',         file: 'lost_lizard_1.webp',          hasFrame2: true },
      // New bosses — live in `monsters/boss/`. frameCount = total frames on disk.
      // `boss_iron_golem` namespaced to avoid clashing with `iron_golem` at default/.
      // `iron_golem` (Dryas, the iron commander) has its own distinct 3-frame
      // battle-stance art, left-facing — separate from the ancient colossus boss.
      { id: 'iron_golem',           folder: 'boss',     file: 'iron_commander_1.webp',       hasFrame2: true, frameCount: 3 },
      { id: 'bog_witch',            folder: 'boss',     file: 'bog_witch_1.webp',            hasFrame2: true, frameCount: 4 },
      { id: 'desert_golem',         folder: 'boss',     file: 'desert_golem_1.webp',         hasFrame2: true, frameCount: 3 },
      { id: 'infernal_dragon',      folder: 'boss',     file: 'infernal_dragon_1.webp',      hasFrame2: true, frameCount: 5 },
      { id: 'boss_iron_golem',      folder: 'boss',     file: 'iron_golem_1.webp',           hasFrame2: true },
    ];
    for (const m of staticMonsters) {
      const path = m.folder ? `assets/characters/monsters/${m.folder}/${m.file}` : `assets/characters/monsters/${m.file}`;
      this.load.image(`monster_${m.id}`, path);
      const totalFrames = m.frameCount ?? (m.hasFrame2 ? 2 : 1);
      for (let n = 2; n <= totalFrames; n++) {
        const pathN = path.replace(/(_1)?\.webp$/i, `_${n}.webp`);
        this.load.image(`monster_${m.id}_${n}`, pathN);
      }
      // Portrait crop (face-only asset in portraits/ folder)
      this.load.image(`portrait_${m.id}`, `assets/characters/monsters/portraits/${m.id}.webp`);
    }

    // Scene backgrounds (400x400, scaled to fill 800x600)
    // bg_city: 6 frames separados (WebP) animados por array de texturas em
    // CityHubScene (ex-spritesheet 7680x720 de 10.6MB; agora 6x ~180KB).
    for (let i = 0; i < 6; i++) {
      this.load.image(`bg_city_${i}`, `assets/scenes/city_hub/bg_city_${i}.webp`);
    }
    // bg_run.png not yet authored — GameScene falls back to bg_desert when
    // bg_run is missing (see GameScene.ts createDesertBackgrounds).
    this.load.image('bg_battle_basic',     'assets/scenes/combat/bg_battle_basic.webp');
    this.load.image('bg_battle_forest',    'assets/scenes/combat/bg_battle_forest.webp');
    this.load.image('bg_battle_graveyard', 'assets/scenes/combat/bg_battle_graveyard.webp');
    this.load.image('bg_battle_swamp',     'assets/scenes/combat/bg_battle_swamp.webp');
    this.load.image('bg_battle_lava',      'assets/scenes/combat/bg_battle_lava.webp');
    this.load.image('bg_battle_desert',    'assets/scenes/combat/bg_battle_desert.webp');
    this.load.image('bg_battle_ruins',     'assets/scenes/combat/bg_battle_ruins.webp');
    this.load.image('homepage', 'assets/scenes/main_menu/homepage.jpg');

    // Parallax backgrounds
    this.load.image('bg_green_field', 'assets/scenes/game/green_field_background.webp');
    this.load.image('bg_sky',         'assets/scenes/game/sky-background.webp');
    this.load.image('bg_desert',      'assets/scenes/game/desert.webp');

    // Special tile sprites (256x256, baked-in decoration).
    this.load.image('tile_event', 'assets/map/tiles/tile_event.webp');
    this.load.image('tile_treasure', 'assets/map/tiles/tile_treasure.webp');
    this.load.image('tile_boss', 'assets/map/tiles/tile_boss.webp');

    // Tile landmarks (shown above special tiles in world view).
    this.load.image('landmark_event',    'assets/map/landmarks/landmark_event.webp');
    this.load.image('landmark_treasure', 'assets/map/landmarks/landmark_treasure.webp');
    this.load.image('landmark_boss',     'assets/map/landmarks/landmark_boss.webp');
    this.load.image('landmark_desert',   'assets/map/landmarks/landmark_desert.webp');
    this.load.image('landmark_forest',   'assets/map/landmarks/landmark_forest.webp');
    this.load.image('landmark_graveyard','assets/map/landmarks/landmark_graveyard.webp');
    this.load.image('landmark_swamp',    'assets/map/landmarks/landmark_swamp.webp');
    this.load.image('landmark_lava',     'assets/map/landmarks/landmark_lava.webp');
    // Subtile landmarks
    this.load.image('landmark_subtile_camp',      'assets/map/landmarks/landmark_subtile_camp.webp');
    this.load.image('landmark_subtile_manawell',  'assets/map/landmarks/landmark_subtile_manawell.webp');
    this.load.image('landmark_subtile_ambush',    'assets/map/landmarks/landmark_subtile_ambush.webp');
    this.load.image('landmark_subtile_bleedtotem','assets/map/landmarks/landmark_subtile_bleedtotem.webp');
    this.load.image('landmark_subtile_burnaltar', 'assets/map/landmarks/landmark_subtile_burnaltar.webp');
    this.load.image('landmark_subtile_magma',     'assets/map/landmarks/landmark_subtile_magma.webp');
    this.load.image('landmark_subtile_resonance', 'assets/map/landmarks/landmark_subtile_resonance.webp');
    this.load.image('landmark_subtile_warhorn',   'assets/map/landmarks/landmark_subtile_warhorn.webp');

    // Building panel backgrounds
    this.load.image('forge_frame_01', 'assets/scenes/forge/forge_frame_01.webp');
    this.load.spritesheet('forge_fire_sheet', 'assets/scenes/forge/forge_fire_sheet.webp', {
      frameWidth: 390, frameHeight: 590,
    });
    this.load.image('arco_forja',     'assets/scenes/forge/arco_forja.webp');
    this.load.image('bigorna',        'assets/scenes/forge/bigorna.webp');
    this.load.image('forge_moldure',       'assets/scenes/forge/forge_moldure.webp');
    this.load.image('forge_status_banner', 'assets/scenes/forge/forge_status_banner.webp');
    // Forge-specific ornate element sigils (separate from the small `icon_<id>`
    // tokens used inside card faces).
    for (const id of ['attack','defense','agility','counter','fire','water','air','earth']) {
      this.load.image(`forge_sigil_${id}`, `assets/scenes/forge/forge-sigils/${id}.webp`);
    }

    // UI Panels & textures
    this.load.image('combat_hero_panel',    'assets/scenes/combat/combat_hero_panel.webp');
    this.load.image('combat_monster_panel', 'assets/scenes/combat/combat_monster_panel.webp');
    this.load.spritesheet('hourglass_timer', 'assets/scenes/combat/hourglass_timer.webp', { frameWidth: 256, frameHeight: 496 });
    this.load.image('combat_chip_panel', 'assets/scenes/combat/combat_chip_panel.webp');
    this.load.image('wood_texture_big', 'assets/scenes/building_panel/wood-texture-big.webp');
    this.load.image('bg_character_selection', 'assets/scenes/character_select/background-character-selection.jpg');
    this.load.spritesheet('flame_selection', 'assets/scenes/character_select/flame-spritesheet-selection.webp', { frameWidth: 448, frameHeight: 576 });
    this.load.image('icon_table', 'assets/scenes/building_panel/icon-table.webp');
    this.load.image('fog', 'assets/scenes/main_menu/fog.webp');

    // Combat hit effects — 4-frame spritesheets
    const FX_W = 443; const FX_H = 887;
    this.load.spritesheet('fx_claw',  'assets/effects/combat/fx_claw.webp',  { frameWidth: FX_W, frameHeight: FX_H });
    this.load.spritesheet('fx_slash',       'assets/effects/combat/fx_slash.webp',       { frameWidth: 512, frameHeight: 512, endFrame: 2 });
    this.load.spritesheet('fx_slash_fire',  'assets/effects/combat/fx_slash_fire.webp',  { frameWidth: 1024, frameHeight: 1024, endFrame: 3 });
    this.load.spritesheet('fx_slash_water', 'assets/effects/combat/fx_slash_water.webp', { frameWidth: 1024, frameHeight: 1024, endFrame: 3 });
    this.load.spritesheet('fx_slash_wind',  'assets/effects/combat/fx_slash_wind.webp',  { frameWidth: 1024, frameHeight: 1024, endFrame: 3 });
    this.load.spritesheet('fx_slash_earth', 'assets/effects/combat/fx_slash_earth.webp', { frameWidth: 1024, frameHeight: 1024, endFrame: 3 });
    this.load.spritesheet('fx_shield_fade', 'assets/effects/combat/fx_shield_fade.webp', { frameWidth: 1024, frameHeight: 1024 });
    this.load.spritesheet('fx_aura_heal',   'assets/effects/combat/fx_aura_heal.webp',   { frameWidth: 1024, frameHeight: 1024, endFrame: 5 });
    this.load.spritesheet('fx_aura_buff',   'assets/effects/combat/fx_aura_buff.webp',   { frameWidth: 1024, frameHeight: 1024, endFrame: 5 });
    this.load.spritesheet('fx_leaf_fall',   'assets/effects/combat/fx_leaf_fall.webp',   { frameWidth: 512, frameHeight: 512, endFrame: 5 });
    this.load.spritesheet('fx_stomp', 'assets/effects/combat/fx_stomp.webp', { frameWidth: 1024, frameHeight: 1024 });
    this.load.spritesheet('fx_bite',  'assets/effects/combat/fx_bite.webp',  { frameWidth: 1024, frameHeight: 1024 });
    this.load.spritesheet('fx_fire',  'assets/effects/combat/fx_fire.webp',  { frameWidth: 1024, frameHeight: 1024 });
    this.load.spritesheet('fx_bleed', 'assets/effects/combat/fx_bleed.webp', { frameWidth: 1024, frameHeight: 1024 });
    this.load.spritesheet('fx_stun',  'assets/effects/combat/fx_stun.webp',  { frameWidth: 1024, frameHeight: 1024 });

    // Tutorial step text-box images (pre-rendered via ComfyUI)
    const tutorialSteps = [
      'welcome', 'pick_warrior', 'deck_review', 'map_intro',
      'combat_intro', 'planning_intro', 'place_tile', 'place_subtile',
      'shop_intro', 'shop_buy_relic', 'shop_buy_elements', 'shop_leave',
      'forge_intro', 'forge_craft', 'boss_preview', 'complete',
    ];
    for (const s of tutorialSteps) {
      this.load.image(`tutorial_text_${s}`, `assets/scenes/tutorial/tutorial_${s}.webp`);
    }
    this.load.image('tile_selection_board', 'assets/scenes/planning/tile-selection-board.webp');
    this.load.image('tile_inventory_panel', 'assets/scenes/planning/tile_inventory_panel.webp');
    this.load.image('panel_keyword_frame_v2', 'assets/scenes/combat/panel_keyword_frame_v2.webp');
    // Keyword intro panels (baked image per keyword)
    for (const kw of ['brace', 'exhaust', 'haste', 'pierce', 'vengeance']) {
      this.load.image(`keyword_${kw}`, `assets/scenes/combat/keyword_${kw}.webp`);
    }
    this.load.image('tutorial_text_panel',    'assets/scenes/tutorial/tutorial_text_panel.webp');
    this.load.spritesheet('belt_pillar', 'assets/scenes/planning/belt_pillar_spritesheet.webp', {
      frameWidth: 512, frameHeight: 512,
    });
    this.load.image('tile_frame', 'assets/scenes/planning/tile-frame.webp');
    this.load.image('card_mold_v2', 'assets/ui/frames/card_mold_v2.webp');
    this.load.image('deck_frame', 'assets/ui/frames/deck-frame.webp');
    this.load.image('bg_tile_selection', 'assets/scenes/planning/background-tile-selection.webp');
    this.load.image('bg_shop_scene', 'assets/scenes/shop/shop.webp');
    this.load.image('shop_panel_list',    'assets/scenes/shop/big_panel.webp');
    this.load.image('shop_panel_detail',  'assets/scenes/shop/asset description.webp');
    this.load.image('shop_tab',           'assets/scenes/shop/shop-section.webp');
    this.load.image('shop_row_selected',  'assets/scenes/shop/item_selection.webp');
    this.load.image('shop_btn_buy',       'assets/scenes/shop/buy-button.webp');
    this.load.image('shop_btn_sell',      'assets/scenes/shop/sell-button.webp');
    this.load.image('shop_gold_panel',    'assets/scenes/shop/gold_panel.webp');
    this.load.image('confirm_panel',        'assets/scenes/shop_remove_card/confirm_panel.webp');
    // Grok-generated painted backdrops for previously-bare scenes. See
    // docs/UI_AUDIT.md for the prompts and re-generation recipe.
    this.load.image('bg_deck_builder', 'assets/scenes/deck_customization/bg_deck_builder.webp');
    this.load.image('bg_deck_editor_v2', 'assets/scenes/deck_customization/deck-editor-v2.webp');
    this.load.image('bg_relic_vault',  'assets/scenes/relic_viewer/bg_relic_vault.webp');
    this.load.image('bg_card_library', 'assets/scenes/card_library/bg_card_library.webp');
    this.load.image('book_open',       'assets/scenes/card_library/book_open.webp');
    this.load.image('bookmark_tab',    'assets/scenes/card_library/bookmark_tab.webp');
    // Page stacks for visual depth in the compendium. Four thickness variants —
    // the active tab picks which side gets which (the book's "open progress").
    this.load.image('page-stack-small',        'assets/scenes/card_library/page-stack - small.webp');
    this.load.image('page-stack-medium-small', 'assets/scenes/card_library/page-stack - medium-small.webp');
    this.load.image('page-stack-medium-large', 'assets/scenes/card_library/page-stack - medium-large.webp');
    this.load.image('page-stack-large',        'assets/scenes/card_library/page-stack - large.webp');
    this.load.image('page',            'assets/scenes/card_library/page.webp');
    // Central gutter (inner crease where the two facing pages dive into the spine)
    this.load.image('page-gutter',     'assets/scenes/card_library/page-gutter.webp');
    // Section bookmark banners (text + emblem baked in, one per compendium tab)
    this.load.image('ribbon_card',     'assets/scenes/card_library/ribbon_card.webp');
    this.load.image('ribbon_relics',   'assets/scenes/card_library/ribbon_relics.webp');
    this.load.image('ribbon_tiles',    'assets/scenes/card_library/ribbon_tiles.webp');
    this.load.image('ribbon_bosses',   'assets/scenes/card_library/ribbon_bosses.webp');
    // *_status_panel = painel "rico": a arte é só o fundo e o texto (nome/
    // descrição/deck) é renderizado por cima pelo Phaser em CharacterSelectScene.
    // Tem prioridade sobre *_status (fallback só-imagem) via textures.exists().
    this.load.image('warrior_status_panel',   'assets/scenes/character_select/warrior_status_panel.webp');
    this.load.image('mage_status_panel',      'assets/scenes/character_select/mage_status_panel.webp');
    // Forge dwarf NPC
    this.load.image('dwarf_talking',          'assets/characters/npc/forge-dwarf/dwarf_talking.webp');
    this.load.image('dwarf_hands_on_hips',    'assets/characters/npc/forge-dwarf/dwarf_hands_on_hips.webp');
    this.load.image('panel_hover_frame',      'assets/scenes/combat/panel_hover_frame.webp');
    this.load.image('bg_settings_scribe',     'assets/ui/backgrounds/bg_settings_scribe.webp');
    this.load.image('deck_relic_table', 'assets/scenes/planning/deck-relic-table.webp');
    this.load.image('achievements_bg', 'assets/ui/panels/achievments.webp');

    // Bitmap fonts (custom game alphabet)
    this.load.bitmapFont('game_font_gold',  'assets/fonts/game_font_gold/game_font_gold.png',   'assets/fonts/game_font_gold/game_font_gold.fnt');
    this.load.bitmapFont('game_font_blue',  'assets/fonts/game_font_blue/game_font_blue.png',   'assets/fonts/game_font_blue/game_font_blue.fnt');
    this.load.bitmapFont('game_font_white', 'assets/fonts/game_font_white/game_font_white.png', 'assets/fonts/game_font_white/game_font_white.fnt');
    // VT323 pixel font variants
    this.load.bitmapFont('vt323_gold',  'assets/fonts/vt323_gold/vt323_gold.png',   'assets/fonts/vt323_gold/vt323_gold.fnt');
    this.load.bitmapFont('vt323_white', 'assets/fonts/vt323_white/vt323_white.png', 'assets/fonts/vt323_white/vt323_white.fnt');
    this.load.bitmapFont('vt323_blue',  'assets/fonts/vt323_blue/vt323_blue.png',   'assets/fonts/vt323_blue/vt323_blue.fnt');

    this.load.image('speed_panel',        'assets/ui/panels/speed_panel.webp');
    this.load.image('hud_panel_left',     'assets/scenes/game/hud_panel_left.webp');
    this.load.image('hud_hero_panel',     'assets/scenes/game/hero_panel.webp');
    this.load.image('hud_loop_panel',     'assets/scenes/game/loop-Panel.webp');
    this.load.image('loop_chip_panel',    'assets/scenes/game/loop_chip_panel.webp');
    this.load.image('hud_panel_progress', 'assets/scenes/game/hud_panel_progress.webp');
    this.load.image('loop_summary_panel', 'assets/scenes/loop_summary/loopcomplete.webp');
    this.load.image('txt_loop_complete',  'assets/scenes/loop_summary/txt_loop_complete.webp');
    this.load.image('txt_victory',        'assets/scenes/combat/txt_victory.webp');
    this.load.image('txt_defeat',         'assets/scenes/combat/txt_defeat.webp');
    this.load.image('panel_daily_run',    'assets/ui/panels/panel_daily_run.webp');
    this.load.image('txt_daily_run_desc', 'assets/ui/panels/txt_daily_run_desc.webp');
    this.load.image('boss_exit_option_panel', 'assets/scenes/boss_exit/option-panel.webp');

    // Tile tooltip panels (styled dark/gold panels with baked title + description)
    const tileTooltips = ['forest','graveyard','swamp','desert','lava','event','treasure',
      'ambush','magma','manawell','camp','burnaltar','bleedtotem','resonance','warhorn'];
    for (const t of tileTooltips) {
      this.load.image(`tile_tooltip_${t}`, `assets/scenes/planning/tile_tooltip_${t}.webp`);
    }

    // UI Buttons — pre-rendered dark/gold style
    this.load.image('btn_continue_run',    'assets/scenes/main_menu/continue-run.webp');
    this.load.image('btn_new_game',        'assets/scenes/main_menu/new-game.webp');
    this.load.image('btn_daily_run',       'assets/scenes/main_menu/daily-run.webp');
    this.load.image('btn_keep_my_run',     'assets/ui/buttons/btn_keep_my_run.webp');
    this.load.image('btn_yes_delete',      'assets/ui/buttons/btn_yes_delete.webp');
    this.load.image('btn_resume',          'assets/ui/buttons/btn_resume.webp');
    this.load.image('btn_view_deck',       'assets/ui/buttons/btn_view_deck.webp');
    this.load.image('btn_settings',        'assets/ui/buttons/btn_settings.webp');
    this.load.image('btn_tutorial',        'assets/ui/buttons/btn_tutorial.webp');
    // Building buttons (city hub)
    this.load.image('btn_forge',         'assets/scenes/city_hub/btn_forge.webp');
    this.load.image('btn_library',       'assets/scenes/city_hub/btn_library.webp');
    this.load.image('btn_workshop',      'assets/scenes/city_hub/btn_workshop.webp');
    this.load.image('btn_vault',         'assets/scenes/city_hub/btn_vault.webp');
    this.load.image('btn_melhorar',          'assets/scenes/city_hub/btn_melhorar.webp');
    this.load.image('btn_start_run_hub',     'assets/scenes/city_hub/btn_start_run_hub.webp');
    this.load.image('label_requer',          'assets/scenes/city_hub/label_requer.webp');
    // Building upgrade text panels (one per level per building)
    const buildingPanels: [string, number][] = [
      ['forge', 6], ['library', 3], ['workshop', 3], ['oracle', 4], ['vault', 8],
    ];
    for (const [name, max] of buildingPanels) {
      for (let l = 1; l <= max; l++) {
        this.load.image(`building_${name}_l${l}`, `assets/scenes/building_panel/building_${name}_l${l}.webp`);
      }
    }
this.load.image('btn_start_run',       'assets/ui/buttons/btn_start_run.webp');
    this.load.image('btn_back',            'assets/ui/buttons/btn_back.webp');
    this.load.image('btn_leave',           'assets/scenes/shop/btn_leave.webp');
    this.load.image('btn_close',           'assets/ui/buttons/btn_close.webp');
    this.load.image('btn_cancel',          'assets/ui/buttons/btn_cancel.webp');
    this.load.image('btn_return_to_menu',  'assets/ui/buttons/btn_return_to_menu.webp');
    this.load.image('btn_change_hero',     'assets/ui/buttons/btn_change_hero.webp');
    this.load.image('btn_start_game',      'assets/scenes/tutorial/btn_start_game.webp');
    this.load.image('btn_visit_shop',      'assets/scenes/relic_viewer/btn_visit_shop.webp');
    this.load.image('btn_abandon_run',     'assets/ui/buttons/btn_abandon_run.webp');
    this.load.image('btn_banish',          'assets/ui/buttons/btn_banish.webp');
    this.load.image('btn_keep',            'assets/ui/buttons/btn_keep.webp');
    this.load.image('btn_delete_run',      'assets/ui/buttons/btn_delete_run.webp');
    this.load.image('btn_forge_action',    'assets/scenes/forge/btn_forge_action.webp');
    this.load.image('btn_dismiss',         'assets/scenes/forge/btn_dismiss.webp');
    this.load.image('btn_got_it',          'assets/ui/buttons/btn_got_it.webp');
    this.load.image('btn_continue_loop',   'assets/scenes/loop_summary/btn_continue_loop.webp');
    // New wood-style buttons (generated 2026-06-06)
    this.load.image('btn_forge_leave',      'assets/scenes/forge/btn_forge_leave.webp');
    this.load.image('btn_recipes',          'assets/scenes/forge/btn_recipes.webp');
    this.load.image('btn_resume_pause',     'assets/scenes/pause/btn_resume_pause.webp');
    this.load.image('btn_view_deck_pause',  'assets/scenes/pause/btn_view_deck_pause.webp');
    this.load.image('btn_tutorial_pause',   'assets/scenes/pause/btn_tutorial_pause.webp');
    this.load.image('btn_abandon_run_pause','assets/scenes/pause/btn_abandon_run_pause.webp');
    this.load.image('btn_back_settings',    'assets/scenes/deck_customization/btn_back_settings.webp');
    this.load.image('btn_cancel_remove',    'assets/scenes/shop_remove_card/btn_cancel_remove.webp');
    this.load.image('btn_banish_remove',    'assets/scenes/shop_remove_card/btn_banish_remove.webp');
    this.load.image('btn_keep_remove',      'assets/scenes/shop_remove_card/btn_keep_remove.webp');
    this.load.image('btn_start_run_deck',   'assets/scenes/starting_deck/btn_start_run_deck.webp');
    // Landing-page delete-run dialog assets
    this.load.image('lp_delete_run',       'assets/scenes/main_menu/delete-run.webp');
    this.load.image('lp_keep',             'assets/scenes/main_menu/keep.webp');
    this.load.image('lp_permanent_erase',  'assets/scenes/main_menu/permanente-erase.webp');
    this.load.image('btn_reset_progress',  'assets/ui/buttons/btn_reset_progress.webp');
    this.load.image('btn_next',            'assets/ui/buttons/btn_next.webp');
    this.load.image('btn_start_loop', 'assets/ui/buttons/start-loop.webp');
    this.load.image('btn_start_loop_scene', 'assets/scenes/planning/start-loop-loop-scene.webp');
    this.load.image('skip_loop_panel', 'assets/scenes/planning/skip-loop.webp');
    this.load.image('remove_tiles_panel', 'assets/scenes/planning/remove_tiles.webp');
    this.load.image('btn_skip_1',  'assets/scenes/planning/1.webp');
    this.load.image('btn_skip_5',  'assets/scenes/planning/5.webp');
    this.load.image('btn_skip_10', 'assets/scenes/planning/10.webp');
    this.load.image('btn_skip_25', 'assets/scenes/planning/25.webp');
    this.load.image('shop_icon', 'assets/scenes/planning/shop.webp');
    this.load.image('forge_icon', 'assets/scenes/planning/forge.webp');
    // Material Icons
    this.load.image('mat_iron', 'assets/icons/iron.webp');
    this.load.image('mat_crystal', 'assets/icons/crystal.webp');
    this.load.image('mat_scroll', 'assets/icons/scroll.webp');
    this.load.image('mat_wood', 'assets/icons/wood.webp');
    this.load.image('mat_stone', 'assets/icons/stone.webp');
    this.load.image('mat_bone', 'assets/icons/bone.webp');
    this.load.image('mat_essence', 'assets/icons/essence.webp');
    this.load.image('mat_herbs', 'assets/icons/herbs.webp');
    this.load.image('deck_icon', 'assets/icons/deck-icon.webp');
    this.load.image('relic_icon', 'assets/icons/relic-icon.webp');
    this.load.image('icon_coin', 'assets/icons/coin.webp');
    this.load.image('icon_brick', 'assets/icons/brick.webp');
    this.load.image('icon_card', 'assets/icons/card.jpg');

    // Card token icons (audit §1.2): bracketed icon tokens like [burn], [str].
    // IconTokens.renderTokenText prefers `icon_${token}` textures when present
    // and falls back to colored caps text otherwise.
    const cardTokenIds = [
      // Stack DoTs / status
      'burn', 'bleed', 'poison', 'slow', 'stun', 'rage',
      // Stats
      'str', 'vit', 'dex', 'int', 'spi',
      // Resources / vitals
      'stam', 'mana', 'HP', 'armor', 'exhaust',
      // Elements
      'attack', 'defense', 'agility', 'counter',
      'fire', 'water', 'air', 'earth',
    ];
    for (const token of cardTokenIds) {
      this.load.image(`icon_${token}`, `assets/icons/tokens/${token}.webp`);
    }

    // Painterly v2 element icons (oil-paint style, generated via Grok) for the
    // shop's element frames. Only the 4 physical + 4 elemental ids exist in v2.
    const elementV2Ids = [
      'attack', 'defense', 'agility', 'counter',
      'fire', 'water', 'air', 'earth',
    ];
    for (const token of elementV2Ids) {
      this.load.image(`icon_v2_${token}`, `assets/icons/tokens/elements-v2/${token}.webp`);
    }

    // Relic Illustrations — one PNG per relic id in src/data/json/relics.json.
    const relicIds = [
      // Warrior
      'whetstone_shard', 'bronze_pauldron', 'stamina_flask', 'battered_vambrace',
      'iron_cestus', 'banded_greaves', 'stamina_reservoir',
      'wargods_mantle', 'bloodgorged_heart', 'the_last_banner',
      // Mage
      'aether_lens', 'burnt_tome', 'frostbite_charm', 'ember_wick',
      'stormglass_lens', 'cinder_circlet', 'mana_veil',
      'tempest_resonator', 'tideheart_amulet', 'archon_codex',
      // Neutral commons (stat/utility)
      'bronze_scale', 'energy_tonic', 'arcane_crystal', 'whetting_stone',
      'iron_brace', 'quick_boots', 'scholars_quill', 'soul_locket', 'vitality_ring',
      'hearty_meal', 'lucky_coin', 'travel_boots', 'beacon_lantern',
      // Neutral commons (combat)
      'smoldering_torch', 'iron_tooth', 'vanguard_cuffs', 'charm_of_tides',
      'steady_compass', 'linen_wrap', 'tarnished_mirror', 'echoing_chime',
      'brass_bell', 'trailblazers_brand', 'veterans_stripe',
      // Neutral uncommons
      'swift_boots', 'thin_deck_charm', 'heavy_tome', 'iron_will',
      'first_strike_amulet', 'gravediggers_tag', 'huntmasters_eye',
      'librarians_seal', 'apothecarys_vial', 'harmonics_charm', 'glasswork_lens',
      'executioners_brand', 'counterweight_sigil', 'burnished_sigil', 'vampiric_fang',
      'smoking_censer', 'lodestone_pendant', 'cracked_crystal',
      'whisperwind_sash', 'ash_eater',
      // Neutral rares
      'sanguine_pact', 'berserker_ring', 'phoenix_feather', 'demon_heart',
      'stoneheart_sigil', 'pandoras_embers', 'cinderkeep', 'crimson_stiletto',
      'stormcallers_rod', 'echo_chamber', 'catalyst_core', 'soulforge_chalice',
      'glass_cannon', 'hemlock_vial', 'constellation_sigil'
    ];

    for (const id of relicIds) {
      this.load.image(`relic_${id}`, `assets/relics/${id}.webp`);
    }

    // Card Illustrations — element-based system (Tier 1 + Tier 2 + Tier 3, all PNG)
    const newCardIds = [
      // T1 — single elements (the 8 base cards in cards.json)
      't1-attack', 't1-defense', 't1-agility', 't1-counter',
      't1-fire', 't1-water', 't1-air', 't1-earth',
      // T2 — pure pairs
      't2-attack-attack', 't2-defense-defense', 't2-agility-agility', 't2-counter-counter',
      't2-fire-fire', 't2-water-water', 't2-air-air', 't2-earth-earth',
      // T2 — cross pairs
      't2-agility-attack', 't2-agility-counter', 't2-agility-defense', 't2-agility-fire',
      't2-agility-water', 't2-agility-air', 't2-agility-earth',
      't2-attack-counter', 't2-attack-defense', 't2-attack-fire', 't2-attack-water',
      't2-air-attack', 't2-attack-earth', 't2-counter-defense', 't2-counter-fire',
      't2-counter-water', 't2-air-counter', 't2-counter-earth', 't2-defense-fire',
      't2-defense-water', 't2-air-defense', 't2-defense-earth', 't2-fire-water',
      't2-air-fire', 't2-earth-fire', 't2-air-water', 't2-earth-water', 't2-air-earth',
      // T2 — physical pure
      't3-attack-attack-attack', 't3-defense-defense-defense',
      't3-agility-agility-agility', 't3-counter-counter-counter',
      // T2 — elemental pure
      't3-fire-fire-fire', 't3-water-water-water', 't3-air-air-air', 't3-earth-earth-earth',
      // T2 — physical mixed
      't3-attack-attack-defense', 't3-agility-attack-attack', 't3-attack-attack-counter',
      't3-attack-defense-defense', 't3-agility-defense-defense', 't3-counter-defense-defense',
      't3-agility-agility-attack', 't3-agility-agility-defense', 't3-agility-agility-counter',
      't3-attack-counter-counter', 't3-counter-counter-defense', 't3-agility-counter-counter',
      't3-agility-attack-defense', 't3-attack-counter-defense', 't3-agility-attack-counter',
      't3-agility-counter-defense',
      // T2 — elemental mixed
      't3-fire-fire-water', 't3-air-fire-fire', 't3-earth-fire-fire',
      't3-fire-water-water', 't3-air-water-water', 't3-earth-water-water',
      't3-air-air-fire', 't3-air-air-water', 't3-air-air-earth',
      't3-earth-earth-fire', 't3-earth-earth-water', 't3-air-earth-earth',
      't3-air-fire-water', 't3-earth-fire-water', 't3-air-earth-fire',
      't3-air-earth-water',
      // T2 — physical × elemental
      't3-attack-attack-fire', 't3-attack-attack-water', 't3-air-attack-attack', 't3-attack-attack-earth',
      't3-defense-defense-fire', 't3-defense-defense-water', 't3-air-defense-defense', 't3-defense-defense-earth',
      't3-agility-agility-fire', 't3-agility-agility-water', 't3-agility-agility-air', 't3-agility-agility-earth',
      't3-counter-counter-fire', 't3-counter-counter-water', 't3-air-counter-counter', 't3-counter-counter-earth',
      't3-attack-defense-fire', 't3-attack-defense-water', 't3-air-attack-defense', 't3-attack-defense-earth',
      't3-agility-attack-fire', 't3-agility-attack-water', 't3-agility-air-attack', 't3-agility-attack-earth',
      't3-attack-counter-fire', 't3-attack-counter-water', 't3-air-attack-counter', 't3-attack-counter-earth',
      't3-agility-defense-fire', 't3-agility-defense-water', 't3-agility-air-defense', 't3-agility-defense-earth',
      't3-counter-defense-fire', 't3-counter-defense-water', 't3-air-counter-defense', 't3-counter-defense-earth',
      't3-agility-counter-fire', 't3-agility-counter-water', 't3-agility-air-counter', 't3-agility-counter-earth',
      't3-attack-fire-fire', 't3-attack-water-water', 't3-air-air-attack', 't3-attack-earth-earth',
      't3-attack-fire-water', 't3-air-attack-fire', 't3-attack-earth-fire', 't3-air-attack-water',
      't3-attack-earth-water', 't3-air-attack-earth',
      't3-defense-fire-fire', 't3-defense-water-water', 't3-air-air-defense', 't3-defense-earth-earth',
      't3-defense-fire-water', 't3-air-defense-fire', 't3-defense-earth-fire', 't3-air-defense-water',
      't3-defense-earth-water', 't3-air-defense-earth',
      't3-agility-fire-fire', 't3-agility-water-water', 't3-agility-air-air', 't3-agility-earth-earth',
      't3-agility-fire-water', 't3-agility-air-fire', 't3-agility-earth-fire', 't3-agility-air-water',
      't3-agility-earth-water', 't3-agility-air-earth',
      't3-counter-fire-fire', 't3-counter-water-water', 't3-air-air-counter', 't3-counter-earth-earth',
      't3-counter-fire-water', 't3-air-counter-fire', 't3-counter-earth-fire', 't3-air-counter-water',
      't3-counter-earth-water', 't3-air-counter-earth',
    ];
    for (const id of newCardIds) {
      this.load.image(`card_${id}`, `assets/cards/${id}.webp`);
    }

    // Enemy attack cards (generic attacks shared across many enemies)
    const enemyAttackIds = [
      'claw', 'bite', 'slash', 'smash', 'slam', 'pierce', 'bone_throw',
      'spit', 'thorn_spike', 'fire_breath', 'water_surge', 'poison',
      'drain', 'curse',
    ];
    for (const id of enemyAttackIds) {
      this.load.image(`enemy/enemy_${id}`, `assets/cards/enemy/enemy_${id}.webp`);
    }


    // Audio
    this.load.audio('theme_song', 'assets/audio/theme-song.mp3');
    this.load.audio('town_song', 'assets/audio/town-song.mp3');
    this.load.audio('walk_forward', 'assets/audio/walk-forward.mp3');
    this.load.audio('sfx_click', 'assets/audio/select.mp3');
    this.load.audio('sfx_slash', 'assets/audio/slash.mp3');
    this.load.audio('sfx_fireball', 'assets/audio/fire.m4a');
    this.load.audio('sfx_hurt', 'assets/audio/hurt.m4a');
    this.load.audio('sfx_cashing', 'assets/audio/cashing.m4a');
    this.load.audio('ambience_wind', 'assets/audio/wind.ogg');
  }

  async create(): Promise<void> {
    this.cameras.main.fadeIn(LAYOUT.fadeDuration, 0, 0, 0);
    // Show a simple loading indicator
    this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff);

    // Simulate brief load
    bar.width = 464;

    // Check for existing saved run
    const savedRun = await saveManager.load();

    // Pass saved run info to MainMenu via registry as a fast-paint hint.
    // Invalidation contract: MainMenu always re-loads from IDB before
    // deciding whether to show "Continue", and removes this key after
    // reading. Other scenes that clear the run also null this out via
    // the run:cleared listener below, so a stale hint can never survive
    // long enough to mislead the menu.
    this.registry.set('savedRun', savedRun);

    // Keep the registry copy in sync when the active run is cleared elsewhere
    // (PauseScene "Abandon Run", BossExitScene safe path, DeathScene, etc.)
    const game = this.game;
    eventBus.on('run:cleared', () => {
      game.registry.set('savedRun', null);
    });

    this.scene.launch('GlobalSound');
    this.scene.launch(SCENE_KEYS.SPEED_PANEL);
    this.scene.start('MainMenu');
  }
}
