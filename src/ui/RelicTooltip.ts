/**
 * RelicTooltip -- hover tooltip showing relic name, effect, and source.
 * Positioned 8px above hovered relic.
 */
export class RelicTooltip extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle;
  private nameText: Phaser.GameObjects.Text;
  private effectText: Phaser.GameObjects.Text;
  private sourceText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);

    const fontFamily = 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif';

    this.bg = scene.add.rectangle(0, 0, 180, 72, 0x222222, 0.95);
    this.add(this.bg);

    this.nameText = scene.add.text(0, -22, '', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily,
    }).setOrigin(0.5, 0.5);
    this.add(this.nameText);

    this.effectText = scene.add.text(0, 0, '', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily,
    }).setOrigin(0.5, 0.5);
    this.add(this.effectText);

    this.sourceText = scene.add.text(0, 18, '', {
      fontSize: '14px',
      color: '#aaaaaa',
      fontFamily,
    }).setOrigin(0.5, 0.5);
    this.add(this.sourceText);

    this.setScrollFactor(0);
    this.setDepth(200);
    this.setVisible(false);
  }

  show(x: number, y: number, name: string, effect: string, source: string, rarityColor: number): void {
    const colorHex = '#' + rarityColor.toString(16).padStart(6, '0');
    this.nameText.setText(name);
    this.nameText.setColor(colorHex);
    this.effectText.setText(effect);
    this.sourceText.setText(`From: ${source}`);

    // Auto-width based on longest text
    const maxWidth = Math.max(
      this.nameText.width,
      this.effectText.width,
      this.sourceText.width,
      180
    );
    this.bg.setSize(maxWidth + 16, 72);

    // Position 8px above hovered relic
    this.setPosition(x, y - 8);
    this.setVisible(true);
  }

  hide(): void {
    this.setVisible(false);
  }
}
