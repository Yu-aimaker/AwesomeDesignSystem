---
title: "Notion, Figma, Raycast (比較)"
category: design-systems
type: product
sources:
  - url: https://github.com/voltagent/awesome-design-md/blob/main/design-md/notion/DESIGN.md
    title: "awesome-design-md: notion/DESIGN.md (実測)"
  - url: https://github.com/voltagent/awesome-design-md/blob/main/design-md/figma/DESIGN.md
    title: "awesome-design-md: figma/DESIGN.md (実測)"
  - url: https://github.com/voltagent/awesome-design-md/blob/main/design-md/raycast/DESIGN.md
    title: "awesome-design-md: raycast/DESIGN.md (実測)"
tags: [notion, figma, raycast, product-ui, compact, radius, neutrals, inter, variable-font]
updated: 2026-09-06
---

# Notion, Figma, Raycast (比較)

## 概要

3 つのプロダクト UI 主導の企業サイトを、neutrals、角丸、書体、密度の観点で比較する。Notion は暖色寄りの neutrals と紫の CTA、Figma は純黒と純白のモノクロームにパステルの色ブロック、Raycast は連続したダークモードと Inter の `ss03`。いずれもクローン済みの実測 DESIGN.md を資料とする。

## 要点

### Notion

- canvas `#ffffff`、surface `#f6f5f4`、surface-soft `#fafaf9`、hairline `#e5e3df`、hairline-strong `#c8c4be`。ink `#1a1a1a`、charcoal `#37352f` (プロダクト UI の本文色)、slate `#5d5b54`、steel `#787671`、stone `#a4a097`。neutrals は暖色 (褐色寄り) にずれる。
- primary `#5645d4` (pressed `#4534b3`)、brand-navy `#0a1530`、link-blue `#0075de`。機能カードにはパステルの tint 9 種 (peach `#ffe8d4`、rose `#fde0ec`、mint `#d9f3e1`、lavender `#e6e0f5`、sky `#dcecfa` など)。
- 書体 Notion Sans (Inter ベース)。display 64 / 56px 600、heading 48 / 36 / 28 / 22 / 18px 600、body 16px / 1.55、body-sm 14px / 1.5、caption 13px、micro 12px、micro-uppercase 11px + 1px。
- 角丸 4 / 6 / 8 / 12 / 16 / 20 / 24 / full。ボタン 8px、padding 10px 18px、14px / 500。
- モーダルの影 `rgba(15, 15, 15, 0.2) 0px 24px 48px -8px`。カードは 1px hairline。
- 余白 4 から 40、セクション 48 / 64 / 96、ヒーロー 120。

### Figma

- canvas `#ffffff`、ink `#000000`、hairline `#e6e6e6`、hairline-soft `#f1f1f1`、surface-soft `#f7f7f5`。中間のグレー文字ロールが存在しない。「body copy is always black at weight 320–340, and weight (not opacity) carries the hierarchy.」
- 色ブロック: lime `#dceeb1`、lilac `#c5b0f4`、cream `#f4ecd6`、pink `#efd4d4`、mint `#c8e6cd`、coral `#f3c9b6`、navy `#1f1d3d`。magenta `#ff3d8b` は販促ボタン限定。
- 書体 figmaSans (variable) を 320 / 330 / 340 / 450 / 480 / 540 / 700 という細かいウェイトで使う。display-xl 86px / 340 / 1.0 / -1.72px。body 18px / 320 / 1.45。eyebrow と caption は figmaMono、all caps、正のトラッキング (+0.54px, +0.60px)。
- CTA は全て pill (50px)。角丸 2 / 6 / 8 / 24 / 32 / pill。
- 影はほぼ使わず、色ブロックが標高の代わり。Level 2 は約 `0 4px 16px rgba(0,0,0,0.06)`。

### Raycast

