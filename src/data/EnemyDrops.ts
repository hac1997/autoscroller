import { getCardById, type CardDefinition } from './CardDefinitions';

export interface EnemyDropConfig {
    enemyType: string;
    cardPool: string[];
    minDrops: number;
    maxDrops: number;
    choicesShown: number;
}

const ENEMY_DROPS: Record<string, EnemyDropConfig> = {
    Slime: {
        enemyType: 'Slime',
        cardPool: ['strike', 'defend', 'heavy-hit', 'shield-wall', 'fireball', 'heal'],
        minDrops: 1,
        maxDrops: 1,
        choicesShown: 3
    },
    Goblin: {
        enemyType: 'Goblin',
        cardPool: ['strike', 'defend', 'heavy-hit', 'berserk', 'quick-strike'],
        minDrops: 1,
        maxDrops: 1,
        choicesShown: 3
    },
    Orc: {
        enemyType: 'Orc',
        cardPool: ['heavy-hit', 'shield-wall', 'defend', 'fortress'],
        minDrops: 1,
        maxDrops: 1,
        choicesShown: 3
    },
    'Dark Mage': {
        enemyType: 'Dark Mage',
        cardPool: ['fireball', 'heal', 'frost', 'arcane-blast'],
        minDrops: 1,
        maxDrops: 1,
        choicesShown: 3
    },
    'Elite Knight': {
        enemyType: 'Elite Knight',
        cardPool: ['heavy-hit', 'shield-wall', 'fortress', 'berserk'],
        minDrops: 2,
        maxDrops: 2,
        choicesShown: 4
    },
    'Demon Lord': {
        enemyType: 'Demon Lord',
        cardPool: ['berserk', 'fury', 'fireball', 'arcane-blast', 'fortress'],
        minDrops: 2,
        maxDrops: 3,
        choicesShown: 5
    }
};

// Tile drops configuration
export interface TileDropConfig {
    tileType: string;
    dropChance: number;
    minQuantity: number;
    maxQuantity: number;
}

const TILE_DROPS: Record<string, TileDropConfig[]> = {
    Slime: [
        { tileType: 'combat', dropChance: 0.3, minQuantity: 1, maxQuantity: 1 }
    ],
    Goblin: [
        { tileType: 'combat', dropChance: 0.4, minQuantity: 1, maxQuantity: 2 },
        { tileType: 'event', dropChance: 0.2, minQuantity: 1, maxQuantity: 1 }
    ],
    Orc: [
        { tileType: 'combat', dropChance: 0.5, minQuantity: 1, maxQuantity: 2 },
        { tileType: 'rest', dropChance: 0.3, minQuantity: 1, maxQuantity: 1 }
    ],
    'Dark Mage': [
        { tileType: 'event', dropChance: 0.5, minQuantity: 1, maxQuantity: 2 },
        { tileType: 'shop', dropChance: 0.3, minQuantity: 1, maxQuantity: 1 }
    ],
    'Elite Knight': [
        { tileType: 'combat', dropChance: 0.7, minQuantity: 2, maxQuantity: 3 },
        { tileType: 'elite', dropChance: 0.4, minQuantity: 1, maxQuantity: 1 },
        { tileType: 'shop', dropChance: 0.5, minQuantity: 1, maxQuantity: 1 }
    ],
    'Demon Lord': [
        { tileType: 'combat', dropChance: 1.0, minQuantity: 3, maxQuantity: 5 },
        { tileType: 'elite', dropChance: 0.8, minQuantity: 1, maxQuantity: 2 },
        { tileType: 'treasure', dropChance: 0.6, minQuantity: 1, maxQuantity: 2 },
        { tileType: 'shop', dropChance: 0.7, minQuantity: 1, maxQuantity: 2 },
        { tileType: 'rest', dropChance: 0.8, minQuantity: 1, maxQuantity: 2 }
    ]
};

export function getEnemyDropConfig(enemyType: string): EnemyDropConfig | undefined {
    return ENEMY_DROPS[enemyType];
}

export function rollCardDrops(enemyType: string): CardDefinition[] {
    const config = getEnemyDropConfig(enemyType);
    if (!config || config.cardPool.length === 0) return [];

    const count = Math.min(config.choicesShown, config.cardPool.length);
    const pool = [...config.cardPool];
    const result: CardDefinition[] = [];

    for (let i = 0; i < count && pool.length > 0; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const cardId = pool[idx];
        const card = getCardById(cardId);
        if (card) result.push(card);
        pool.splice(idx, 1);
    }
    return result;
}

export function rollTileDrops(enemyType: string): Map<string, number> {
    const drops = new Map<string, number>();
    const config = TILE_DROPS[enemyType];
    
    if (!config) return drops;

    for (const tileDrop of config) {
        if (Math.random() < tileDrop.dropChance) {
            const quantity = tileDrop.minQuantity + 
                Math.floor(Math.random() * (tileDrop.maxQuantity - tileDrop.minQuantity + 1));
            const current = drops.get(tileDrop.tileType) || 0;
            drops.set(tileDrop.tileType, current + quantity);
        }
    }

    return drops;
}
