import { Scene } from 'phaser';
import { loadAllData } from '../data/DataLoader';
import { LAYOUT } from '../ui/StyleConstants';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    this.cameras.main.fadeIn(LAYOUT.fadeDuration, 0, 0, 0);
    loadAllData();
    this.scene.start('Preloader');
  }
}
