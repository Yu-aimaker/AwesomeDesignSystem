---
title: "Font loading: Fontsource, next/font, subsetting, size-adjust"
category: tech-stack
type: guideline
sources:
  - url: https://github.com/fontsource/fontsource
    title: "fontsource/fontsource: Self-host Open Source fonts in neatly bundled NPM packages"
  - url: https://registry.npmjs.org/@fontsource-variable/noto-sans-jp/latest
    title: "npm: @fontsource-variable/noto-sans-jp latest"
  - url: https://registry.npmjs.org/geist/latest
    title: "npm: geist (Vercel font package) latest"
  - url: https://raw.githubusercontent.com/vercel/next.js/canary/docs/01-app/01-getting-started/13-fonts.mdx
    title: "Next.js docs: Fonts"
  - url: https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/reference/at-rules/@font-face/size-adjust/index.md
    title: "MDN: size-adjust (@font-face descriptor)"
  - url: https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/reference/at-rules/@font-face/font-display/index.md
    title: "MDN: font-display (@font-face descriptor)"
  - url: https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/at-rules/font-face.json
    title: "MDN browser-compat-data: css.at-rules.font-face (size-adjust, metric overrides, font-display)"
tags: [fonts, fontsource, next-font, geist, noto-sans-jp, subsetting, size-adjust, font-display, japanese]
updated: 2026-09-06
---

# Font loading: Fontsource, next/font, subsetting, size-adjust

## 概要

AwesomeDS は Geist（Latin）と Noto Sans JP（和文）をセルフホストで読み込む。Next.js では `next/font`、それ以外では Fontsource の npm パッケージか自前の `@font-face` を使う。和文フォントは容量が大きいため、unicode-range によるサブセット分割が前提。読み込み中のレイアウトシフトは `font-display` とフォールバックの `size-adjust` で抑える。本エントリは取得できた一次資料（Fontsource README、npm メタデータ、Next.js docs、MDN のソース、browser-compat-data）に基づく。

## 要点

- Fontsource: OSS フォントを個別の npm パッケージにしたモノレポ。セルフホストで性能、バージョン固定、プライバシー、オフライン対応を得る。固定ウェイトは `@fontsource/<name>`、可変フォントは `@fontsource-variable/<name>`。`import "@fontsource/roboto"` で既定（400、latin）、`import "@fontsource/roboto/latin.css"` や `"@fontsource/roboto/700.css"` でサブセットやウェイトを絞る。ライセンスは各フォントに従い、多くは SIL OFL 1.1、一部 Apache 2 や Ubuntu Font License。
- Noto Sans JP: `@fontsource-variable/noto-sans-jp` 5.3.0、OFL-1.1。サブセットとウェイト一覧は `metadata.json` に入るが、本セッションでは jsDelivr と unpkg がブロックされ未取得。
- Geist: npm `geist` 1.7.2、SIL OFL。「Geist is a new font family for Vercel, created by Vercel in collaboration with Basement Studio.」エクスポートは `geist/font/sans` と `geist/font/mono`（`next/font/local` を内包した Next.js 向け）。Next.js 以外では Fontsource の `@fontsource-variable/geist` か自前 `@font-face`。
- `next/font`: `next/font/google` と `next/font/local`。ビルド時にフォントを取得してセルフホストし、外部リクエストをなくす。`subsets: ['latin']` で分割、可変フォント推奨、固定なら `weight`。`variable` で CSS 変数名を出し、ルートレイアウトの `html` に `className` を付ける。`display` の既定と `adjustFontFallback` の既定値は API リファレンスにあり本セッションでは未取得。
- `font-display`（MDN）: `auto`（UA に任せる）、`block`（短い block 期間 + 無限の swap 期間）、`swap`（極短い block + 無限 swap）、`fallback`（極短い block + 短い swap）、`optional`（極短い block + swap なし）。具体的な秒数は UA 依存で MDN 本文には明記なし。
- `size-adjust`（MDN）: `@font-face` 内でグリフのアウトラインとメトリクスに倍率をかける。`size-adjust: 90%;` のように書き、既定は 100%。フォールバックフォントの見た目の大きさを Web フォントに合わせ、swap 時のリフローを減らす。関連の `ascent-override`、`descent-override`、`line-gap-override` は行の高さ方向を合わせる。
- 対応（browser-compat-data）: `size-adjust` は Chrome 92、Firefox 92、Safari 17。`ascent-override` / `descent-override` / `line-gap-override` は Chrome 87、Firefox 89、Safari は preview。`font-display` は Chrome 60、Firefox 58、Safari 11.1。
- 和文サブセット: Fontsource は unicode-range によるサブセット分割を README で挙げており、Noto Sans JP のような CJK フォントは多数のチャンクに分けて配信される（チャンク数は `metadata.json` が未取得のため未確認）。CSS は全 `@font-face` を宣言し、ブラウザはページで使われた文字の範囲だけを取得する。AwesomeDS 第 3 節「never ship one 5 MB file」はこの分割配信を前提にした規則。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| Latin | Geist（`geist` 1.7.2、OFL）。Next.js: `import { GeistSans } from "geist/font/sans"` |
| Mono | Geist Mono（`geist/font/mono`）。代替 JetBrains Mono |
| 和文 | Noto Sans JP（`@fontsource-variable/noto-sans-jp` 5.3.0、OFL-1.1、または `next/font/google` の `Noto_Sans_JP`） |
| font-display | 本文フォント `swap`。装飾フォント（あれば）`optional` |
| size-adjust 対応 | Chrome 92+、Firefox 92+、Safari 17+ |
| metric overrides 対応 | Chrome 87+、Firefox 89+、Safari 未対応（preview） |
| 分割 | Latin と Japanese は別サブセット。和文は unicode-range で分割配信 |

