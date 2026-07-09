// A tiny in-memory cache keyed by URL. Dedupes in-flight requests so the same
// resource is never fetched twice, and stores parsed results for reuse.
const store = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Fetch JSON from `url`, parse it with `parse`, and cache the result by URL.
 * Concurrent callers for the same URL share a single network request.
 */
export async function cachedJson<T>(
  url: string,
  parse: (data: unknown) => T,
  fetchImpl: typeof fetch = fetch
): Promise<T> {
  if (store.has(url)) {
    return store.get(url) as T;
  }
  if (inflight.has(url)) {
    return inflight.get(url) as Promise<T>;
  }

  const promise = (async () => {
    const res = await fetchImpl(url);
    if (!res.ok) {
      throw new ApiError(`Request failed: ${url}`, res.status);
    }
    const json: unknown = await res.json();
    const parsed = parse(json);
    store.set(url, parsed);
    return parsed;
  })();

  inflight.set(url, promise);
  try {
    return (await promise) as T;
  } finally {
    inflight.delete(url);
  }
}

export function clearCache(): void {
  store.clear();
  inflight.clear();
}

export function cacheSize(): number {
  return store.size;
}
