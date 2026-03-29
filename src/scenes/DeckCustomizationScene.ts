import { Scene } from 'phaser';
import { getRun } from '../state/RunState';
import { getCardById } from '../data/DataLoader';
import { createCardVisual } from '../ui/CardVisual';
import { COLORS, FONTS, LAYOUT, createButton } from '../ui/StyleConstants';

/**
 * DeckCustomizationScene -- overlay for viewing full deck during gameplay.
 * Shows all cards in a scrollable grid with card counts by category.
 * Click any card to see its full details.
 * Accessible via [D] key from GameScene.
 */
const COLS = 6;
const CARD_W = 72;
const CARD_H = 96;
const GAP = 10;
const GRID_TOP = 130;

export class DeckCustomizationScene extends Scene {
  private gridContainer!: Phaser.GameObjects.Container;
  private scrollY = 0;
  private maxScroll = 0;

  constructor() {
    super('DeckCustomizationScene');
  }

  create(): void {
    const run = getRun();
    const deckIds = run.deck.active;

    this.cameras.main.setBackgroundColor(COLORS.background);

    const fontFamily = FONTS.family;

    // Title
    this.add.text(LAYOUT.centerX, 30, 'Your Deck', {
      ...FONTS.title,
      color: COLORS.accent,
      fontFamily,
    }).setOrigin(0.5);

    // Stats bar
    const attacks = deckIds.filter(id => getCardById(id)?.category === 'attack').length;
    const defenses = deckIds.filter(id => getCardById(id)?.category === 'defense').length;
    const spells = deckIds.filter(id => getCardById(id)?.category === 'magic').length;

    const statsStr = `${deckIds.length} Cards  |  Attack: ${attacks}  |  Defense: ${defenses}  |  Magic: ${spells}`;
    this.add.text(LAYOUT.centerX, 68, statsStr, {
      ...FONTS.small,
      color: COLORS.textSecondary,
      fontFamily,
    }).setOrigin(0.5);

    // Hint
    this.add.text(LAYOUT.centerX, 90, 'Click a card for details  |  Scroll to see more', {
      fontSize: '12px',
      color: COLORS.textSecondary,
      fontFamily,
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Card grid
    this.gridContainer = this.add.container(0, 0);
    const gridLeft = LAYOUT.centerX - ((COLS * (CARD_W + GAP) - GAP) / 2) + CARD_W / 2;

    for (let i = 0; i < deckIds.length; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = gridLeft + col * (CARD_W + GAP);
      const y = GRID_TOP + CARD_H / 2 + row * (CARD_H + GAP);

      // Order number
      const orderNum = this.add.text(x - CARD_W / 2 - 2, y - CARD_H / 2 - 2, `${i + 1}`, {
        fontSize: '10px',
        color: COLORS.textSecondary,
        fontFamily,
      }).setOrigin(1, 1);
      this.gridContainer.add(orderNum);

      const cardVis = createCardVisual(this, x, y, deckIds[i]);
      this.gridContainer.add(cardVis);
    }

    // Scroll support
    const totalRows = Math.ceil(deckIds.length / COLS);
    const visibleHeight = LAYOUT.canvasHeight - GRID_TOP - 60;
    const contentHeight = totalRows * (CARD_H + GAP);
    this.maxScroll = Math.max(0, contentHeight - visibleHeight);
    this.scrollY = 0;

    if (this.maxScroll > 0) {
      this.input.on('wheel', (_p: any, _go: any, _dx: number, dy: number) => {
        this.scrollY = Math.max(0, Math.min(this.maxScroll, this.scrollY + dy * 0.5));
        this.gridContainer.y = -this.scrollY;
      });
    }

    // Mask the grid area
    const maskGfx = this.make.graphics({ x: 0, y: 0 });
    maskGfx.fillStyle(0xffffff);
    maskGfx.fillRect(0, GRID_TOP - 10, LAYOUT.canvasWidth, visibleHeight + 10);
    this.gridContainer.setMask(maskGfx.createGeometryMask());

    // Close button
    createButton(this, LAYOUT.centerX, LAYOUT.canvasHeight - 30, 'Close (D)', () => this.close(), 'primary');

    this.input.keyboard?.on('keydown-D', () => this.close());
    this.input.keyboard?.on('keydown-ESC', () => this.close());

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
