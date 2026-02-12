import Phaser, { Scene } from 'phaser';

export interface TileData {
    type: 'basic' | 'combat' | 'event';
    color: number;
}

export class MapManager {
    private scene: Scene;
    private tiles: Phaser.GameObjects.Rectangle[];
    private baseTiles: TileData[]; // The logical loop of 20 tiles
    private tileSize: number = 80;
    private currentX: number = 0;
    private loopLength: number = 20;

    constructor(scene: Scene) {
        this.scene = scene;
        this.tiles = [];
        this.baseTiles = [];
        this.initializeBaseTiles();
        this.expandTrack();
    }

    private initializeBaseTiles() {
        for (let i = 0; i < this.loopLength; i++) {
            this.baseTiles.push({
                type: 'basic',
                color: (i % 2 === 0) ? 0x666666 : 0x888888
            });
        }
    }

    private expandTrack() {
        const tilesToGenerate = 10;
        for (let i = 0; i < tilesToGenerate; i++) {
            const globalIndex = Math.floor(this.currentX / this.tileSize);
            const loopIndex = globalIndex % this.loopLength;
            const data = this.baseTiles[loopIndex];

            const x = this.currentX + (this.tileSize / 2);
            const y = 450;

            const tile = this.scene.add.rectangle(x, y, this.tileSize, this.tileSize, data.color);

            // Interaction for testing
            tile.setInteractive();
            tile.on('pointerdown', () => this.onTileClick(globalIndex, tile));

            this.tiles.push(tile);
            this.currentX += this.tileSize;
        }
    }

    private onTileClick(globalIndex: number, tile: Phaser.GameObjects.Rectangle) {
        const loopIndex = globalIndex % this.loopLength;
        const data = this.baseTiles[loopIndex];

        // Simple toggle logic for prototype
        if (data.type === 'basic') {
            data.type = 'combat';
            data.color = 0x880000; // Dark Red
        } else {
            data.type = 'basic';
            data.color = (loopIndex % 2 === 0) ? 0x666666 : 0x888888;
        }

        // Update the visual of the clicked tile
        tile.setFillStyle(data.color);

        console.log(`Updated Tile ${loopIndex} to ${data.type}`);
    }

    public getTileDataAt(x: number): TileData | null {
        const globalIndex = Math.floor(x / this.tileSize);
        if (x < 0) return null; // Logic check
        const loopIndex = globalIndex % this.loopLength;
        return this.baseTiles[loopIndex];
    }

    public update(playerX: number) {
        // Generate new tiles ahead of the player
        if (playerX + 1000 > this.currentX) {
            this.expandTrack();
        }

        // Remove old tiles behind the player
        const cleanupThreshold = playerX - 1000;
        if (this.tiles.length > 0 && this.tiles[0].x < cleanupThreshold) {
            while (this.tiles.length > 0 && this.tiles[0].x < cleanupThreshold) {
                const tile = this.tiles.shift();
                tile?.destroy();
            }
        }
    }
}
