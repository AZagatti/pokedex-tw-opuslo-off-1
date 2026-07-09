import { getPokemonList } from "$lib/api/client";
import { idFromUrl } from "$lib/utils/pokemon";

import type { PageLoad } from "./$types";

export interface IndexEntry {
  name: string;
  id: number;
}

export const load: PageLoad = async ({ fetch }) => {
  // One cheap request gives the full name/id index for the whole Pokédex.
  const list = await getPokemonList(100000, 0, fetch);
  const entries: IndexEntry[] = list.results
    .map((r) => ({ name: r.name, id: idFromUrl(r.url) }))
    .filter((e) => Number.isFinite(e.id))
    .sort((a, b) => a.id - b.id);
  return { entries };
};
