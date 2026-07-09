import { getBerryList } from "$lib/api/client";
import { idFromUrl } from "$lib/utils/pokemon";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const list = await getBerryList(1000, 0, fetch);
  const berries = list.results
    .map((r) => ({ name: r.name, id: idFromUrl(r.url) }))
    .sort((a, b) => a.id - b.id);
  return { berries };
};
