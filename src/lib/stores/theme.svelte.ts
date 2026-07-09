import { browser } from "$app/environment";

const STORAGE_KEY = "pokedex:theme";
export type Theme = "light" | "dark";

function initial(): Theme {
  if (!browser) {
    return "light";
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

class ThemeStore {
  value = $state<Theme>(initial());

  toggle(): void {
    this.value = this.value === "dark" ? "light" : "dark";
    this.apply();
  }

  set(theme: Theme): void {
    this.value = theme;
    this.apply();
  }

  apply(): void {
    if (!browser) {
      return;
    }
    document.documentElement.classList.toggle("dark", this.value === "dark");
    document.documentElement.style.colorScheme = this.value;
    localStorage.setItem(STORAGE_KEY, this.value);
  }
}

export const theme = new ThemeStore();
