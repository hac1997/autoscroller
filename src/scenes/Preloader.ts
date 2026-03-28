import { Scene } from 'phaser';
import { saveManager } from '../core/SaveManager';
import { LAYOUT } from '../ui/StyleConstants';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  async create(): Promise<void> {
    this.cameras.main.fadeIn(LAYOUT.fadeDuration, 0, 0, 0);
    // Show a simple loading indicator
    this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff);

    // Simulate brief load
    bar.width = 464;

    // Check for existing saved run
    const savedRun = await saveManager.load();

    // Pass saved run info to MainMenu via registry
    this.registry.set('savedRun', savedRun);

    this.scene.start('MainMenu');
  }
}
