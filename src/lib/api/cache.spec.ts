import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, cachedJson, cacheSize, clearCache } from "./cache";

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

describe("cachedJson", () => {
  beforeEach(() => {
    clearCache();
  });

  it("fetches, parses and returns the result", async () => {
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse({ n: 1 })));
    const result = await cachedJson(
      "https://x/1",
      (d) => d as { n: number },
      fetchImpl as unknown as typeof fetch
    );
    expect(result).toEqual({ n: 1 });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("serves a cached value without refetching", async () => {
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse({ n: 2 })));
    const f = fetchImpl as unknown as typeof fetch;
    await cachedJson("https://x/2", (d) => d, f);
    await cachedJson("https://x/2", (d) => d, f);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(cacheSize()).toBe(1);
  });

  it("dedupes concurrent in-flight requests", async () => {
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse({ n: 3 })));
    const f = fetchImpl as unknown as typeof fetch;
    const [a, b] = await Promise.all([
      cachedJson("https://x/3", (d) => d, f),
      cachedJson("https://x/3", (d) => d, f),
    ]);
    expect(a).toEqual(b);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("throws an ApiError with status on a failed response", async () => {
    const fetchImpl = vi.fn(() =>
      Promise.resolve(jsonResponse(null, false, 404))
    );
    await expect(
      cachedJson(
        "https://x/404",
        (d) => d,
        fetchImpl as unknown as typeof fetch
      )
    ).rejects.toMatchObject({ status: 404 });
    expect(ApiError).toBeDefined();
  });
});
