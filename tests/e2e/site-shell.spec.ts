import { expect, test } from "@playwright/test";

test.describe("site shell navigation", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("desktop header exposes primary docs and mega menu", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    const header = page.locator(".site-header");
    await expect(header.getByRole("link", { name: "AwesomeDS home" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Components" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Motion" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Enter the Canon" })).toBeVisible();

    const more = header.locator(".nav-more").first();
    await more.locator("summary").click();
    await expect(more.getByRole("link", { name: "Foundations" })).toBeVisible();
    await more.getByRole("link", { name: "Foundations" }).click();
    await expect(page).toHaveURL(/\/en\/foundations$/);
  });

  test("mobile keeps the native disclosure keyboard-operable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ja", { waitUntil: "domcontentloaded" });

    const disclosure = page.locator("details.nav-disclosure");
    const menu = disclosure.locator(":scope > summary");
    const box = await menu.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

    await menu.focus();
    await page.keyboard.press("Enter");
    await expect(disclosure).toHaveAttribute("open", "");
    const canonLink = page.locator("#mobile-site-navigation a[href='/ja/canon']");
    await expect(canonLink).toBeVisible();

    await page.keyboard.press("Space");
    await expect(disclosure).not.toHaveAttribute("open", "");

    await menu.click();
    await page.locator("#mobile-site-navigation a[href='/ja/canon']").click();
    await expect(page).toHaveURL(/\/ja\/canon$/);
    await expect(disclosure).not.toHaveAttribute("open", "");
  });


  test("theme selection stays in sync when the shell crosses its responsive breakpoint", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    const desktopUtilities = page.locator(".site-header__utilities--desktop");
    await desktopUtilities.getByRole("button", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("details.nav-disclosure > summary").click();

    const mobileUtilities = page.locator(".site-header__utilities--mobile");
    await expect(mobileUtilities.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
  });
});

