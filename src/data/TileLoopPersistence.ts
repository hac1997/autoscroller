import type { TileData } from './TileData';

let persistedTileLoop: TileData[] | null = null;

export function saveTileLoop(tiles: TileData[]): void {
    persistedTileLoop = tiles.map((t) => ({ ...t }));
}

export function loadTileLoop(): TileData[] | null {
    return persistedTileLoop;
}

export function clearTileLoop(): void {
    persistedTileLoop = null;
}
