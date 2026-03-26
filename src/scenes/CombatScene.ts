import { Scene } from 'phaser';
import { eventBus, type GameEvents } from '../core/EventBus';
import { getRun } from '../state/RunState';

/**
 * CombatScene -- thin wrapper rendering shell.
 * Actual combat engine logic is Phase 2. This scene provides:
 * - State bookkeeping (isInCombat flag)
 * - HP/stats display from RunState
 * - Card queue display from RunState
 * - Cleanup on shutdown
 */
export class CombatScene extends Scene {
  private onCombatEnd!: (data: GameEvents['combat:end']) => void;

  constructor() {
    super('CombatScene');
  }

  create(): void {
    const run = getRun();
    run.isInCombat = true;

    // Overlay panel background
    this.add.rectangle(400, 300, 600, 400, 0x222222, 0.9).setInteractive();

    // Title
    this.add.text(400, 130, 'COMBAT', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Hero stats display
    this.add.text(200, 200, 'HERO', {
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(200, 240,
      `HP: ${run.hero.currentHP}/${run.hero.maxHP}\n` +
      `Def: ${run.hero.currentDefense}\n` +
      `Sta: ${run.hero.currentStamina}/${run.hero.maxStamina}\n` +
      `Mana: ${run.hero.currentMana}/${run.hero.maxMana}`, {
      fontSize: '14px',
      color: '#ffffff',
      lineSpacing: 4,
    }).setOrigin(0.5);

    // Card queue display (placeholder -- Phase 2 implements full combat)
    const cardCount = run.deck.active.length;
    this.add.text(400, 400, `Cards in deck: ${cardCount}`, {
      fontSize: '14px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // Placeholder: combat engine will be added in Phase 2
    this.add.text(400, 450, 'Combat engine: Phase 2', {
      fontSize: '14px',
      color: '#888888',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Listen for combat end (Phase 2 will emit this)
    this.onCombatEnd = (_data) => {
      const run = getRun();
      run.isInCombat = false;
    };
    eventBus.on('combat:end', this.onCombatEnd);

    // Register cleanup
    this.events.on('shutdown', this.cleanup, this);
  }

  private cleanup(): void {
    eventBus.off('combat:end', this.onCombatEnd);
    // Ensure isInCombat is reset if scene shuts down unexpectedly
    try {
      const run = getRun();
      run.isInCombat = false;
    } catch {
      // No active run -- nothing to clean
    }
  }
}
