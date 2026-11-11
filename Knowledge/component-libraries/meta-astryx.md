---
title: "Astryx"
category: component-libraries
type: library
sources:
  - url: https://github.com/meta/astryx
    title: "meta/astryx"
  - url: https://astryx.atmeta.com
    title: "Astryx docs"
  - url: https://raw.githubusercontent.com/meta/astryx/main/README.md
    title: "Astryx README"
  - url: https://raw.githubusercontent.com/meta/astryx/main/LICENSE
    title: "MIT LICENSE"
  - url: https://raw.githubusercontent.com/meta/astryx/main/packages/cli/README.md
    title: "@astryxdesign/cli README"
tags: [astryx, meta, react, component-library, mit, cli]
updated: 2026-11-11
---

# Astryx

## 概要

Astryx は Meta のオープンソースな React 向けデザインシステムで、2026-11-11 時点は Beta である。README は React 19 以降、著者が StyleX で書き、利用側はビルド済み CSS と型付きコンポーネントを使うと書く。className で Tailwind、CSS Modules、普通の CSS を上書きできる。AwesomeDS の既定部品は shadcn/ui と Base UI のままにする。

## 要点

- ライセンスは MIT。LICENSE の著作権表示は 2026 Meta Platforms, Inc.（2026-11-11 に開いた）。
- GitHub API（2026-11-11）: 24,449 stars、最終 push 2026-11-11、archived ではない、license は MIT。`@astryxdesign/core` の package.json は 0.7.14。
- README の「150+ components」と「13,000+ apps」は公開者の記述であり、ここでの独立した監査ではない。
- CLI は `@astryxdesign/cli`。入れたあとは `pnpm exec astryx component Button` や `npx @astryxdesign/cli`。CLI README は、未インストールのスコープなし `npx astryx` が別パッケージだと警告する。
- README と CLI README を 2026-11-11 に検索し、MCP の記載は見つからなかった。MCP があるとは書かない。
- CLI はコンポーネント文書、検索、テンプレート、JSON 出力を持つ。部品契約を読む参照であり、このリポジトリへ部品一式は入れない。

## 具体的な値・ルール（あれば）

| 項目 | 値 | 確認場所 |
|---|---|---|
| ピア | React 19 以降 | README |
| コア | `@astryxdesign/core` 0.7.14 | packages/core/package.json |
| CLI | `@astryxdesign/cli` | packages/cli/README.md |
| 文書 | https://astryx.atmeta.com | HTTP 200（2026-11-11） |

## AwesomeDS への反映

- 反映済み: `awesome-ds` スキルは Astryx を部品契約の参照と書き、既定を shadcn/ui と Base UI のままにする。MCP とは書かない。
- 反映不要: Meta のブランド、150 個の部品の同梱、StyleX への移行。

## 出典

- https://raw.githubusercontent.com/meta/astryx/main/README.md : Beta、React 19、StyleX、className、150+ と 13,000+ の公開者記述、MIT（2026-11-11）。
- https://raw.githubusercontent.com/meta/astryx/main/LICENSE : MIT（2026-11-11）。
- https://raw.githubusercontent.com/meta/astryx/main/packages/cli/README.md : スコープ付き CLI と、スコープなし npx の警告（2026-11-11）。MCP の語は見当たらなかった。
- https://github.com/meta/astryx : API の stars、push、license（2026-11-11）。
- https://astryx.atmeta.com : HTTP 200（2026-11-11）。
