---
title: "コントラストとアクセシブルな色"
category: color
type: article
sources:
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/20/contrast-minimum.html
    title: "WCAG 1.4.3 Contrast (Minimum) source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/21/non-text-contrast.html
    title: "WCAG 1.4.11 Non-text Contrast source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/Myndex/SAPC-APCA/master/documentation/APCA_in_a_Nutshell.md
    title: "APCA in a Nutshell (Myndex/SAPC-APCA)"
  - url: https://raw.githubusercontent.com/Myndex/SAPC-APCA/master/documentation/WhyAPCA.md
    title: "Why APCA (Myndex/SAPC-APCA)"
  - url: https://raw.githubusercontent.com/mdn/content/HEAD/files/en-us/web/css/reference/selectors/_colon_focus-visible/index.md
    title: ":focus-visible - CSS (MDN content source)"
tags: [contrast, wcag, apca, accessibility, ink, neutrals, tools]
updated: 2026-09-06
---

# コントラストとアクセシブルな色

## 概要

文字と UI の色は、WCAG 2.x のコントラスト比 (本文 4.5:1、大きな文字と UI 部品 3:1) を満たすことが規格上の要件である。APCA は WCAG 3 に向けた知覚コントラスト指標で、Lc 値 (0 から約 106) と用途別の閾値を提示し、特にダークモードで WCAG 2 の比率が実感とずれる問題を扱う。AwesomeDS の ink `#0a0a0a` と 3 段の文字色はこの両方を意識して選ばれている。webaim.org、tpgi.com、contrast-ratio.com、apcacontrast.com は本環境から取得できず、WCAG のソースと APCA のリポジトリ文書を資料とした。

## 要点

- WCAG 1.4.3 (AA): 「The visual presentation of text and images of text has a contrast ratio of at least 4.5:1」。大きな文字は 3:1。ロゴと非アクティブ要素は例外。
- WCAG 1.4.11 (AA): UI コンポーネントとグラフィカルオブジェクトは隣接色に対して 3:1。
- MDN (:focus-visible): フォーカスインジケーターも 1.4.11 の対象で「at least 3 to 1」。
- APCA の Lc 閾値 (APCA in a Nutshell): Lc 90 「Preferred level for fluent text and columns of body text」、Lc 75 「The minimum level for columns of body text」、Lc 60 「The minimum level recommended for content text that is not body, column, or block text」、Lc 45 「The minimum for larger, heavier text」、Lc 30 「The absolute minimum for any text not listed above」(プレースホルダー、無効状態)、Lc 15 「The absolute minimum for any non-semantic non-text that needs to be discernible」。
- APCA のスケール: 「Lc 0 to Lc 105+」で、「halving or doubling the APCA value relates to halving or doubling the perceived contrast」。
- Why APCA: 「WCAG 2.x contrast cannot be used for guidance designing 'dark mode'」「WCAG 2 contrast can pass colors that should fail as not readable, and sometimes the WCAG 2 math fails a color pair that should pass」「4.5:1 can be functionally unreadable when a color is near black」。
- 実務: 規格要件は WCAG 2.2 なので比率で検証し、APCA は暗い面や細い文字の追加チェックに使う。ツールとしては WebAIM Contrast Checker、TPGi Colour Contrast Analyser、Lea Verou の contrast-ratio.com、apcacontrast.com が一般的 (いずれも今回は未取得)。

## 具体的な値・ルール

AwesomeDS の白地 `#ffffff` 上の比率 (DESIGN.md 記載値と WCAG 2 の式による)。

| Role | Hex | 比率 (on #ffffff) | 判定 |
|---|---|---|---|
| ink | `#0a0a0a` | 約 19.6:1 | AAA |
| ink-secondary | `#525252` | 7.6:1 | AAA |
| ink-muted | `#737373` | 4.7:1 | AA (本文可、ただし用途は補助) |
| ink-disabled | `#a3a3a3` | 約 2.6:1 | 非対象 (無効状態) |
| accent | `#2f5bea` | 約 5.4:1 | AA |
| hairline-strong | `#d4d4d4` | 約 1.5:1 | 3:1 未満、入力枠は背景差と focus で補う |
| success | `#1a7f37` | 約 5.1:1 | AA |
| warning | `#b26a00` | 約 4.6:1 | AA |
| danger | `#c81e1e` | 約 5.9:1 | AA |

ダーク面 `#0a0a0a` 上:

| Role | Hex | 比率 |
|---|---|---|
| dark-ink | `#fafafa` | 約 18.8:1 |
| dark-ink-secondary | `#a3a3a3` | 約 7.8:1 |
| dark-ink-muted | `#737373` | 約 4.1:1 (補助のみ) |
| dark-accent | `#7a9cff` | 約 7.9:1 |

ink を `#000000` ではなく `#0a0a0a` にする理由: 純黒と白の 21:1 は APCA でも最大値になるが、AwesomeDS では (1) 影の tint 色として `rgba(10,10,10,…)` を使うときに面と同系の黒になる、(2) ダークモードのキャンバス `#0a0a0a` と対になり、輝度反転が対称になる、(3) 純黒は OLED で周囲の階調が潰れて見える、という運用上の理由で選んだ。コントラストの損失は 21:1 → 19.6:1 で無視できる。

## AwesomeDS への反映

- 採用: 「Text contrast is at least 4.5:1 for body, 3:1 for large text and UI borders. Check with the values above; do not eyeball」(DESIGN.md 2. Color 規則 4)。値ごとに比率を併記する運用。
- 採用: フォーカスリングを accent 2px にし、白地で 3:1 を超える色を選ぶ (11. Accessibility)。
- 採用: APCA の指摘に沿い、ダークモードでは accent を明るくし (`#7a9cff`)、`dark-ink-muted` を補助用途に限定した。
- 採用: 「Status colors carry an icon or a label. Color alone is never the message」(規則 5)。コントラストを満たしても色だけに頼らない。
- 翻案: APCA の Lc 閾値は要件にせず、レビュー時の参考にする。ステップ 11 / 12 に Lc 60 / 90 を保証する Radix の方式は参考に留めた。
- 不採用: AAA 7:1 の全面適用。`ink-muted` は 4.7:1 で本文には使わない設計にして、本文と補助テキストは 7:1 以上を保つ。
- 不採用: `hairline` を 3:1 にすること。カードの罫線は「識別に必要な視覚情報」ではなく装飾に近いため 1.4.11 の対象外とし、入力枠だけ focus と背景差で補う。

## 出典

- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/20/contrast-minimum.html : 取得済み。1.4.3 の規範文。
- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/21/non-text-contrast.html : 取得済み。1.4.11。
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/master/documentation/APCA_in_a_Nutshell.md : 取得済み。Lc 閾値とスケール。
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/master/documentation/WhyAPCA.md : 取得済み。WCAG 2 との差、ダークモードの問題。
- https://raw.githubusercontent.com/mdn/content/HEAD/files/en-us/web/css/reference/selectors/_colon_focus-visible/index.md : 取得済み。focus indicator の 3:1。
- webaim.org、tpgi.com、contrast-ratio.com、apcacontrast.com、readtech.org はネットワーク制限で取得不可。比率の算出は WCAG 2 の相対輝度式による。
