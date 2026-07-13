import { expect, test } from "@playwright/test";

test("primary knowledge routes remain readable without JavaScript", async ({ page }) => {
  for (const route of ["/en", "/en/canon", "/en/motion", "/en/references", "/ja"]) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBeLessThan(400);
    await expect(page.locator("main#main"), route).toBeVisible();
    await expect(page.locator("main#main"), route).not.toBeEmpty();
  }
});

test("native component fallbacks remain operable without JavaScript", async ({ page }) => {
  await page.goto("/en/components/accordion", { waitUntil: "domcontentloaded" });
  const disclosure = page.locator("details").first();
  await expect(disclosure).toBeVisible();
  await disclosure.locator("summary").click({ force: true });
  await expect(disclosure).toHaveAttribute("open", "");

  await page.goto("/en/components/input", { waitUntil: "domcontentloaded" });
  const input = page.getByRole("textbox", { name: "Email" });
  await input.fill("reader@example.com");
  await expect(input).toHaveValue("reader@example.com");

  await page.goto("/en/components/link", { waitUntil: "domcontentloaded" });
  const link = page.getByRole("link", { name: "Open Atlas" });
  await expect(link).toHaveAttribute("href", "/en/references");
});

test("motion documentation remains visible when animation helpers cannot hydrate", async ({ page }) => {
  await page.goto("/en/motion/enter", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "enter" })).toBeVisible();
  await expect(page.getByText("Introduce new content without layout thrash")).toBeVisible();
});
