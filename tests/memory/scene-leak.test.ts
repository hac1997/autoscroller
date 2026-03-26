import { describe, it, expect, beforeEach } from 'vitest';
import { eventBus } from '../../src/core/EventBus';
import type { GameEvents } from '../../src/core/EventBus';

describe('Memory Leak Detection -- Scene Restart Cycles', () => {
  beforeEach(() => {
    eventBus.removeAllListeners();
  });

  it('50 CombatScene-like cycles: zero listeners after all cycles', () => {
    const events: (keyof GameEvents)[] = [
      'combat:start',
      'combat:end',
      'hero:damaged',
      'gold:changed',
      'loop:completed',
    ];

    for (let cycle = 0; cycle < 50; cycle++) {
      // Simulate scene create: subscribe to 5 events
      const handlers = events.map((evt) => {
        const handler = () => {};
        eventBus.on(evt, handler);
        return { evt, handler };
      });

      // Simulate scene shutdown: unsubscribe all
      for (const { evt, handler } of handlers) {
        eventBus.off(evt, handler);
      }
    }

    // After 50 cycles, all listener counts must be zero
    for (const evt of events) {
      expect(eventBus.listenerCount(evt)).toBe(0);
    }
  });

  it('50 cycles with mixed event types: total listener count is zero', () => {
    const allEvents: (keyof GameEvents)[] = [
      'combat:start',
      'combat:end',
      'combat:card-played',
      'combat:damage-dealt',
      'hero:damaged',
      'hero:healed',
      'hero:died',
      'gold:changed',
      'tile-points:changed',
      'deck:card-added',
      'deck:card-removed',
      'loop:completed',
      'loop:tile-entered',
      'relic:acquired',
      'relic:triggered',
      'save:requested',
      'save:completed',
      'run:started',
      'run:ended',
    ];

    for (let cycle = 0; cycle < 50; cycle++) {
      // Subscribe to a rotating subset of 5 events per cycle
      const startIdx = cycle % (allEvents.length - 4);
      const subset = allEvents.slice(startIdx, startIdx + 5);

      const handlers = subset.map((evt) => {
        const handler = () => {};
        eventBus.on(evt, handler);
        return { evt, handler };
      });

      // Cleanup
      for (const { evt, handler } of handlers) {
        eventBus.off(evt, handler);
      }
    }

    // Verify total count across all events is zero
    let totalListeners = 0;
    for (const evt of allEvents) {
      totalListeners += eventBus.listenerCount(evt);
    }
    expect(totalListeners).toBe(0);
  });

  it('20 cycles with different event subsets: no accumulation', () => {
    const eventSets: (keyof GameEvents)[][] = [
      ['combat:start', 'combat:end', 'hero:damaged'],
      ['gold:changed', 'loop:completed', 'relic:acquired'],
      ['deck:card-added', 'deck:card-removed', 'save:completed'],
      ['hero:healed', 'combat:card-played', 'run:started'],
      ['tile-points:changed', 'loop:tile-entered', 'relic:triggered'],
    ];

    for (let cycle = 0; cycle < 20; cycle++) {
      const events = eventSets[cycle % eventSets.length];

      const handlers = events.map((evt) => {
        const handler = () => {};
        eventBus.on(evt, handler);
        return { evt, handler };
      });

      // Cleanup
      for (const { evt, handler } of handlers) {
        eventBus.off(evt, handler);
      }

      // Verify zero accumulation after each cycle
      for (const evt of events) {
        expect(eventBus.listenerCount(evt)).toBe(0);
      }
    }

    // Final check: all events across all sets have zero listeners
    const allUsedEvents = new Set(eventSets.flat());
    for (const evt of allUsedEvents) {
      expect(eventBus.listenerCount(evt)).toBe(0);
    }
  });
});
