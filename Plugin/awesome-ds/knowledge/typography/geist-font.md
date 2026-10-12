---
title: "Geist (Geist Sans / Geist Mono)"
category: typography
type: library
sources:
  - url: https://github.com/vercel/geist-font
    title: "vercel/geist-font: Geist Sans, Geist Mono, Geist Pixel"
  - url: https://www.npmjs.com/package/geist
    title: "geist - npm"
  - url: https://vercel.com/font
    title: "Geist Font - Vercel"
tags: [geist, font, vercel, ofl, variable, sans, mono]
updated: 2026-09-06
---

# Geist (Geist Sans / Geist Mono)

## 概要

Geist は Vercel が Basement Studio と Andrés Briganti と共同で制作した書体ファミリーで、Geist Sans (サンセリフ)、Geist Mono (等幅)、Geist Pixel (ピクセル) からなる。SIL Open Font License 1.1 で公開され、`npm i geist` で Next.js から直接読み込める。AwesomeDS の既定 Latin 書体である。vercel.com/font と npmjs.com は本環境から取得できず、GitHub リポジトリの説明を一次資料とした。

## 要点

- Geist Sans: 「A sans-serif typeface designed for legibility and simplicity. It is a modern, geometric typeface that is based on the principles of classic Swiss typography.」
- Geist Mono: 「A monospaced typeface that has been crafted to be the perfect partner to Geist Sans. It is designed to be used in code editors, diagrams, terminals, and other text-based interfaces.」
- Geist Pixel: Geist を補完するピクセル書体。「five stylistic variants」。
- 参考にした書体として Inter、Univers、SF Mono、SF Pro、Suisse International、ABC Diatype が挙げられている。
- ライセンス: 「This Font Software is licensed under the SIL Open Font License, Version 1.1.」 商用利用、再配布、Web フォント配信が可能。
- 配布: `npm i geist`。Next.js では `geist/font/sans` と `geist/font/mono` から `GeistSans` / `GeistMono` を読み込む (npm ページは取得不可のため、パッケージ名のみ確認)。
- 実測 (クローン済み vercel/DESIGN.md): Vercel 自身は display 600、button 500、body 400 で使い、700 以上は使わない。Geist Mono は 12 から 13px / 400 で技術ラベルとコードのみ。
- Linear の実測 DESIGN.md も「Geist Sans is also viable」と代替に挙げている。Inter と同系統の x-height を持ち、Noto Sans JP と並べたときの高さが揃いやすい。

## 具体的な値・ルール

| 項目 | 値 |
|---|---|
| ファミリー | Geist Sans, Geist Mono, Geist Pixel |
| ライセンス | SIL OFL 1.1 |
| 配布 | `npm i geist`、GitHub Releases |
| 制作 | Vercel, Basement Studio, Andrés Briganti |
| Vercel での運用ウェイト | 400 / 500 / 600 |
| Mono の運用サイズ | 12 から 13px |

AwesomeDS でのスタック:

```css
--font-sans: "Geist", "Noto Sans JP", system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", sans-serif;
--font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

## AwesomeDS への反映

- 採用: Geist を Latin の既定書体、Geist Mono を等幅の既定書体にした (DESIGN.md 3. Typography)。理由は「open license, designed for screens, tabular figures, variable weight」。
- 採用: Vercel と同じ運用ウェイト 400 / 500 / 600。「Never 700+ except display」。
- 採用: Mono は 13px / 1.6 でコードとテーブルの数値のみ。本文に使わない。
- 翻案: Geist は Latin のみなので、日本語は Noto Sans JP に分担させる。両者を 2 つのサブセットとして読み込み、1 つの大きなファイルにしない。
- 不採用: Geist Pixel。装飾用途であり AwesomeDS の型スケールには入れない。
- 補足: `ds-creator` で別のブランド書体に置き換える場合も、フォールバックとして Geist を残すことを推奨する。

## 出典

- https://github.com/vercel/geist-font : 取得済み。3 ファミリーの説明、OFL 1.1、制作クレジット、参考書体、`npm i geist`。
- https://www.npmjs.com/package/geist : HTTP 403 で取得不可。パッケージ名は GitHub README で確認。
- https://vercel.com/font : ネットワーク制限で取得不可。
