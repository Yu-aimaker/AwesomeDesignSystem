---
title: "Nothing Technology"
category: design-systems
type: product
sources:
  - url: https://github.com/xeji01/nothingfont
    title: "xeji01/nothingfont: nothing.tech typeface (Ndot-55, Ndot-57, NType-82)"
  - url: https://fontsinuse.com/typefaces/233367/ndot
    title: "NDot in use - Fonts In Use"
  - url: https://nothing.community/d/104-ndot57-the-nothing-typeface
    title: "ndot57: the Nothing Typeface - Nothing Community"
  - url: https://www.phonearena.com/news/nothing-design-boss-explains-the-big-change-behind-phone-3_id171637
    title: "Nothing's design boss explains the big change behind Phone (3) - PhoneArena"
tags: [nothing, ndot, dot-matrix, monochrome, red-accent, transparency, restraint]
updated: 2026-09-06
---

# Nothing Technology

## 概要

Nothing はロンドンのコンシューマーエレクトロニクス企業で、透明な筐体、Glyph Interface、モノクロームの UI、そして dot-matrix 書体 NDot を一貫して使うことで知られる。Web と OS は黒か白の面、白または黒の文字、赤の 1 色だけをアクセントに使う。nothing.tech (nl / uk / www) と fontsinuse.com、phonearena.com はいずれも本環境からアクセス不可のため、検索結果の要約と GitHub 上の書体資料に基づく。

## 要点

- NDot は 2021 年に Nothing 専用として Colophon Foundry が設計した dot-matrix 書体。検索結果の要約: 「The design drew inspiration from the raw digital fonts and colours from IBM's iconic mainframe era in the 1980s.」
- ブランド書体一式は NDot、NType 82、NType 82 Mono。Seventy Agency と Colophon Foundry の共同 (検索結果の要約)。
- GitHub の資料 (xeji01/nothingfont) には Ndot-55、Ndot-57、NType-82 が含まれる。Ndot-57 は「much tighter dots compare to Ndot-55」で、小文字 a, e, f, s の可読性を上げた版。権利表記は「NOTHING Tech. All Rights Reserved.」であり、オープンライセンスではない。
- Nothing OS 3.0 で NDot が UI に戻った (検索結果タイトル: 「Nothing brings back OG 'NDot' font on Nothing OS 3.0, but there's a catch」)。
- 視覚言語の構成 (検索結果とブランド観察に基づく): 黒または白の単色面、透明パーツを見せる筐体、赤の単一アクセント、dot-matrix の見出しと sans の本文、装飾のない罫線。
- 「restraint (抑制) と単一アクセント」が Nothing から学ぶ核心。色数を絞り、書体の個性 1 つで識別性を作る。

## 具体的な値・ルール

公式トークンは取得できていない。取得できた事実のみ表にする。

| 項目 | 内容 | 出典 |
|---|---|---|
| ディスプレイ書体 | NDot (Ndot-55 / Ndot-57) | xeji01/nothingfont、Fonts In Use |
| 本文書体 | NType 82 / NType 82 Mono | Fonts In Use (検索結果) |
| 設計 | Colophon Foundry、2021 | Fonts In Use (検索結果) |
| 着想 | 1980 年代 IBM メインフレームのデジタル書体 | Fonts In Use (検索結果) |
| 権利 | Nothing 専有、All Rights Reserved | xeji01/nothingfont README |
| 色 | 黒 / 白 + 赤 1 色 | 検索結果の要約 (数値未確認) |

赤アクセントの hex、角丸、余白は一次資料が取れなかったため記載しない。

## AwesomeDS への反映

- 採用: 単一アクセントの原則。AwesomeDS は「One accent per product」「accent は links, focus, selection のみ」(DESIGN.md 2. Color 規則 1, 2)。Nothing の赤の使い方は、その原則が消費者向けブランドでも成立する例として参照した。
- 採用: 無彩色の面と文字で階層を作る抑制。「Hierarchy comes from type size, weight and spacing, not from color or decoration」(1. Visual theme)。
- 採用: 書体 1 つでブランドを識別させる考え方。AwesomeDS では既定書体を Geist に固定し、ブランド固有の display 書体は `ds-creator` の判断項目にした (3. Typography「A serif is a brand decision」)。
- 不採用: dot-matrix 書体。可読性とアクセシビリティ (小サイズでの判読、日本語非対応) の理由で、AwesomeDS の型スケールには入れない。見出し限定のブランド書体として `ds-creator` で追加する側。
- 不採用: 透明・ガラス表現。「no glass, no glow」(1. Visual theme)。Nothing の透明は物理筐体の表現であり、Web UI の半透明とは別問題。
- 不採用: 黒キャンバス既定。AwesomeDS は白キャンバスが既定。

## 出典

- https://github.com/xeji01/nothingfont : 取得済み。Ndot-55 / Ndot-57 / NType-82 のサンプルと権利表記。
- https://fontsinuse.com/typefaces/233367/ndot : 検索結果で確認 (Colophon Foundry、2021、IBM メインフレーム着想)。サイトはアクセス不可。
- https://nothing.community/d/104-ndot57-the-nothing-typeface : 検索結果で確認。未取得。
- https://www.phonearena.com/news/nothing-design-boss-explains-the-big-change-behind-phone-3_id171637 : 検索結果で確認。アクセス不可。
- https://nl.nothing.tech/ と https://www.nothing.tech/ はネットワーク制限で取得不可。色と角丸の実測値は未取得。
