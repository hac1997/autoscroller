import Phaser, { Scene } from 'phaser';

export interface Card {
    id: string;
    name: string;
    value: number; // Damage or Block amount
    type: 'attack' | 'defense';
}

export class CombatScene extends Scene {
    private deck: Card[] = [];
    private enemyHP: number = 100;
    private turnTimer: Phaser.Time.TimerEvent | undefined;
    private enemy: Phaser.GameObjects.Rectangle | undefined;
    private enemyHPText: Phaser.GameObjects.Text | undefined;
    private combatLog: Phaser.GameObjects.Text | undefined;

    constructor() {
        super('CombatScene');
    }

    create(data: { enemyType: string }) {
        this.deck = this.generateStarterDeck();
        this.enemyHP = 100; // Reset HP

        // Background
        this.add.rectangle(400, 300, 600, 400, 0x222222, 0.9).setInteractive();

        // Title
        this.add.text(400, 150, `COMBAT: ${data.enemyType}`, { fontSize: '32px', fontStyle: 'bold' }).setOrigin(0.5);

        // Player (Left)
        this.add.rectangle(250, 350, 60, 60, 0x0000ff);
        this.add.text(250, 400, 'YOU', { fontSize: '20px' }).setOrigin(0.5);

        // Enemy (Right)
        this.enemy = this.add.rectangle(550, 350, 80, 80, 0xff0000);
        this.enemyHPText = this.add.text(550, 300, `${this.enemyHP} HP`, { fontSize: '24px', color: '#ffaaaa' }).setOrigin(0.5);

        // Combat Log
        this.combatLog = this.add.text(400, 450, 'Battle Started...', { fontSize: '18px', color: '#ffffaa' }).setOrigin(0.5);

        // Start Loop
        this.turnTimer = this.time.addEvent({
            delay: 1500,
            callback: this.processNextCard,
            callbackScope: this,
            loop: true
        });
    }

    private generateStarterDeck(): Card[] {
        return [
            { id: '1', name: 'Strike', value: 10, type: 'attack' },
            { id: '2', name: 'Defend', value: 5, type: 'defense' },
            { id: '3', name: 'Heavy Hit', value: 20, type: 'attack' }
        ];
    }

    private processNextCard() {
        if (this.deck.length === 0) return;

        const card = this.deck.shift(); // Take from top
        if (!card) return;

        // Visual Feedback
        this.tweens.add({
            targets: this.enemy,
            x: this.enemy!.x + 10,
            duration: 50,
            yoyo: true,
            repeat: 1
        });

        // Apply Effect
        if (card.type === 'attack') {
            this.enemyHP -= card.value;
            if (this.enemyHP < 0) this.enemyHP = 0;

            this.combatLog?.setText(`Used ${card.name}!\nDealt ${card.value} damage.`);
            this.enemyHPText?.setText(`${this.enemyHP} HP`);
        } else if (card.type === 'defense') {
            this.combatLog?.setText(`Used ${card.name}!\nBlocked incoming damage.`);
        }

        // Return to bottom
        this.deck.push(card);

        // Check Win
        if (this.enemyHP <= 0) {
            this.time.delayedCall(500, () => this.endCombat(true));
        }
    }

    private endCombat(_victory: boolean) {
        if (this.turnTimer) this.turnTimer.destroy();
        this.scene.stop();
        this.scene.resume('Game');
    }
}
