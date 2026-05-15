import { expect, test } from "@playwright/test";

const BASE_URL = "https://worldguess-navy.vercel.app";

test("world mode atlas lookup shows Estonia as EU", async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  await page.getByPlaceholder("Search a country or territory").fill("estonia");
  await page.getByRole("button", { name: /Estonia/ }).last().click();

  await expect(
    page.locator("div").filter({ hasText: /^SelectedEstonia$/ }).first(),
  ).toBeVisible();
  await expect(page.getByText("EU", { exact: true })).toBeVisible();
});

test("world mode both-ways turn flow works", async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Start match" }).click();

  await expect(page.getByText("Step 1: Answer the computer")).toBeVisible();
  await expect(
    page.getByLabel("Step 2: Ask your clue or make a direct guess"),
  ).toBeVisible();

  const logEntriesBefore = await page.locator("article").count();

  await page.getByRole("button", { name: "YES" }).click();
  await page
    .getByLabel("Step 2: Ask your clue or make a direct guess")
    .fill("Is your country in Europe?");
  await page.getByRole("button", { name: "End turn" }).click();

  await expect(page.getByText(/About my country:/)).toBeVisible();
  await expect(page.locator("article")).toHaveCount(logEntriesBefore + 2);
});

test("world mode computer-only flow works", async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  await page
    .getByRole("button", {
      name: /Computer Only The computer only has to guess your country/,
    })
    .click();
  await page.getByRole("button", { name: "Start match" }).click();

  await expect(page.getByText("One-way mode")).toBeVisible();
  await expect(page.locator("textarea")).toHaveCount(0);

  const logEntriesBefore = await page.locator("article").count();

  await page.getByRole("button", { name: "NO", exact: true }).click();
  await page.getByRole("button", { name: "Send answer" }).click();

  await expect(page.locator("article")).toHaveCount(logEntriesBefore + 2);
});

test("US states mode starts and advances", async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  await page
    .getByRole("button", {
      name: /States US States Play a separate one-difficulty state mode/,
    })
    .click();

  await expect(page.getByRole("button", { name: /States US States/ })).toBeVisible();
  await page.getByRole("button", { name: "Start state match" }).click();
  await expect(page.getByText("Answer the computer")).toBeVisible();

  const logEntriesBefore = await page.locator("article").count();

  await page.getByRole("button", { name: "YES" }).click();
  await page.getByRole("button", { name: "Send answer" }).click();

  await expect(page.locator("article")).toHaveCount(logEntriesBefore + 2);
});
