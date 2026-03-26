// Consecutive pair synergy detection from JSON data.
// Zero Phaser imports.

import synergiesData from '../../data/json/synergies.json';
import type { SynergyDefinition } from '../../data/types';

export class SynergySystem {
  private synergies: Map<string, SynergyDefinition>;

  constructor() {
    this.synergies = new Map();
    for (const s of synergiesData as SynergyDefinition[]) {
      const key = `${s.cardA}|${s.cardB}`;
      this.synergies.set(key, s);
    }
  }

  /**
   * Check if playing currentCardId after lastPlayedCardId triggers a synergy.
   * Returns the synergy definition if triggered, null otherwise.
   * Order matters: cardA must be last played, cardB must be current.
   */
  check(
    lastPlayedCardId: string | null,
    currentCardId: string,
    heroClass: string,
  ): SynergyDefinition | null {
    if (lastPlayedCardId === null) return null;

    const key = `${lastPlayedCardId}|${currentCardId}`;
    const synergy = this.synergies.get(key);
    if (!synergy) return null;

    // Check class restriction
    if (synergy.classRestriction && synergy.classRestriction !== heroClass) {
      return null;
    }

    return synergy;
  }
}
