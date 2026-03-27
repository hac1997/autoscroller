import type { TileType } from './TileTypes';

export interface TileInventoryItem {
    type: TileType;
    quantity: number;
}

let tileInventory: Map<TileType, number> = new Map();

export function getTileInventory(): Map<TileType, number> {
    return new Map(tileInventory);
}

export function getTileCount(type: TileType): number {
    return tileInventory.get(type) || 0;
}

export function addTile(type: TileType, quantity: number = 1): void {
    const current = tileInventory.get(type) || 0;
    tileInventory.set(type, current + quantity);
}

export function removeTile(type: TileType, quantity: number = 1): boolean {
    const current = tileInventory.get(type) || 0;
    if (current >= quantity) {
        tileInventory.set(type, current - quantity);
        return true;
    }
    return false;
}

export function resetTileInventory(): void {
    tileInventory.clear();
}

export function getPlaceableTileTypes(): TileType[] {
    const types: TileType[] = [];
    tileInventory.forEach((quantity, type) => {
        if (quantity > 0 && type !== 'basic' && type !== 'boss') {
            types.push(type);
        }
    });
    return types;
}
