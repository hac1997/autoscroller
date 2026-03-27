import { Scene } from 'phaser';
import { saveManager } from '../core/SaveManager';
import { createNewRun, setRun, getRun } from '../state/RunState';
import type { RunState } from '../state/RunState';

export class MainMenu extends Scene {
  private savedRun: RunState | null = null;
  private confirmOverlay: Phaser.GameObjects.Container | null = null;

  constructor() {
    super('MainMenu');
  }

  create(): void {
    this.savedRun = this.registry.get('savedRun') as RunState | null;
    this.confirmOverlay = null;

    // Background
    this.cameras.main.setBackgroundColor(0x1a1a2e);

    // Title
    this.add.text(400, 150, 'Rogue Scroll', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    if (this.savedRun) {
      // Continue Run button (primary, accent)
      const continueBtn = this.add.text(400, 300, 'Continue Run', {
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#ffd700',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      continueBtn.on('pointerover', () => continueBtn.setColor('#ffffff'));
      continueBtn.on('pointerout', () => continueBtn.setColor('#ffd700'));
      continueBtn.on('pointerdown', () => this.continueRun());

      // New Run button (secondary, below)
      const newRunBtn = this.add.text(400, 360, 'New Run', {
        fontSize: '16px',
        color: '#ffd700',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      newRunBtn.on('pointerover', () => newRunBtn.setColor('#ffffff'));
      newRunBtn.on('pointerout', () => newRunBtn.setColor('#ffd700'));
      newRunBtn.on('pointerdown', () => this.showDeleteConfirmation());
    } else {
      // No saved run -- show only New Run as primary
      const newRunBtn = this.add.text(400, 300, 'New Run', {
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#ffd700',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      newRunBtn.on('pointerover', () => newRunBtn.setColor('#ffffff'));
      newRunBtn.on('pointerout', () => newRunBtn.setColor('#ffd700'));
      newRunBtn.on('pointerdown', () => this.startNewRun());
    }

    this.events.on('shutdown', this.cleanup, this);
  }

  private continueRun(): void {
    if (this.savedRun) {
      setRun(this.savedRun);
      this.scene.start('GameScene');
    }
  }

  private showDeleteConfirmation(): void {
    if (this.confirmOverlay) return;

    this.confirmOverlay = this.add.container(0, 0);

    // Dim background
    const dimBg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    dimBg.setInteractive(); // block click-through
    this.confirmOverlay.add(dimBg);

    // Confirmation panel
    const panel = this.add.rectangle(400, 300, 500, 200, 0x222222, 0.95);
    this.confirmOverlay.add(panel);

    const msg = this.add.text(400, 260, 'This will permanently erase your current run. Continue?', {
      fontSize: '16px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 440 },
    }).setOrigin(0.5);
    this.confirmOverlay.add(msg);

    // Yes, Delete button (accent)
    const yesBtn = this.add.text(320, 330, 'Yes, Delete', {
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffd700',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    yesBtn.on('pointerover', () => yesBtn.setColor('#ffffff'));
    yesBtn.on('pointerout', () => yesBtn.setColor('#ffd700'));
    yesBtn.on('pointerdown', () => this.startNewRun());
    this.confirmOverlay.add(yesBtn);

    // Keep My Run button (muted)
    const noBtn = this.add.text(480, 330, 'Keep My Run', {
      fontSize: '16px',
      color: '#aaaaaa',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    noBtn.on('pointerover', () => noBtn.setColor('#ffffff'));
    noBtn.on('pointerout', () => noBtn.setColor('#aaaaaa'));
    noBtn.on('pointerdown', () => this.hideConfirmation());
    this.confirmOverlay.add(noBtn);
  }

  private hideConfirmation(): void {
    if (this.confirmOverlay) {
      this.confirmOverlay.destroy(true);
      this.confirmOverlay = null;
    }
  }

  private async startNewRun(): Promise<void> {
    await saveManager.clear();
    setRun(createNewRun());
    await saveManager.save(getRun());
    this.scene.start('CityHub');
  }

  private cleanup(): void {
    this.confirmOverlay = null;
    this.savedRun = null;
  }
}
