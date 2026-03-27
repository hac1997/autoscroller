import Phaser from 'phaser';
import type { RunState } from '../state/RunState';

/**
 * LoopHUD -- fixed HUD overlay for GameScene.
 * Displays: gold, loop counter, difficulty, HP bar, tile points, materials.
 */
export class LoopHUD extends Phaser.GameObjects.Container {
  private goldText: Phaser.GameObjects.Text;
  private loopText: Phaser.GameObjects.Text;
  private difficultyText: Phaser.GameObjects.Text;
  private hpBar: Phaser.GameObjects.Rectangle;
  private hpBg: Phaser.GameObjects.Rectangle;
  private hpText: Phaser.GameObjects.Text;
  private tpText: Phaser.GameObjects.Text;
  private materialsText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.setScrollFactor(0);
    this.setDepth(100);

    const fontFamily = 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif';

    // Left panel background
    const panelBg = scene.add.rectangle(10, 10, 260, 90, 0x000000, 0.5)
      .setOrigin(0, 0);
    this.add(panelBg);

    // Row 1 (y=20): Gold icon + amount
    const goldIcon = scene.add.text(20, 20, '\u25C6', {
      fontSize: '20px', color: '#ffd700', fontFamily,
    });
    this.add(goldIcon);

    this.goldText = scene.add.text(44, 22, '0', {
      fontSize: '16px', color: '#ffd700', fontFamily,
    });
    this.add(this.goldText);

    // Row 2 (y=42): Loop counter + difficulty
    this.loopText = scene.add.text(20, 42, 'Loop 1', {
      fontSize: '16px', color: '#ffffff', fontFamily,
    });
    this.add(this.loopText);

    this.difficultyText = scene.add.text(250, 42, 'x1.0', {
      fontSize: '14px', color: '#aaaaaa', fontFamily,
    }).setOrigin(1, 0);
    this.add(this.difficultyText);

    // Row 3 (y=62): HP bar
    this.hpBg = scene.add.rectangle(20, 64, 160, 12, 0x333333).setOrigin(0, 0);
    this.add(this.hpBg);

    this.hpBar = scene.add.rectangle(20, 64, 160, 12, 0x00ff00).setOrigin(0, 0);
    this.add(this.hpBar);

    this.hpText = scene.add.text(190, 62, '100/100', {
      fontSize: '14px', color: '#ffffff', fontFamily,
    });
    this.add(this.hpText);

    // Right-side: Tile Points
    const tpIcon = scene.add.text(600, 14, 'TP', {
      fontSize: '14px', color: '#00e5ff', fontFamily, fontStyle: 'bold',
    });
    this.add(tpIcon);

    this.tpText = scene.add.text(625, 14, '0 TP', {
      fontSize: '16px', color: '#00e5ff', fontFamily,
    });
    this.add(this.tpText);

    // Right-side: Materials
    this.materialsText = scene.add.text(600, 36, '', {
      fontSize: '12px', color: '#e040fb', fontFamily,
    });
    this.add(this.materialsText);

    scene.add.existing(this);
  }

  update(runState: RunState): void {
    this.goldText.setText(`${runState.economy.gold}`);
    this.loopText.setText(`Loop ${runState.loop.count}`);
    this.difficultyText.setText(`x${runState.loop.difficulty.toFixed(1)}`);

    // HP bar
    const hpRatio = Math.max(0, runState.hero.currentHP / runState.hero.maxHP);
    this.hpBar.width = 160 * hpRatio;
    this.hpBar.setFillStyle(this.getHpColor(hpRatio));
    this.hpText.setText(`${runState.hero.currentHP}/${runState.hero.maxHP}`);

    // Tile points
    this.tpText.setText(`${runState.economy.tilePoints} TP`);

    // Materials display: compact format with first letter abbreviation
    const ABBREV: Record<string, string> = { wood: 'W', stone: 'S', iron: 'I', crystal: 'C', bone: 'B', herbs: 'H', essence: 'E' };
    const matEntries = Object.entries(runState.economy.materials ?? {}).filter(([, v]) => v > 0);
    const matStr = matEntries.length > 0
      ? matEntries.slice(0, 4).map(([k, v]) => `${ABBREV[k] ?? k[0].toUpperCase()}:${v}`).join(' ')
      : '';
    this.materialsText.setText(matStr);
  }

  private getHpColor(ratio: number): number {
    if (ratio > 0.5) return 0x00ff00;
    if (ratio > 0.25) return 0xffaa00;
    return 0xff0000;
  }
}
