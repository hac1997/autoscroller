import { Scene } from 'phaser';
import { getGold } from '../data/Currency';
import type { HeroStats } from '../data/HeroStats';

export class HUDManager {
    private scene: Scene;
    private container: Phaser.GameObjects.Container;
    private goldText!: Phaser.GameObjects.Text;
    private loopText!: Phaser.GameObjects.Text;
    private hpBar!: Phaser.GameObjects.Rectangle;
    private hpText!: Phaser.GameObjects.Text;

    constructor(scene: Scene) {
        this.scene = scene;
        this.container = scene.add.container(0, 0).setScrollFactor(0).setDepth(100);
        this.create();
    }

    private create(): void {
        // Background panel
        const bg = this.scene.add.rectangle(10, 10, 200, 80, 0x000000, 0.5);
        bg.setOrigin(0, 0);
        this.container.add(bg);

        // Gold
        const goldIcon = this.scene.add.text(20, 20, '◆', { fontSize: '20px', color: '#ffd700' });
        this.goldText = this.scene.add.text(45, 20, `${getGold()}`, { fontSize: '18px', color: '#ffd700' });
        this.container.add([goldIcon, this.goldText]);

        // Loop counter
        this.loopText = this.scene.add.text(20, 45, 'Loop: 0/100', { fontSize: '16px', color: '#ffffff' });
        this.container.add(this.loopText);

        // HP bar will be added dynamically
        this.hpBar = this.scene.add.rectangle(20, 75, 0, 10, 0xff0000);
        this.hpBar.setOrigin(0, 0);
        this.hpText = this.scene.add.text(120, 71, '100/100', { fontSize: '14px', color: '#ffffff' });
        this.container.add([this.hpBar, this.hpText]);
    }

    public update(heroStats: HeroStats, currentLoop: number): void {
        this.goldText.setText(`${getGold()}`);
        this.loopText.setText(`Loop: ${currentLoop}/100`);
        
        const hpPercent = heroStats.currentHP / heroStats.maxHP;
        this.hpBar.width = 160 * hpPercent;
        this.hpBar.setFillStyle(hpPercent > 0.5 ? 0x00ff00 : hpPercent > 0.25 ? 0xffaa00 : 0xff0000);
        this.hpText.setText(`${heroStats.currentHP}/${heroStats.maxHP}`);
    }

    public destroy(): void {
        this.container.destroy();
    }
}
