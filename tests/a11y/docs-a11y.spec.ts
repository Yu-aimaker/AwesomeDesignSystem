import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Axe scans for representative docs routes.
 * Fails on critical/serious impact only (moderate/minor allowed).
 * Set PLAYWRIGHT_SKIP=1 to skip.
 */
const skip = process.env.PLAYWRIGHT_SKIP === "1";

const routes = ["/en", "/ja", "/en/references", "/ja/references", "/en/components", "/ja/brand/workbench"] as const;

test.describe("docs a11y (axe)", () => {
  test.skip(skip, "PLAYWRIGHT_SKIP=1");

  for (const route of routes) {
    test(`no critical/serious violations on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main#main")).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      const serious = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      const summary = serious
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s)) — ${v.helpUrl}`,
        )
        .join("\n");

      expect(serious, summary || "unexpected empty serious list").toEqual([]);
    });
  }
});
