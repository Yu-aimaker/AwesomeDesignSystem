import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Axe scans for representative docs routes.
 * Fails on every automated WCAG-tagged violation after hydration settles.
 * Set PLAYWRIGHT_SKIP=1 to skip.
 */
const skip = process.env.PLAYWRIGHT_SKIP === "1";

const routes = [
  "/en", "/ja", "/en/references", "/ja/references", "/en/components",
  "/en/brand", "/ja/brand",
  "/ja/brand/workbench", "/ja/components/alert-dialog", "/ja/components/tooltip", "/ja/motion/enter",
  "/ja/references/ref.apple.hig-accessibility",
] as const;

test.describe("docs a11y (axe)", () => {
  test.skip(skip, "PLAYWRIGHT_SKIP=1");

  for (const route of routes) {
    test(`no automated WCAG violations on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main#main")).toBeVisible();
      if (route.includes("/references/")) await expect(page.getByRole("heading", { name: "Apple HIG Accessibility" })).toBeVisible();
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      const summary = results.violations
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s)) — ${v.helpUrl}`,
        )
        .join("\n");

      expect(results.violations, summary || "unexpected accessibility violation").toEqual([]);
    });
  }

  test("forced-colors keeps focus, disabled, invalid, danger, and dialog boundaries visible", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await page.goto("/en/components", { waitUntil: "networkidle" });
    const primary = page.getByRole("button", { name: "Primary" });
    await primary.focus();
    expect(await primary.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("solid");
    const disabled = page.getByRole("button", { name: "Loading" });
    expect(await disabled.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    const danger = page.getByRole("button", { name: "Danger" });
    expect(await danger.evaluate((element) => getComputedStyle(element).borderStyle)).toBe("double");

    await page.goto("/en/components/input", { waitUntil: "networkidle" });
    const input = page.getByRole("textbox", { name: "Email" });
    await input.evaluate((element) => element.setAttribute("data-invalid", ""));
    expect(Number.parseFloat(await input.evaluate((element) => getComputedStyle(element).borderWidth))).toBeGreaterThanOrEqual(2);

    await page.goto("/en/components/dialog", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open dialog" }).click();
    const dialog = page.getByRole("dialog", { name: "Dialog" });
    expect(Number.parseFloat(await dialog.evaluate((element) => getComputedStyle(element).borderWidth))).toBeGreaterThanOrEqual(2);

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
});
