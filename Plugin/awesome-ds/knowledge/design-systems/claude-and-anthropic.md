---
title: "Claude / Anthropic"
category: design-systems
type: product
sources:
  - url: https://github.com/voltagent/awesome-design-md/blob/main/design-md/claude/DESIGN.md
    title: "awesome-design-md: claude/DESIGN.md (実測)"
tags: [anthropic, claude, warm-neutrals, serif, cream, coral, editorial]
updated: 2026-09-06
---

# Claude / Anthropic

## 概要

claude.com は AI プロダクトの中で最も暖色寄りで編集物的な見た目を持つ。クリーム `#faf9f5` のキャンバス、暖かい墨色 `#141413` の文字、コーラル `#cc785c` の CTA、スラブセリフ (Copernicus / Tiempos Headline) の見出し、humanist sans (StyreneB / Inter) の本文で構成される。本エントリはクローン済みの実測 DESIGN.md のみを資料とし、AwesomeDS が「意図的に採用しなかった」点を中心に記す。

## 要点

- キャンバスはクリーム `#faf9f5`。「deliberately not the cool gray-white that every other AI brand uses」。面は `#f5f0e8` → `#efe9de` → `#e8e0d2` と暖色で沈む。
- 文字は ink `#141413`、body `#3d3d3a`、muted `#6c6a64`、muted-soft `#8e8b82`。すべて暖色の灰。
- コーラル `#cc785c` (active `#a9583e`、disabled `#e6dfd8`) が primary。CTA と全幅 callout カードに使う。hairline `#e6dfd8` は disabled と同じ hex で、「borders feel like one elevation step rather than ink lines」。
- 暗い面 `#181715` / `#252320` / `#1f1e1b` はコードブロックとモデル比較のプロダクトクロームに使い、cream と dark の交互がページのリズムになる。
- 見出しは Copernicus (代替 Tiempos Headline) を weight 400 で、-1.5px (64px) から -0.3px (28px) の負トラッキング。「Display sizes use weight 400 (regular), never bold.」
- 本文は StyreneB (代替 Inter) 16px / 400 / 1.55、ラベル 500。コードは JetBrains Mono 14px / 1.6。
- 角丸は 8 (ボタン、入力) / 12 (カード) / 16 (ヒーローイラスト) / pill (バッジ)。ボタン高さ 40px、padding 12px 20px。
- 余白 4 / 8 / 12 / 16 / 24 / 32 / 48、セクション 96px、カード内 32px。
- accent-teal `#5db8a6`、accent-amber `#e8a55a`、success `#5db872`、warning `#d4a017`、error `#c64545`。

## 具体的な値・ルール

| Token | Hex | 用途 |
|---|---|---|
| canvas | `#faf9f5` | ページ |
| surface-soft | `#f5f0e8` | 面 1 |
| surface-card | `#efe9de` | 機能カード |
| surface-cream-strong | `#e8e0d2` | 選択タブ、強調バンド |
| surface-dark | `#181715` | コード、プロダクト面 |
| ink | `#141413` | 見出し、本文 |
| body | `#3d3d3a` | 段落 |
| muted | `#6c6a64` | 補助 |
| hairline | `#e6dfd8` | 1px 罫線 |
| primary (coral) | `#cc785c` | CTA、callout |
| primary-active | `#a9583e` | press |

| Type role | Font | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| display-xl | Copernicus | 64px | 400 | 1.05 | -1.5px |
| display-lg | Copernicus | 48px | 400 | 1.1 | -1px |
| display-md | Copernicus | 36px | 400 | 1.15 | -0.5px |
| title-lg | StyreneB | 22px | 500 | 1.3 | 0 |
| body-md | StyreneB | 16px | 400 | 1.55 | 0 |
| body-sm | StyreneB | 14px | 400 | 1.55 | 0 |
| caption-uppercase | StyreneB | 12px | 500 | 1.4 | 1.5px |
| code | JetBrains Mono | 14px | 400 | 1.6 | 0 |

## AwesomeDS への反映

- 採用: 角丸の階層 8 / 12 / 16 / pill と、ボタン高さ 40px、padding の水平 16 から 20px。AwesomeDS 5. Shape と `button-primary` (height 40px) は同じ構造。
- 採用: セクション 96px、カード内 24 から 32px、4px 基準の余白。
- 採用: 「ブランドを 1 色で識別させ、他の有彩色を status に限定する」構造。
- 翻案: 「純黒を避ける」姿勢。Claude は暖色の `#141413`、AwesomeDS は無彩色の `#0a0a0a`。
- 不採用 (意図的): 暖色の neutrals。クリームのキャンバスは Anthropic のブランド資産で、汎用システムに入れると全ての製品が Anthropic 風に見える。AwesomeDS は true gray を選び、「Neutrals are true grays (no blue or warm cast) so brand colors are never fighting a tint」(DESIGN.md 2. Color 規則 3) と明文化した。
- 不採用 (意図的): セリフの display。「No serif by default. A serif is a brand decision, made in `ds-creator`, not a default」(3. Typography)。Copernicus は proprietary で日本語に対応しないという実務的理由もある。
- 不採用: コーラルを CTA 塗りに使うこと。AwesomeDS の primary button は ink、accent は link / focus / selection のみ (規則 1)。
- 不採用: uppercase の eyebrow ラベル (12px / +1.5px)。「Do not put an uppercase eyebrow label above every heading」(9. Do not)。
- 不採用: 本文 1.55。AwesomeDS は 1.6。

## 出典

- https://github.com/voltagent/awesome-design-md/blob/main/design-md/claude/DESIGN.md : クローン済み実測 DESIGN.md。ローカルコピーを読了。全ての値はここから。
- claude.com / anthropic.com は本エントリの範囲では取得していない。
