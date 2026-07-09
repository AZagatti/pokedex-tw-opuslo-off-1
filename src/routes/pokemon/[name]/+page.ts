import { ApiError } from "$lib/api/cache";
import { getPokemon } from "$lib/api/client";
import type { Pokemon } from "$lib/api/schemas";
import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export interface EvoNode {
  name: string;
  id: number;
}

export const load: PageLoad = async ({ params, fetch }) => {
  // Only the Pokémon itself blocks the initial render. Species, evolution chain
  // and flavor text are enrichments fetched client-side (see +page.svelte) so
  // the page paints as soon as the core data is available.
  let pokemon: Pokemon;
  try {
    pokemon = await getPokemon(params.name, fetch);
  } catch (error_) {
    if (error_ instanceof ApiError && error_.status === 404) {
      error(404, `No Pokémon named "${params.name}"`);
    }
    throw error_;
  }

  return { pokemon };
};

export const prerender = false;
