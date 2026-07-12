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
});
