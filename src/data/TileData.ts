import type { TileType } from './TileTypes';

export interface TileData {
    type: TileType;
    color: number;
    isDefeated?: boolean; // Tracks whether the tile has been defeated or not in the current loop
}
