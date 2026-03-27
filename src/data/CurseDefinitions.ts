export interface CurseDefinition {
    id: string;
    name: string;
    description: string;
    effects: Array<{
        type: 'nothing' | 'damage_self' | 'reduce_damage' | 'increase_damage_taken';
        value?: number;
    }>;
    color: number;
}

const CURSES: Record<string, CurseDefinition> = {
    pain: {
        id: 'pain',
        name: 'Pain',
        description: 'Does nothing. Clogs your deck.',
        effects: [{ type: 'nothing' }],
        color: 0x4a4a4a
    },
    wound: {
        id: 'wound',
        name: 'Wound',
        description: 'When played, lose 2 HP.',
        effects: [{ type: 'damage_self', value: 2 }],
        color: 0x8b0000
    },
    weakness: {
        id: 'weakness',
        name: 'Weakness',
        description: 'This turn: All cards deal -2 damage.',
        effects: [{ type: 'reduce_damage', value: 2 }],
        color: 0x6a5acd
    },
    fragility: {
        id: 'fragility',
        name: 'Fragility',
        description: 'This turn: Take +50% damage.',
        effects: [{ type: 'increase_damage_taken', value: 50 }],
        color: 0x8fbc8f
    }
};

export function getCurseDefinition(id: string): CurseDefinition | undefined {
    return CURSES[id];
}

export function getRandomCurse(): CurseDefinition {
    const curses = Object.values(CURSES);
    return curses[Math.floor(Math.random() * curses.length)];
}

export const ALL_CURSES = Object.values(CURSES);
