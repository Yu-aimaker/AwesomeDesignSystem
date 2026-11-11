---
title: "React Grab"
category: tech-stack
type: library
sources:
  - url: https://github.com/aidenybai/react-grab
    title: "aidenybai/react-grab"
  - url: https://react-grab.com
    title: "react-grab.com"
  - url: https://raw.githubusercontent.com/aidenybai/react-grab/main/README.md
    title: "README"
  - url: https://raw.githubusercontent.com/aidenybai/react-grab/main/LICENSE
    title: "MIT LICENSE"
tags: [react-grab, devtools, mit, local-development]
updated: 2026-11-11
---

# React Grab

## 概要

React Grab は、開発中の画面で選んだ要素と、そのコンポーネントのソース位置をエージェントへ渡すツールである。README の導入例は、Next.js では `NODE_ENV === "development"`、Vite では `import.meta.env.DEV` のときだけ読み込む。

## 要点

- ライセンスは MIT。GitHub API（2026-11-11）: 7,706 stars、最終 push 2026-08-22、archived ではない。
- 操作は、要素を指してコピーし、要素とコンポーネントスタック（ファイルと行）をエージェントへ渡す。
- README は速度が 2 倍だと書き、ベンチマークページへリンクする。このエントリではその計測を監査していないので、数字は採用しない。
- 本番バンドルへは入れない。ソースパスを本番へ出さない。
- https://react-grab.com は 2026-11-11 に https://www.react-grab.com/ へ移り、HTTP 200。ホストの www を除くと比較すると同一。

## AwesomeDS への反映

- 反映不要: 本番サイトやプラグインへ同梱しない。ローカル開発の選択ツールとして参照するだけ。

## 出典

- https://raw.githubusercontent.com/aidenybai/react-grab/main/README.md : 開発時だけ読み込む例、コピーする中身、速度の主張（2026-11-11）。
- https://raw.githubusercontent.com/aidenybai/react-grab/main/LICENSE : MIT（2026-11-11）。
- https://github.com/aidenybai/react-grab : API（2026-11-11）。
- https://react-grab.com : HTTP 200（2026-11-11）。
