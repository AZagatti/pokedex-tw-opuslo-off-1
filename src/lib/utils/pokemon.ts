import type { Pokemon } from "$lib/api/schemas";

/** Extract the numeric id from a PokeAPI resource url like `.../pokemon/25/`. */
export function idFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number(parts.at(-1));
}

/** Turn `nidoran-f` into `Nidoran ♀`-ish Title Case. */
export function formatName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function dexNumber(id: number): string {
  return `#${String(id).padStart(4, "0")}`;
}

export function statTotal(pokemon: Pokemon): number {
  return pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
}

export function officialArtwork(pokemon: Pokemon): string | null {
  return (
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.other?.home?.front_default ??
    pokemon.sprites.front_default
  );
}

/**
 * Lightweight sprite for grid cards. The pixel `front_default` is ~0.6 KB vs
 * ~200 KB for official artwork, keeping the image-heavy list fast (a big LCP
 * win). Detail pages still use the full-resolution artwork.
 */
export function cardSprite(pokemon: Pokemon): string | null {
  return pokemon.sprites.front_default ?? officialArtwork(pokemon);
}

export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

export const MAX_STAT = 255;

export const ALL_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;
export type PokeType = (typeof ALL_TYPES)[number];

// Canonical type colors (used for badges + gradients).
export const TYPE_COLORS: Record<string, string> = {
  normal: "#9099a1",
  fire: "#ff9d55",
  water: "#5090d6",
  electric: "#f4d23c",
  grass: "#63bc5a",
  ice: "#73cec0",
  fighting: "#ce4069",
  poison: "#ab6ac8",
  ground: "#d97845",
  flying: "#8fa8dd",
  psychic: "#f66f71",
  bug: "#90c12c",
  rock: "#c7b78b",
  ghost: "#5269ac",
  dragon: "#0a6dc4",
  dark: "#5a5366",
  steel: "#5a8ea1",
  fairy: "#ec8fe6",
};

export function typeColor(type: string): string {
  return TYPE_COLORS[type] ?? "#9099a1";
}

export const GENERATIONS = [
  { id: 1, label: "Gen I", region: "Kanto" },
  { id: 2, label: "Gen II", region: "Johto" },
  { id: 3, label: "Gen III", region: "Hoenn" },
  { id: 4, label: "Gen IV", region: "Sinnoh" },
  { id: 5, label: "Gen V", region: "Unova" },
  { id: 6, label: "Gen VI", region: "Kalos" },
  { id: 7, label: "Gen VII", region: "Alola" },
  { id: 8, label: "Gen VIII", region: "Galar" },
  { id: 9, label: "Gen IX", region: "Paldea" },
] as const;
