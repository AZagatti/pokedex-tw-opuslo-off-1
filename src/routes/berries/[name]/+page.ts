import { ApiError } from "$lib/api/cache";
import { getBerry } from "$lib/api/client";
import type { Berry } from "$lib/api/schemas";
import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
  let berry: Berry;
  try {
    berry = await getBerry(params.name, fetch);
  } catch (error_) {
    if (error_ instanceof ApiError && error_.status === 404) {
      error(404, `No berry named "${params.name}"`);
    }
    throw error_;
  }
  return { berry };
};

export const prerender = false;
