# Architecture

## Overview

The Pokédex is a **client-rendered single-page app** built with SvelteKit and shipped as fully static assets (`@sveltejs/adapter-static`). There is no server at runtime — GitHub Pages serves the built files, and everything (routing, data fetching, state) happens in the browser.

## Rendering model

- `src/routes/+layout.ts` sets `ssr = false` and `prerender = true`. SvelteKit therefore prerenders the **static route shells** (`/`, `/berries`, `/favorites`) at build time, while the JavaScript app hydrates and fetches live data on the client.
- Dynamic routes (`/pokemon/[name]`, `/berries/[name]`) set `prerender = false`. They are reached at runtime through the SPA **`404.html` fallback** that the static adapter emits, then rendered client-side from their `load` function.
- `paths.base` is set to `/pokedex-tw-opuslo-off-1` for project-site Pages, and to `''` during `dev`.

## Data flow

```
+page.ts load({ fetch })
        │
        ▼
   api/client.ts            typed functions: getPokemon, getPokemonList,
        │                   getGeneration, getType, getSpecies,
        │                   getEvolutionChainByUrl, getBerry, getBerryList
        ▼
   api/cache.ts  ── cachedJson(url, parse, fetch)
        │            1. return memoized parsed value if present
        │            2. return the in-flight promise if one exists (dedupe)
        │            3. otherwise fetch → check res.ok → json → parse → store
        ▼
   api/schemas.ts  ── zod schema .parse() validates every response
        │
        ▼
   +page.svelte (Svelte 5 runes: $state / $derived / $effect)
        │
        ▼
   components  ── PokemonCard, TypeBadge, StatBar, Toolbar, EvolutionChain, …
```

### Caching

`src/lib/api/cache.ts` is a module-level cache with two `Map`s keyed by URL:

- `store` — parsed, validated results. A second request for the same URL is a synchronous cache hit.
- `inflight` — promises for requests currently in progress, so N concurrent callers for the same resource share **one** network request.

Because the list view fetches per-Pokémon detail for each card (and the detail, favorites and evolution views request overlapping resources), this cache eliminates virtually all duplicate network traffic within a session. On a failed response the client throws a typed `ApiError` carrying the HTTP status, which the dynamic routes use to raise a SvelteKit `404`.

## The list view

The home route loads a single cheap index request (`/pokemon?limit=100000`) to get every name + id. Filtering, sorting and searching all operate on that in-memory index:

- **Search** filters names (debounced 250 ms in the toolbar).
- **Generation** filter fetches `/generation/{id}` once and intersects by species name.
- **Type** filter fetches `/type/{name}` for each selected type and keeps the union of their members.
- **Sort** is either dex-number (default, from the index) or base-stat total (computed from loaded detail).

Only the current slice (`shownCount`, grown by 30 via an `IntersectionObserver` sentinel) has its detail fetched, so the grid stays cheap no matter how large the filtered set is.

## State

- `stores/favorites.svelte.ts` — a `$state` array of Pokémon ids, mirrored to `localStorage` on every toggle. Read once at module init.
- `stores/theme.svelte.ts` — `'light' | 'dark'`, initialized from `localStorage` then the `prefers-color-scheme` media query, applied by toggling a `.dark` class on `<html>`.

## Routes

| Route | Kind | Purpose |
| --- | --- | --- |
| `/` | prerendered shell | Pokédex list, search, filters, infinite scroll |
| `/pokemon/[name]` | client-only | Detail: stats, abilities, moves, evolution, sprites, cry |
| `/berries` | prerendered shell | Berry index with search |
| `/berries/[name]` | client-only | Berry detail: firmness, flavors, growth, size |
| `/favorites` | prerendered shell | Grid of localStorage-favorited Pokémon |
| `+error.svelte` | — | 404 / error state |
