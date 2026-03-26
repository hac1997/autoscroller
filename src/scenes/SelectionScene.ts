import { Scene } from 'phaser';
import { getRun } from '../state/RunState';

/**
 * SelectionScene -- card/heir reward selection.
 * Placeholder for Phase 2 reward system.
 */
export class SelectionScene extends Scene {
  constructor() {
    super('SelectionScene');
  }

  create(): void {
    const run = getRun();

    this.cameras.main.setBackgroundColor(0x1a1a2e);

    // Title
    this.add.text(400, 100, 'Selection', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffd700',
    }).setOrigin(0.5);

    // Context
    this.add.text(400, 180, `Generation: ${run.generation}`, {
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Placeholder
    this.add.text(400, 300, 'Selection system: Phase 2', {
      fontSize: '14px',
      color: '#888888',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Continue button
    const continueBtn = this.add.text(400, 420, 'Continue', {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffd700',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    continueBtn.on('pointerover', () => continueBtn.setColor('#ffffff'));
    continueBtn.on('pointerout', () => continueBtn.setColor('#ffd700'));
    continueBtn.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    this.events.on('shutdown', this.cleanup, this);
  }

  private cleanup(): void {
    // No eventBus listeners to clean
  }
}
