---
title: "Radix Colors (12 ステップスケール)"
category: color
type: library
sources:
  - url: https://raw.githubusercontent.com/radix-ui/website/main/data/colors/docs/palette-composition/understanding-the-scale.mdx
    title: "Radix Colors: Understanding the scale (website source)"
  - url: https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
    title: "Understanding the scale - Radix Colors"
tags: [radix, colors, scale, 12-step, semantic, apca, shadcn]
updated: 2026-09-06
---

# Radix Colors (12 ステップスケール)

## 概要

Radix Colors は WorkOS が公開する色パレットで、各色相を 12 ステップに分け、ステップ番号ごとに用途 (背景、コンポーネント面、罫線、塗り、文字) を固定している。shadcn/ui の基盤である Radix Primitives と組み合わせて使われることが多い。radix-ui.com は本環境から取得できなかったため、ドキュメントのソース (radix-ui/website リポジトリの mdx) を一次資料とした。

## 要点

- ステップ 1 と 2: 「Steps `1` and `2` are designed for app backgrounds and subtle component backgrounds.」
- ステップ 3 から 5: 「Step `3` is for normal states. Step `4` is for hover states. Step `5` is for pressed or selected states.」 (コンポーネントの背景)
- ステップ 6 から 8: 「Step `6` is designed for subtle borders on components which are not interactive... Step `7` is designed for subtle borders on interactive components. Step `8` is designed for stronger borders on interactive components and focus rings.」
- ステップ 9 と 10: 「Step `9` has the highest chroma of all steps in the scale... the purest step, the step mixed with the least amount of white or black.」 「Step `10` is designed for component hover states, where step `9` is the component's normal state background.」
- ステップ 11 と 12: 「Step `11` is designed for low-contrast text. Step `12` is designed for high-contrast text.」
- コントラスト保証: 「Steps `11` and `12`... are guaranteed to Lc 60 and Lc 90 APCA contrast ratio on top of a step `2` background from the same scale.」
- 同じ番号は色相を変えても同じ役割を持つため、accent 色を差し替えても UI の構造が崩れない。

## 具体的な値・ルール

| Step | 用途 |
|---|---|
| 1 | アプリ背景 |
| 2 | 控えめな背景 |
| 3 | UI 要素の背景 (通常) |
| 4 | UI 要素の背景 (hover) |
| 5 | UI 要素の背景 (pressed / selected) |
| 6 | 非インタラクティブな罫線、区切り |
| 7 | インタラクティブな要素の罫線 |
| 8 | 強い罫線、focus ring |
| 9 | 塗り (最も純度が高い) |
| 10 | 塗りの hover |
| 11 | 低コントラストの文字 (Lc 60 on step 2) |
| 12 | 高コントラストの文字 (Lc 90 on step 2) |

AwesomeDS のロールとの対応:

| Radix step | AwesomeDS role | Light 値 |
|---|---|---|
| 1 | canvas | `#ffffff` |
| 2 | canvas-soft / surface | `#fafafa` / `#ffffff` |
| 3 | surface-sunken | `#f5f5f5` |
| 4 から 5 | (hover / selected は accent-soft, selection) | `#e8eefc`, `#dbe4fd` |
| 6 | hairline | `#e5e5e5` |
| 7 から 8 | hairline-strong / focus-ring | `#d4d4d4` / `#2f5bea` |
| 9 | primary (ink) / accent | `#0a0a0a` / `#2f5bea` |
| 10 | primary-hover / accent-hover | `#262626` / `#264dd0` |
| 11 | ink-secondary, ink-muted | `#525252`, `#737373` |
| 12 | ink | `#0a0a0a` |

## AwesomeDS への反映

- 採用: 「番号 (ロール) が用途を決め、色相は差し替え可能」という構造。AwesomeDS は「Roles, not hues. Never reference a raw hex in a component; reference a role」(DESIGN.md 2. Color) と表現し、ロール名は Radix のステップ番号ではなく用途名 (canvas, surface, hairline, ink) にした。
- 採用: 背景 2 段、面 1 段、罫線 2 段、塗り 2 段、文字 3 段という段構成。上表のとおり Radix の 12 段に写像できる。
- 採用: ステップ 6 と 7 を分ける発想 (非インタラクティブな罫線と入力枠の罫線)。AwesomeDS では hairline `#e5e5e5` (カード) と hairline-strong `#d4d4d4` (入力、hover)。
- 翻案: 文字の 2 段 (11, 12) を 3 段 (ink, ink-secondary, ink-muted) にした。UI の補助テキストとプレースホルダーを区別するため。
- 翻案: APCA の Lc 60 / 90 保証は、AwesomeDS では WCAG 比率 (7.6:1, 4.7:1) で記述した。規格要件が WCAG 2.2 のため。
- 不採用: 12 段全てをトークンとして公開すること。AwesomeDS は使うロールだけを定義し、ステップ 4 と 5 に相当する hover / selected は accent 系の 2 色に限定した。
- 不採用: Radix のパレット hex そのもの。neutrals は Tailwind neutral と同じ無彩色を選んだ。

## 出典

- https://raw.githubusercontent.com/radix-ui/website/main/data/colors/docs/palette-composition/understanding-the-scale.mdx : 取得済み。12 ステップの定義と Lc 60 / 90 の保証。
- https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale : 公開ページ。ネットワーク制限で取得不可 (内容は上記ソースと同一)。
