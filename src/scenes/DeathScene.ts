// DeathScene -- run statistics on death.
// Shows "Run Over", cause of death, accumulated stats, material retention summary.

import { Scene } from 'phaser';
import { getRun, clearRun } from '../state/RunState';
import { loseAllRunXP } from '../systems/hero/XPSystem';
import { bankRunRewards, getStorehouseEffects } from '../systems/MetaProgressionSystem';
import { loadMetaState, saveMetaState } from '../systems/MetaPersistence';
import type { CombatStats } from '../systems/combat/CombatStats';

export class DeathScene extends Scene {
  constructor() {
    super('DeathScene');
  }

  async create(data?: { enemyName?: string; stats?: CombatStats }): Promise<void> {
    const run = getRun();
    const enemyName = data?.enemyName ?? 'Unknown';
    const stats = data?.stats;

    this.cameras.main.setBackgroundColor(0x1a1a2e);

    const fontFamily = 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif';

    // Title
    this.add.text(400, 60, 'Run Over', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ff0000',
      fontFamily,
    }).setOrigin(0.5);

    // Cause of death
    this.add.text(400, 95, `Defeated by ${enemyName}`, {
      fontSize: '16px',
      color: '#aaaaaa',
      fontFamily,
    }).setOrigin(0.5);

    // Stats panel
    this.add.rectangle(400, 270, 400, 320, 0x222222, 0.85);

    // Stats
    const startY = 145;
    const gap = 38;
    const labelX = 240;
    const valueX = 560;

    // Calculate materials retained on death (10% base, storehouse may increase)
    const materialsEarned: Record<string, number> = { ...(run.economy.materials ?? {}) };
    const xpEarned = run.hero.runXP ?? 0;
    const metaState = await loadMetaState();
    const storehouseLevel = metaState.buildings.storehouse?.level ?? 0;
    const { deathRetention } = getStorehouseEffects(storehouseLevel);
    const retentionPct = Math.round(deathRetention * 100);

    // Build per-material retention display
    const retainedLines = Object.entries(materialsEarned)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `${k}: ${Math.floor(v * deathRetention)}`)
      .join(', ') || 'None';

    const statRows: Array<{ label: string; value: string; color: string }> = [
      { label: 'Loops Completed', value: `${run.loop.count}`, color: '#ffffff' },
      { label: 'Total Damage Dealt', value: `${stats?.damageDealt ?? 0}`, color: '#ffffff' },
      { label: 'Total Cards Played', value: `${stats?.cardsPlayed ?? 0}`, color: '#ffffff' },
      { label: 'Total Combos', value: `${stats?.synergiesTriggered ?? 0}`, color: '#ff00ff' },
      { label: `Retained (${retentionPct}%)`, value: retainedLines, color: '#e040fb' },
    ];

    for (let i = 0; i < statRows.length; i++) {
      const row = statRows[i];
      const y = startY + i * gap;

      // Label
      this.add.text(labelX, y, row.label, {
        fontSize: '16px',
        color: '#aaaaaa',
        fontFamily,
      }).setOrigin(0, 0.5);

      // Value
      this.add.text(valueX, y, row.value, {
        fontSize: '24px',
        color: row.color,
        fontFamily,
      }).setOrigin(1, 0.5);
    }

    // XP warning
    this.add.text(400, startY + statRows.length * gap + 10, 'All unbanked XP has been lost.', {
      fontSize: '16px',
      color: '#ff0000',
      fontFamily,
    }).setOrigin(0.5);

    // Bank run rewards to meta state (metaState already loaded above for storehouse)
    const updatedState = bankRunRewards(
      materialsEarned,
      xpEarned,
      'death',
      {
        seed: (run as any).seed ?? 'unknown',
        loopsCompleted: run.loop.count,
        bossesDefeated: 0,
      },
      metaState
    );
    await saveMetaState(updatedState);

    // Unlock notification
    const unlockY = startY + statRows.length * gap + 45;
    const unlockNotice = this.add.text(400, unlockY, 'New unlocks available! Return to the city.', {
      fontSize: '16px',
      color: '#ffd700',
      fontFamily,
    }).setOrigin(0.5);

    // Pulse tween
    this.tweens.add({
      targets: unlockNotice,
      alpha: { from: 1, to: 0.5 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // "Return to City" button
    const cityBtn = this.add.text(400, 520, 'Return to City', {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffd700',
      fontFamily,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    cityBtn.on('pointerover', () => cityBtn.setColor('#ffffff'));
    cityBtn.on('pointerout', () => cityBtn.setColor('#ffd700'));
    cityBtn.on('pointerdown', () => {
      loseAllRunXP(run);
      clearRun();
      this.scene.stop('GameScene');
      this.scene.start('CityHub');
    });

    this.events.on('shutdown', this.cleanup, this);
  }

  private cleanup(): void {
    // No eventBus listeners
  }
}