Next.js での指定例。

```tsx
import { GeistSans } from "geist/font/sans";
import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: "variable", variable: "--font-noto-sans-jp", display: "swap", preload: false });

<html className={`${GeistSans.variable} ${notoSansJP.variable}`}>
```

```css
@theme inline {
  --font-sans: var(--font-geist-sans), var(--font-noto-sans-jp), system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", sans-serif;
}
```

Vite での指定例。

```ts
import "@fontsource-variable/geist";
import "@fontsource-variable/noto-sans-jp";
```

フォールバック調整の例（Safari は size-adjust のみ有効）。

```css
@font-face {
  font-family: "Noto Sans JP Fallback";
  src: local("Hiragino Sans"), local("Yu Gothic UI");
  size-adjust: 100%;
  ascent-override: 116%;
  descent-override: 29%;
  line-gap-override: 0%;
}
```

## AwesomeDS への反映

- 採用: Geist + Noto Sans JP をセルフホストし、Latin と Japanese を別サブセットで配る（第 3 節）。Fontsource と next/font のどちらも unicode-range 分割を提供するので、1 ファイルの巨大フォントを避けられる。
- 採用: `font-display: swap` を本文フォントの既定にする。`block` は日本語で不可視期間が長くなり、`optional` は初回訪問で和文が常にフォールバックになるため。
- 採用: フォールバックの `size-adjust` と metric overrides を `tokens/tokens.css` に用意し、Hiragino Sans / Yu Gothic UI を Noto Sans JP の x-height と行高さに近づける。数値はフォントごとに計測して決める（上の例は書式のみ）。Safari で metric overrides が効かないことを既知の制約として記録。
- 採用: Next.js では `preload: false` を和文に付け、Latin だけを preload する。和文サブセットは数が多く、全部 preload するとネットワークを占有するため。
- 変更: 第 3 節「Load Latin and Japanese as two subsets」を、Next.js では `subsets: ["latin"]` を Noto Sans JP に指定し（和文グリフは unicode-range の遅延取得に任せる）、Vite では Fontsource の既定 import で両方を読む、と実装別に明記する。
- 不採用: Google Fonts の `<link>` 埋め込み。外部リクエスト、プライバシー、バージョン変動の理由（Fontsource README と taste-skill §3.A の双方が指摘）。
- 記録: `@fontsource-variable/noto-sans-jp` のサブセット一覧と `next/font` の `display` / `adjustFontFallback` の既定値は未取得。取得後に本エントリを更新する。

## 出典

- https://github.com/fontsource/fontsource : README（目的、import 形式、サブセットとウェイトの指定、ライセンス、CDN）。取得済み。
- https://registry.npmjs.org/@fontsource-variable/noto-sans-jp/latest : 5.3.0、OFL-1.1。取得済み（metadata.json は未取得）。
- https://registry.npmjs.org/geist/latest : 1.7.2、OFL、エクスポート、homepage。取得済み。
- https://raw.githubusercontent.com/vercel/next.js/canary/docs/01-app/01-getting-started/13-fonts.mdx : next/font の使い方。取得済み。
- https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/reference/at-rules/@font-face/size-adjust/index.md : 目的、構文、例。取得済み。
- https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/reference/at-rules/@font-face/font-display/index.md : 5 つの値と block / swap 期間の説明。取得済み。
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/at-rules/font-face.json : 各ディスクリプタの対応版。取得済み。
