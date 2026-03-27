import { Scene } from 'phaser';

export class CombatEffects {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    screenShake(intensity: number = 5, duration: number = 200): void {
        this.scene.cameras.main.shake(duration, intensity / 1000);
    }

    flashRed(target: Phaser.GameObjects.GameObject, duration: number = 100): void {
        if (target instanceof Phaser.GameObjects.Rectangle) {
            const originalColor = target.fillColor;
            target.setFillStyle(0xff0000);
            this.scene.time.delayedCall(duration, () => {
                target.setFillStyle(originalColor);
            });
        }
    }

    floatingNumber(
        x: number,
        y: number,
        value: number,
        color: string = '#ffffff',
        prefix: string = ''
    ): void {
        const text = this.scene.add.text(x, y, `${prefix}${value}`, {
            fontSize: '24px',
            fontStyle: 'bold',
            color
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: y - 60,
            alpha: 0,
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => text.destroy()
        });
    }

    cardPlayAnimation(
        startX: number,
        startY: number,
        targetX: number,
        targetY: number,
        cardName: string,
        callback?: () => void
    ): void {
        const card = this.scene.add.rectangle(startX, startY, 80, 100, 0x3d3d5c);
        card.setStrokeStyle(2, 0xffffff);
        const text = this.scene.add.text(startX, startY, cardName, {
            fontSize: '12px',
            color: '#ffffff',
            wordWrap: { width: 70 }
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: [card, text],
            x: targetX,
            y: targetY,
            scale: 1.5,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: [card, text],
                    alpha: 0,
                    scale: 0,
                    duration: 200,
                    onComplete: () => {
                        card.destroy();
                        text.destroy();
                        if (callback) callback();
                    }
                });
            }
        });
    }

    damageParticles(x: number, y: number, count: number = 10): void {
        for (let i = 0; i < count; i++) {
            const particle = this.scene.add.circle(
                x,
                y,
                Math.random() * 4 + 2,
                0xff0000
            );

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 100 + 50;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            this.scene.tweens.add({
                targets: particle,
                x: x + vx,
                y: y + vy,
                alpha: 0,
                duration: 500,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    healParticles(x: number, y: number, count: number = 10): void {
        for (let i = 0; i < count; i++) {
            const particle = this.scene.add.circle(
                x,
                y + Math.random() * 20,
                Math.random() * 3 + 2,
                0x00ff00
            );

            this.scene.tweens.add({
                targets: particle,
                y: y - 60,
                alpha: 0,
                duration: 800,
                delay: i * 50,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    armorGainEffect(x: number, y: number): void {
        const shield = this.scene.add.circle(x, y, 30, 0x4169e1, 0.5);
        shield.setStrokeStyle(3, 0x87ceeb);

        this.scene.tweens.add({
            targets: shield,
            scale: 1.5,
            alpha: 0,
            duration: 500,
            ease: 'Cubic.easeOut',
            onComplete: () => shield.destroy()
        });
    }

    pulseEffect(target: Phaser.GameObjects.GameObject, scale: number = 1.2, duration: number = 300): void {
        this.scene.tweens.add({
            targets: target,
            scaleX: scale,
            scaleY: scale,
            duration: duration / 2,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }
}

export function createCombatEffects(scene: Scene): CombatEffects {
    return new CombatEffects(scene);
}
