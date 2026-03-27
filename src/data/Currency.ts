let currentGold: number = 0;

export function getGold(): number {
    return currentGold;
}

export function addGold(amount: number): void {
    currentGold = Math.max(0, currentGold + amount);
}

export function spendGold(amount: number): boolean {
    if (currentGold >= amount) {
        currentGold -= amount;
        return true;
    }
    return false;
}

export function resetGold(): void {
    currentGold = 0;
}

export function setGold(amount: number): void {
    currentGold = Math.max(0, amount);
}
