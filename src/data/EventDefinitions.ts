export type EventChoiceEffect = 'gain_hp' | 'lose_hp' | 'gain_gold' | 'lose_gold' | 'add_card' | 'remove_card' | 'gain_relic' | 'add_curse';

export interface EventChoice {
    text: string;
    effects: Array<{
        type: EventChoiceEffect;
        value?: number | string;
    }>;
    requirement?: {
        minGold?: number;
        minHP?: number;
    };
}

export interface EventDefinition {
    id: string;
    title: string;
    description: string;
    choices: EventChoice[];
}

const EVENTS: EventDefinition[] = [
    {
        id: 'mysterious_merchant',
        title: 'Mysterious Merchant',
        description: 'A hooded figure offers you a strange deal...',
        choices: [
            {
                text: 'Trade 30 Gold for a random rare card',
                effects: [
                    { type: 'lose_gold', value: 30 },
                    { type: 'add_card', value: 'random_rare' }
                ],
                requirement: { minGold: 30 }
            },
            {
                text: 'Trade random card for 50 Gold',
                effects: [
                    { type: 'remove_card', value: 'random' },
                    { type: 'gain_gold', value: 50 }
                ]
            },
            {
                text: 'Walk away',
                effects: []
            }
        ]
    },
    {
        id: 'cursed_chest',
        title: 'Cursed Chest',
        description: 'A glowing chest radiates dark energy. Open it?',
        choices: [
            {
                text: 'Open it (Gain relic + curse)',
                effects: [
                    { type: 'gain_relic', value: 'random' },
                    { type: 'add_curse', value: 'pain' }
                ]
            },
            {
                text: 'Leave it alone',
                effects: []
            }
        ]
    },
    {
        id: 'healing_fountain',
        title: 'Healing Fountain',
        description: 'A magical fountain offers healing, but at what cost?',
        choices: [
            {
                text: 'Drink deeply (Heal 40 HP, lose 10 Max Stamina)',
                effects: [
                    { type: 'gain_hp', value: 40 },
                    { type: 'lose_hp', value: -10 }
                ]
            },
            {
                text: 'Sip carefully (Heal 20 HP)',
                effects: [
                    { type: 'gain_hp', value: 20 }
                ]
            },
            {
                text: 'Ignore it',
                effects: []
            }
        ]
    },
    {
        id: 'ancient_shrine',
        title: 'Ancient Shrine',
        description: 'An old shrine glows with power. Make an offering?',
        choices: [
            {
                text: 'Offer 20 HP for a powerful relic',
                effects: [
                    { type: 'lose_hp', value: 20 },
                    { type: 'gain_relic', value: 'rare' }
                ],
                requirement: { minHP: 21 }
            },
            {
                text: 'Pray for guidance (+30 Gold)',
                effects: [
                    { type: 'gain_gold', value: 30 }
                ]
            },
            {
                text: 'Leave',
                effects: []
            }
        ]
    },
    {
        id: 'traveling_salesman',
        title: 'Traveling Salesman',
        description: 'A friendly merchant with questionable goods.',
        choices: [
            {
                text: 'Buy healing potion (40 Gold, Heal 30 HP)',
                effects: [
                    { type: 'lose_gold', value: 40 },
                    { type: 'gain_hp', value: 30 }
                ],
                requirement: { minGold: 40 }
            },
            {
                text: 'Sell a card for 40 Gold',
                effects: [
                    { type: 'remove_card', value: 'choose' },
                    { type: 'gain_gold', value: 40 }
                ]
            },
            {
                text: 'Move on',
                effects: []
            }
        ]
    }
];

export function getRandomEvent(): EventDefinition {
    return EVENTS[Math.floor(Math.random() * EVENTS.length)];
}

export function getAllEvents(): EventDefinition[] {
    return [...EVENTS];
}
