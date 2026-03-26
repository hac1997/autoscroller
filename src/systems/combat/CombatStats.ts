// Combat statistics accumulator -- tracks all metrics during a single combat.
// Zero Phaser imports.

export interface CombatStats {
  damageDealt: number;
  damageReceived: number;
  cardsPlayed: number;
  synergiesTriggered: number;
  reshuffles: number;
  cardsSkipped: number;
  enemyId: string;
  enemyName: string;
  result: 'victory' | 'defeat' | 'ongoing';
}

export function createEmptyCombatStats(enemyId: string, enemyName: string): CombatStats {
  return {
    damageDealt: 0,
    damageReceived: 0,
    cardsPlayed: 0,
    synergiesTriggered: 0,
    reshuffles: 0,
    cardsSkipped: 0,
    enemyId,
    enemyName,
    result: 'ongoing',
  };
}
