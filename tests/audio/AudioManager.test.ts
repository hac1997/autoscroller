import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SOUND_DEFS } from '../../src/audio/SoundDefinitions';

// Mock AudioContext before importing AudioManager
function createMockAudioContext() {
  const mockOscillator = {
    type: '' as OscillatorType,
    frequency: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };

  const mockGainNode = {
    gain: {
      value: 0,
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  };

  const ctx = {
    createOscillator: vi.fn(() => {
      const osc = {
        type: '' as OscillatorType,
        frequency: { value: 0 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      (ctx as any)._lastOsc = osc;
      return osc;
    }),
    createGain: vi.fn(() => {
      const g = {
        gain: {
          value: 0,
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      };
      (ctx as any)._lastGain = g;
      return g;
    }),
    destination: {},
    currentTime: 0,
    state: 'running' as AudioContextState,
    resume: vi.fn(),
    _lastOsc: mockOscillator,
    _lastGain: mockGainNode,
  };

  return ctx;
}

let mockCtx: ReturnType<typeof createMockAudioContext>;

// Use a real class so `new AudioContext()` works
class MockAudioContext {
  createOscillator: any;
  createGain: any;
  destination: any;
  currentTime: number;
  state: AudioContextState;
  resume: any;
  constructor() {
    mockCtx = createMockAudioContext();
    this.createOscillator = mockCtx.createOscillator;
    this.createGain = mockCtx.createGain;
    this.destination = mockCtx.destination;
    this.currentTime = mockCtx.currentTime;
    this.state = mockCtx.state;
    this.resume = mockCtx.resume;
  }
}

vi.stubGlobal('AudioContext', MockAudioContext);

// Dynamic import to ensure mock is in place
const { AudioManager } = await import('../../src/audio/AudioManager');

describe('AudioManager', () => {
  let audio: InstanceType<typeof AudioManager>;

  beforeEach(() => {
    vi.clearAllMocks();
    audio = new AudioManager();
  });

  it('playSFX("hit") creates oscillator with frequency 150 and waveform square', () => {
    audio.playSFX('hit');
    const osc = mockCtx._lastOsc;
    expect(osc.type).toBe('square');
    expect(osc.frequency.value).toBe(150);
  });

  it('playSFX("gold") creates oscillator with frequency 880', () => {
    audio.playSFX('gold');
    const osc = mockCtx._lastOsc;
    expect(osc.frequency.value).toBe(880);
  });

  it('setEnabled(false) then playSFX("hit") does NOT create oscillator', () => {
    audio.setEnabled(false);
    audio.playSFX('hit');
    // Since enabled=false returns early, createOscillator should not be called
    // mockCtx may not even exist if AudioContext was never constructed
    // The key check: no oscillator was created
    expect(mockCtx.createOscillator).not.toHaveBeenCalled();
  });

  it('setSFXVolume(0.5) then playSFX("hit") -- gain peak is volume * masterVolume = 0.2', () => {
    audio.setSFXVolume(0.5);
    audio.playSFX('hit');
    const g = mockCtx._lastGain;
    // Peak volume: SOUND_DEFS.hit.volume (0.4) * 0.5 = 0.2
    const calls = g.gain.linearRampToValueAtTime.mock.calls;
    // First ramp call is the attack peak
    expect(calls[0][0]).toBeCloseTo(0.2);
  });

  it('resumes suspended AudioContext on playSFX', () => {
    // Override the MockAudioContext to return suspended state
    const OrigMock = MockAudioContext;
    class SuspendedMockAudioContext extends OrigMock {
      constructor() {
        super();
        this.state = 'suspended' as AudioContextState;
      }
    }
    vi.stubGlobal('AudioContext', SuspendedMockAudioContext);

    const audio2 = new AudioManager();
    audio2.playSFX('hit');
    expect(mockCtx.resume).toHaveBeenCalled();

    // Restore
    vi.stubGlobal('AudioContext', MockAudioContext);
  });

  it('getVolume returns current master volume', () => {
    expect(audio.getVolume()).toBe(1.0);
    audio.setSFXVolume(0.7);
    expect(audio.getVolume()).toBe(0.7);
  });

  it('isEnabled returns current enabled state', () => {
    expect(audio.isEnabled()).toBe(true);
    audio.setEnabled(false);
    expect(audio.isEnabled()).toBe(false);
  });
});

describe('SOUND_DEFS', () => {
  it('has all 8 SFX event keys', () => {
    const expectedKeys = ['hit', 'card', 'gold', 'click', 'hurt', 'death', 'loop_complete', 'boss_warning'];
    expect(Object.keys(SOUND_DEFS)).toEqual(expect.arrayContaining(expectedKeys));
    expect(Object.keys(SOUND_DEFS)).toHaveLength(8);
  });
});
