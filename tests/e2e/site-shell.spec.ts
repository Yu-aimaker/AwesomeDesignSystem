import { expect, test } from "@playwright/test";

test.describe("site shell navigation", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("desktop sidebar collapses from the keyboard and persists in server HTML", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    const shell = page.locator(".shell");
    const heading = page.getByRole("heading", { level: 1 });
    const toggle = page.getByRole("button", { name: "Collapse sidebar" });
    const headingBefore = await heading.boundingBox();

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toBeEnabled();
    await toggle.focus();
    await page.keyboard.press("Enter");

    await expect(shell).toHaveAttribute("data-sidebar-state", "collapsed");
    await expect(page.getByRole("button", { name: "Expand sidebar" })).toBeFocused();
    await expect(page.locator("#desktop-site-navigation")).toBeHidden();

    const reopen = page.getByRole("button", { name: "Expand sidebar" });
    const reopenBox = await reopen.boundingBox();
    expect(reopenBox?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(reopenBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    const headingAfter = await heading.boundingBox();
    expect(Math.abs((headingAfter?.y ?? 0) - (headingBefore?.y ?? 0))).toBeLessThan(1);

    const response = await page.request.get("/en");
    const serverHtml = await response.text();
    expect(serverHtml).toContain('data-sidebar-state="collapsed"');
    expect(serverHtml).toContain('aria-expanded="false"');

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(shell).toHaveAttribute("data-sidebar-state", "collapsed");
    await expect(page.getByRole("button", { name: "Expand sidebar" })).toHaveAttribute("aria-expanded", "false");

    await page.getByRole("button", { name: "Expand sidebar" }).focus();
    await page.keyboard.press("Space");
    await expect(shell).toHaveAttribute("data-sidebar-state", "expanded");
    await expect(page.getByRole("button", { name: "Collapse sidebar" })).toHaveAttribute("aria-expanded", "true");
  });

  test("mobile keeps the native disclosure keyboard-operable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ja", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "サイドバーを閉じる" })).toBeHidden();
    const disclosure = page.locator(".nav-disclosure");
    const menu = disclosure.locator("summary");
    const box = await menu.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

    await menu.focus();
    await page.keyboard.press("Enter");
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(page.locator("#mobile-site-navigation").getByRole("link", { name: "体系" })).toBeVisible();

    await page.keyboard.press("Space");
    await expect(disclosure).not.toHaveAttribute("open", "");

    await menu.click();
    await page.locator("#mobile-site-navigation").getByRole("link", { name: "体系" }).click();
    await expect(page).toHaveURL(/\/ja\/canon$/);
    await expect(disclosure).not.toHaveAttribute("open", "");
  });

  test("theme selection stays in sync when the shell crosses its responsive breakpoint", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    const desktopUtilities = page.locator(".rail-utilities--desktop");
    await desktopUtilities.getByRole("button", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".nav-disclosure summary").click();

    const mobileUtilities = page.locator(".rail-utilities--mobile");
    await expect(mobileUtilities.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
  });
});
