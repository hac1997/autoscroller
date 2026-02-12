import { Scene } from 'phaser';
import { MapManager } from '../objects/MapManager';
import { Player } from '../objects/Player';

export class Game extends Scene {
    private mapManager!: MapManager;
    private player!: Player;
    private heirData?: { heir: any }; // Added to store heir data for update method

    constructor() {
        super('Game');
    }

    create(data?: { heir: any }) {
        this.heirData = data; // Store heir data
        this.cameras.main.setBackgroundColor(0x222222);

        // Initialize Map
        this.mapManager = new MapManager(this);

        // Initialize Player above the track
        // Track Y in MapManager is 450. Tile height 80. Center 450. Top is 450-40 = 410.
        // Player is 40x40. Center origin. So y=450 sits inside.
        // Let's put player at y=410 (sitting on top).
        this.player = new Player(this, 100, 410);

        // Apply Heir Traits if any
        if (data && data.heir) {
            console.log('Inheriting traits:', data.heir);
            // Apply traits logic here (e.g. modify stats)
            // data.heir.traits.forEach(t => t.effect(this.player.stats));
        }

        // Camera Setup
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(100, 100);

        // Debug Text
        this.add.text(10, 10, 'Autoscroll Prototype', {
            fontFamily: 'Arial', fontSize: 16, color: '#ffffff'
        }).setScrollFactor(0);
    }

    update(time: number, delta: number) {
        if (this.scene.isPaused()) return;

        this.player.update(time, delta);
        this.mapManager.update(this.player.x);

        // Check Loop Progression (Loop length = 20 tiles * 80 size = 1600px)
        const currentLoop = Math.floor(this.player.x / 1600);
        if (currentLoop >= 3) {
            this.scene.start('SelectionScene', { generation: (this.heirData && this.heirData.heir ? this.heirData.heir.generation + 1 : 1) });
        }

        // Check Combat
        const tileData = this.mapManager.getTileDataAt(this.player.x);
        if (tileData && tileData.type === 'combat') {
            // Pause this scene
            this.scene.pause();

            // Launch Combat
            this.scene.launch('CombatScene', { enemyType: 'Slime' });

            // Clear tile data (simple persistence: tile becomes basic now)
            // In a real game, this might happen only AFTER victory.
            // We can pass a callback or listen to resume event.
            tileData.type = 'basic';
            tileData.color = 0x666666; // Reset color
        }
    }
}
