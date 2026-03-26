// Deck management pure functions -- operates on RunState directly.
// No Phaser dependency. All mutations are in-place on the passed RunState.

import type { RunState } from '../../state/RunState';

// ── Constants ───────────────────────────────────────────────

export const REMOVAL_BASE_COST = 10;
export const REORDER_SESSION_COST = 30;

// ── Add Card ────────────────────────────────────────────────

/**
 * Add a card to the active deck (free operation).
 * Appends to deck.active.
 */
export function addCard(cardId: string, run: RunState): void {
  run.deck.active.push(cardId);
}

// ── Removal Cost ────────────────────────────────────────────

/**
 * Calculate gold cost to remove a card.
 * Cost scales inversely with deck size: smaller decks cost more to shrink.
 * Formula: ceil(baseCost * (1 + 0.25 * max(0, 15 - deckSize)))
 */
export function getRemovalCost(run: RunState): number {
  const deckSize = run.deck.active.length;
  return Math.ceil(REMOVAL_BASE_COST * (1 + 0.25 * Math.max(0, 15 - deckSize)));
}

// ── Remove Card ─────────────────────────────────────────────

/**
 * Remove a card from the active deck, deducting the removal cost in gold.
 * Returns false if insufficient gold or card not found.
 */
export function removeCard(cardId: string, run: RunState): boolean {
  const cost = getRemovalCost(run);
  if (run.economy.gold < cost) return false;
  const idx = run.deck.active.indexOf(cardId);
  if (idx === -1) return false;
  run.deck.active.splice(idx, 1);
  run.economy.gold -= cost;
  return true;
}

// ── Reorder Deck ────────────────────────────────────────────

/**
 * Reorder the active deck to a new card order.
 * Costs a flat session fee. Returns false if insufficient gold
 * or if newOrder doesn't contain the same cards.
 */
export function reorderDeck(newOrder: string[], run: RunState): boolean {
  if (run.economy.gold < REORDER_SESSION_COST) return false;
  // Validate newOrder contains same cards as current active
  if (newOrder.length !== run.deck.active.length) return false;
  const sorted1 = [...newOrder].sort();
  const sorted2 = [...run.deck.active].sort();
  if (sorted1.join(',') !== sorted2.join(',')) return false;
  run.deck.active = [...newOrder];
  run.economy.gold -= REORDER_SESSION_COST;
  return true;
}
