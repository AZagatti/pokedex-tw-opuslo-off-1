import { ApiError } from "$lib/api/cache";
import {
  getEvolutionChainByUrl,
  getPokemon,
  getSpecies,
} from "$lib/api/client";
import type { EvolutionChain, Pokemon, Species } from "$lib/api/schemas";
import { idFromUrl } from "$lib/utils/pokemon";
import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export interface EvoNode {
  name: string;
  id: number;
}

function flattenChain(chain: EvolutionChain): EvoNode[][] {
  const stages: EvoNode[][] = [];
  let level = [chain.chain];
  while (level.length > 0) {
    stages.push(
      level.map((l) => ({ name: l.species.name, id: idFromUrl(l.species.url) }))
    );
    level = level.flatMap((l) => l.evolves_to);
  }
  return stages;
}

export const load: PageLoad = async ({ params, fetch }) => {
  let pokemon: Pokemon;
  try {
    pokemon = await getPokemon(params.name, fetch);
  } catch (error_) {
    if (error_ instanceof ApiError && error_.status === 404) {
      error(404, `No Pokémon named "${params.name}"`);
    }
    throw error_;
  }

  let species: Species | null = null;
  let evolution: EvoNode[][] = [];
  try {
    species = await getSpecies(pokemon.id, fetch);
    if (species.evolution_chain) {
      const chain = await getEvolutionChainByUrl(
        species.evolution_chain.url,
        fetch
      );
      evolution = flattenChain(chain);
    }
  } catch {
    // species/evolution are enrichments — tolerate their absence
  }

  const flavor = species?.flavor_text_entries
    .find((f) => f.language.name === "en")
    ?.flavor_text.replaceAll(/[\n\f]/gu, " ");
  const genus = species?.genera.find((g) => g.language.name === "en")?.genus;

  return { pokemon, evolution, flavor, genus };
};

export const prerender = false;
