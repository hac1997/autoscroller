import { Scene } from 'phaser';
import { getRun } from '../state/RunState';
import { COLORS, FONTS, LAYOUT, createButton } from '../ui/StyleConstants';

/**
 * DeckCustomizationScene -- overlay for viewing/reordering/removing cards.
 * Reads run.deck. Full UI is Phase 2.
 */
export class DeckCustomizationScene extends Scene {
  constructor() {
    super('DeckCustomizationScene');
  }

  create(): void {
    const run = getRun();

    this.cameras.main.setBackgroundColor(COLORS.background);

    // Title
    this.add.text(400, 60, 'Deck Customization', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: COLORS.accent,
      fontFamily: FONTS.family,
    }).setOrigin(0.5);

    // Deck info
    this.add.text(400, 120, `Cards in deck: ${run.deck.active.length}`, {
      fontSize: '16px',
      color: COLORS.textPrimary,
      fontFamily: FONTS.family,
    }).setOrigin(0.5);

    // Card list
    const inventoryKeys = Object.keys(run.deck.inventory);
    if (inventoryKeys.length > 0) {
      this.add.text(400, 160, `Cards in inventory: ${inventoryKeys.length}`, {
        fontSize: '14px',
        color: COLORS.textSecondary,
        fontFamily: FONTS.family,
      }).setOrigin(0.5);
    }

    // Placeholder
    this.add.text(400, 300, 'Deck management: Phase 2', {
      fontSize: '14px',
      color: COLORS.textSecondary,
      fontFamily: FONTS.family,
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Close button
    createButton(this, 400, 520, 'Close (D)', () => this.close(), 'primary');

    this.input.keyboard?.on('keydown-D', () => this.close());

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
