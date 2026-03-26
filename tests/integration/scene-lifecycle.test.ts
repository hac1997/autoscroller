import { describe, it, expect, beforeEach } from 'vitest';
import { eventBus } from '../../src/core/EventBus';
import type { GameEvents } from '../../src/core/EventBus';

describe('Scene Lifecycle Integration', () => {
  beforeEach(() => {
    eventBus.removeAllListeners();
  });

  it('scene create/cleanup pattern leaves zero listeners for 5 events', () => {
    const events: (keyof GameEvents)[] = [
      'combat:start',
      'combat:end',
      'hero:damaged',
      'gold:changed',
      'loop:completed',
    ];

    // Simulate scene create: subscribe to all events
    const handlers = events.map((evt) => {
      const handler = () => {};
      eventBus.on(evt, handler);
      return { evt, handler };
    });

    // Verify all subscribed
    for (const { evt } of handlers) {
      expect(eventBus.listenerCount(evt)).toBeGreaterThan(0);
    }

    // Simulate scene cleanup: unsubscribe all
    for (const { evt, handler } of handlers) {
      eventBus.off(evt, handler);
    }

    // All listener counts should be 0
    for (const evt of events) {
      expect(eventBus.listenerCount(evt)).toBe(0);
    }
  });

  it('scene cleanup removes only its own listeners (others unaffected)', () => {
    // "Background" listener that should survive
    const bgHandler = () => {};
    eventBus.on('gold:changed', bgHandler);

    // Scene subscribes to 3 events
    const sceneEvents: (keyof GameEvents)[] = [
      'combat:start',
      'combat:end',
      'hero:damaged',
    ];
    const sceneHandlers = sceneEvents.map((evt) => {
      const handler = () => {};
      eventBus.on(evt, handler);
      return { evt, handler };
    });

    // Scene cleanup: remove only scene handlers
    for (const { evt, handler } of sceneHandlers) {
      eventBus.off(evt, handler);
    }

    // Scene events cleaned
    for (const evt of sceneEvents) {
      expect(eventBus.listenerCount(evt)).toBe(0);
    }

    // Background listener still present
    expect(eventBus.listenerCount('gold:changed')).toBe(1);

    // Cleanup
    eventBus.off('gold:changed', bgHandler);
  });

  it('overlapping scenes (Game + PauseScene overlay) clean up independently', () => {
    // Game scene subscribes
    const gameHandlers: { evt: keyof GameEvents; handler: () => void }[] = [];
    const gameEvents: (keyof GameEvents)[] = ['combat:start', 'hero:damaged', 'gold:changed'];
    for (const evt of gameEvents) {
      const handler = () => {};
      eventBus.on(evt, handler);
      gameHandlers.push({ evt, handler });
    }

    // PauseScene overlay subscribes (some overlapping events)
    const pauseHandlers: { evt: keyof GameEvents; handler: () => void }[] = [];
    const pauseEvents: (keyof GameEvents)[] = ['gold:changed', 'save:completed'];
    for (const evt of pauseEvents) {
      const handler = () => {};
      eventBus.on(evt, handler);
      pauseHandlers.push({ evt, handler });
    }

    // gold:changed has 2 listeners (one from each scene)
    expect(eventBus.listenerCount('gold:changed')).toBe(2);

    // PauseScene closes first: cleanup its handlers
    for (const { evt, handler } of pauseHandlers) {
      eventBus.off(evt, handler);
    }

    // gold:changed should now have 1 (Game's handler)
    expect(eventBus.listenerCount('gold:changed')).toBe(1);
    expect(eventBus.listenerCount('save:completed')).toBe(0);

    // Game scene cleanup
    for (const { evt, handler } of gameHandlers) {
      eventBus.off(evt, handler);
    }

    // Everything zeroed
    for (const evt of [...gameEvents, ...pauseEvents]) {
      expect(eventBus.listenerCount(evt)).toBe(0);
    }
  });
});
