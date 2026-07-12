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
    const results = page.locator(".lint-results");
    await expect.poll(async () => {
      await copyField.fill(cleanCopy);
      return results.getAttribute("data-copy");
    }, { message: "hydrated workbench processes edited copy" }).toBe(cleanCopy);
    await expect(copyField).toHaveValue(cleanCopy);
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

  test("Japanese dynamic detail routes localize their instructional chrome", async ({ page }) => {
    await page.goto("/ja/components/button", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "状態マトリクス" })).toBeVisible();
    await expect(page.locator("main").getByRole("link", { name: "コンポーネント" })).toHaveAttribute("href", "/ja/components");
    await expect(page.getByText(/未翻訳/)).toBeVisible();

    await page.goto("/ja/motion/enter", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("使用できる場面")).toBeVisible();
    await expect(page.getByText("パフォーマンス")).toBeVisible();

    await page.goto("/ja/references/ref.apple.hig", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "この情報源から得られる知見" })).toBeVisible();
  });

  test("Canon frontmatter is hidden and internal Markdown links resolve", async ({ page, request }) => {
    const response = await page.goto("/ja/canon/brand/voice-tone-matrix", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("main#main")).not.toContainText("updated: 2026");
    await page.goto("/ja/canon/components/components", { waitUntil: "domcontentloaded" });
    const internal = page.locator('main a[href*="foundations/tokens"]').first();
    await expect(internal).toHaveAttribute("href", /foundations\/tokens(?!\.md)/);
    const href = await internal.getAttribute("href");
    expect(href).toBeTruthy();
    const target = await request.get(new URL(href!, page.url()).toString());
    expect(target.status()).toBeLessThan(400);
  });

  test("docs responses include defense-in-depth security headers", async ({ request }) => {
    const response = await request.get("/en/canon");
    expect(response.headers()["content-security-policy"]).toContain("object-src 'none'");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  });
});
