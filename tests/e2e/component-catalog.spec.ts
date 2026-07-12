import { expect, test } from "@playwright/test";
import { componentCatalog } from "../../packages/core/src/component-contracts";
import { motionRecipes } from "../../packages/motion/src/recipes";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

test("all component contracts have a working localized detail and live preview", async ({ page }) => {
  for (const item of componentCatalog) {
    const response = await page.goto(`/ja/components/${item.slug}`, { waitUntil: "domcontentloaded" });
    expect(response?.status(), item.slug).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1, name: item.name }), item.slug).toBeVisible();
    await expect(page.getByRole("heading", { name: "キーボード操作契約" }), item.slug).toBeVisible();
    await expect(page.locator("main"), item.slug).not.toContainText("No live preview for this slug");
  }
});

test("every motion recipe has localized Japanese chrome and an explicit English fallback", async ({ page }) => {
  for (const recipe of motionRecipes) {
    const response = await page.goto(`/ja/motion/${recipe.intent}`, { waitUntil: "domcontentloaded" });
    expect(response?.status(), recipe.intent).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1, name: recipe.intent })).toBeVisible();
    await expect(page.getByText("この標準文書は未翻訳です。", { exact: false })).toBeVisible();
    await expect(page.getByText("使用できる場面", { exact: true })).toBeVisible();
    await expect(page.locator('[lang="en"]')).not.toHaveCount(0);
  }
});

test("every reference has localized Japanese chrome or Japanese source content", async ({ page }) => {
  const directory = path.resolve(process.cwd(), "content/references");
  const files = (await readdir(directory)).filter((file) => file.endsWith(".json"));
  for (const file of files) {
    const reference = JSON.parse(await readFile(path.join(directory, file), "utf8")) as { id: string; title: string; language: string };
    const response = await page.goto(`/ja/references/${reference.id}`, { waitUntil: "domcontentloaded" });
    expect(response?.status(), reference.id).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1, name: reference.title }), reference.id).toBeVisible();
    await expect(page.getByRole("heading", { name: "この情報源から得られる知見" }), reference.id).toBeVisible();
    if (reference.language !== "ja") {
      await expect(page.getByText("この標準文書は未翻訳です。", { exact: false }), reference.id).toBeVisible();
    }
  }
});
