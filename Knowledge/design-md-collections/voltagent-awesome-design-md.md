---
title: "VoltAgent awesome-design-md"
category: design-md-collections
type: repo
sources:
  - url: https://github.com/VoltAgent/awesome-design-md
    title: "VoltAgent/awesome-design-md: Curated collection of DESIGN.md analysis by developer focused websites"
  - url: https://getdesign.md/vercel/design-md
    title: "getdesign.md: Vercel DESIGN.md (preview and download page)"
  - url: https://stitch.withgoogle.com/docs/design-md/specification/
    title: "Google Stitch: DESIGN.md specification (proxy blocked, link recorded)"
  - url: https://github.com/google-labs-code/design.md
    title: "google-labs-code/design.md: A format specification for describing a visual identity to coding agents"
tags: [design-md, stitch, tokens, collection, voltagent, frontmatter]
updated: 2026-09-06
---

# VoltAgent awesome-design-md

## 概要

VoltAgent が運営する、実在する Web サイトから抽出した DESIGN.md のコレクション。README のバッジは 73 件を掲げ、リポジトリの `design-md/` には 74 ディレクトリがある（README に載っていない `slack` を含む）。各ファイルは Google Stitch の DESIGN.md 形式（YAML frontmatter + Markdown 本文）に従い、色・タイポグラフィ・角丸・余白・コンポーネントをトークンとして持つ。AI エージェントに「このファイルの見た目で作れ」と渡すことを目的にしている。

## 要点

- リポジトリ構成: `README.md`、`CONTRIBUTING.md`、`LICENSE`（MIT）、`design-md/<site>/DESIGN.md`。各サイトの `README.md` は本文を持たず、`https://getdesign.md/<site>/design-md` へ誘導する。
- README は各サイトに `DESIGN.md`、`preview.html`、`preview-dark.html` の 3 ファイルがあると書くが、クローン時点のリポジトリにあるのは `DESIGN.md` と誘導用 `README.md` のみ。プレビューは getdesign.md 側に移されている。
- 全 74 ファイルの合計は 40,372 行。1 ファイルあたりおよそ 450 から 550 行（`x.ai` 465 行、`zapier` 537 行、`linear.app` 548 行）。
- カテゴリ: AI & LLM Platforms、Developer Tools & IDEs、Backend/Database/DevOps、Productivity & SaaS、Design & Creative Tools、Fintech & Crypto、E-commerce & Retail、Media & Consumer Tech、Automotive、Retro Web（Dell 1996、Nintendo 2001）。
- README が掲げる 9 セクション: 1 Visual Theme & Atmosphere、2 Color Palette & Roles、3 Typography Rules、4 Component Stylings、5 Layout Principles、6 Depth & Elevation、7 Do's and Don'ts、8 Responsive Behavior、9 Agent Prompt Guide。
- 実ファイルの本文見出しは Stitch 仕様の順序に従う: `## Overview`、`## Colors`、`## Typography`、`## Layout`、`## Elevation & Depth`、`## Shapes`、`## Components`、`## Do's and Don'ts`。`linear.app` はさらに `## Responsive Behavior`、`## Iteration Guide`、`## Known Gaps` を持つ。README の 9 セクション表と実ファイルの見出しは一致しないので、読むときは実ファイルを正とする。
- frontmatter のトップレベルキー: `version: alpha`、`name`、`description`、`colors`、`typography`、`rounded`、`spacing`、`components`。本文はトークンを `{colors.primary}` の形で参照する。
- 貢献ルール: 既存ファイルの修正のみ受け付ける。新規 DESIGN.md の PR は品質維持のため受け付けない。PR 前に Issue を立てる。
- ライセンス表記: 抽出したトークンは公開 CSS の値であり、各サイトの視覚的アイデンティティの所有は主張しない。

## 具体的な値・ルール（あれば）

frontmatter から読み取った主要値（primary / canvas / rounded）。

