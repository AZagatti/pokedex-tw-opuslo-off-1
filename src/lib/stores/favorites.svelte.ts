import { browser } from "$app/environment";

const STORAGE_KEY = "pokedex:favorites";

function load(): number[] {
  if (!browser) {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((n) => typeof n === "number")
      : [];
  } catch {
    return [];
  }
}

class FavoritesStore {
  ids = $state<number[]>(load());

  has(id: number): boolean {
    return this.ids.includes(id);
  }

  toggle(id: number): void {
    if (this.has(id)) {
      this.ids = this.ids.filter((x) => x !== id);
    } else {
      this.ids = [...this.ids, id];
    }
    this.persist();
  }

  get count(): number {
    return this.ids.length;
  }

  private persist(): void {
    if (browser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.ids));
    }
  }
}

export const favorites = new FavoritesStore();
