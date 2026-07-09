import { expect, test } from "@playwright/test";

test.describe("Pokédex list", () => {
  test("renders the card grid", async ({ page }) => {
    await page.goto("");
    await expect(
      page.getByRole("heading", { name: /Explore the/i })
    ).toBeVisible();
    const firstCard = page.getByTestId("pokemon-card").first();
    await expect(firstCard).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: "Bulbasaur" })
    ).toBeVisible();
  });

  test("search filters the grid", async ({ page }) => {
    await page.goto("");
    await page.getByTestId("pokemon-card").first().waitFor({ timeout: 15_000 });
    await page.getByRole("searchbox").fill("pikachu");
    await expect(page.getByRole("heading", { name: "Pikachu" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/1 result/)).toBeVisible();
  });

  test("shows an empty state for no matches", async ({ page }) => {
    await page.goto("");
    await page.getByRole("searchbox").fill("zzzznope");
    await expect(page.getByText("No Pokémon found")).toBeVisible();
  });
});

test.describe("Detail page", () => {
  test("navigates into a Pokémon and shows stats + evolution", async ({
    page,
  }) => {
    await page.goto("pokemon/charizard/");
    await expect(page.getByRole("heading", { name: "Charizard" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Base stats")).toBeVisible();
    await expect(page.getByText("Evolution")).toBeVisible();
    await expect(page.getByText("Charmander")).toBeVisible();
  });

  test("404s for an unknown Pokémon", async ({ page }) => {
    await page.goto("pokemon/notarealmon/");
    await expect(page.getByText(/Page not found|not found/i)).toBeVisible({
      timeout: 15_000,
    });
  });
});

test.describe("Favorites", () => {
  test("favoriting persists to the favorites page", async ({ page }) => {
    await page.goto("");
    await page.getByTestId("pokemon-card").first().waitFor({ timeout: 15_000 });
    await page
      .getByRole("button", { name: /Add Bulbasaur to favorites/ })
      .click();
    await page.goto("favorites/");
    await expect(page.getByRole("heading", { name: "Bulbasaur" })).toBeVisible({
      timeout: 15_000,
    });
  });
});

test.describe("Theme", () => {
  test("toggles dark mode", async ({ page }) => {
    await page.goto("");
    await page.getByRole("button", { name: /dark theme/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

test.describe("Berries", () => {
  test("lists berries and opens a detail", async ({ page }) => {
    await page.goto("berries/");
    await expect(page.getByRole("heading", { name: /Berry/i })).toBeVisible();
    await page.getByRole("link", { name: /Cheri/i }).first().click();
    await expect(page.getByText(/firmness/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
