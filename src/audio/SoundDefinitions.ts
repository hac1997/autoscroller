export type SFXEvent = 'hit' | 'card' | 'gold' | 'click' | 'hurt' | 'death' | 'loop_complete' | 'boss_warning';

export interface ToneConfig {
  frequency: number;
  waveform: OscillatorType;
  duration: number;
  attack: number;
  decay: number;
  volume: number;
}

export const SOUND_DEFS: Record<SFXEvent, ToneConfig> = {
  hit:           { frequency: 150, waveform: 'square',   duration: 0.12, attack: 0.01, decay: 0.11, volume: 0.4 },
  card:          { frequency: 600, waveform: 'sine',     duration: 0.08, attack: 0.01, decay: 0.07, volume: 0.25 },
  gold:          { frequency: 880, waveform: 'sine',     duration: 0.15, attack: 0.01, decay: 0.14, volume: 0.3 },
  click:         { frequency: 440, waveform: 'sine',     duration: 0.05, attack: 0.005, decay: 0.045, volume: 0.15 },
  hurt:          { frequency: 200, waveform: 'sawtooth', duration: 0.2,  attack: 0.01, decay: 0.19, volume: 0.35 },
  death:         { frequency: 80,  waveform: 'sawtooth', duration: 0.8,  attack: 0.05, decay: 0.75, volume: 0.5 },
  loop_complete: { frequency: 523, waveform: 'triangle', duration: 0.3,  attack: 0.02, decay: 0.28, volume: 0.35 },
  boss_warning:  { frequency: 120, waveform: 'square',   duration: 0.5,  attack: 0.02, decay: 0.48, volume: 0.5 },
};
