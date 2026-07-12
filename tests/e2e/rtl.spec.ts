import { test, expect } from "@playwright/test";

/**
 * RTL direction smoke: main remains visible when dir=rtl is applied.
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
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }
});
