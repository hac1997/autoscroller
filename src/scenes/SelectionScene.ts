import { Scene } from 'phaser';
import { HeirGenerator, HeirCandidate } from '../objects/HeirGenerator';

export class SelectionScene extends Scene {
    constructor() {
        super('SelectionScene');
    }

    create(data: { generation: number }) {
        const generation = data.generation || 1;
        const candidates = HeirGenerator.generateCandidates(3, generation);

        this.add.text(400, 50, 'Select Your Heir', { fontSize: '32px' }).setOrigin(0.5);

        // Display 3 Options
        candidates.forEach((heir, index) => {
            const x = 200 + (index * 200);
            const y = 300;

            const bg = this.add.rectangle(x, y, 180, 400, 0x444444).setInteractive();
            this.add.text(x, y - 150, heir.name, { fontSize: '20px' }).setOrigin(0.5);
            this.add.text(x, y - 50, heir.traits[0].name, { fontSize: '18px', color: '#ffff00' }).setOrigin(0.5);
            this.add.text(x, y + 20, heir.traits[0].description, { fontSize: '14px', align: 'center', wordWrap: { width: 160 } }).setOrigin(0.5);

            bg.on('pointerdown', () => {
                this.selectHeir(heir);
            });
        });
    }

    private selectHeir(heir: HeirCandidate) {
        // Pass selected heir data to Game scene
        this.scene.start('Game', { heir: heir });
    }
}
