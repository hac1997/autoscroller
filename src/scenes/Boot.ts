import { Scene } from 'phaser';
import { loadAllData } from '../data/DataLoader';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    loadAllData();
    this.scene.start('Preloader');
  }
}