| サイト | primary | canvas | rounded（主要） | 特徴 |
|---|---|---|---|---|
| vercel | `#171717` | `#ffffff` | xs 4 / sm 6 / md 8 / lg 12 / xl 16 / pill 100px | Geist、link `#0070f3`、ink `#171717` |
| linear.app | `#5e6ad2` | `#010102` | md 8 / lg 12 / xl 16 / pill 9999px | ink `#f7f8f8`、4 段の surface ladder |
| stripe | `#533afd` | `#ffffff` | xs 4 / sm 6 / md 8 / lg 12 / xl 16 | ink `#0d253d` |
| apple | `#0066cc` | `#ffffff` | xs 5 / sm 8 / md 11 / lg 18 / pill 9999px | ink `#1d1d1f` |
| notion | `#5645d4` | `#ffffff` | xs 4 / sm 6 / md 8 / lg 12 / xl 16 | surface `#f6f5f4`、ink `#1a1a1a` |
| claude | `#cc785c` | `#faf9f5` | xs 4 / sm 6 / md 8 / lg 12 / xl 16 | ink `#141413`、暖色キャンバス |
| supabase | `#3ecf8e` | `#ffffff` | xs 4 / sm 6 / md 8 / lg 12 / xl 16 | on-primary `#171717` |
| raycast | `#ffffff` | `#07080a` | xs 4 / sm 6 / md 8 / lg 10 / xl 16 | on-primary `#000000`、surface `#0d0d0d` |
| cursor | `#f54e00` | `#f7f7f4` | xs 4 / sm 6 / md 8 / lg 12 / xl 16 | ink `#26251e` |
| airbnb | `#ff385c` | `#ffffff` | sm 8 / md 14 / lg 20 / xl 32 | ink `#222222`、大きめの角丸 |
| figma | `#000000` | `#ffffff` | xs 2 / sm 6 / md 8 / lg 24 / xl 32 / pill 50px | 黒の primary |
| shopify | `#000000` | canvas-night `#000000` / canvas-light `#ffffff` | sm 5 / md 8 / lg 12 / xl 20 | ダーク優先 |

`linear.app/DESIGN.md` の本文に見られる書き方の例。

- タイポグラフィ表: token / Size / Weight / Line Height / Letter Spacing / Use の 6 列。`display-xl` 80px 600 1.05 -3.0px。`body` 16px 400 1.50 -0.05px。`button` 14px 500 1.20 0。
- Spacing: base 4px、`{spacing.xxs}` 4 から `{spacing.section}` 96 まで。カード内側 24px、CTA バナー 48px。
- Elevation 表: Level 0 は影も枠もなし、Level 1 は `surface-1` + 1px hairline、Level 2 は `surface-2` + hairline-strong。
- 「Note on Font Substitutes」で自社フォントの代替として Inter または Geist Sans、mono は JetBrains Mono / Geist Mono を挙げる。

## AwesomeDS への反映

- 採用: frontmatter に `colors` / `typography` / `rounded` / `spacing` / `components` を持ち、本文が `{colors.primary}` 形式でトークンを参照する構造。`AwesomeDS/DESIGN.md` の frontmatter はこのキー構成をそのまま使い、`version: 0.1.0` と `name: AwesomeDS` を与えた。
- 採用: 「primary はブランド色ではなく ink 系の黒でよい」という判断。vercel（`#171717`）、figma、shopify（`#000000`）、raycast（白 primary）のように、開発者向けプロダクトの多くが primary ボタンを無彩色にしている。AwesomeDS 第 2 節「Primary actions are ink on canvas」はこの観察に基づく。
- 採用: 角丸スケール xs 4 / sm 6 / md 8 / lg 12 / xl 16 / pill 9999px。vercel、stripe、notion、claude、supabase、cursor で同一の並びが観測できたため、AwesomeDS 第 5 節の 8px（コントロール）12px（カード）16px（ダイアログ）に落とした。
- 採用: Elevation を「Level 0 から 3」の表で書く形式（AwesomeDS 第 6 節）。
- 変更: README の 9 セクション構成ではなく、実ファイルの 8 見出し（Overview から Do's and Don'ts）と Stitch 仕様を基準にし、AwesomeDS では 12 節に拡張した（Responsive、Accessibility、Agent prompt guide を追加）。
- 不採用: `ink` を `#171717` や `#010102` のような固有値にすること。AwesomeDS は `#0a0a0a`（ink）と `#ffffff`（canvas）の純グレー軸にし、ブランド色と干渉しない中立を選んだ。
- 不採用: 本文中の em dash 多用。コレクションの description は em dash を多く含むが、AwesomeDS 第 9 節は UI コピーでの em dash を禁止している。

## 出典

- https://github.com/VoltAgent/awesome-design-md : README（73 件、9 セクション表、貢献ルール）、CONTRIBUTING.md、`design-md/*/DESIGN.md` 74 件をローカルクローンで読んだ。
- https://getdesign.md/vercel/design-md : 各サイトの README が誘導する先。プレビュー（preview.html / preview-dark.html）とダウンロードはここに移されている。
- https://stitch.withgoogle.com/docs/design-md/specification/ : README が参照する形式仕様。プロキシで取得不可、リンクのみ記録。
- https://github.com/google-labs-code/design.md : Stitch 仕様の GitHub 側リポジトリ。frontmatter キーと必須セクション順序の一次情報として使用。
