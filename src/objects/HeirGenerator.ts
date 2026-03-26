export interface HeirTrait {
    name: string;
    description: string;
    effect: (stats: any) => void;
}

export interface HeirCandidate {
    name: string;
    generation: number;
    traits: HeirTrait[];
    deck: any[]; // Inheritance logic needed later
}

export class HeirGenerator {
    private static traitsList: HeirTrait[] = [
        { name: 'Giant', description: '+50% HP, -20% Speed', effect: (s) => { s.maxHP *= 1.5; s.moveSpeed *= 0.8; } },
        { name: 'Glass Cannon', description: '+100% Strength, -50% HP', effect: (s) => { s.strength *= 2; s.maxHP *= 0.5; s.currentHP = Math.min(s.currentHP, s.maxHP); } },
        { name: 'Sprinter', description: '+50% Speed', effect: (s) => { s.moveSpeed *= 1.5; } },
        { name: 'Tank', description: '+50% Armor gained', effect: (s) => { s.defenseMultiplier *= 1.5; } }
    ];

    public static generateCandidates(count: number, generation: number): HeirCandidate[] {
        const candidates: HeirCandidate[] = [];
        for (let i = 0; i < count; i++) {
            const trait = this.traitsList[Math.floor(Math.random() * this.traitsList.length)];
            candidates.push({
                name: `Heir ${generation}-${i + 1}`,
                generation: generation,
                traits: [trait],
                deck: [] // Implement deck copying logic
            });
        }
        return candidates;
    }
}
