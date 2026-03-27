export interface DifficultyConfig {
    baseEnemyHPMultiplier: number;
    baseDamageMultiplier: number;
    generationScaling: number;
    goldDropMultiplier: number;
    cardDropRate: number;
    relicDropRate: number;
    eliteChance: number;
    eventChance: number;
    shopCost: {
        cardBase: number;
        removeCard: number;
        upgrade: number;
    };
}

export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
    normal: {
        baseEnemyHPMultiplier: 1.0,
        baseDamageMultiplier: 1.0,
        generationScaling: 0.3,
        goldDropMultiplier: 1.0,
        cardDropRate: 1.0,
        relicDropRate: 0.15,
        eliteChance: 0.2,
        eventChance: 0.25,
        shopCost: {
            cardBase: 60,
            removeCard: 75,
            upgrade: 100
        }
    },
    hard: {
        baseEnemyHPMultiplier: 1.3,
        baseDamageMultiplier: 1.2,
        generationScaling: 0.4,
        goldDropMultiplier: 0.8,
        cardDropRate: 0.85,
        relicDropRate: 0.12,
        eliteChance: 0.3,
        eventChance: 0.2,
        shopCost: {
            cardBase: 80,
            removeCard: 100,
            upgrade: 150
        }
    }
};

let currentDifficulty: DifficultyConfig = DIFFICULTY_CONFIGS.normal;

export function getDifficultyConfig(): DifficultyConfig {
    return currentDifficulty;
}

export function setDifficulty(difficulty: 'normal' | 'hard'): void {
    currentDifficulty = DIFFICULTY_CONFIGS[difficulty];
}
