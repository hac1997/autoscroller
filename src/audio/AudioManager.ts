import { SOUND_DEFS, type SFXEvent } from './SoundDefinitions';

export type { SFXEvent };

export class AudioManager {
  private audioCtx: AudioContext | null = null;
  private masterVolume: number = 1.0;
  private enabled: boolean = true;

  constructor() {
    // AudioContext created lazily on first playSFX() call
  }

  private ensureContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  playSFX(sound: SFXEvent): void {
    if (!this.enabled || this.masterVolume === 0) return;

    const def = SOUND_DEFS[sound];
    if (!def) return;

    const ctx = this.ensureContext();

    // Resume if suspended (autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = def.waveform;
    osc.frequency.value = def.frequency;

    const now = ctx.currentTime;
    const peakVolume = def.volume * this.masterVolume;

    // Envelope: attack ramp up, then decay ramp down
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peakVolume, now + def.attack);
    gain.gain.linearRampToValueAtTime(0, now + def.attack + def.decay);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + def.duration);
  }

  playMusic(_track: 'menu' | 'game' | 'combat' | 'boss'): void {
    // No-op for v1 -- no music tracks
  }

  stopMusic(): void {
    // No-op for v1
  }

  setSFXVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(_volume: number): void {
    // No-op for v1
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  getVolume(): number {
    return this.masterVolume;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

let audioManagerInstance: AudioManager | null = null;

export function getAudioManager(_scene?: any): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance;
}
