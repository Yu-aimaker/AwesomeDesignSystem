---
title: "Playwright visual testing and axe-core"
category: tech-stack
type: library
sources:
  - url: https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/test-snapshots-js.md
    title: "Playwright docs: Visual comparisons (source of playwright.dev, which is proxy blocked)"
  - url: https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/accessibility-testing-js.md
    title: "Playwright docs: Accessibility testing"
  - url: https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright
    title: "@axe-core/playwright package (dequelabs/axe-core-npm)"
tags: [playwright, screenshot, tohavescreenshot, axe-core, accessibility, visual-regression, design-verifier]
updated: 2026-09-06
---

# Playwright visual testing and axe-core

## 概要

Playwright の `toHaveScreenshot()` は初回にリファレンス画像を生成し、以後の実行で差分を比較するビジュアル回帰の仕組み。`@axe-core/playwright` の `AxeBuilder` は同じページに対して WCAG の自動検査を行う。AwesomeDS では `design-verifier` スキルがこの 2 つを組み合わせ、トークンの適用、状態の網羅、コントラストと ARIA をスクリーンショットと違反リストで確認する。playwright.dev はプロキシで取得できないため、GitHub 上の同じドキュメントを読んだ。

## 要点

- 基本: `await expect(page).toHaveScreenshot();` 初回はリファレンスを作り、2 回目以降で比較する。名前を付けるなら `toHaveScreenshot('landing.png')`。
- 命名と保存先: 既定のファイル名は `testname-1-browser-platform.png` の形で、テストファイルごとの `example.spec.ts-snapshots/` に置かれる。PNG が既定、`.webp` 拡張子で WebP。OS とブラウザで描画が変わるため、リファレンスは実行環境ごとに分かれる。
- 更新: 意図した変更後は `--update-snapshots` で再生成。
- オプション: `maxDiffPixels`（許容する差分ピクセル数、例 `{ maxDiffPixels: 100 }`）、`maxDiffPixelRatio`、`threshold`、`stylePath`（撮影時に注入する CSS。動的要素を隠す）、`mask`、`fullPage`、`animations: "disabled"`、`caret`、`scale`。`playwright.config.ts` の `expect.toHaveScreenshot` にプロジェクト共通の既定を書ける。
- 非画像: `expect(value).toMatchSnapshot(name)` でテキストやバイナリを比較。内容の型は自動判定。
- axe: `npm install @axe-core/playwright`。`import AxeBuilder from '@axe-core/playwright'`、`const results = await new AxeBuilder({ page }).analyze(); expect(results.violations).toEqual([]);`。
- AxeBuilder のメソッド: `withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])` で基準を絞る、`withRules()` で規則 ID を指定、`include('#section')` / `exclude('#known-issue')` で範囲、`disableRules(['duplicate-id'])` で一時除外、`options()` で axe.run のオプション、`setLegacyMode()`。バージョンは axe-core の major.minor に追従。
- 運用: fixture で `AxeBuilder` の共通設定を再利用する。`testInfo.attach()` で結果 JSON をレポートに添付する。既知の違反はスナップショットで「指紋」を取り、変化したら気づく形にする。自動検査はコントラスト不足やラベル欠落を見つけるが、全てのアクセシビリティ問題は検出できないので手動確認と併用する。

## 具体的な値・ルール（あれば）

`playwright.config.ts` の共通設定例。

```ts
export default defineConfig({
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", caret: "hide" },
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 }, colorScheme: "light" } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, colorScheme: "light" } },
    { name: "dark", use: { viewport: { width: 1280, height: 800 }, colorScheme: "dark" } },
  ],
});
```

コンポーネント状態のスクリーンショット例。

```ts
test("button states", async ({ page }) => {
  await page.goto("/components/button");
  await expect(page.getByRole("button", { name: "Save" })).toHaveScreenshot("button-default.png");
  await page.getByRole("button", { name: "Save" }).hover();
  await expect(page.getByRole("button", { name: "Save" })).toHaveScreenshot("button-hover.png");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Save" })).toHaveScreenshot("button-focus.png");
});
```

axe の例。

```ts
const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
  .exclude("#third-party-widget")
  .analyze();
await test.info().attach("axe", { body: JSON.stringify(results, null, 2), contentType: "application/json" });
expect(results.violations).toEqual([]);
```

| 項目 | AwesomeDS の設定 |
|---|---|
| ビューポート | 390x844（第 10 節の 390px ヒーロー規則）、1280x800 |
| colorScheme | light と dark の両方（第 2 節 Rule 6） |
| `animations` | `"disabled"`（第 7 節の動きを撮影から除く） |
| `maxDiffPixelRatio` | 0.01 |
| axe タグ | wcag2a、wcag2aa、wcag21a、wcag21aa、wcag22aa（第 11 節 WCAG 2.2 AA） |
| 撮影する状態 | default、hover、focus-visible、active、disabled、loading、empty、error（第 8 節） |

## AwesomeDS への反映

- 採用: `design-verifier` スキルの検証手段を Playwright の `toHaveScreenshot` と `AxeBuilder` に固定する。第 12 節「run the checklist in components/checklist.md」の機械的な部分（コントラスト、ARIA、フォーカス可視、状態の存在）はこれで自動化し、残り（コピー、階層、余白の妥当性）はスクリーンショットを見て判断する。
- 採用: 390px と 1280px、light と dark の 4 組を最小のプロジェクト構成にする。第 10 節「Hero fits in the first viewport on a 390px wide phone」と第 2 節のダークモード規則を撮影で確認するため。
- 採用: `animations: "disabled"` と `caret: "hide"` を既定にし、第 7 節の動きが差分に混ざらないようにする。`prefers-reduced-motion` のエミュレーション（`page.emulateMedia({ reducedMotion: "reduce" })`）を別ケースとして追加し、第 7 節の reduced motion 対応を撮影で確かめる。
- 採用: axe のタグに `wcag22aa` を含める（第 11 節「WCAG 2.2 AA is the floor」、第 4 節のターゲットサイズ 24x24）。
- 採用: 状態ごとのスクリーンショットを第 8 節の必須状態一覧（hover、focus-visible、active、disabled、loading、skeleton、empty、error）と 1 対 1 に対応させ、欠けていれば `design-verifier` が不合格にする。
- 変更: OS 差による誤検知を避けるため、リファレンスは CI の Linux コンテナで生成し、ローカルでは `--update-snapshots` を禁止する運用にする。
- 不採用: `threshold` を緩めて差分を隠すこと。差分が出たら `stylePath` か `mask` で動的要素を除き、閾値は 0.01 に保つ。
- 記録: `ds-creator` が既存ブランドサイトから色やフォントを取得する際も Playwright を使う（Knowledge/skills/mattpocock-grill-me.md）。`page.evaluate(() => getComputedStyle(...))` で computed style を読む方法は awesome-design-md-jp の CONTRIBUTING が求める「実測値」に対応する。

## 出典

- https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/test-snapshots-js.md : `toHaveScreenshot` の使い方、オプション、命名、更新、`toMatchSnapshot`。取得済み。
- https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/accessibility-testing-js.md : `AxeBuilder` の使い方、タグ、include / exclude、disableRules、fixture、添付、限界。取得済み。
- https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright : パッケージ README（インストール、API メソッド、バージョン方針）。取得済み。
