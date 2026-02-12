import Phaser, { Scene } from 'phaser';

export class Player extends Phaser.GameObjects.Container {
    private sprite: Phaser.GameObjects.Rectangle;
    private moveSpeed: number = 2; // Pixels per frame


    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);

        // Player visual representation (red square)
        this.sprite = scene.add.rectangle(0, 0, 40, 40, 0xff0000);
        this.add(this.sprite);

        // Ensure physics body is added if needed later
        scene.physics.add.existing(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setAllowGravity(false);
    }

    update(_time: number, _delta: number) {
        // Move to the right
        this.x += this.moveSpeed;

        // Simple loop reset logic (for testing)
        if (this.x > 1600) { // Extended range
            // this.x = 0; // Disable reset for now, let camera follow
        }
    }
}
