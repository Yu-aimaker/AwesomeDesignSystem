---
title: "Goodpatch"
category: design-systems
type: product
sources:
  - url: https://github.com/yuki-takei/awesome-design-md-jp/blob/main/design-md/goodpatch/DESIGN.md
    title: "awesome-design-md-jp: goodpatch/DESIGN.md (実測 2026-05-21)"
  - url: https://goodpatch.com/en
    title: "Goodpatch | Prove the Power of Design"
  - url: https://goodpatch.com/blog/ux-engineer-design-system
    title: "UXエンジニアが知っておきたいデザインシステムの原則 | Goodpatch Blog"
  - url: https://goodpatch.com/blog/2026-04-cz-ds-01
    title: "良いデザインシステムとは？その基本と構造をグッドパッチが解説 | Goodpatch Blog"
  - url: https://goodpatch.com/blog/design-process-knowledge
    title: "大集合！Goodpatch流 実践デザインナレッジまとめ | Goodpatch Blog"
tags: [goodpatch, japan, design-company, yu-gothic, galano-grotesque, pill-cta, line-height]
updated: 2026-10-07
---

# Goodpatch

## 概要

Goodpatch (グッドパッチ) は東京のデザインカンパニーで、UI/UX デザイン、デザイン戦略、組織デザインを手がける。コーポレートサイトは `#f6f6f6` のニュートラルな背景に brand blue `#096fc8` のピル CTA、欧文 Galano Grotesque と和文 游ゴシック体 Pr6N を要素単位で切り替える構成、本文 line-height 2.0 という広い行間が特徴。goodpatch.com は本環境からアクセス不可のため、クローン済みの実測 DESIGN.md (2026-05-21 取得) を一次資料とし、ブログ記事は検索結果のタイトルと要約のみ参照した。

## 要点

- 色: brand blue `#096fc8` (CTA 背景、セクションラベル、サブヘッド)、背景 `#f6f6f6`、本文 `#333333`、muted `#6e6e6e`、フッター `#191b1f`。hover は `#81b0da`。
- ヒーローの「Design to empower」は 1 文字ずつ色を変えるオレンジからゴールドのグラデーション (`#f4963d`, `#f49c3d`, `#f3ab3e`, `#f2c63f`, `#f2d040`)。CSS gradient ではなく span 単位の個別色。
- 書体: 欧文は My Galano Grotesque (nav, header, CTA, 英語見出し)、和文は A+EqpB-游ゴシック体 Pr6N M (本文) と B (サブヘッド)。要素ごとに `font-family` を切り替え、単一のフォールバックチェーンを使わない。
- 代替書体の提案 (実測ファイル内): 欧文 DM Sans / Poppins、和文 Noto Sans JP / Yu Gothic / Hiragino Sans。
- サイズ: Hero H1 150px / 700 / 0.85 / -0.035em。セクション見出し 60px / 600 / -0.025em。本文 16px / 400 / line-height 2.0 / letter-spacing normal。和文サブヘッドは `halt` + -0.04em。
- CTA は radius `1584px` (完全ピル)、padding 16px 24px、14.5px / 400。フッター CTA カードは 8px。
- `box-shadow: none` が基本。フラット。ダークモード非対応。
- 余白は 8px グリッド推奨: 8 / 16 / 24 / 48、フッター上 104px。
- ブログ (検索結果要約): デザインシステムを「デザイナーが作るスタイルガイドではなく、デザイナー・開発者・PM を含むチーム全体で共有する原則とコンポーネントライブラリ」と定義し、「一貫性、柔軟性、再利用性、保守性」を要件に挙げる。デザイン原則は「Shared Language」として不要な議論を防ぐ。「Goodpatch Design Principles」という名の公開文書は検索結果では確認できなかった。

## 具体的な値・ルール

| Token | 値 | 用途 |
|---|---|---|
| brand blue | `#096fc8` | CTA、ラベル、サブヘッド |
| hover blue | `#81b0da` | ワークカード hover |
| text primary | `#333333` | 本文、見出し |
| text muted | `#6e6e6e` | フッター、パンくず |
| text subtitle | `#8f95a1` | タグ |
| background | `#f6f6f6` | ページ |
| footer bg | `#191b1f` | フッター |
| badge 受付中 | `#ff7669` | イベント |
| badge ケーススタディ | `#76b7ed` | 事例 |

| Role | Font | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Hero H1 | Galano Grotesque | 150px | 700 | 0.85 | -0.035em |
| Section heading (En) | Galano Grotesque | 60px | 600 | 0.95 | -0.025em |
| Work card title | Galano Grotesque | 40px | 600 | 1.1 | -0.025em (palt) |
| Teaser title (Jp) | 游ゴシック Pr6N B | 40px | 400 | 1.2 | normal (halt) |
| SubheadJp | 游ゴシック Pr6N B | 28px | 400 | 1.14 | -0.04em (halt) |
| Body | 游ゴシック Pr6N M | 16px | 400 | 2.0 | normal |

## AwesomeDS への反映

- 採用: 和文本文の行間を欧文より広く取る。Goodpatch の 2.0 は極端だが方向は同じで、AwesomeDS は日本語 1.8 (DESIGN.md 3. Typography)。
- 採用: `palt` / `halt` は見出しのみ、本文は `letter-spacing: normal`。AwesomeDS「`palt` on headings only, never on body」。
- 採用: 影なしのフラットな面と 1px 罫線。「Borders before shadows」。
- 採用: ブランド青をラベルと CTA に限定する抑制。AwesomeDS の accent 運用に近い。
- 翻案: 欧文と和文で font-family を要素単位に切り替える方式は採らず、`"Geist", "Noto Sans JP"` の単一チェーンで Latin と Japanese を分担させる。要素単位切り替えは CMS や生成 UI で崩れやすいため。
- 翻案: 8px グリッド推奨は 4px 基準 (4 の倍数) に細かくした。
- 不採用: 完全ピル CTA (`1584px`)。AwesomeDS のコントロールは 8px。
- 不採用: 150px / weight 700 のヒーローと span 単位グラデーション文字。display は 56px / 600 まで、文字へのグラデーションは使わない (9. Do not)。
- 不採用: 游ゴシック Pr6N (Adobe Fonts 依存)。オープンな Noto Sans JP を採用。
- 不採用: 和文サブヘッドの -0.04em。AwesomeDS は日本語の負トラッキングを禁止 (0 から 0.02em)。

## 出典

- https://github.com/yuki-takei/awesome-design-md-jp/blob/main/design-md/goodpatch/DESIGN.md : クローン済み実測 DESIGN.md。ローカルコピーを読了。全ての数値はここから。
- https://goodpatch.com/ (取得日 2026-10-07): og:title「Goodpatch | Prove the Power of Design」、og:image `https://goodpatch.com/ogp.png`。
- https://goodpatch.com/blog/ux-engineer-design-system : 検索結果で確認 (デザイン原則 = Shared Language)。アクセス不可。
- https://goodpatch.com/blog/2026-04-cz-ds-01 : 検索結果で確認 (良いデザインシステムの定義)。アクセス不可。
- https://goodpatch.com/blog/design-process-knowledge : 検索結果で確認。アクセス不可。
