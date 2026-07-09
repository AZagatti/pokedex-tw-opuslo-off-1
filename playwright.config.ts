import { defineConfig } from "@playwright/test";

const BASE = "/pokedex-tw-opuslo-off-1";

export default defineConfig({
  testDir: "e2e",
  testMatch: "**/*.e2e.{ts,js}",
  timeout: 45_000,
  expect: { timeout: 15_000 },
  // PokeAPI rate-limits under load, so keep concurrency modest and allow a retry.
  workers: 2,
  retries: 1,
  webServer: {
    command: "npm run build && npm run preview",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    // Trailing slash + relative goto() paths so the base path is preserved
    // (a leading-slash path would resolve against the origin and drop BASE).
    baseURL: `http://localhost:4173${BASE}/`,
  },
});
