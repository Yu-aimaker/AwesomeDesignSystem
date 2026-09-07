---
title: "WCAG 2.2 (UI に関わる達成基準)"
category: platform-guidelines
type: guideline
sources:
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/20/contrast-minimum.html
    title: "WCAG 1.4.3 Contrast (Minimum) source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/21/non-text-contrast.html
    title: "WCAG 1.4.11 Non-text Contrast source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/21/text-spacing.html
    title: "WCAG 1.4.12 Text Spacing source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/21/animation-from-interactions.html
    title: "WCAG 2.3.3 Animation from Interactions source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/20/focus-visible.html
    title: "WCAG 2.4.7 Focus Visible source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/focus-not-obscured-minimum.html
    title: "WCAG 2.4.11 Focus Not Obscured (Minimum) source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/focus-appearance.html
    title: "WCAG 2.4.13 Focus Appearance source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/dragging-movements.html
    title: "WCAG 2.5.7 Dragging Movements source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/target-size-minimum.html
    title: "WCAG 2.5.8 Target Size (Minimum) source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/redundant-entry.html
    title: "WCAG 3.3.7 Redundant Entry source (w3c/wcag)"
  - url: https://github.com/Myndex/SAPC-APCA
    title: "Myndex/SAPC-APCA: APCA Accessible Perceptual Contrast Algorithm"
tags: [wcag, accessibility, contrast, focus, target-size, motion, apca]
updated: 2026-09-06
---

# WCAG 2.2 (UI に関わる達成基準)

## 概要

WCAG 2.2 は W3C の Web アクセシビリティ規格で、2023 年に勧告された。2.1 に対して 2.4.11 Focus Not Obscured、2.5.8 Target Size (Minimum)、2.5.7 Dragging Movements、3.3.7 Redundant Entry などが追加された。www.w3.org は本環境からアクセス不可だったため、規格の原稿を管理する GitHub リポジトリ `w3c/wcag` の達成基準ソースから規範文を取得した。

## 要点

- 1.4.3 Contrast (Minimum), AA: 文字と文字画像のコントラスト比は 4.5:1 以上。大きな文字は 3:1。ロゴと非アクティブ要素は対象外。
- 1.4.11 Non-text Contrast, AA: UI コンポーネントとグラフィカルオブジェクトは隣接色に対して 3:1 以上。「User Interface Components and Graphical Objects」の両方が対象。
- 1.4.12 Text Spacing, AA: 行間 1.5 倍、段落後 2 倍、字間 0.12 倍、語間 0.16 倍に変更しても内容と機能が失われないこと。
- 2.3.3 Animation from Interactions, AAA: 操作で起きるモーションアニメーションは無効化できること (機能や情報に必須の場合を除く)。
- 2.4.7 Focus Visible, AA: キーボード操作可能な UI には、フォーカスインジケーターが見えるモードがあること。
- 2.4.11 Focus Not Obscured (Minimum), AA: フォーカスを受けた要素が、作者が作ったコンテンツで完全に隠れないこと。sticky header や cookie バナーが典型的な違反源。
- 2.4.12 Focus Not Obscured (Enhanced), AAA: 一部も隠れないこと。
- 2.4.13 Focus Appearance, AAA: インジケーターの面積が「2 CSS px 太さの外周」以上で、フォーカス前後で 3:1 以上のコントラスト差。
- 2.5.7 Dragging Movements, AA: ドラッグで行う機能は、ドラッグなしの単一ポインタ操作でも達成できること。
- 2.5.8 Target Size (Minimum), AA: ポインタ入力の対象は 24 x 24 CSS px 以上。例外は Spacing (24px 円が重ならない配置)、Equivalent、Inline、User Agent Control、Essential。
- 3.3.7 Redundant Entry, A: 同じプロセス内で以前入力した情報は自動入力または選択可能にする。

## 具体的な値・ルール

