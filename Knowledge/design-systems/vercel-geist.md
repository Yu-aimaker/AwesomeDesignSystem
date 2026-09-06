---
title: "Vercel Geist Design System"
category: design-systems
type: design-system
sources:
  - url: https://github.com/voltagent/awesome-design-md/blob/main/design-md/vercel/DESIGN.md
    title: "awesome-design-md: vercel/DESIGN.md (実測)"
  - url: https://github.com/vercel/geist-font
    title: "vercel/geist-font: Geist Sans, Geist Mono, Geist Pixel"
  - url: https://vercel.com/geist/introduction
    title: "Geist Design System - Introduction (Vercel)"
  - url: https://vercel.com/geist/colors
    title: "Geist Design System - Colors (Vercel)"
tags: [vercel, geist, design-system, monochrome, gray-scale, mono, gradient]
updated: 2026-09-06
---

# Vercel Geist Design System

## 概要

Geist は Vercel のデザインシステムで、同名の書体 (Geist Sans / Geist Mono) を中心に、白に近いキャンバス、`#171717` の ink、1 から 10 段の gray スケール、そして hero 限定のメッシュグラデーションで構成される。vercel.com は本環境からアクセス不可のため、書体は GitHub リポジトリ、サイトの数値はクローン済みの実測 DESIGN.md を一次資料にした。色スケールの段階別の意味づけ (1 から 10) は取得できなかったため、ここでは実測に基づく値のみ記す。

## 要点

- キャンバス `#ffffff` (カード)、`#fafafa` (ページ本体)、`#f5f5f5` (inset)。ink `#171717`、本文 `#4d4d4d`、muted `#888888`、hairline `#ebebeb`、hairline-strong `#a1a1a1`。
- 実測の記述: 「a 200-step gray scale that gives every divider, border, and disabled state its own deliberate step」。システムトークンとしては 100 から 1000 の gray + blue + red + amber + green + teal + purple + pink が存在し、マーケティング面では 100 / 700 / 1000 レベルしか使わない。
- link blue `#0070f3` (旧 `--geist-success`)、error `#ee0000`、warning `#f5a623`。
- 書体は Geist (display 600、button 500、body 400、700 以上は使わない)。Geist Mono は 12 から 13px / 400 の技術ラベル、eyebrow、コードのみ。「Body paragraphs never set in mono.」
- 見出しのトラッキングは強い負: 48px で -2.4px、32px で -1.28px、24px で -0.96px。本文 14px は -0.28px、16px は 0。
- 影は「stacked shadow」: `0px 1px 1px #00000005` + `0px 2px 2px #0000000a` + inset border。単一の重い drop-shadow は使わない。
- グラデーションは Develop `#007cf0 → #00dfd8`、Preview `#7928ca → #ff0080`、Ship `#ff4d4d → #f9cb28` の 3 対。「Used at hero scale only.」 「That gradient is the entire decoration system.」
- 余白の基準は 4px (`--geist-space`)、`--geist-gap` は 24px。セクション余白 64 から 96px、hero は 192px。
- 角丸 4 / 6 / 8 / 12 / 16、pill 100px、full 9999px。マーケティングのボタンは pill、nav の CTA は 6px、高さ 28px。
- Geist フォントは SIL OFL 1.1、`npm i geist`。Vercel が Basement Studio と Andrés Briganti と共同制作。参考書体として Inter, Univers, SF Mono, SF Pro, Suisse International, ABC Diatype を挙げている。

## 具体的な値・ルール

| Token | 値 |
|---|---|
| canvas | `#ffffff` |
| canvas-soft | `#fafafa` |
| canvas-soft-2 | `#f5f5f5` |
| ink / primary | `#171717` |
| body | `#4d4d4d` |
| mute | `#888888` |
| hairline | `#ebebeb` |
| hairline-strong | `#a1a1a1` |
| link | `#0070f3` |
| error | `#ee0000` |
| warning | `#f5a623` |

| Type role | Size / Line | Weight | Tracking |
|---|---|---|---|
| display-xl | 48 / 48px | 600 | -2.4px |
| display-lg | 32 / 40px | 600 | -1.28px |
| display-md | 24 / 32px | 600 | -0.96px |
| body-md | 16 / 24px | 400 | 0 |
| body-sm | 14 / 20px | 400 | -0.28px |
| caption-mono | 12 / 16px | 400 | 0 |
| code | 13 / 20px | 400 | 0 |
| button-md | 14 / 20px | 500 | 0 |

余白: 4, 8, 12, 16, 24, 32, 40, 48, 64, 96, 128, section 192。

## AwesomeDS への反映

- 採用: Geist Sans と Geist Mono を既定書体にした (DESIGN.md 3. Typography)。理由はオープンライセンス、variable weight、tabular figures、そして Vercel と Linear の双方が代替として認める互換性。
- 採用: 「mono は技術レイヤーだけ」。AwesomeDS の `mono` は 13px / 400 / 1.6 で、コードとテーブルの数値に限定する。
- 採用: 4px 基準の余白と 24px gap。AwesomeDS の spacing と card padding 24px、grid gutter 24px は Geist の `--geist-space` / `--geist-gap` と一致する。
- 採用: 黒に近い ink を primary button にする構図 (`primary: ink on canvas`)。Vercel の ink `#171717` に対し、AwesomeDS は `#0a0a0a` を選び、`ink-secondary #525252` と `ink-muted #737373` で 3 段にした。
- 採用: 近い明度のグレーを true gray で揃える方針。Vercel の gray は色味がなく、AwesomeDS の neutrals も無彩色。
- 翻案: 積層シャドウ。AwesomeDS は Level 2 を `0 4px 12px -2px rgba(10,10,10,.08)` の 1 層 + border にし、実装コストを下げた。
- 翻案: 見出しトラッキング。Vercel の -2.4px at 48px (-0.05em) は強すぎるため、-0.02em に抑えた。
- 不採用: メッシュグラデーション。Vercel では「the entire decoration system」だが、AwesomeDS は「No gradients on backgrounds」を既定にし、ブランド固有の装飾は `ds-creator` で追加する。
- 不採用: pill ボタン。AwesomeDS のコントロールは 8px で統一 (5. Shape)。pill はバッジとトグルのみ。
- 不採用: 14px 本文の負トラッキング。

## 出典

- https://github.com/voltagent/awesome-design-md/blob/main/design-md/vercel/DESIGN.md : クローン済み実測トークン。ローカルコピーを読了。
- https://github.com/vercel/geist-font : Geist Sans / Mono / Pixel の説明、OFL 1.1、制作クレジット、`npm i geist`。取得済み。
- https://vercel.com/geist/introduction : Geist デザインシステムの紹介。vercel.com はネットワーク制限で取得不可。
- https://vercel.com/geist/colors : 色スケール。取得不可のため、1 から 10 段の意味づけは本エントリに含めていない。
