/**
 * SeedDisplay -- shows run seed in bottom-right HUD corner with click-to-copy.
 * Only created when the seed was manually entered.
 */
export class SeedDisplay extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, seed: string) {
    super(scene, 790, 590);
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(100);

    const fontFamily = 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif';

    // Seed text
    const seedText = scene.add.text(0, 0, `Seed: ${seed}`, {
      fontSize: '14px',
      color: '#aaaaaa',
      fontFamily,
    }).setOrigin(1, 1).setAlpha(0.6);
    seedText.setInteractive({ useHandCursor: true });
    this.add(seedText);

    // Click to copy
    seedText.on('pointerdown', () => {
      navigator.clipboard.writeText(seed).then(() => {
        // Show "Seed copied!" toast
        const toast = scene.add.text(790, 570, 'Seed copied!', {
          fontSize: '14px',
          color: '#ffd700',
          fontFamily,
        }).setOrigin(1, 1).setScrollFactor(0).setDepth(200);

        scene.tweens.add({
          targets: toast,
          y: 550,
          alpha: 0,
          duration: 1500,
          onComplete: () => toast.destroy(),
        });
      }).catch(() => {
        // Clipboard API may not be available in all contexts
      });
    });
  }
}
