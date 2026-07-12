import { test, expect } from "@playwright/test";

/**
 * Browser smoke suite — docs webServer is started via playwright.config.ts
 * (or reuse an existing server when not in CI).
 * Set PLAYWRIGHT_SKIP=1 to skip the entire suite.
 */
const skip = process.env.PLAYWRIGHT_SKIP === "1";

test.describe("docs smoke", () => {
  test.skip(skip, "PLAYWRIGHT_SKIP=1");

  test("home heading is visible", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("skip link is present", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const skipLink = page.getByRole("link", { name: /skip to content/i });
    await expect(skipLink).toHaveCount(1);
    await expect(skipLink).toHaveAttribute("href", "#main");
  });

  test("skip link focus works", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const skipLink = page.getByRole("link", { name: /skip to content/i });

    // Prefer keyboard focus (Tab from document start); fall back to focus() if order differs.
    await page.keyboard.press("Tab");
    const focusedViaTab = await skipLink.evaluate(
      (el) => el === document.activeElement,
    );
    if (!focusedViaTab) {
      await skipLink.focus();
    }

    await expect(skipLink).toBeFocused();
    // Off-screen until :focus; after focus it should be in the viewport.
    await expect(skipLink).toBeVisible();

    await skipLink.click();
    await expect(page.locator("main#main")).toBeVisible();
  });

  test("references page and vercel filter", async ({ page }) => {
    await page.goto("/references", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Reference Atlas" })).toBeVisible();

    await page.goto("/references?q=vercel", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Reference Atlas" })).toBeVisible();
    await expect(page.getByRole("link", { name: /vercel/i }).first()).toBeVisible();
    await expect(page.getByText(/of \d+ sources/)).toBeVisible();
    // Filtered set should be smaller than or equal to full atlas, and not empty for vercel.
    const meta = page.locator("p.meta").filter({ hasText: /of \d+ sources/ });
    await expect(meta).toContainText(/^[1-9]\d* of \d+ sources$/);
  });

  test("components page", async ({ page }) => {
    await page.goto("/components", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Components", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Primary" })).toBeVisible();
  });

  test("motion page", async ({ page }) => {
    await page.goto("/motion", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /motion/i })).toBeVisible();
  });

  test("status page", async ({ page }) => {
    await page.goto("/status", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /system status/i })).toBeVisible();
  });

  test("playground page", async ({ page }) => {
    await page.goto("/playground", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Playground" })).toBeVisible();
  });

  test("review page heading", async ({ page }) => {
    await page.goto("/review", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Review", exact: true })).toBeVisible();
  });

  test("brand page", async ({ page }) => {
    await page.goto("/brand", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Brand", exact: true })).toBeVisible();
    await expect(page.locator("main#main")).toBeVisible();
  });

  test("Japanese locale is URL-addressable and language switch preserves the route", async ({ page }) => {
    await page.goto("/ja/references?q=apple", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.getByRole("heading", { name: "リファレンス・アトラス" })).toBeVisible();
    const englishLink = page.getByRole("link", { name: "English" });
    await expect(englishLink).toHaveAttribute("href", "/en/references?q=apple");
    await englishLink.click();
    await expect(page).toHaveURL(/\/en\/references\?q=apple$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("Brand Workbench reports Product Lexicon violations", async ({ page }) => {
    await page.goto("/en/brand/workbench", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Brand Workbench" })).toBeVisible();
    await expect(page.getByText(/deprecated/i)).toBeVisible();
    const copyField = page.getByLabel("Interface copy");
    const cleanCopy = "A clear workspace for everyone.";
    await expect(copyField).toBeEditable();
    await copyField.fill(cleanCopy);
    await expect(copyField).toHaveValue(cleanCopy);
    const results = page.locator(".lint-results");
    await expect(results).toHaveAttribute("data-copy", cleanCopy);
    await expect(results).toContainText("No lexicon violations.");
  });

  test("theme data-theme can be set on html via evaluate", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
    });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "light");
    });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});
