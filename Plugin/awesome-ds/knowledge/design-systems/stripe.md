---
title: "Stripe"
category: design-systems
type: product
sources:
  - url: https://stripe.com/
    title: "Stripe | Financial Infrastructure to Grow Your Revenue"
  - url: https://github.com/voltagent/awesome-design-md/blob/main/design-md/stripe/DESIGN.md
    title: "awesome-design-md: stripe/DESIGN.md (実測、Stripi-Inspired)"
  - url: https://www.shadcn.io/design/stripe
    title: "Stripe Design System for React - Indigo #533afd, Sohne, and 21 components"
  - url: https://www.designmd.run/blog/stripe-design-system-breakdown
    title: "Inside Stripe's Design System: A Token-Level Breakdown | DESIGN.md"
  - url: https://stripe.design/
    title: "Stripe Design Language Study"
tags: [stripe, fintech, sohne, gradient, tabular-nums, indigo, navy]
updated: 2026-10-07
---

# Stripe

## 概要

Stripe のマーケティングサイトは、深い navy の ink `#0d253d`、indigo `#533afd` の CTA、そしてほぼ全ページの上部 3 分の 1 を占めるメッシュグラデーションで知られる。書体は Klim Type Foundry の Sohne (variable `sohne-var`) を weight 300 で使い、`ss01` を全文に適用、金額を扱う箇所には `tnum` を使う。stripe.com と stripe.design は本環境からアクセス不可のため、クローン済みの実測 DESIGN.md と検索結果の要約を一次資料とした。

## 要点

- 色は 2 役。indigo `#533afd` は「one filled pill per band」の CTA、navy `#0d253d` は本文とダッシュボードモックの面。ruby `#ea2261`、magenta `#f96bee` はグラデーション内の色で「never a button」。
- canvas `#ffffff`、canvas-soft `#f6f9fc` (冷たいオフホワイト)、hairline `#e3e8ee`、input border `#a8c3de`。
- Sohne 300 の見出し。56px で -1.4px、48px で -0.96px、32px で -0.64px のトラッキング。「Thin weight is the brand.」
- `font-feature-settings: "ss01"` を body に適用 (single-story a など)。表の数値は `tnum` + -0.36 から -0.42px。
- 本文は 15 から 16px / 300 / 1.4。caption 13px / 400。
- 角丸 4 / 6 / 8 / 12 / 16 / pill。ボタンは pill、padding 8px 16px。input は 6px。カードは 12px。
- 余白は 2, 4, 8, 12, 16, 24, 32, 64。セクション 96px、比較や購入のページでは 32px に詰める。
- 影は navy tint: Level 1 `rgba(0,55,112,0.08) 0 1px 3px`、Level 2 `rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px`。「The gradient mesh IS the depth system.」 メッシュは CSS グラデーションではなく SVG または画像で実装される。
- 検索結果の要約 (shadcn.io / designmd): 「built around the variable font "sohne-var" at light weights (300–400), a deep navy-to-indigo brand palette anchored by #533afd」「Components are low-radius (4–6px), flat-to-minimal-shadow, and structured around an 8px base spacing grid」。

## 具体的な値・ルール

| Token | 値 | 用途 |
|---|---|---|
| primary | `#533afd` | CTA pill、link |
| primary-press | `#2e2b8c` | pressed |
| ink | `#0d253d` | 本文、navy 面 |
| ink-mute | `#64748d` | 補助テキスト |
| canvas-soft | `#f6f9fc` | 機能説明バンド |
| hairline | `#e3e8ee` | 罫線 |
| ruby | `#ea2261` | グラデーション、チャート |
| shadow-blue | `#003770` | 影の tint |

| Type role | Size | Weight | Line height | Tracking | Feature |
|---|---|---|---|---|---|
| display-xxl | 56px | 300 | 1.03 | -1.4px | ss01 |
| display-xl | 48px | 300 | 1.15 | -0.96px | ss01 |
| display-lg | 32px | 300 | 1.1 | -0.64px | ss01 |
| body-lg | 16px | 300 | 1.4 | 0 | ss01 |
| body-tabular | 14px | 300 | 1.4 | -0.42px | tnum |
| button-md | 16px | 400 | 1.0 | 0 | ss01 |
| caption | 13px | 400 | 1.4 | -0.39px | tnum |

## AwesomeDS への反映

- 採用: 数値には `font-variant-numeric: tabular-nums` (DESIGN.md 3. Typography)。Stripe の `tnum` の使い方 (金額と数値の列) をそのまま採用した。
- 採用: 影を ink で tint する考え方。Stripe は navy `rgba(0,55,112,…)`、AwesomeDS は `rgba(10,10,10,…)`。「Shadows are tinted with the ink color, never pure black」(6. Depth and elevation)。
- 採用: CTA を 1 バンドに 1 つ。「One primary button per view」(8. Components)。
- 採用: 角丸 4 / 6 / 8 / 12 / 16 の刻み。
- 翻案: 冷たいオフホワイト `#f6f9fc` は採用せず、無彩色の `#fafafa` にした。ブランド色と干渉しない neutrals を優先 (2. Color 規則 3)。
- 不採用: weight 300 の見出し。Apple HIG も Light 系を避けるよう勧めており、日本語フォントでは 300 の再現性が低い。AwesomeDS は見出し 600。
- 不採用: メッシュグラデーションの hero。「No gradients on backgrounds」(1. Visual theme)。Stripe の gradient はブランド資産であり、汎用システムに持ち込むと「AI default」に見える。
- 不採用: pill ボタン。AwesomeDS のコントロールは 8px。
- 不採用: 本文の負トラッキングと 1.4 の行間。AwesomeDS は本文 0 / 1.6。
- 不採用: proprietary な Sohne。Geist を採用。

## 出典

- https://github.com/voltagent/awesome-design-md/blob/main/design-md/stripe/DESIGN.md : クローン済み実測トークン。ローカルコピーを読了。
- https://www.shadcn.io/design/stripe : 検索結果で確認 (sohne-var 300-400、#533afd、4-6px radius、8px grid)。サイト自体はアクセス不可。
- https://www.designmd.run/blog/stripe-design-system-breakdown : 検索結果で確認。アクセス不可。
- https://stripe.design/ : 検索結果で確認。アクセス不可。
- https://stripe.com/ (取得日 2026-10-07): og:title「Stripe | Financial Infrastructure to Grow Your Revenue」、og:image は Stripe CDN JPEG。
- stripe.com/blog の個別記事は本エントリに含めていない。
