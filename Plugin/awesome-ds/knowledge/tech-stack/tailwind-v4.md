---
title: "Tailwind CSS v4"
category: tech-stack
type: library
sources:
  - url: https://raw.githubusercontent.com/tailwindlabs/tailwindcss.com/main/src/blog/tailwindcss-v4/index.mdx
    title: "Tailwind CSS v4.0 announcement (source of tailwindcss.com/blog, which is proxy blocked)"
  - url: https://raw.githubusercontent.com/tailwindlabs/tailwindcss.com/main/src/docs/theme.mdx
    title: "Tailwind docs: Theme variables"
  - url: https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/packages/tailwindcss/theme.css
    title: "tailwindcss packages/tailwindcss/theme.css (default theme)"
  - url: https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/packages/@tailwindcss-vite/README.md
    title: "@tailwindcss/vite README"
  - url: https://registry.npmjs.org/tailwindcss/latest
    title: "npm: tailwindcss latest"
  - url: https://github.com/tailwindlabs/tailwindcss
    title: "tailwindlabs/tailwindcss"
tags: [tailwind, v4, theme, css-first, oklch, vite, tokens]
updated: 2026-09-06
---

# Tailwind CSS v4

## 概要

Tailwind CSS v4.0 は 2025-01-22 に公開された、CSS ファーストの設定に移行したメジャー版。`tailwind.config.js` の代わりに CSS の `@theme` ブロックでデザイントークンを宣言し、それがユーティリティクラスの生成元になる。既定パレットは oklch、Vite 用に第一級プラグイン `@tailwindcss/vite` がある。npm 最新は 4.3.3（MIT）。AwesomeDS の `tokens/tailwind.css` はこの `@theme` を出力形式にしている。

## 要点

- 導入: `npm install tailwindcss @tailwindcss/vite`、`vite.config` に `tailwindcss()` プラグインを追加、CSS に `@import "tailwindcss";` の 1 行。テンプレートの自動検出により `content` 設定は不要。PostCSS の場合は `@tailwindcss/postcss`。
- 速度: Oxide エンジンでフルビルド 3.5 倍以上、増分ビルド 8 倍以上、新規 CSS のない増分はマイクロ秒単位（v3.4 比 182 倍）。
- 現代 CSS: cascade layers、`@property` で登録した custom properties、`color-mix()`、コンテナクエリ（プラグイン不要）、3D transform（`rotate-x-*`、`rotate-y-*`、`translate-z-*`）、グラデーション API 拡張（角度、conic、radial、補間モード）、`@starting-style` 対応、`not-*` variant、任意値を受ける動的ユーティリティ（grid columns、data 属性）。
- `@theme`: トップレベルにのみ書ける特別なブロック。変数は通常の CSS 変数として `:root` に出力されつつ、名前空間に応じてユーティリティを生む。`@theme inline { --font-sans: var(--font-geist); }` のように他の変数を参照するときは `inline` を付ける。名前空間ごと既定を消すには `--color-*: initial;`。
- 名前空間: `--color-*`（bg、text、fill など）、`--font-*`（font-family）、`--text-*`（font-size と行間）、`--font-weight-*`、`--tracking-*`、`--leading-*`、`--breakpoint-*`（responsive variant）、`--container-*`（container query variant）、`--spacing-*`、`--radius-*`、`--shadow-*`、`--ease-*`、`--animate-*`。
- `@tailwindcss/vite` の `optimize` オプション: 既定で本番ビルド時に Lightning CSS を有効化。`optimize: false` で無効、`optimize: { minify: false }` で最小化のみ無効。
- ブラウザ要件は v4 の現代 CSS 依存（cascade layers、`@property`、`color-mix()`）により v3 より上がっている。公式の対応ブラウザ一覧ページは本セッションで未取得のため、具体的な版は記載しない。

## 具体的な値・ルール（あれば）

既定テーマ（`theme.css`）の抜粋。

| 変数 | 値 |
|---|---|
| `--spacing` | `0.25rem`（`p-4` = 1rem） |
| `--radius-xs` / sm / md / lg / xl / 2xl / 3xl / 4xl | 0.125rem / 0.25rem / 0.375rem / 0.5rem / 0.75rem / 1rem / 1.5rem / 2rem |
| `--text-sm` / base / lg | 0.875rem（行間 1.43）/ 1rem（1.5）/ 1.125rem（1.56） |
| `--breakpoint-sm` / md / lg / xl / 2xl | 40rem / 48rem / 64rem / 80rem / 96rem（640 / 768 / 1024 / 1280 / 1536px） |
| `--ease-in` / out / in-out | `cubic-bezier(0.4, 0, 1, 1)` / `cubic-bezier(0, 0, 0.2, 1)` / `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--animate-*` | spin、ping、pulse、bounce |
| `--shadow-*` | 2xs（0 1px）から 2xl（`0 25px 50px -12px`） |

