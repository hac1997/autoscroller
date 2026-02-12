import './style.css'
import Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Preloader } from './scenes/Preloader'
import { MainMenu } from './scenes/MainMenu'
import { Game } from './scenes/Game'
import { CombatScene } from './scenes/CombatScene'
import { SelectionScene } from './scenes/SelectionScene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'app',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        CombatScene,
        SelectionScene
    ]
}

new Phaser.Game(config)
