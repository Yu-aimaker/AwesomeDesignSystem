import { test, expect } from "@playwright/test";

/**
 * Soft visual smoke screenshots for representative docs routes.
 *
 * - Set PLAYWRIGHT_SKIP=1 to skip the entire suite.
 * - Set PLAYWRIGHT_NO_SCREENSHOTS=1 to skip screenshot assertions (CI without baselines).
 * - First run needs baseline generation: `pnpm exec playwright test --update-snapshots`
 * - Uses a permissive maxDiffPixelRatio so minor font/AA drift does not fail hard.
 */
const skip = process.env.PLAYWRIGHT_SKIP === "1";
const noScreenshots = process.env.PLAYWRIGHT_NO_SCREENSHOTS === "1";

const routes = [
  { path: "/", name: "home" },
  { path: "/ja", name: "home-ja" },
  { path: "/components", name: "components" },
  { path: "/references", name: "references" },
] as const;

test.describe("docs visual smoke", () => {
  test.skip(skip, "PLAYWRIGHT_SKIP=1");

  for (const route of routes) {
    test(`${route.name} (${route.path}) soft screenshot`, async ({ page }) => {
      test.skip(noScreenshots, "PLAYWRIGHT_NO_SCREENSHOTS=1");

      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main#main")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);

      // Soft baseline: tolerate AA / font raster differences.
      // First run: playwright test --update-snapshots
      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        maxDiffPixelRatio: 0.15,
        fullPage: true,
      });
    });
  }
});
