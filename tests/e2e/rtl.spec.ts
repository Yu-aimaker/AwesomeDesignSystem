import { test, expect } from "@playwright/test";

/**
 * RTL direction smoke: the logical layout remains usable and inside the viewport.
 * Set PLAYWRIGHT_SKIP=1 to skip.
 */
const skip = process.env.PLAYWRIGHT_SKIP === "1";

test.describe("RTL direction", () => {
  test.skip(skip, "PLAYWRIGHT_SKIP=1");

  for (const route of ["/", "/components"] as const) {
    test(`main still visible with dir=rtl on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        document.documentElement.dir = "rtl";
      });

      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      await expect(page.locator("main#main")).toBeVisible();
      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading).toBeVisible();
      const primary = page.getByRole("complementary", { name: /^primary$/i });
      await expect(primary).toBeVisible();
      await expect(primary.getByRole("navigation", { name: /^site$/i })).toBeVisible();

      const layout = await page.evaluate(() => {
        const heading = document.querySelector("main#main h1")?.getBoundingClientRect();
        return {
          direction: getComputedStyle(document.documentElement).direction,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          headingLeft: heading?.left ?? -1,
          headingRight: heading?.right ?? Number.POSITIVE_INFINITY,
        };
      });
      expect(layout.direction).toBe("rtl");
      expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
      expect(layout.headingLeft).toBeGreaterThanOrEqual(0);
      expect(layout.headingRight).toBeLessThanOrEqual(layout.clientWidth + 1);
    });
  }
});
