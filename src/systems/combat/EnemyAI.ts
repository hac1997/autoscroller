// Enemy attack logic with independent cooldown.
// Zero Phaser imports.

import { eventBus } from '../../core/EventBus';
import type { CombatState } from './CombatState';
import type { CombatStats } from './CombatStats';

export class EnemyAI {
  private cooldownTimer: number;

  constructor(state: CombatState) {
    this.cooldownTimer = state.enemyAttackCooldown;
  }

  tick(deltaMs: number, state: CombatState, stats: CombatStats): void {
    this.cooldownTimer -= deltaMs;

    if (this.cooldownTimer <= 0) {
      this.attack(state, stats);
      this.cooldownTimer += state.enemyAttackCooldown;
    }
  }

  private attack(state: CombatState, stats: CombatStats): void {
    let damage = this.calculateDamage(state, stats);
    let specialEffect: string | null = null;

    // Apply special effects
    if (state.enemySpecialEffect) {
      specialEffect = state.enemySpecialEffect;

      switch (state.enemySpecialEffect) {
        case 'double': {
          // 30% chance to double damage
          if (Math.random() < 0.3) {
            damage *= 2;
          }
          break;
        }
        case 'stun': {
          state.heroStunned = true;
          break;
        }
        // debuff and lifesteal applied after damage
      }
    }

    // Apply damage considering hero defense
    const actualDamage = this.applyDamage(damage, state);
    stats.damageReceived += actualDamage;

    // Post-damage special effects
    if (state.enemySpecialEffect === 'debuff') {
      state.heroDefense = Math.max(0, state.heroDefense - 3);
    }

    if (state.enemySpecialEffect === 'lifesteal') {
      const healAmount = Math.floor(actualDamage * 0.5);
      state.enemyHP = Math.min(state.enemyMaxHP, state.enemyHP + healAmount);
    }

    eventBus.emit('combat:enemy-attack', { damage: actualDamage, specialEffect });
  }

  private calculateDamage(state: CombatState, stats: CombatStats): number {
    switch (state.enemyPattern) {
      case 'fixed':
        return state.enemyDamage;
      case 'random':
        return state.enemyDamage * (0.8 + Math.random() * 0.4);
      case 'scaling':
        return state.enemyDamage + Math.floor(stats.cardsPlayed * 0.5);
      case 'conditional':
        if (state.heroHP < state.heroMaxHP * 0.5) {
          return state.enemyDamage * 1.5;
        }
        return state.enemyDamage;
      default:
        return state.enemyDamage;
    }
  }

  /**
   * Apply raw damage to hero, accounting for defense.
   * Defense absorbs damage first, then remaining hits HP.
   * Returns actual HP damage dealt.
   */
  private applyDamage(rawDamage: number, state: CombatState): number {
    const damage = Math.floor(rawDamage);

    if (state.heroDefense >= damage) {
      state.heroDefense -= damage;
      return 0;
    }

    const remaining = damage - state.heroDefense;
    state.heroDefense = 0;
    state.heroHP -= remaining;
    return remaining;
  }
}
