import { Scene } from 'phaser';
import { loadMetaState } from '../systems/MetaPersistence';
import { getCollectionStatus, getCompletionPercent } from '../systems/CollectionRegistry';

/**
 * CollectionScene -- tabbed content viewer for all game content.
 * Placeholder: fleshed out in Task 2.
 */
export class CollectionScene extends Scene {
  constructor() {
    super('CollectionScene');
  }

  async create(): Promise<void> {
    const metaState = await loadMetaState();
    const status = getCollectionStatus(metaState);
    const percent = getCompletionPercent(metaState);

    this.cameras.main.setBackgroundColor(0x1a1a2e);
    this.add.text(400, 300, `Collection ${percent}% Complete (${status.cards.unlocked} cards)`, {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);
  }
}
