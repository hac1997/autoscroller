import { getCardById, STARTER_DECK_IDS, type CardDefinition } from './CardDefinitions';

export class DeckManager {
    private inventory: Map<string, number> = new Map();
    private deck: string[] = [];

    constructor() {
        this.reset();
    }

    reset(): void {
        this.inventory.clear();
        this.deck = [...STARTER_DECK_IDS];
    }

    addToInventory(cardId: string): void {
        this.inventory.set(cardId, (this.inventory.get(cardId) ?? 0) + 1);
    }

    getInventoryCount(cardId: string): number {
        return this.inventory.get(cardId) ?? 0;
    }

    getInventoryCards(): { cardId: string; count: number }[] {
        return Array.from(this.inventory.entries())
            .filter(([, count]) => count > 0)
            .map(([cardId, count]) => ({ cardId, count }))
            .sort((a, b) => a.cardId.localeCompare(b.cardId));
    }

    getDeckIds(): string[] {
        return [...this.deck];
    }

    getDeck(): CardDefinition[] {
        return this.deck
            .map((id) => getCardById(id))
            .filter((c): c is CardDefinition => c !== undefined);
    }

    addToDeck(cardId: string): boolean {
        const spare = this.inventory.get(cardId) ?? 0;
        if (spare <= 0) return false;
        this.inventory.set(cardId, spare - 1);
        this.deck.push(cardId);
        return true;
    }

    removeFromDeck(cardId: string): boolean {
        const idx = this.deck.indexOf(cardId);
        if (idx === -1) return false;
        this.deck.splice(idx, 1);
        this.inventory.set(cardId, (this.inventory.get(cardId) ?? 0) + 1);
        return true;
    }

    getDeckCount(cardId: string): number {
        return this.deck.filter((id) => id === cardId).length;
    }
}

let deckManagerInstance: DeckManager | null = null;

export function getDeckManager(): DeckManager {
    if (!deckManagerInstance) {
        deckManagerInstance = new DeckManager();
    }
    return deckManagerInstance;
}

export function resetDeckManager(): void {
    deckManagerInstance = null;
}
