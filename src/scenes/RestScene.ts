import { Scene } from 'phaser';
import { getRun } from '../state/RunState';
import { COLORS, FONTS, LAYOUT, createButton } from '../ui/StyleConstants';

/**
 * RestScene -- overlay for rest site choices (heal/purify).
 * Reads RunState for hero HP. Actual rest logic is Phase 2+.
 */
export class RestScene extends Scene {
  constructor() {
    super('RestScene');
  }

  create(): void {
    const run = getRun();

    // Overlay panel
    this.add.rectangle(400, 300, 600, 400, COLORS.panel, LAYOUT.panelAlpha).setInteractive();

    // Title
    this.add.text(400, 140, 'Rest Site', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#88ccff',
      fontFamily: FONTS.family,
    }).setOrigin(0.5);

    // HP display
    this.add.text(400, 190, `HP: ${run.hero.currentHP}/${run.hero.maxHP}`, {
      fontSize: '16px',
      color: COLORS.textPrimary,
      fontFamily: FONTS.family,
    }).setOrigin(0.5);

    // Heal option placeholder
    const healAmount = Math.floor(run.hero.maxHP * 0.3);
    this.add.text(400, 260, `Heal (+${healAmount} HP) -- Phase 2`, {
      fontSize: '14px',
      color: COLORS.textSecondary,
      fontFamily: FONTS.family,
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Skip button
    createButton(this, 400, 420, 'Skip', () => this.close(), 'primary');

    this.events.on('shutdown', this.cleanup, this);
  }

  private close(): void {
    this.scene.stop();
    this.scene.resume('GameScene');
  }

  private cleanup(): void {
    // No eventBus listeners to clean
  }
}
