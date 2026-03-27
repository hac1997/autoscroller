import { Scene } from 'phaser';

export class AudioManager {
    private sfxVolume: number = 1.0;
    private musicVolume: number = 1.0;
    private enabled: boolean = true;

    constructor(_scene: Scene) {
        // Scene stored for future audio loading
    }

    playSFX(sound: 'hit' | 'card' | 'gold' | 'click' | 'hurt'): void {
        if (!this.enabled || this.sfxVolume === 0) return;
        
        // Placeholder: In the future, load actual sound files
        // For now, we could use Phaser's built-in beep/tone generator
        // or just log the sound events
        console.log(`[SFX] ${sound} at volume ${this.sfxVolume}`);
    }

    playMusic(track: 'menu' | 'game' | 'combat' | 'boss'): void {
        if (!this.enabled || this.musicVolume === 0) return;
        
        console.log(`[Music] Playing ${track} at volume ${this.musicVolume}`);
    }

    stopMusic(): void {
        console.log('[Music] Stopped');
    }

    setSFXVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    setMusicVolume(volume: number): void {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
        if (!enabled) {
            this.stopMusic();
        }
    }
}

let audioManagerInstance: AudioManager | null = null;

export function getAudioManager(scene?: Scene): AudioManager {
    if (!audioManagerInstance && scene) {
        audioManagerInstance = new AudioManager(scene);
    }
    return audioManagerInstance!;
}
