export type TileType = 'basic' | 'combat' | 'elite' | 'boss' | 'shop' | 'rest' | 'event' | 'treasure';

export interface TileTypeConfig {
    type: TileType;
    name: string;
    color: number;
    canPlaceManually: boolean;
}

export const TILE_CONFIGS: Record<TileType, TileTypeConfig> = {
    basic: {
        type: 'basic',
        name: 'Path',
        color: 0x666666,
        canPlaceManually: false
    },
    combat: {
        type: 'combat',
        name: 'Combat',
        color: 0x880000,
        canPlaceManually: true
    },
    elite: {
        type: 'elite',
        name: 'Elite Combat',
        color: 0xaa0000,
        canPlaceManually: true
    },
    boss: {
        type: 'boss',
        name: 'Boss',
        color: 0xff0000,
        canPlaceManually: false
    },
    shop: {
        type: 'shop',
        name: 'Shop',
        color: 0xffd700,
        canPlaceManually: true
    },
    rest: {
        type: 'rest',
        name: 'Rest Site',
        color: 0x4169e1,
        canPlaceManually: true
    },
    event: {
        type: 'event',
        name: 'Event',
        color: 0x9370db,
        canPlaceManually: true
    },
    treasure: {
        type: 'treasure',
        name: 'Treasure',
        color: 0xff8c00,
        canPlaceManually: true
    }
};

export interface GeneratedTileLayout {
    tiles: TileType[];
    bossIndex: number;
}

export function generateTileLayout(loopLength: number = 20): GeneratedTileLayout {
    const tiles: TileType[] = new Array(loopLength).fill('basic');

    // Seed some encounters so the loop isn't empty
    // Combat at positions 4, 9, 14
    if (loopLength >= 15) {
        tiles[4] = 'combat';
        tiles[9] = 'combat';
        tiles[14] = 'combat';
    }
    // Shop at position 7
    if (loopLength >= 8) {
        tiles[7] = 'shop';
    }
    // Rest at position 12
    if (loopLength >= 13) {
        tiles[12] = 'rest';
    }

    // Last tile will be determined dynamically based on loop number
    // For loops 1-99: escalating combat
    // For loop 100: boss
    const bossIndex = loopLength - 1;
    tiles[bossIndex] = 'basic'; // Will be set dynamically in MapManager

    return { tiles, bossIndex };
}

export function getTileConfig(type: TileType): TileTypeConfig {
    return TILE_CONFIGS[type];
}