| 達成基準 | Level | 数値 |
|---|---|---|
| 1.4.3 Contrast (Minimum) | AA | 本文 4.5:1、大きな文字 3:1 |
| 1.4.11 Non-text Contrast | AA | UI 部品・図形 3:1 |
| 1.4.12 Text Spacing | AA | 行間 1.5、段落後 2.0、字間 0.12、語間 0.16 (font-size 倍) |
| 2.3.3 Animation from Interactions | AAA | 無効化可能 |
| 2.4.7 Focus Visible | AA | 可視モードが存在 |
| 2.4.11 Focus Not Obscured (Minimum) | AA | 完全に隠れない |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | 一部も隠れない |
| 2.4.13 Focus Appearance | AAA | 2 CSS px 外周相当の面積、3:1 |
| 2.5.7 Dragging Movements | AA | 単一ポインタ代替 |
| 2.5.8 Target Size (Minimum) | AA | 24 x 24 CSS px |
| 3.3.7 Redundant Entry | A | 自動入力または選択 |

原文の例: 2.5.8 「The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except when: ...」。2.4.11 「When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content.」

### APCA についての注記

APCA (Accessible Perceptual Contrast Algorithm) は WCAG 3 に向けて開発中の知覚コントラスト指標で、Lc 0 から Lc 105 程度のスケールを持つ。WCAG 2 の比率は暗い色のコントラストを過大評価する (「4.5:1 can be functionally unreadable when a color is near black」) と Myndex は主張している。現時点で法的・規格的な要求は WCAG 2.2 の比率であり、APCA は補助指標として使う。詳細は `Knowledge/color/contrast-and-accessible-color.md`。

## AwesomeDS への反映

- 採用: 「WCAG 2.2 AA is the floor」(DESIGN.md 11. Accessibility)。上表の AA 項目を全て満たすことを既定にした。
- 採用: 本文 4.5:1、大きな文字と UI 境界 3:1 (2. Color 規則 4)。`ink-secondary #525252` は白地で 7.6:1、`ink-muted #737373` は 4.7:1 と、値ごとに比率を記載している。
- 採用: 24 x 24 をデスクトップの最小ターゲットにし、モバイルは HIG に合わせて 44 x 44 (4. Spacing and layout)。ボタン既定高さ 40px、小 32px はいずれも 24px を超える。
- 採用: フォーカスリングは 2px solid accent + 2px offset (11. Accessibility)。2.4.13 の「2 CSS px 外周」を AAA だが既定で満たす設計。`accent #2f5bea` は白地で 3:1 を超える。
- 採用: `prefers-reduced-motion: reduce` で transform を止め opacity のみ残す (7. Motion)。2.3.3 は AAA だが既定で対応。
- 採用: 行間 1.6 (日本語 1.8) は 1.4.12 の 1.5 倍を常に上回る。
- 翻案: 2.4.11 への対応として、sticky なヘッダーやトーストが焦点を隠さないようコンポーネントのチェックリスト (`components/checklist.md`) で確認する運用にした。
- 不採用: AAA の 7:1 コントラストを既定にすること。`ink-muted` はプレースホルダー用途に留め、本文は `ink` と `ink-secondary` で 7:1 以上になるようにしている。

## 出典

- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/20/contrast-minimum.html : 1.4.3 の規範文と例外。
- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/21/non-text-contrast.html : 1.4.11。
- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/21/text-spacing.html : 1.4.12。
- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/21/animation-from-interactions.html : 2.3.3。
- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/20/focus-visible.html : 2.4.7。
- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/focus-not-obscured-minimum.html : 2.4.11 と注記。
- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/focus-appearance.html : 2.4.13。
- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/dragging-movements.html : 2.5.7。
- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/target-size-minimum.html : 2.5.8 と 5 つの例外。
- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/redundant-entry.html : 3.3.7。
- https://github.com/Myndex/SAPC-APCA : APCA の概要。
- https://www.w3.org/TR/WCAG22/ と https://waic.jp/translations/WCAG22/ はネットワーク制限で取得不可。