neutral スケール（oklch、彩度 0）。

| step | 値 |
|---|---|
| 50 | `oklch(98.5% 0 none)` |
| 100 | `oklch(97% 0 none)` |
| 200 | `oklch(92.2% 0 none)` |
| 300 | `oklch(87% 0 none)` |
| 400 | `oklch(70.8% 0 none)` |
| 500 | `oklch(55.6% 0 none)` |
| 600 | `oklch(43.9% 0 none)` |
| 700 | `oklch(37.1% 0 none)` |
| 800 | `oklch(26.9% 0 none)` |
| 900 | `oklch(20.5% 0 none)` |
| 950 | `oklch(14.5% 0 none)` |

zinc は 98.5% から 14.1% の 11 段で、わずかに青寄り。

## AwesomeDS への反映

- 採用: `@theme` を AwesomeDS のトークン配布形式にする（第 12 節「the Tailwind theme in tokens/tailwind.css」）。`--color-canvas`、`--color-ink`、`--color-accent` などを `@theme` に置き、`bg-canvas`、`text-ink`、`text-accent` が生成されるようにする。`tokens/tokens.css` の生 CSS 変数を参照する場合は `@theme inline` を使う。
- 採用: `--radius-*` を AwesomeDS の 4 / 6 / 8 / 12 / 16 / 24px に上書きする。Tailwind 既定（`--radius-md` 0.375rem = 6px、`--radius-lg` 0.5rem = 8px）と AwesomeDS の md 8px / lg 12px は一致しないため、`--radius-*: initial;` で消してから再定義する。
- 採用: `--breakpoint-*` は Tailwind 既定（640 / 768 / 1024 / 1280 / 1536）をそのまま採用（第 4 節 Breakpoints）。
- 採用: `--spacing: 0.25rem` の 4px 基準は AwesomeDS 第 4 節「4px base unit」と一致するので変更しない。
- 変更: `--ease-*`。Tailwind の `--ease-out: cubic-bezier(0, 0, 0.2, 1)` は AwesomeDS の `cubic-bezier(0.16, 1, 0.3, 1)` より減速が弱い。AwesomeDS は自前の `--ease-out` / `--ease-in` / `--ease-in-out` で上書きする（第 7 節）。
- 変更: 色。AwesomeDS のニュートラルは hex（`#fafafa`、`#f5f5f5`、`#e5e5e5`、`#d4d4d4`、`#a3a3a3`、`#737373`、`#525252`、`#262626`、`#0a0a0a`）で定義しており、Tailwind neutral の 50 / 100 / 200 / 300 / 400 / 500 / 600 / 800 / 950 に近い。`ds-creator` で色を増やすときは oklch で書き、`@theme` に足す。
- 不採用: `--color-*: initial` で既定パレットを全消しすること。status 色（success / warning / danger）は AwesomeDS が独自値を持つが、開発者がチャートなどで Tailwind 既定色を使う余地は残す。
- 不採用: `--animate-pulse` と `--animate-bounce` を UI に使うこと。第 7 節「Nothing loops forever except a progress indicator」に従い、skeleton のみ `animate-pulse` を許す。

## 出典

- https://raw.githubusercontent.com/tailwindlabs/tailwindcss.com/main/src/blog/tailwindcss-v4/index.mdx : 公開日、速度、機能一覧。取得済み（tailwindcss.com 本体はプロキシで取得不可）。
- https://raw.githubusercontent.com/tailwindlabs/tailwindcss.com/main/src/docs/theme.mdx : `@theme` の仕組み、名前空間、`inline`、`initial`。取得済み。
- https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/packages/tailwindcss/theme.css : 既定値（spacing、radius、text、breakpoint、ease、neutral / zinc の oklch）。取得済み。
- https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/packages/@tailwindcss-vite/README.md : Vite プラグインの `optimize` オプション。取得済み。
- https://registry.npmjs.org/tailwindcss/latest : 4.3.3、MIT。取得済み。
- https://github.com/tailwindlabs/tailwindcss : README（v4 の Vite 導入、ライセンス）。取得済み。
