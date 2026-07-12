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

type VisualRoute = {
  path: string;
  name: string;
  theme?: "dark" | "high-contrast";
  viewport?: { width: number; height: number };
  direction?: "rtl";
  reducedMotion?: boolean;
};

const routes: VisualRoute[] = [
  { path: "/", name: "home" },
  { path: "/", name: "home-dark", theme: "dark" },
  { path: "/", name: "home-high-contrast", theme: "high-contrast" },
  { path: "/ja", name: "home-ja" },
  { path: "/ja", name: "home-ja-mobile", viewport: { width: 320, height: 640 } },
  { path: "/components", name: "components" },
  { path: "/components", name: "components-rtl", direction: "rtl" },
  { path: "/motion", name: "motion-reduced", reducedMotion: true },
  { path: "/references", name: "references" },
  { path: "/ja/components/alert-dialog", name: "component-detail-ja-mobile", viewport: { width: 320, height: 640 } },
  { path: "/ja/motion/enter", name: "motion-detail-ja" },
  { path: "/ja/references/ref-apple-hig-accessibility", name: "reference-detail-ja-mobile", viewport: { width: 320, height: 640 } },
];

test.describe("docs visual smoke", () => {
  test.skip(skip, "PLAYWRIGHT_SKIP=1");

  for (const route of routes) {
    test(`${route.name} (${route.path}) soft screenshot`, async ({ page }) => {
      test.skip(noScreenshots, "PLAYWRIGHT_NO_SCREENSHOTS=1");

      if (route.viewport) await page.setViewportSize(route.viewport);
      if (route.reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });
      if (route.theme) {
        await page.addInitScript((theme) => {
          localStorage.setItem("ads-theme", theme);
          document.documentElement.setAttribute("data-theme", theme);
        }, route.theme);
      }
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main#main")).toBeVisible();
      if (route.direction) await page.locator("html").evaluate((element, direction) => element.setAttribute("dir", direction), route.direction);
      await page.evaluate(() => document.fonts.ready);

      // Soft baseline: tolerate AA / font raster differences.
      // First run: playwright test --update-snapshots
      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        maxDiffPixelRatio: 0.03,
        fullPage: true,
      });
    });
  }
});
