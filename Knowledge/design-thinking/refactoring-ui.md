---
title: "Refactoring UI"
category: design-thinking
type: article
sources:
  - url: https://raw.githubusercontent.com/xCYBERx01/NEXPLACE/HEAD/docs/research/08-refactoring-ui.md
    title: "NEXPLACE docs: 08-refactoring-ui.md (Refactoring UI の要点ノート)"
  - url: https://raw.githubusercontent.com/Mte90/dotfiles/HEAD/.config/opencode/skills/design/design/foundations-of-design.md
    title: "Mte90/dotfiles: foundations-of-design.md (Refactoring UI の要点)"
  - url: https://www.refactoringui.com/
    title: "Refactoring UI (Adam Wathan & Steve Schoger)"
tags: [refactoring-ui, hierarchy, spacing, color-scale, shadows, wathan, schoger, tailwind]
updated: 2026-09-06
---

# Refactoring UI

## 概要

Refactoring UI は Adam Wathan と Steve Schoger による、開発者向けの視覚デザイン実務書 (2018)。階層、余白のシステム、色のシェード、影、タイプスケールを「系統的で繰り返せる判断」として説明し、その考え方は Tailwind CSS の既定値に反映されている。公式サイトは本環境から取得できなかったため、要点を整理した GitHub 上のノート 2 件を資料とした。引用はノートからの要約であり、原著の逐語ではない。

## 要点

- 設計観: 「Design is a set of systematic, repeatable decisions, not artistic intuition.」
- 階層: 「Not all elements equal」。主要要素を大きくするより、副次要素を小さく、軽く、低コントラストにして相対的に主要要素を立てる。ラベルより値を強調する。
- 余白: 「start with too much white space」。制約付きスケール 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256 を使い、隣り合う値は 25% 以上離す (差が知覚できない刻みを作らない)。
- 色: 色相ごとに 8 から 10 段のシェードを HSL で作る。グレー、primary 5 から 10 段、accent (green / yellow / red / blue)。「Increase saturation as lightness moves away from 50% else washed pastels」。グレースケールで組んでから色を入れる。
- 影: 直接光の小さく鋭い影 + 環境光の大きく柔らかい影の 2 層。5 段の影で十分。
- 文字: hand-picked scale 12, 14, 16, 18, 20, 24, 30, 36, 48, 64。小数を避ける。ウェイトは 400 から 500 と 600 から 700 の 2 グループ。
- ラベルと値: 「Name: Jane」のようにラベルを強調せず、値を大きく濃くし、ラベルは小さく薄くするか省く。
- ボタンの階層: primary は塗り、secondary は枠、tertiary は文字のみ。同じ画面で塗りボタンを複数並べない。
- 開発者に多い失敗 6 つ: 階層がない、余白が一貫しない、色が制御されていない、タイプスケールがない、データモデル駆動の情報設計、ボタン状態の区別がない。

## 具体的な値・ルール

| 項目 | Refactoring UI (ノート) | AwesomeDS |
|---|---|---|
| 余白スケール | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256 | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128 |
| タイプスケール | 12, 14, 16, 18, 20, 24, 30, 36, 48, 64 | 12, 14, 16, 18, 20, 28, 36, 56 |
| ウェイト | 400 から 500 / 600 から 700 | 400 / 500 / 600 |
| 色のシェード | 8 から 10 段 / 色相、HSL | ロール別に必要な段のみ、hex (生成は OKLCH) |
| 影 | 2 層 × 5 段 | 1 層 × 2 段 (Level 2, 3) + 罫線 |
| 階層 | 副次要素を弱める | ink / ink-secondary / ink-muted の 3 段 |

## AwesomeDS への反映

- 採用: 「副次要素を弱めて階層を作る」。AwesomeDS の文字色 3 段 (`#0a0a0a`, `#525252`, `#737373`) と、「Hierarchy comes from type size, weight and spacing, not from color or decoration」(DESIGN.md 1. Visual theme) はこの考え方。
- 採用: 制約付き余白スケールと 4px 基準。AwesomeDS は 20, 40, 80 を追加し、192 と 256 を落とした (4. Spacing and layout)。
- 採用: hand-picked のタイプスケールと小数の回避 (3. Typography)。
- 採用: 「グレースケールで組んでから色を入れる」。AwesomeDS は neutrals と ink だけで UI が成立し、accent は最後に 1 か所だけ足す構造。
- 採用: ボタン状態の区別。全部品に hover / focus-visible / active / disabled / loading (8. Components)。
- 翻案: 影は 2 層 × 5 段ではなく、罫線を優先し影は 2 段のみ (6. Depth and elevation)。Linear、Raycast、Figma の実測が「影をほぼ使わない」方向だったため。
- 翻案: 色のシェードは HSL ではなく OKLCH で生成し、公開するのは用途があるロールだけにした (`oklch-and-modern-css-color.md`、`radix-colors.md`)。
- 不採用: 700 ウェイト。見出しは 600 まで。
- 不採用: 30 と 64px。28 と 56 にして 4 の倍数を優先した。

## 出典

- https://raw.githubusercontent.com/xCYBERx01/NEXPLACE/HEAD/docs/research/08-refactoring-ui.md : 取得済み。階層、余白スケール、色シェード、影、タイプスケールの要点。
- https://raw.githubusercontent.com/Mte90/dotfiles/HEAD/.config/opencode/skills/design/design/foundations-of-design.md : 取得済み。設計観、グレースケール先行、6 つの失敗。
- https://www.refactoringui.com/ : ネットワーク制限で取得不可。原著の逐語引用は含めていない。
