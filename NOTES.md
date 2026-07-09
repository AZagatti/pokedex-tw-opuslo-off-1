# Build Journal

- 2026-07-09: Started. Env: node v24.17.0, npm 11.17.0, git 2.43.0, gh 2.92.0. Dir empty except SPEC.md. Not a git repo yet.

- 2026-07-09: Scaffolded SvelteKit (kit 2.63/vite8/svelte5.56/TS6). New `sv` puts adapter inline in vite.config — moved kit config to canonical svelte.config.js and made vite `sveltekit()` plain; works. TTY prompts blocked automating tailwind add-on & vitest usages; added Tailwind v4 manually via @tailwindcss/vite. ultracite init --quiet wired oxlint+oxfmt configs; it overwrote `check` script — restored to svelte-check, set lint=oxlint/format=oxfmt.
- 2026-07-09: List page renders (SPA, ssr=false + prerender shells). `{#each Array.from({length:n}), i (i)}` index-only each syntax works in Svelte 5. Master index via one /pokemon?limit=100000 call; details fetched per-slice with in-memory cache. Screenshot verified: cards, sprites, type badges, hearts, gradients all good.
- 2026-07-09: Decision: pre-push hook runs unit tests only (not e2e) to avoid slow/browser-dependent git pushes; CI runs full e2e. base path=/pokedex-tw-opuslo-off-1.
