import { z } from "zod";

// Only the fields we actually consume are modeled; PokeAPI payloads are large.

export const namedResource = z.object({
  name: z.string(),
  url: z.string(),
});
export type NamedResource = z.infer<typeof namedResource>;

export const pokemonListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(namedResource),
});
export type PokemonList = z.infer<typeof pokemonListSchema>;

export const pokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  base_experience: z.number().nullable().optional(),
  sprites: z.object({
    front_default: z.string().nullable(),
    back_default: z.string().nullable(),
    front_shiny: z.string().nullable(),
    back_shiny: z.string().nullable(),
    other: z
      .object({
        "official-artwork": z
          .object({
            front_default: z.string().nullable(),
            front_shiny: z.string().nullable().optional(),
          })
          .optional(),
        home: z.object({ front_default: z.string().nullable() }).optional(),
      })
      .optional(),
  }),
  cries: z
    .object({
      latest: z.string().nullable().optional(),
      legacy: z.string().nullable().optional(),
    })
    .optional(),
  types: z.array(
    z.object({
      slot: z.number(),
      type: namedResource,
    })
  ),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      stat: namedResource,
    })
  ),
  abilities: z.array(
    z.object({
      ability: namedResource,
      is_hidden: z.boolean(),
      slot: z.number(),
    })
  ),
  moves: z.array(
    z.object({
      move: namedResource,
    })
  ),
});
export type Pokemon = z.infer<typeof pokemonSchema>;

export const generationSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon_species: z.array(namedResource),
});
export type Generation = z.infer<typeof generationSchema>;

export const typeSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon: z.array(
    z.object({
      slot: z.number(),
      pokemon: namedResource,
    })
  ),
});
export type TypeResource = z.infer<typeof typeSchema>;

export const speciesSchema = z.object({
  id: z.number(),
  name: z.string(),
  evolution_chain: z.object({ url: z.string() }).nullable(),
  flavor_text_entries: z.array(
    z.object({
      flavor_text: z.string(),
      language: namedResource,
    })
  ),
  genera: z.array(
    z.object({
      genus: z.string(),
      language: namedResource,
    })
  ),
});
export type Species = z.infer<typeof speciesSchema>;

type EvoLink = {
  species: NamedResource;
  evolves_to: EvoLink[];
};

const evoLinkSchema: z.ZodType<EvoLink> = z.lazy(() =>
  z.object({
    species: namedResource,
    evolves_to: z.array(evoLinkSchema),
  })
);

export const evolutionChainSchema = z.object({
  id: z.number(),
  chain: evoLinkSchema,
});
export type EvolutionChain = z.infer<typeof evolutionChainSchema>;

// --- Berries ---

export const berryListSchema = pokemonListSchema;

export const berrySchema = z.object({
  id: z.number(),
  name: z.string(),
  growth_time: z.number(),
  max_harvest: z.number(),
  size: z.number(),
  smoothness: z.number(),
  soil_dryness: z.number(),
  firmness: namedResource,
  flavors: z.array(
    z.object({
      potency: z.number(),
      flavor: namedResource,
    })
  ),
  item: namedResource,
});
export type Berry = z.infer<typeof berrySchema>;