- canvas `#07080a`、surface `#0d0d0d`、surface-elevated `#101111`、surface-card `#121212`。hairline `#242728`、hairline-soft `rgba(255,255,255,0.08)`。ink `#f4f4f6`、body `#cdcdcd`、mute `#9c9c9d`。
- primary は白 `#ffffff` の pill、on-primary `#000000`。アクセント (blue `#57c1ff`、red `#ff6161`、green `#59d499`、yellow `#ffc533`) はカテゴリのイラスト限定。
- 書体 Inter、`font-feature-settings: "calt", "kern", "liga", "ss03"` を全体に適用 (single-story の g)。display 64px / 600 / 1.1、body 16px / 400 / 1.6、button 14px / 500。トラッキングは常に正 (0.1 から 0.4px)。
- 角丸 4 / 6 (keycap) / 8 (ボタン) / 10 (カード) / 16 (ヒーローモック)。
- 「there are no drop shadows in the system」。面色ラダー + 1px hairline で標高。
- 最大幅約 1240px、ガター 24px、セクション 96px。

## 具体的な値・ルール

| 観点 | Notion | Figma | Raycast |
|---|---|---|---|
| canvas | `#ffffff` | `#ffffff` | `#07080a` |
| ink | `#1a1a1a` (UI は `#37352f`) | `#000000` | `#f4f4f6` |
| hairline | `#e5e3df` | `#e6e6e6` | `#242728` |
| neutrals の色味 | 暖色 | 無彩色 | 無彩色 (わずかに青) |
| 書体 | Notion Sans (Inter 系) | figmaSans (variable) | Inter + ss03 |
| 本文 | 16px / 400 / 1.55 | 18px / 320 / 1.45 | 16px / 400 / 1.6 |
| ボタン | 8px、14px / 500 | pill、20px / 480 | pill 白、14px / 500 |
| カード角丸 | 12 から 16px | 24px | 10px |
| 標高 | hairline + モーダル影 | 色ブロック | 面色ラダー |
| セクション余白 | 64 / 96 / 120px | 96px | 96px |

## AwesomeDS への反映

- 採用: 無彩色の neutrals (Figma、Raycast)。Notion の暖色 neutrals は採らない (DESIGN.md 2. Color 規則 3)。
- 採用: 「本文は 16px、ラベルとボタンは 14px / 500」(Notion、Raycast)。AwesomeDS `body` 16 / `label` 14 / 500。
- 採用: 8px のボタン角丸 (Notion、Raycast のボタン)。「Controls: 8px」(5. Shape)。
- 採用: hairline + 面色で標高を作り、影は浮くものだけ (Raycast、Notion のモーダル)。6. Depth and elevation。Notion のモーダル影 `0 24px 48px -8px rgba(15,15,15,.2)` を参考に、AwesomeDS Level 3 は `0 16px 48px -12px rgba(10,10,10,.18)`。
- 採用: 本文 1.6 (Raycast)。
- 翻案: Figma の「ウェイトで階層を作る」方針は、AwesomeDS では 400 / 500 / 600 の 3 段に整理した。320 から 540 の細かいウェイトは Geist と Noto Sans JP の variable 軸で可能だが、日本語では 300 台の可読性が落ちる。
- 翻案: Raycast の `ss03` のような stylistic set は、AwesomeDS では Geist の既定字形を使い、`font-feature-settings` は `tnum` と `palt` (見出し) のみに限定した。
- 不採用: pill ボタン (Figma、Raycast)。8px に統一。
- 不採用: Notion のパステル tint カード、Figma の色ブロック。「Use three identical cards in a row as a default」と「decorative blobs」を避ける方針 (9. Do not) に基づき、装飾色は `ds-creator` で追加する。
- 不採用: 11px の micro ラベルと正のトラッキング (Notion、Raycast)。最小 12px、本文 0。
- 不採用: Inter。Geist を採用 (理由は `vercel-geist.md` と `atlassian-carbon-polaris-primer.md` を参照)。

## 出典

- https://github.com/voltagent/awesome-design-md/blob/main/design-md/notion/DESIGN.md : クローン済み実測。ローカルコピーを読了。
- https://github.com/voltagent/awesome-design-md/blob/main/design-md/figma/DESIGN.md : クローン済み実測。ローカルコピーを読了。
- https://github.com/voltagent/awesome-design-md/blob/main/design-md/raycast/DESIGN.md : クローン済み実測。ローカルコピーを読了。
