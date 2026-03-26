// Card effect application with cost payment and targeting.
// Zero Phaser imports.

import type { CardDefinition, SynergyDefinition } from '../../data/types';
import type { CombatState } from './CombatState';

export interface ResolveResult {
  totalDamage: number;
  healed: number;
  armorGained: number;
}

export class CardResolver {
  /**
   * Check if the hero can afford to play a card given current state.
   */
  canAfford(card: CardDefinition, state: CombatState): boolean {
    if (!card.cost) return true;
    if (card.cost.stamina !== undefined && state.heroStamina < card.cost.stamina) return false;
    if (card.cost.mana !== undefined && state.heroMana < card.cost.mana) return false;
    if (card.cost.defense !== undefined && state.heroDefense < card.cost.defense) return false;
    return true;
  }

  /**
   * Resolve a card: pay costs, apply effects, apply synergy bonus.
   * Mutates state in-place. Returns summary of what happened.
   */
  resolve(
    card: CardDefinition,
    state: CombatState,
    synergyBonus: SynergyDefinition | null,
  ): ResolveResult {
    const result: ResolveResult = { totalDamage: 0, healed: 0, armorGained: 0 };

    // Pay costs (unless synergy provides cost_waive)
    const waiveCost = synergyBonus?.bonus.type === 'cost_waive';
    if (card.cost && !waiveCost) {
      if (card.cost.stamina) state.heroStamina -= card.cost.stamina;
      if (card.cost.mana) state.heroMana -= card.cost.mana;
      if (card.cost.defense) state.heroDefense -= card.cost.defense;
    }

    // Apply each card effect
    for (const effect of card.effects) {
      this.applyEffect(effect.type, effect.value, effect.target, state, result);
    }

    // Apply synergy bonus effect (if not cost_waive)
    if (synergyBonus && synergyBonus.bonus.type !== 'cost_waive') {
      this.applyEffect(
        synergyBonus.bonus.type as 'damage' | 'heal' | 'armor' | 'stamina' | 'mana' | 'debuff',
        synergyBonus.bonus.value,
        synergyBonus.bonus.target as 'enemy' | 'self',
        state,
        result,
      );
    }

    return result;
  }

  private applyEffect(
    type: string,
    value: number,
    target: string,
    state: CombatState,
    result: ResolveResult,
  ): void {
    switch (type) {
      case 'damage': {
        const raw = Math.max(0, (value * state.heroStrength) - state.enemyDefense);
        state.enemyHP -= raw;
        result.totalDamage += raw;
        break;
      }
      case 'heal': {
        const before = state.heroHP;
        state.heroHP = Math.min(state.heroMaxHP, state.heroHP + value);
        result.healed += state.heroHP - before;
        break;
      }
      case 'armor': {
        state.heroDefense += value;
        result.armorGained += value;
        break;
      }
      case 'stamina': {
        state.heroStamina = Math.min(state.heroMaxStamina, state.heroStamina + value);
        break;
      }
      case 'mana': {
        state.heroMana = Math.min(state.heroMaxMana, state.heroMana + value);
        break;
      }
      case 'debuff': {
        state.enemyDefense = Math.max(0, state.enemyDefense - value);
        break;
      }
    }
  }
}
