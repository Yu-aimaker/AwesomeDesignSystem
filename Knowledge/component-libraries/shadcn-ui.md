---
title: "shadcn/ui"
category: component-libraries
type: library
sources:
  - url: https://github.com/shadcn-ui/ui
    title: "shadcn-ui/ui (source of ui.shadcn.com docs; the site itself is proxy blocked)"
  - url: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/(root)/index.mdx
    title: "shadcn/ui docs: Introduction"
  - url: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/(root)/theming.mdx
    title: "shadcn/ui docs: Theming"
  - url: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/(root)/cli.mdx
    title: "shadcn/ui docs: CLI"
  - url: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/(root)/components-json.mdx
    title: "shadcn/ui docs: components.json"
  - url: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/(root)/tailwind-v4.mdx
    title: "shadcn/ui docs: Tailwind v4"
  - url: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/registry/registry-item-json.mdx
    title: "shadcn/ui docs: registry-item.json"
  - url: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/registry/getting-started.mdx
    title: "shadcn/ui docs: Registry getting started"
  - url: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/changelog/2026-01-base-ui.mdx
    title: "shadcn/ui changelog: Base UI support (2026-01-20)"
  - url: https://registry.npmjs.org/shadcn/latest
    title: "npm: shadcn (CLI) latest"
tags: [shadcn, radix, base-ui, tailwind-v4, css-variables, registry, new-york, oklch]
updated: 2026-09-06
---

# shadcn/ui

## 概要

shadcn/ui はコンポーネントライブラリではなく「コンポーネントライブラリの作り方」。CLI がコンポーネントのソースをプロジェクトに複製し、開発者がそのコードを所有する。スタイルは CSS 変数（`--background` / `--foreground` の組）で表現し、Tailwind v4、React 19、Radix と Base UI の両方に対応する。Registry 機構により、任意のチームが自前の配布元を持てる。AwesomeDS の基礎ライブラリ。

## 要点

- 5 原則（Introduction）: Open Code（コードの最上層を直接編集できる）、Composition（全コンポーネントが共通の合成可能なインターフェース）、Distribution（フラットファイルのスキーマと CLI による配布）、Beautiful Defaults、AI-Ready（LLM が読み書きできる open code）。
- CLI（npm `shadcn`、最新 4.21.0）: `init`（`--template`、`--base`、`--preset`、`--defaults`、`--css-variables`、`--monorepo`、`--rtl`、`--pointer`）、`add [component]`（`--all`、`--overwrite`、`--path`、`--dry-run`、`--diff`）、`view`、`search`（別名 `list`）、`build`（registry JSON 生成、`--output`）、`docs`、`info`、`apply [preset]`（`--only theme,font`）、`preset`、`migrate`（`cn`、`icons`、`base-color`、`radix`、`rtl`）、`eject`（ユーティリティをインライン化して依存を外す）。
- `components.json`: `style` は `"new-york"`（推奨）と `"default"`（deprecated）、初期化後に変更不可。`tailwind.baseColor` は `neutral` / `stone` / `zinc` / `mauve` / `olive` / `mist` / `taupe`。`tailwind.cssVariables` は `true`（意味トークン）か `false`（インラインユーティリティ）で、切り替えには再インストールが要る。`rsc`、`tsx`、`aliases`（utils、components、ui、lib、hooks）、`registries`（URL テンプレートと認証ヘッダー）。
- Theming: 背景トークンは接尾辞なし、その上の文字とアイコンは `-foreground`（例 `primary` と `primary-foreground`）。既定の `--radius` は `0.625rem`（10px）。色は oklch。
- Tailwind v4 対応: `@theme inline` で CSS 変数を直接使う、HSL から oklch に移行、全 primitive に `data-slot` 属性、`forwardRef` を廃止して関数コンポーネントに、`w-* h-*` は `size-*` に、`tailwindcss-animate` は `tw-animate-css` に、`default` style は非推奨で新規は `new-york`。既存の v3 / React 18 プロジェクトは破壊的変更なし。
- React 19 と Next.js 15 対応は 2024-10-29 の changelog。
- Base UI 対応は 2026-01-20 の changelog。`npx shadcn create` の初期化で Radix か Base UI を選び、以後の API は同一。「Only the underlying implementation changes」。全コンポーネントの例が両方で再構築された。Radix 側は統合パッケージ `radix-ui`（最新 1.6.7、43 の `@radix-ui/react-*` を束ねる）。
- Registry: ルートに `registry.json`（単一ファイル、または `include` で分割）。`shadcn build` が `public/r/*.json` を生成。`npx shadcn@latest add https://acme.com/r/button.json` で直接、または `components.json` の `"registries": {"@acme": "https://acme.com/r/{name}.json"}` を設定して `npx shadcn@latest add @acme/button`。
- `registry-item.json` の型は 12 種: `registry:base`（完全なデザインシステム）、`registry:block`、`registry:component`、`registry:font`、`registry:lib`、`registry:hook`、`registry:ui`、`registry:page`（`target` 必須）、`registry:file`（`target` 必須）、`registry:style`、`registry:theme`、`registry:item`。フィールドは `name`、`type`、`title`、`description`、`files`、`dependencies`、`registryDependencies`、`cssVars`（light / dark / theme）、`css`、`meta`、`docs`、`categories`。Tailwind v4 では `tailwind` フィールドの代わりに `cssVars.theme` を使う。
- changelog フォルダには 2023-06 から 2026-09 までの月次ファイルがあり、2026 年だけで 27 件（Base UI、Radix 更新、presets、chat components、helpers、`cn` など）。

