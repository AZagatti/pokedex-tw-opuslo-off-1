import { describe, expect, it } from "vitest";

import { berrySchema, pokemonSchema } from "./schemas";

describe("pokemonSchema", () => {
  it("parses a minimal valid pokemon payload", () => {
    const parsed = pokemonSchema.parse({
      id: 25,
      name: "pikachu",
      height: 4,
      weight: 60,
      sprites: {
        front_default: "f.png",
        back_default: null,
        front_shiny: null,
        back_shiny: null,
      },
      types: [{ slot: 1, type: { name: "electric", url: "" } }],
      stats: [{ base_stat: 35, stat: { name: "hp", url: "" } }],
      abilities: [
        { ability: { name: "static", url: "" }, is_hidden: false, slot: 1 },
      ],
      moves: [{ move: { name: "thunderbolt", url: "" } }],
    });
    expect(parsed.name).toBe("pikachu");
    expect(parsed.types[0]?.type.name).toBe("electric");
  });

  it("rejects a payload missing required fields", () => {
    expect(() => pokemonSchema.parse({ name: "bad" })).toThrow();
  });
});

describe("berrySchema", () => {
  it("parses a valid berry payload", () => {
    const parsed = berrySchema.parse({
      id: 1,
      name: "cheri",
      growth_time: 3,
      max_harvest: 5,
      size: 20,
      smoothness: 25,
      soil_dryness: 15,
      firmness: { name: "soft", url: "" },
      flavors: [{ potency: 10, flavor: { name: "spicy", url: "" } }],
      item: { name: "cheri-berry", url: "" },
    });
    expect(parsed.firmness.name).toBe("soft");
    expect(parsed.flavors[0]?.potency).toBe(10);
  });
});
