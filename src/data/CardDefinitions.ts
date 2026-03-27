export type CardCategory = 'attack' | 'defense' | 'magic';

export interface CardCost {
    stamina?: number;
    mana?: number;
    defense?: number;
}

export interface CardEffect {
    type: 'damage' | 'heal' | 'armor' | 'stamina' | 'mana' | 'debuff';
    value: number;
    target: 'enemy' | 'self';
}

export interface CardDefinition {
    id: string;
    name: string;
    description: string;
    category: CardCategory;
    effects: CardEffect[];
    cost?: CardCost;
    upgraded?: boolean;
    upgradeBonus?: {
        damageBonus?: number;
        healBonus?: number;
        armorBonus?: number;
        costReduction?: Partial<CardCost>;
    };
}

const ATTACK_CARDS: CardDefinition[] = [
    {
        id: 'strike',
        name: 'Strike',
        description: 'Deal 10 damage.',
        category: 'attack',
        effects: [{ type: 'damage', value: 10, target: 'enemy' }]
    },
    {
        id: 'heavy-hit',
        name: 'Heavy Hit',
        description: 'Deal 20 damage. Lose 5 Stamina.',
        category: 'attack',
        effects: [{ type: 'damage', value: 20, target: 'enemy' }],
        cost: { stamina: 5 }
    },
    {
        id: 'fury',
        name: 'Fury',
        description: 'Deal 30 damage. Lose 10 Defense.',
        category: 'attack',
        effects: [{ type: 'damage', value: 30, target: 'enemy' }],
        cost: { defense: 10 }
    },
    {
        id: 'berserker',
        name: 'Berserker',
        description: 'Deal 40 damage. Lose 15 Stamina and 5 Defense.',
        category: 'attack',
        effects: [{ type: 'damage', value: 40, target: 'enemy' }],
        cost: { stamina: 15, defense: 5 }
    }
];

const DEFENSE_CARDS: CardDefinition[] = [
    {
        id: 'defend',
        name: 'Defend',
        description: 'Gain 5 Armor.',
        category: 'defense',
        effects: [{ type: 'armor', value: 5, target: 'self' }]
    },
    {
        id: 'shield-wall',
        name: 'Shield Wall',
        description: 'Gain 15 Armor. Lose 5 Stamina.',
        category: 'defense',
        effects: [{ type: 'armor', value: 15, target: 'self' }],
        cost: { stamina: 5 }
    },
    {
        id: 'fortify',
        name: 'Fortify',
        description: 'Gain 25 Armor. Lose 10 Stamina.',
        category: 'defense',
        effects: [{ type: 'armor', value: 25, target: 'self' }],
        cost: { stamina: 10 }
    },
    {
        id: 'iron-skin',
        name: 'Iron Skin',
        description: 'Gain 20 Armor. Lose 5 Mana.',
        category: 'defense',
        effects: [{ type: 'armor', value: 20, target: 'self' }],
        cost: { mana: 5 }
    }
];

const MAGIC_CARDS: CardDefinition[] = [
    {
        id: 'fireball',
        name: 'Fireball',
        description: 'Deal 15 damage. Costs 5 Mana.',
        category: 'magic',
        effects: [{ type: 'damage', value: 15, target: 'enemy' }],
        cost: { mana: 5 }
    },
    {
        id: 'heal',
        name: 'Heal',
        description: 'Restore 15 HP. Costs 8 Mana.',
        category: 'magic',
        effects: [{ type: 'heal', value: 15, target: 'self' }],
        cost: { mana: 8 }
    },
    {
        id: 'arcane-shield',
        name: 'Arcane Shield',
        description: 'Gain 10 Armor. Costs 6 Mana.',
        category: 'magic',
        effects: [{ type: 'armor', value: 10, target: 'self' }],
        cost: { mana: 6 }
    },
    {
        id: 'rejuvenate',
        name: 'Rejuvenate',
        description: 'Restore 10 Stamina. Costs 5 Mana.',
        category: 'magic',
        effects: [{ type: 'stamina', value: 10, target: 'self' }],
        cost: { mana: 5 }
    },
    {
        id: 'mana-drain',
        name: 'Mana Drain',
        description: 'Deal 8 damage. Restore 5 Mana.',
        category: 'magic',
        effects: [
            { type: 'damage', value: 8, target: 'enemy' },
            { type: 'mana', value: 5, target: 'self' }
        ]
    },
    {
        id: 'weaken',
        name: 'Weaken',
        description: 'Deal 5 damage. Enemy loses 5 Defense next turn. Costs 7 Mana.',
        category: 'magic',
        effects: [
            { type: 'damage', value: 5, target: 'enemy' },
            { type: 'debuff', value: 5, target: 'enemy' }
        ],
        cost: { mana: 7 }
    }
];

export const ALL_CARDS: CardDefinition[] = [
    ...ATTACK_CARDS,
    ...DEFENSE_CARDS,
    ...MAGIC_CARDS
];

export const STARTER_DECK_IDS: string[] = [
    'strike', 'strike', 'strike', 'strike',
    'defend', 'defend', 'defend', 'defend',
    'heavy-hit', 'fireball'
];

export function getCardById(id: string): CardDefinition | undefined {
    return ALL_CARDS.find((c) => c.id === id);
}

export function getStarterDeck(): CardDefinition[] {
    return STARTER_DECK_IDS.map((id) => getCardById(id)).filter(
        (c): c is CardDefinition => c !== undefined
    );
}
