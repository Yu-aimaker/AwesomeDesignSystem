---
title: "Noto Sans JP"
category: typography
type: library
sources:
  - url: https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/METADATA.pb
    title: "google/fonts: ofl/notosansjp/METADATA.pb"
  - url: https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/DESCRIPTION.en_us.html
    title: "google/fonts: ofl/notosansjp/DESCRIPTION.en_us.html"
  - url: https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/README.md
    title: "notofonts/noto-cjk: Sans/README.md"
  - url: https://fonts.google.com/noto/specimen/Noto+Sans+JP
    title: "Noto Sans JP - Google Fonts"
tags: [noto, japanese, cjk, google-fonts, variable, ofl, subset]
updated: 2026-09-06
---

# Noto Sans JP

## 概要

Noto Sans JP は Google の Noto プロジェクトによる日本語サンセリフで、Adobe の Source Han Sans と同じ設計を共有する Noto Sans CJK の日本語向けパッケージである。Google Fonts では weight 100 から 900 の variable font として配布され、ライセンスは SIL OFL。AwesomeDS では Geist と組み合わせる日本語の既定書体にしている。fonts.google.com は本環境から取得できず、Google Fonts のメタデータリポジトリと noto-cjk リポジトリを一次資料にした。

## 要点

- METADATA.pb: name "Noto Sans JP"、designer "Google"、license "OFL"、category "SANS_SERIF"、axes wght 100.0 から 900.0、subsets: cyrillic, japanese, latin, latin-ext, menu, vietnamese。date_added 2015-01-29。
- DESCRIPTION: 「Noto is a global font collection for writing in all modern and ancient languages. Noto Sans JP is an unmodulated ("sans serif") design for the Japanese language and other languages used in Japan.」 ひらがな、カタカナ、漢字、Latin、Cyrillic、Greek、Hangul を含む。
- Noto Sans CJK (noto-cjk リポジトリ): 5 言語 (SC, TC, HK, JP, KR)、7 ウェイト (Thin, Light, DemiLight, Regular, Medium, Bold, Black)。配布形態は OTC (全言語・全ウェイト)、言語別、地域別サブセット、および variable font (OTF / TTF)。「Select this deployment format if you want all five languages and all seven weights, along with the half-width (Mono) variations.」
- Google Fonts 版は日本語グリフを unicode-range で 100 以上のチャンクに分割して配信するため、必要な文字だけがダウンロードされる。フルフォントは数 MB あるので、自前ホストする場合はサブセット化が必須。
- Latin との組み合わせ: Noto Sans JP の x-height と字幅は Inter / Geist 系と近く、`font-family: "Geist", "Noto Sans JP"` の順で書くと Latin は Geist、日本語は Noto Sans JP に自然に分かれる。
- 日本語のウェイトは 400 と 500 と 700 が実用域。300 以下は細部が潰れ、900 は小サイズで詰まる。

## 具体的な値・ルール

| 項目 | 値 |
|---|---|
| 名称 | Noto Sans JP |
| 設計 | Google (Source Han Sans と共通設計、Adobe) |
| ライセンス | SIL OFL 1.1 |
| ウェイト | variable 100 から 900 (静的は Thin, Light, DemiLight, Regular, Medium, Bold, Black) |
| サブセット (Google Fonts) | cyrillic, japanese, latin, latin-ext, vietnamese |
| Google Fonts 追加日 | 2015-01-29 |

AwesomeDS での読み込み方針:

```css
/* Latin は Geist、日本語は Noto Sans JP の 2 サブセット。1 ファイルにまとめない */
--font-sans: "Geist", "Noto Sans JP", system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", sans-serif;
```

## AwesomeDS への反映

- 採用: Noto Sans JP を日本語の既定書体にした (DESIGN.md 3. Typography)。理由は「largest glyph coverage, variable, pairs with Geist at the same x-height」。
- 採用: 「Load Latin and Japanese as two subsets; never ship one 5 MB file」。Google Fonts の unicode-range 分割か、自前サブセットのどちらかを使う。
- 採用: ウェイトは 400 / 500 / 600。Noto Sans JP の variable 軸で 600 を指定でき、静的版なら Medium (500) と Bold (700) の間を variable で補う。
- 翻案: 行間 1.8、字間 0 から 0.02em。Noto Sans JP は仮想ボディに対して字面が大きめなので、負のトラッキングは禁止した。
- 不採用: 游ゴシック (Goodpatch、SmartHR が採用) と Hiragino Sans を既定にすること。OS 依存で描画が変わるため、フォールバックにのみ残す。
- 不採用: Noto Sans CJK の OTC 一括配布。Web では JP サブセットのみを使う。

## 出典

- https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/METADATA.pb : 取得済み。名称、designer、license、axes、subsets、date_added。
- https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/DESCRIPTION.en_us.html : 取得済み。説明文。
- https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/README.md : 取得済み。5 言語、7 ウェイト、variable と OTC の配布形態。
- https://fonts.google.com/noto/specimen/Noto+Sans+JP : ネットワーク制限で取得不可。
