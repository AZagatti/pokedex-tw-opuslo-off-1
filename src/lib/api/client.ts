import { cachedJson } from "./cache";
import {
  berrySchema,
  evolutionChainSchema,
  generationSchema,
  pokemonListSchema,
  pokemonSchema,
  speciesSchema,
  typeSchema,
  berryListSchema,
  type Berry,
  type EvolutionChain,
  type Generation,
  type Pokemon,
  type PokemonList,
  type Species,
  type TypeResource,
} from "./schemas";

export const API_BASE = "https://pokeapi.co/api/v2";

type Fetch = typeof fetch;

export function getPokemonList(
  limit: number,
  offset: number,
  f: Fetch = fetch
): Promise<PokemonList> {
  return cachedJson(
    `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`,
    (d) => pokemonListSchema.parse(d),
    f
  );
}

export function getPokemon(
  nameOrId: string | number,
  f: Fetch = fetch
): Promise<Pokemon> {
  return cachedJson(
    `${API_BASE}/pokemon/${nameOrId}`,
    (d) => pokemonSchema.parse(d),
    f
  );
}

export function getGeneration(
  id: number,
  f: Fetch = fetch
): Promise<Generation> {
  return cachedJson(
    `${API_BASE}/generation/${id}`,
    (d) => generationSchema.parse(d),
    f
  );
}

export function getType(name: string, f: Fetch = fetch): Promise<TypeResource> {
  return cachedJson(`${API_BASE}/type/${name}`, (d) => typeSchema.parse(d), f);
}

export function getSpecies(
  nameOrId: string | number,
  f: Fetch = fetch
): Promise<Species> {
  return cachedJson(
    `${API_BASE}/pokemon-species/${nameOrId}`,
    (d) => speciesSchema.parse(d),
    f
  );
}

export function getEvolutionChainByUrl(
  url: string,
  f: Fetch = fetch
): Promise<EvolutionChain> {
  return cachedJson(url, (d) => evolutionChainSchema.parse(d), f);
}

export function getBerryList(
  limit: number,
  offset: number,
  f: Fetch = fetch
): Promise<PokemonList> {
  return cachedJson(
    `${API_BASE}/berry?limit=${limit}&offset=${offset}`,
    (d) => berryListSchema.parse(d),
    f
  );
}

export function getBerry(
  nameOrId: string | number,
  f: Fetch = fetch
): Promise<Berry> {
  return cachedJson(
    `${API_BASE}/berry/${nameOrId}`,
    (d) => berrySchema.parse(d),
    f
  );
}
