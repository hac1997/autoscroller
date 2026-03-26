import { Scene } from 'phaser';
import { eventBus, type GameEvents } from '../core/EventBus';
import { getRun } from '../state/RunState';
import { saveManager } from '../core/SaveManager';

export class Game extends Scene {
  // Named event handler references for cleanup
  private onGoldChanged!: (data: GameEvents['gold:changed']) => void;
  private onHeroDamaged!: (data: GameEvents['hero:damaged']) => void;
  private onHeroHealed!: (data: GameEvents['hero:healed']) => void;
  private onLoopCompleted!: (data: GameEvents['loop:completed']) => void;
  private onSaveCompleted!: (data: GameEvents['save:completed']) => void;

  // HUD elements
  private goldText!: Phaser.GameObjects.Text;
  private hpBar!: Phaser.GameObjects.Rectangle;

  private hpText!: Phaser.GameObjects.Text;
  private loopText!: Phaser.GameObjects.Text;
  private saveIndicator!: Phaser.GameObjects.Text;

  constructor() {
    super('Game');
  }

  create(): void {
    const run = getRun();

    // Background
    this.cameras.main.setBackgroundColor(0x1a1a2e);

    // ── HUD Panel ──────────────────────────────────────────
    this.add.rectangle(8, 8, 200, 80, 0x222222, 0.85)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(100);

    // Gold display
    this.goldText = this.add.text(16, 16, `Gold: ${run.economy.gold}`, {
      fontSize: '14px',
      color: '#ffd700',
    }).setScrollFactor(0).setDepth(100);

    // Loop counter
    this.loopText = this.add.text(16, 36, `Loop: ${run.loop.count}`, {
      fontSize: '14px',
      color: '#ffffff',
    }).setScrollFactor(0).setDepth(100);

    // HP bar background
    this.add.rectangle(16, 60, 160, 12, 0x333333)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(100);

    // HP bar fill
    const hpRatio = run.hero.currentHP / run.hero.maxHP;
    this.hpBar = this.add.rectangle(16, 60, 160 * hpRatio, 12, this.getHpColor(hpRatio))
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(100);

    // HP text
    this.hpText = this.add.text(180, 58, `${run.hero.currentHP}/${run.hero.maxHP}`, {
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // ── Save Indicator ─────────────────────────────────────
    this.saveIndicator = this.add.text(784, 584, 'Saved', {
      fontSize: '14px',
      color: '#ffd700',
    }).setOrigin(1, 1).setScrollFactor(0).setDepth(200).setAlpha(0);

    // ── Wire auto-save ─────────────────────────────────────
    saveManager.setupAutoSave(() => getRun());

    // ── Event handlers ─────────────────────────────────────
    this.onGoldChanged = (data) => {
      this.goldText.setText(`Gold: ${data.total}`);
    };
    eventBus.on('gold:changed', this.onGoldChanged);

    this.onHeroDamaged = (data) => {
      this.updateHpBar(data.currentHP, data.maxHP);
    };
    eventBus.on('hero:damaged', this.onHeroDamaged);

    this.onHeroHealed = (data) => {
      const run = getRun();
      this.updateHpBar(data.currentHP, run.hero.maxHP);
    };
    eventBus.on('hero:healed', this.onHeroHealed);

    this.onLoopCompleted = (data) => {
      this.loopText.setText(`Loop: ${data.loopNumber}`);
    };
    eventBus.on('loop:completed', this.onLoopCompleted);

    this.onSaveCompleted = (_data) => {
      this.showSaveIndicator();
    };
    eventBus.on('save:completed', this.onSaveCompleted);

    // ── Controls hint ──────────────────────────────────────
    this.add.text(10, 550, '[D] Deck | [R] Relics | [ESC] Pause', {
      fontSize: '12px',
      color: '#aaccff',
    }).setScrollFactor(0).setDepth(100);

    // ── Keyboard shortcuts ─────────────────────────────────
    this.input.keyboard?.on('keydown-D', () => {
      if (!this.scene.isPaused()) {
        this.scene.pause();
        this.scene.launch('DeckCustomizationScene');
      }
    });

    this.input.keyboard?.on('keydown-R', () => {
      if (!this.scene.isPaused()) {
        this.scene.pause();
        this.scene.launch('RelicViewerScene');
      }
    });

    this.input.keyboard?.on('keydown-ESC', () => {
      if (!this.scene.isPaused()) {
        this.scene.pause();
        this.scene.launch('PauseScene');
      }
    });

    // Register cleanup
    this.events.on('shutdown', this.cleanup, this);
  }

  private updateHpBar(currentHP: number, maxHP: number): void {
    const ratio = Math.max(0, currentHP / maxHP);
    this.hpBar.width = 160 * ratio;
    this.hpBar.setFillStyle(this.getHpColor(ratio));
    this.hpText.setText(`${currentHP}/${maxHP}`);
  }

  private getHpColor(ratio: number): number {
    if (ratio > 0.5) return 0x00ff00;
    if (ratio > 0.25) return 0xffaa00;
    return 0xff0000;
  }

  private showSaveIndicator(): void {
    // Fade in 200ms, hold 1.5s, fade out 500ms
    this.tweens.killTweensOf(this.saveIndicator);
    this.saveIndicator.setAlpha(0);
    this.tweens.add({
      targets: this.saveIndicator,
      alpha: 1,
      duration: 200,
      hold: 1500,
      yoyo: true,
      yoyoDelay: 0,
      completeDelay: 0,
      ease: 'Linear',
      onYoyo: () => {
        // fade out over 500ms handled by yoyo
      },
    });
    // Override yoyo duration to 500ms by using timeline
    this.tweens.killTweensOf(this.saveIndicator);
    this.tweens.chain({
      targets: this.saveIndicator,
      tweens: [
        { alpha: 1, duration: 200 },
        { alpha: 1, duration: 1500 },
        { alpha: 0, duration: 500 },
      ],
    });
  }

  private cleanup(): void {
    eventBus.off('gold:changed', this.onGoldChanged);
    eventBus.off('hero:damaged', this.onHeroDamaged);
    eventBus.off('hero:healed', this.onHeroHealed);
    eventBus.off('loop:completed', this.onLoopCompleted);
    eventBus.off('save:completed', this.onSaveCompleted);
  }
}
