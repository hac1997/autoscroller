/**
 * Plays an unlock celebration animation on the active scene.
 * "New Unlock!" title + item name, auto-destroys after animation.
 */
export function playUnlockCelebration(
  scene: Phaser.Scene,
  itemName: string,
  rarityColor: number = 0xffd700
): void {
  const fontFamily = 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif';
  const rarityHex = '#' + rarityColor.toString(16).padStart(6, '0');

  // "New Unlock!" text
  const titleText = scene.add.text(400, 280, 'New Unlock!', {
    fontSize: '32px',
    fontStyle: 'bold',
    color: '#ffd700',
    fontFamily,
  }).setOrigin(0.5).setDepth(300).setScale(0);

  // Item name text
  const itemText = scene.add.text(400, 360, itemName, {
    fontSize: '24px',
    fontStyle: 'bold',
    color: rarityHex,
    fontFamily,
  }).setOrigin(0.5).setDepth(300).setAlpha(0);

  // Title: scale from 0 -> 1.2 (300ms Back.easeOut), hold 800ms, fade (400ms)
  scene.tweens.add({
    targets: titleText,
    scaleX: 1.2,
    scaleY: 1.2,
    duration: 300,
    ease: 'Back.easeOut',
    onComplete: () => {
      scene.time.delayedCall(800, () => {
        scene.tweens.add({
          targets: titleText,
          alpha: 0,
          duration: 400,
          onComplete: () => titleText.destroy(),
        });
      });
    },
  });

  // Item name: slides up from (400, 360) with 200ms delay, 300ms duration
  scene.time.delayedCall(200, () => {
    itemText.setAlpha(1);
    scene.tweens.add({
      targets: itemText,
      y: 320,
      duration: 300,
      ease: 'Power2',
    });

    // Fade out after title fades
    scene.time.delayedCall(900, () => {
      scene.tweens.add({
        targets: itemText,
        alpha: 0,
        duration: 400,
        onComplete: () => itemText.destroy(),
      });
    });
  });
}
