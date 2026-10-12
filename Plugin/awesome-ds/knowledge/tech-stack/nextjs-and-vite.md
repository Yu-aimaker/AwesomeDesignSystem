---
title: "Next.js App Router and Vite"
category: tech-stack
type: library
sources:
  - url: https://raw.githubusercontent.com/vercel/next.js/canary/docs/01-app/01-getting-started/03-layouts-and-pages.mdx
    title: "Next.js docs: Layouts and Pages (source of nextjs.org, which is proxy blocked)"
  - url: https://raw.githubusercontent.com/vercel/next.js/canary/docs/01-app/01-getting-started/05-server-and-client-components.mdx
    title: "Next.js docs: Server and Client Components"
  - url: https://raw.githubusercontent.com/vercel/next.js/canary/docs/01-app/01-getting-started/13-fonts.mdx
    title: "Next.js docs: Fonts"
  - url: https://registry.npmjs.org/next/latest
    title: "npm: next latest"
  - url: https://raw.githubusercontent.com/vitejs/vite/main/docs/guide/index.md
    title: "Vite docs: Getting Started (source of vite.dev, which is proxy blocked)"
  - url: https://registry.npmjs.org/vite/latest
    title: "npm: vite latest"
  - url: https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/react-best-practices/SKILL.md
    title: "Vercel react-best-practices SKILL.md"
tags: [nextjs, app-router, rsc, next-font, vite, spa, rolldown, framework-choice]
updated: 2026-09-06
---

# Next.js App Router and Vite

## 概要

Next.js（16.3.4、MIT）の App Router は React Server Components を既定とし、`app/` のファイル規約（`layout.tsx`、`page.tsx`）でルーティングとレイアウトを組む。`next/font` はフォントをセルフホストしてレイアウトシフトをなくす。Vite（8.2.2、MIT）はネイティブ ESM の開発サーバーと Rolldown による本番バンドルを持つビルドツールで、SPA やコンポーネントカタログに向く。AwesomeDS は両方をサポートし、フォント読み込みの方法だけがフレームワークで変わる。

## 要点

- Next.js のファイル規約: `page.tsx` がルートの UI、`layout.tsx` が複数ページで共有され「state を保持し、再レンダーされない」UI。ルートレイアウト `app/layout.tsx` は必須で `html` と `body` を含む。フォルダが URL セグメント、`[slug]` が動的セグメント（`params` prop）。`<Link>`（`next/link`）がプリフェッチとクライアント遷移を担う。`searchParams` prop（Server）と `useSearchParams`（Client）。
- Server / Client Components: Server が既定。データ取得をデータ源の近くで行い、秘密情報を露出せず、クライアントに送る JavaScript を減らす。Client は state、イベント、ブラウザ API、effect、カスタムフックが必要なときに `"use client"` を先頭に書く。この境界以下の import と直接描画するコンポーネントはクライアントバンドルに入る。Server Component を Client Component の `children` として渡せる。RSC Payload はサーバーで描いた木の直列化で、Client Component の位置と JS の参照と props を含む。
- `next/font`: `next/font/google` と `next/font/local`。外部リクエストを除き、セルフホストでレイアウトシフトなし。`subsets: ['latin']` などでファイルを絞る。可変フォントを推奨し、固定ウェイトなら `weight` を指定。返り値の `className` か `variable` を要素に付け、ルートレイアウトに置けばアプリ全体に適用。`display` の既定や `adjustFontFallback` の詳細は API リファレンス（本セッションでは未取得）にある。
- Vite: 「faster and leaner development experience」を目的とするビルドツール。開発はネイティブ ESM + HMR、本番は Rolldown（vite 8 の依存 `rolldown ~1.2.4`）。`npm create vite@latest my-app -- --template react-ts`。`index.html` がエントリで、Vite がそれをソースとして扱う。Node.js 20.19+ または 22.12+。本番のブラウザ目標は各メジャー版で固定した日付の Baseline Widely Available（現行版は 2023 年中頃のブラウザ）。
- Vercel react-best-practices の優先順位（Knowledge/skills/vercel-agent-skills.md）: 1 waterfall の除去、2 バンドルサイズ、3 サーバー側性能、4 クライアント側データ取得、5 再レンダー、6 描画性能。Motion や GSAP を使う部品を Client の葉に隔離する（taste-skill §3.A）のは 2 と 5 のため。

