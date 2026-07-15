import { test, expect } from "@playwright/test";

/**
 * Narrow viewport reflow + reduced-motion media checks.
 * Set PLAYWRIGHT_SKIP=1 to skip.
 */
const skip = process.env.PLAYWRIGHT_SKIP === "1";

test.describe("zoom / reflow", () => {
  test.skip(skip, "PLAYWRIGHT_SKIP=1");

  test("representative routes reflow at 320x640 without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });

    for (const route of [
      "/en",
      "/en/references",
      "/en/brand",
      "/ja/brand",
      "/en/reports",
      "/ja/reports",
    ] as const) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main#main")).toBeVisible();
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(() => {
        const { scrollWidth, clientWidth } = document.documentElement;
        // Prefer documentElement; body can under-report depending on CSS.
        const body = document.body;
        const maxScroll = Math.max(scrollWidth, body.scrollWidth);
        const maxClient = Math.max(clientWidth, body.clientWidth);
        return { scrollWidth: maxScroll, clientWidth: maxClient };
      });

      expect(
        overflow.scrollWidth,
        `${route}: horizontal overflow (scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth})`,
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);
    }
  });

  test("motion page loads under prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/motion", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main#main")).toBeVisible();
    await expect(page.getByRole("heading", { name: /motion/i })).toBeVisible();
  });
});
