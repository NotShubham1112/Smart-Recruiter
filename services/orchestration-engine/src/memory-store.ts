export interface MemoryEntry {
  key: string;
  value: unknown;
  ttl?: number;
  createdAt: number;
}

export class MemoryStore {
  private store = new Map<string, MemoryEntry>();

  set(key: string, value: unknown, ttlMs?: number): void {
    this.store.set(key, { key, value, ttl: ttlMs, createdAt: Date.now() });
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.ttl && Date.now() - entry.createdAt > entry.ttl) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}