## 具体的な値・ルール（あれば）

既定テーマ（neutral、`:root`）の抜粋。

```css
--radius: 0.625rem;
--background: oklch(1 0 0);
--foreground: oklch(0.145 0 0);
--card: oklch(1 0 0);
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
--secondary: oklch(0.97 0 0);
--muted: oklch(0.97 0 0);
--muted-foreground: oklch(0.556 0 0);
--accent: oklch(0.97 0 0);
--destructive: oklch(0.577 0.245 27.325);
--border: oklch(0.922 0 0);
--input: oklch(0.922 0 0);
--ring: oklch(0.708 0 0);
```

`.dark` の抜粋。

```css
--background: oklch(0.145 0 0);
--foreground: oklch(0.985 0 0);
--card: oklch(0.205 0 0);
--primary: oklch(0.922 0 0);
--primary-foreground: oklch(0.205 0 0);
--secondary: oklch(0.269 0 0);
--muted-foreground: oklch(0.708 0 0);
--destructive: oklch(0.704 0.191 22.216);
--border: oklch(1 0 0 / 10%);
--input: oklch(1 0 0 / 15%);
--ring: oklch(0.556 0 0);
```

その他 `--chart-1` から `--chart-5`、`--sidebar*` 一式（sidebar、sidebar-foreground、sidebar-primary、sidebar-accent、sidebar-border、sidebar-ring）。

## AwesomeDS への反映

- 採用: 基礎ライブラリとして shadcn/ui（第 8 節「Base library: shadcn/ui on Radix primitives (Base UI is the accepted alternative). Install components into the project; do not import a pre-styled kit.」）。Open Code と Distribution の思想がそのまま AwesomeDS の運用方針。
- 採用: 「primary は無彩色」。shadcn の既定 `--primary: oklch(0.205 0 0)` は黒に近いグレー。AwesomeDS の `primary: #0a0a0a` / `on-primary: #ffffff` はこれと同じ判断で、アクセントをボタン色にしない。
- 採用: `background` / `foreground` の対で書くトークン命名の考え方。AwesomeDS は `canvas` / `ink`、`accent` / `on-accent`、`primary` / `on-primary` と Stitch 仕様に寄せた名前にしたが、対で定義する構造は同じ。`AwesomeDS/tokens/tailwind.css` で shadcn の変数名（`--background`、`--foreground`、`--primary`、`--border`、`--ring`、`--radius`）にマッピングして、CLI で入れたコンポーネントがそのまま動くようにする。
- 採用: `new-york` style、`cssVariables: true`、`baseColor: neutral`。AwesomeDS のニュートラルは純グレー（第 2 節 Rule 3）で、neutral の oklch（彩度 0）と一致する。
- 採用: Registry。本リポジトリの Web サイトから AwesomeDS 版コンポーネントを `registry:ui` / `registry:theme` として配布し、`@awesome-ds/button` の形で入れられるようにする。`registry:base` でデザインシステム全体を配る案も記録。
- 変更: 角丸。shadcn 既定 `--radius: 0.625rem`（10px）に対し、AwesomeDS は 8px（コントロール）12px（カード）16px（ダイアログ）の 3 段。`--radius` は 8px（`rounded.md`）にマッピングし、カードとダイアログは個別トークンで上書きする。
- 変更: `--ring`。shadcn 既定はグレー `oklch(0.708 0 0)` だが、AwesomeDS の focus-ring は accent `#2f5bea`（第 11 節）。
- 不採用: `default` style と `tailwind.cssVariables: false`。どちらも新規プロジェクトでは推奨されない。
- 記録: Base UI を選んだ場合の差分は Knowledge/component-libraries/base-ui.md に整理する。AwesomeDS はどちらでも同じトークンで動くことを要件にする。

## 出典

- https://github.com/shadcn-ui/ui : ドキュメントのソース。`apps/v4/content/docs/(root)/` と `changelog/` のファイル一覧を取得済み。ui.shadcn.com 本体はプロキシで取得不可。
- https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/(root)/index.mdx : 5 原則。取得済み。
- https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/(root)/theming.mdx : CSS 変数一覧と oklch 値、base color 一覧。取得済み。
- https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/(root)/cli.mdx : コマンドとフラグ。取得済み。
- https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/(root)/components-json.mdx : フィールドと許容値。取得済み。
- https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/(root)/tailwind-v4.mdx : v4 での変更点。取得済み。
- https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/registry/registry-item-json.mdx : 12 の item type とフィールド。取得済み。
- https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/registry/getting-started.mdx : build と namespaced registry。取得済み。
- https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/changelog/2026-01-base-ui.mdx : Base UI 対応の告知。取得済み。
- https://registry.npmjs.org/shadcn/latest : CLI の最新版 4.21.0、MIT。取得済み。
