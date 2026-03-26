// Transient combat state -- created at combat start, discarded at end.
// Zero Phaser imports. Fully mutable during combat tick loop.

import type { RunState } from '../../state/RunState';
import type { EnemyDefinition } from '../../data/types';

export interface CombatState {
  heroHP: number;
  heroMaxHP: number;
  heroStamina: number;
  heroMaxStamina: number;
  heroMana: number;
  heroMaxMana: number;
  heroDefense: number;
  heroStrength: number;
  heroDefenseMultiplier: number;
  heroClass: string;

  deckOrder: string[];

  enemyId: string;
  enemyName: string;
  enemyHP: number;
  enemyMaxHP: number;
  enemyDefense: number;
  enemyDamage: number;
  enemyAttackCooldown: number;
  enemyPattern: string;
  enemySpecialEffect: string | null;

  /** Passives applied from relics, etc. -- typed properly in Plan 02 */
  activePassives: unknown[];

  /** Flag set by EnemyAI stun effect -- skips next hero card */
  heroStunned: boolean;
}

/**
 * Create a fresh CombatState from RunState and enemy definition.
 * HP persists from run. Stamina/mana reset to max. Defense resets to 0.
 */
export function createCombatState(run: RunState, enemy: EnemyDefinition): CombatState {
  return {
    heroHP: run.hero.currentHP,
    heroMaxHP: run.hero.maxHP,
    heroStamina: run.hero.maxStamina,   // reset to max (CMBT-10)
    heroMaxStamina: run.hero.maxStamina,
    heroMana: run.hero.maxMana,         // reset to max (CMBT-10)
    heroMaxMana: run.hero.maxMana,
    heroDefense: 0,                      // reset to 0
    heroStrength: run.hero.strength,
    heroDefenseMultiplier: run.hero.defenseMultiplier,
    heroClass: 'warrior',                // default class; extended in later plans

    deckOrder: [...run.deck.active],

    enemyId: enemy.id,
    enemyName: enemy.name,
    enemyHP: enemy.baseHP,
    enemyMaxHP: enemy.baseHP,
    enemyDefense: enemy.baseDefense,
    enemyDamage: enemy.attack.damage,
    enemyAttackCooldown: enemy.attackCooldown ?? 2000,
    enemyPattern: enemy.attack.pattern,
    enemySpecialEffect: enemy.attack.specialEffect ?? null,

    activePassives: [],
    heroStunned: false,
  };
}
