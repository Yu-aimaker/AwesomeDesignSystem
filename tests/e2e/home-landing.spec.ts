import { expect, test } from "@playwright/test";

test("home LP hero exposes the system and install path", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1 })).toContainText(/AI slop|Ship taste/i);
  await expect(page.getByRole("link", { name: /Explore the system/i })).toBeVisible();
  await expect(page.getByRole("img", { name: /Dotto/i }).first()).toBeVisible();

  await page.getByRole("link", { name: /Install the skills/i }).click();
  await expect(page.locator("#install")).toBeVisible();
  await expect(page.locator(".install-code")).toContainText("install.sh");
  await expect(page.locator(".skill-list")).toContainText("/AwesomeDS");
});

test("home Japanese route keeps LP structure", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/ja", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /システムを見る/ })).toBeVisible();
  await expect(page.locator(".cmy-swatches")).toContainText("Magenta");
});
