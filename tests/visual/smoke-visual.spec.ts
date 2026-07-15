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
  linuxBaseline?: boolean;
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
  { path: "/ja", name: "home-ja-mobile", viewport: { width: 320, height: 640 }, linuxBaseline: true },
  { path: "/components", name: "components" },
  { path: "/components", name: "components-rtl", direction: "rtl" },
  { path: "/motion", name: "motion-reduced", reducedMotion: true },
  { path: "/references", name: "references", linuxBaseline: true },
  { path: "/ja/components/alert-dialog", name: "component-detail-ja-mobile", viewport: { width: 320, height: 640 } },
  { path: "/ja/motion/enter", name: "motion-detail-ja" },
  { path: "/ja/references/ref.apple.hig-accessibility", name: "reference-detail-ja-mobile", viewport: { width: 320, height: 640 }, linuxBaseline: true },
];

test.describe("docs visual smoke", () => {
  test.skip(skip, "PLAYWRIGHT_SKIP=1");

  for (const route of routes) {
    test(`${route.name} (${route.path}) soft screenshot`, async ({ page }) => {
      test.skip(noScreenshots, "PLAYWRIGHT_NO_SCREENSHOTS=1");

      if (route.viewport) await page.setViewportSize(route.viewport);
      if (route.reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });
      if (route.theme) {
        await page.context().addCookies([{ name: "awesome-theme", value: route.theme, domain: "127.0.0.1", path: "/" }]);
      }
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main#main")).toBeVisible();
      if (route.name === "reference-detail-ja-mobile") await expect(page.getByRole("heading", { name: "Apple HIG Accessibility" })).toBeVisible();
      if (route.name === "component-detail-ja-mobile") await expect(page.getByRole("heading", { name: "スクリーンリーダー契約" })).toBeVisible();
      if (route.direction) await page.locator("html").evaluate((element, direction) => element.setAttribute("dir", direction), route.direction);
      await page.evaluate(() => document.fonts.ready);

      // Soft baseline: tolerate AA / font raster differences.
      // First run: playwright test --update-snapshots
      // Long text-heavy pages accumulate small glyph-metric differences between
      // macOS and Linux even with the same bundled variable fonts and Chromium.
      // Keep reviewed Linux baselines instead of weakening regression tolerance.
      const snapshotName = route.linuxBaseline && process.platform === "linux"
        ? `${route.name}-linux.png`
        : `${route.name}.png`;
      await expect(page).toHaveScreenshot(snapshotName, {
        maxDiffPixelRatio: 0.03,
        fullPage: true,
      });
    });
  }
});
