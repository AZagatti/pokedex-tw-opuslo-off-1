# Decisions

Why each pinned choice was made, and the notable trade-offs taken along the way.

## Framework & rendering

- **SvelteKit + Svelte 5 runes.** Runes (`$state`, `$derived`, `$effect`) give fine-grained reactivity with very little boilerplate, and SvelteKit's file-based routing + `load` functions map cleanly onto the PokéAPI's resource-per-URL shape.
- **`@sveltejs/adapter-static`, SPA mode.** GitHub Pages only serves static files. The adapter prerenders the static route shells and emits a `404.html` fallback that boots the client router for dynamic routes (`/pokemon/[name]`, `/berries/[name]`). `ssr = false` keeps the runtime a pure client app, which is the simplest correct model for a data-driven Pages site.
- **`paths.base = '/pokedex-tw-opuslo-off-1'`.** Required because this is a project site served from a sub-path, not a user/organization root.

## Data layer

- **Native `fetch` in `load` + a hand-rolled cache.** The brief pins "no data-fetching library." `src/lib/api/cache.ts` is a ~50-line URL-keyed cache that both memoizes parsed results and de-dupes in-flight requests — enough to eliminate redundant traffic without pulling in TanStack Query et al.
- **zod on every response.** PokéAPI payloads are huge; each schema models only the fields consumed, and `.parse()` turns an unexpected shape into a clear error at the boundary rather than an `undefined` deep in a component.
- **Detail enrichments load client-side.** `/pokemon/[name]`'s `load` only awaits the core Pokémon (one request); species → evolution-chain → flavor text (two more sequential requests) are fetched in a component `$effect`. This paints the page as soon as the essential data arrives instead of blocking on three round-trips, which also made the e2e suite reliable under parallel load.

## Styling & motion

- **Tailwind v4 for layout + hand-written CSS for motion.** Tailwind's utilities handle spacing/grid/responsive quickly; bespoke keyframes and transitions (stat-bar growth, card lift, artwork float) live in component `<style>` and a small design-token layer in `app.css`. Every animation is gated behind a global `prefers-reduced-motion` reset.
- **Type-colored design system.** A single `TYPE_COLORS` map drives badges, card gradients and stat bars so the palette stays consistent everywhere.

## State

- **Rune-class stores persisted to `localStorage`.** `favorites` and `theme` are small classes exposing `$state`; persistence is a one-liner on each mutation. No external store library needed for this scope.

## Tooling

- **ultracite → oxlint + oxfmt.** Rust-based lint/format that is dramatically faster than ESLint/Prettier. Ultracite's preset is intentionally maximal; a handful of purely-stylistic rules that fight SvelteKit conventions were disabled in `oxlint.config.ts` (PascalCase component filenames, `let` props, alphabetical object keys, promise-chaining inside `$effect`s, mandatory regex `u` flags). Every correctness rule stays on.
- **lefthook.** pre-commit runs oxlint + oxfmt --check + `svelte-check` on the repo; pre-push runs the unit suite. The Playwright e2e suite is intentionally **not** in pre-push — it needs a production build + a browser and would make pushing slow and network-dependent; CI runs it instead.
- **vitest + Playwright.** vitest covers pure logic (cache dedupe, schema parsing, utils) and a component render; Playwright drives the real built app (search, detail, favorites persistence, theme, berries) against a preview server.

## CI/CD

- **One workflow: verify → deploy.** `verify` installs, lints, checks, unit- and e2e-tests, then builds and uploads the Pages artifact. `deploy` (gated to `main`, with `pages: write` + `id-token: write`) publishes via `actions/deploy-pages`. Keeping deploy dependent on `verify` means a red build never ships.