## 具体的な値・ルール（あれば）

| 項目 | Next.js | Vite |
|---|---|---|
| バージョン | 16.3.4 | 8.2.2 |
| React peer | ^18.2.0 || ^19.0.0 | 任意（react-ts テンプレートは 19） |
| 描画モデル | RSC 既定、`"use client"` で境界 | SPA（CSR）。SSR は別途 |
| ルーティング | `app/` ファイル規約 | 別ライブラリ（react-router など） |
| フォント | `next/font/google` / `next/font/local` | `@fontsource-variable/*` の import か自前 `@font-face` |
| Tailwind v4 | `@tailwindcss/postcss` | `@tailwindcss/vite` |
| バンドラ | Turbopack / webpack | Rolldown |
| 向く用途 | 製品サイト、ドキュメント、認証付きアプリ | コンポーネントカタログ、Storybook 的な検証、SPA |

選択基準（AwesomeDS 実装ガイド用）。

1. SEO、メタデータ、ストリーミング、サーバー側データ取得が要る → Next.js。
2. デザインシステムのプレビューやビジュアル回帰テストの対象ページ、内部ツール → Vite SPA。
3. どちらでも AwesomeDS のトークンは `tokens/tokens.css`（生 CSS 変数）と `tokens/tailwind.css`（`@theme`）の 2 形式で同じ値を使う。

## AwesomeDS への反映

- 採用: RSC 既定と Client の葉への隔離。第 12 節の実装ガイドに「Motion、GSAP、three.js を使う部品は `'use client'` を先頭に置いた葉コンポーネントにする」を入れる（taste-skill §3.A と react-best-practices の bundle / re-render 規則に基づく）。
- 採用: `next/font` を Next.js でのフォント読み込みの唯一の手段にする。Google Fonts の `<link>` は本番で使わない（Knowledge/tech-stack/fonts-loading.md）。Geist は npm `geist`（`geist/font/sans`、`geist/font/mono`）から、Noto Sans JP は `next/font/google` の `Noto_Sans_JP` から読み、`variable` で `--font-geist` と `--font-noto-sans-jp` を出して `@theme inline` の `--font-sans` に渡す。
- 採用: Vite を本リポジトリの `web/`（コンポーネントカタログとビジュアル回帰の対象）に使う。理由は起動と HMR の速さ、`index.html` エントリの単純さ、Playwright との組み合わせが軽いこと。
- 変更: 第 10 節「`min-height: 100dvh`」など AwesomeDS の CSS 規則はフレームワーク非依存で書き、Next.js 固有の `next/image` や `next/link` は「使えるなら使う」推奨に留める。画像は第 10 節の `aspect-ratio` と `object-fit: cover` を必須にし、`next/image` はその実装手段の 1 つとする。
- 不採用: Pages Router。App Router の RSC 前提でガイドを書く。
- 記録: nextjs.org と vite.dev はプロキシで取得不可。GitHub 上の同じ Markdown を読んだ。`next/font` の API リファレンス（`display` 既定、`adjustFontFallback`）は未取得。

## 出典

- https://raw.githubusercontent.com/vercel/next.js/canary/docs/01-app/01-getting-started/03-layouts-and-pages.mdx : ファイル規約、ルートレイアウト、動的セグメント、Link。取得済み。
- https://raw.githubusercontent.com/vercel/next.js/canary/docs/01-app/01-getting-started/05-server-and-client-components.mdx : Server / Client の使い分け、`"use client"` 境界、RSC Payload。取得済み。
- https://raw.githubusercontent.com/vercel/next.js/canary/docs/01-app/01-getting-started/13-fonts.mdx : next/font の使い方、subsets、可変フォント推奨。取得済み。
- https://registry.npmjs.org/next/latest : 16.3.4、React peer。取得済み。
- https://raw.githubusercontent.com/vitejs/vite/main/docs/guide/index.md : 概要、ブラウザ目標、scaffolding、index.html エントリ、Node 要件。取得済み。
- https://registry.npmjs.org/vite/latest : 8.2.2、Rolldown 依存。取得済み。
- https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/react-best-practices/SKILL.md : 8 カテゴリの優先順位。取得済み。
