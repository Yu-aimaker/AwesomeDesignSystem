import { test, expect } from "@playwright/test";

/**
 * Browser smoke suite — run with docs server:
 *   pnpm --filter @awesome-ds/docs start &
 *   pnpm test:e2e
 * Skipped automatically when PLAYWRIGHT_SKIP=1.
 */
const skip = process.env.PLAYWRIGHT_SKIP === "1";

test.describe("docs smoke", () => {
  test.skip(skip, "PLAYWRIGHT_SKIP=1");

  test("home and references are reachable", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/references");
    await expect(page.getByRole("heading", { name: "Reference Atlas" })).toBeVisible();
  });
});
