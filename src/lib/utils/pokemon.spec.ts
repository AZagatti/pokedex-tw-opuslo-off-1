import type { Pokemon } from "$lib/api/schemas";
import { describe, expect, it } from "vitest";

import {
  dexNumber,
  formatName,
  idFromUrl,
  officialArtwork,
  statTotal,
  typeColor,
} from "./pokemon";

describe("idFromUrl", () => {
  it("extracts the trailing id from a resource url", () => {
    expect(idFromUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
  });

  it("works without a trailing slash", () => {
    expect(idFromUrl("https://pokeapi.co/api/v2/pokemon/151")).toBe(151);
  });
});

describe("formatName", () => {
  it("title-cases a single word", () => {
    expect(formatName("pikachu")).toBe("Pikachu");
  });

  it("splits hyphenated names into words", () => {
    expect(formatName("nidoran-f")).toBe("Nidoran F");
  });
});

describe("dexNumber", () => {
  it("pads to four digits with a hash", () => {
    expect(dexNumber(1)).toBe("#0001");
    expect(dexNumber(1025)).toBe("#1025");
  });
});

describe("typeColor", () => {
  it("returns a known type color", () => {
    expect(typeColor("fire")).toBe("#ff9d55");
  });

  it("falls back for an unknown type", () => {
    expect(typeColor("mystery")).toBe("#9099a1");
  });
});

const fakePokemon = {
  id: 1,
  name: "bulbasaur",
  stats: [
    { base_stat: 45, stat: { name: "hp", url: "" } },
    { base_stat: 49, stat: { name: "attack", url: "" } },
    { base_stat: 6, stat: { name: "speed", url: "" } },
  ],
  sprites: {
    front_default: "front.png",
    back_default: null,
    front_shiny: null,
    back_shiny: null,
    other: { "official-artwork": { front_default: "art.png" } },
  },
} as unknown as Pokemon;

describe("statTotal", () => {
  it("sums every base stat", () => {
    expect(statTotal(fakePokemon)).toBe(100);
  });
});

describe("officialArtwork", () => {
  it("prefers official artwork", () => {
    expect(officialArtwork(fakePokemon)).toBe("art.png");
  });

  it("falls back to front_default when artwork missing", () => {
    const p = {
      ...fakePokemon,
      sprites: { ...fakePokemon.sprites, other: undefined },
    } as unknown as Pokemon;
    expect(officialArtwork(p)).toBe("front.png");
  });
});
