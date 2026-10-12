---
title: "OKLCH とモダン CSS カラー"
category: color
type: article
sources:
  - url: https://raw.githubusercontent.com/mdn/content/HEAD/files/en-us/web/css/reference/values/color_value/oklch/index.md
    title: "oklch() - CSS (MDN content source)"
  - url: https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-color-4/Overview.bs
    title: "CSS Color Module Level 4 (Editor's Draft source)"
  - url: https://github.com/evilmartians/oklch-picker
    title: "evilmartians/oklch-picker: Color picker and converter for OKLCH and LCH"
  - url: https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/packages/tailwindcss/theme.css
    title: "tailwindcss v4 theme.css (oklch palette)"
  - url: https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
    title: "OKLCH in CSS: why we moved from RGB and HSL - Evil Martians"
tags: [oklch, oklab, css-color-4, perceptual, p3, tailwind, hsl]
updated: 2026-09-06
---

# OKLCH とモダン CSS カラー

## 概要

`oklch()` は CSS Color Level 4 で定義された色関数で、Björn Ottosson の Oklab 色空間を極座標 (Lightness, Chroma, Hue) で表す。HSL と違い L が知覚的な明度に対応し、彩度を変えても色相がずれにくく、sRGB より広い P3 などの色域を表現できる。Tailwind CSS v4 は既定パレットを oklch で定義している。Evil Martians の記事、caniuse、oklch.com は本環境から取得できず、MDN のソース、CSS 仕様草案のソース、oklch-picker の README、Tailwind の theme.css を資料とした。

## 要点

- MDN: `oklch()` は「expresses a given color in the Oklab color space」で、「the cylindrical form of oklab(), using the same L axis, but with polar Chroma (C) and Hue (h) coordinates」。
- L は 0 から 1 (0% から 100%)。「the number 0 corresponds to 0% (black) and the number 1 corresponds to 100% (white)」。「the color's perceived lightness」。
- C は 0 から上限なし。「0% is 0 and 100% is the number 0.4」、実用上の最大は約 0.5。
- H は 0 から 360deg の色相角。alpha は 0 から 1。
- CSS 仕様草案は Oklab の根拠として Ottosson の 2020 年の論文「A perceptual color space for image processing」を参照し、CIELAB より色相の直線性が良いことを設計意図とする。
- oklch-picker README: OKLCH は「can encode more colors for modern screens (P3, Rec. 2020, and beyond)」。利点はネイティブなブラウザ対応、変換後もコントラストが予測できること (HSL と対照的)、彩度調整で色相がずれないこと (LCH / Lab と対照的)。
- Tailwind v4 の neutral は `oklch(98.5% 0 none)` から `oklch(14.5% 0 none)` まで chroma 0 で定義され、gray は `oklch(98.5% 0.002 247.839)` のようにわずかに青い。blue-500 は `oklch(62.3% 0.214 259.815)`、blue-600 は `oklch(54.6% 0.245 262.881)`。
- HSL の問題: L=50% の黄と青は知覚的な明度が大きく異なる。OKLCH では同じ L の色は同じくらい明るく見えるため、パレットの段階を L だけで設計できる。

## 具体的な値・ルール

構文:

```css
color: oklch(L C H);
color: oklch(L C H / alpha);
/* 例 */
color: oklch(62.3% 0.214 259.815);   /* Tailwind blue-500 */
color: oklch(55.6% 0 none);          /* Tailwind neutral-500 (無彩色) */
```

| 成分 | 範囲 | 意味 |
|---|---|---|
| L | 0 から 1 / 0% から 100% | 知覚明度 |
| C | 0 から約 0.4 (100%) 、実用上 0.5 まで | 彩度 |
| H | 0 から 360deg | 色相 |

Tailwind v4 neutral (chroma 0):

| step | L |
|---|---|
| 50 | 98.5% |
| 100 | 97% |
| 200 | 92.2% |
| 300 | 87% |
| 400 | 70.8% |
| 500 | 55.6% |
| 600 | 43.9% |
| 700 | 37.1% |
| 800 | 26.9% |
| 900 | 20.5% |
| 950 | 14.5% |

AwesomeDS の neutrals を oklch に写すと、`#fafafa` ≈ L 98.5%、`#f5f5f5` ≈ L 97%、`#e5e5e5` ≈ L 92.2%、`#d4d4d4` ≈ L 87%、`#a3a3a3` ≈ L 70.8%、`#737373` ≈ L 55.6%、`#525252` ≈ L 43.9%、`#262626` ≈ L 26.9%、`#0a0a0a` ≈ L 14.5% 未満で、Tailwind neutral と同じ段に乗る。

## AwesomeDS への反映

- 採用: 明度の段階を知覚的に等間隔にする考え方。AwesomeDS の neutrals は Tailwind v4 の neutral (chroma 0) と同じ hex を使っており、oklch の L で見て等間隔になっている (DESIGN.md 2. Color)。
- 採用: 無彩色 (chroma 0) の neutrals。「Neutrals are true grays (no blue or warm cast)」。Tailwind の gray (わずかに青) ではなく neutral を選んだ理由と同じ。
- 採用: ダークモードの accent を「lightened for contrast」する運用。OKLCH なら L を上げ C を保つことで同じ色相のまま明るくできる (`#2f5bea` → `#7a9cff`)。
- 翻案: トークンの記法は hex のまま。デザインツール (Figma) との往復と、古いブラウザでの確実な描画のため。生成や補間には oklch を使い、出力は hex に固定する。
- 不採用: P3 色域の色を既定パレットに入れること。sRGB 外の色は環境で見えが変わるため、ブランド固有の判断として `ds-creator` に委ねる。
- 不採用: HSL でのパレット生成。Refactoring UI が推す方法だが、明度が知覚と合わないため OKLCH に置き換える。

## 出典

- https://raw.githubusercontent.com/mdn/content/HEAD/files/en-us/web/css/reference/values/color_value/oklch/index.md : 取得済み。定義、L / C / H の範囲。
- https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-color-4/Overview.bs : 取得済み。oklab / oklch の定義と Ottosson 論文への参照。
- https://github.com/evilmartians/oklch-picker : 取得済み。OKLCH の利点、P3、Evil Martians 記事へのリンク。
- https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/packages/tailwindcss/theme.css : 取得済み。oklch で定義された neutral / gray / blue。
- https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl : ネットワーク制限で取得不可。URL は oklch-picker README で確認。caniuse.com も取得不可のため、ブラウザ対応の版番号は記載していない。
