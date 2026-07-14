import { expect, test, type APIRequestContext } from "@playwright/test";
import { componentCatalog } from "../../packages/core/src/component-contracts";
import { motionRecipes } from "../../packages/motion/src/recipes";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

type ReferenceFixture = { id: string; language: string };

const references = readdirSync(path.resolve(process.cwd(), "content/references"))
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(path.resolve(process.cwd(), "content/references", file), "utf8")) as ReferenceFixture);

function chunks<T>(values: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(values.length / size) }, (_, index) => values.slice(index * size, (index + 1) * size));
}

async function expectHtml(request: APIRequestContext, url: string, expected: string[], label: string) {
  const response = await request.get(url);
  expect(response.status(), label).toBeLessThan(400);
  const html = await response.text();
  for (const text of expected) expect(html, `${label}: ${text}`).toContain(text);
  return html;
}

for (const [index, items] of chunks([...componentCatalog], 8).entries()) {
  test(`localized component SSR contracts ${index + 1}/${Math.ceil(componentCatalog.length / 8)}`, async ({ request }) => {
    for (const item of items) {
      const html = await expectHtml(request, `/ja/components/${item.slug}`, [item.name, "キーボード操作契約"], item.slug);
      expect(html, item.slug).not.toContain("No live preview for this slug");
    }
  });
}

test("a failed live preview cannot take down its component documentation", async ({ page }) => {
  await page.goto("/ja/components/button?preview=error", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Button" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "公開API" })).toBeVisible();
  await expect(page.locator('p[role="alert"]')).toContainText("ライブプレビューだけでエラー");
  await expect(page.getByRole("heading", { name: "コピー可能な実装例" })).toBeVisible();
});

for (const [index, recipes] of chunks([...motionRecipes], 5).entries()) {
  test(`reviewed Japanese motion contracts ${index + 1}/${Math.ceil(motionRecipes.length / 5)}`, async ({ request }) => {
    for (const recipe of recipes) {
      const html = await expectHtml(request, `/ja/motion/${recipe.intent}`, ["使用できる場面"], recipe.intent);
      expect(html, recipe.intent).not.toContain("この標準文書は未翻訳です。");
      expect(html, recipe.intent).not.toContain(recipe.purpose);
    }
  });
}

for (const [index, items] of chunks(references, 12).entries()) {
  test(`localized reference SSR contracts ${index + 1}/${Math.ceil(references.length / 12)}`, async ({ request }) => {
    for (const reference of items) {
      const expected = ["この情報源から得られる知見"];
      if (reference.language !== "ja") expected.push("この標準文書は未翻訳です。");
      await expectHtml(request, `/ja/references/${reference.id}`, expected, reference.id);
    }
  });
}
