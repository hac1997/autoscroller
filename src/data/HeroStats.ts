export interface HeroStats {
    maxHP: number;
    currentHP: number;
    maxDefense: number;
    currentDefense: number;
    maxStamina: number;
    currentStamina: number;
    maxMana: number;
    currentMana: number;
    strength: number;
    defenseMultiplier: number;
    moveSpeed: number;
}

export const DEFAULT_HERO_STATS: HeroStats = {
    maxHP: 100,
    currentHP: 100,
    maxDefense: 0,
    currentDefense: 0,
    maxStamina: 50,
    currentStamina: 50,
    maxMana: 30,
    currentMana: 30,
    strength: 1,
    defenseMultiplier: 1,
    moveSpeed: 2
};

export function createHeroStats(overrides?: Partial<HeroStats>): HeroStats {
    return { ...DEFAULT_HERO_STATS, ...overrides };
}

export function cloneHeroStats(stats: HeroStats): HeroStats {
    return { ...stats };
}
