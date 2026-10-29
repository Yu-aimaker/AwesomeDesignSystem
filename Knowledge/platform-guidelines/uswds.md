---
title: "U.S. Web Design System (USWDS)"
category: platform-guidelines
type: design-system
sources:
  - url: https://designsystem.digital.gov/
    title: "USWDS: The United States Web Design System"
  - url: https://github.com/uswds/uswds
    title: "uswds/uswds: United States Web Design System"
  - url: https://registry.npmjs.org/@uswds/uswds/latest
    title: "npm: @uswds/uswds latest"
  - url: https://designsystem.digital.gov/documentation/migration
    title: "USWDS 3.0 Migration Guide"
tags: [uswds, government, design-system, accessibility, sass, tokens, public-sans]
updated: 2026-10-07
---

# U.S. Web Design System (USWDS)

## 概要

USWDS は米国連邦政府ウェブサイト向けのデザインシステムで、原則、ガイダンス、コードを含む。コンポーネントと視覚スタイルガイドはパブリックドメインおよびオープンソースとして公開されている。コードは uswds/uswds、文書サイトは uswds/uswds-site。公式サイト designsystem.digital.gov の og:description は「accessible, mobile-friendly government websites」である。

## 要点

- 公式 og:title は「USWDS: The United States Web Design System」。og:image は 200x200 の黒ロゴ (lg-black.png) で、1200x630 の SNS カードではない。
- 現行メジャーは USWDS 3.0。コードベースは機能パッケージ中心 (例: `packages/usa-accordion`)。
- dist にコンパイル済み CSS / フォント / 画像、packages にソース。フォントは Merriweather、Public Sans、Roboto Mono、Source Sans Pro。
- コンポーネント Sass は `packages/[package]/src/styles`、JS は `packages/[package]/src/index.js`、テンプレートは Twig。HTML 見本は公式サイトの components から取るよう案内される。
- npm `@uswds/uswds` 最新は 3.14.0 (2026-10-07 取得)。
- AwesomeDS の fonts.json は Public Sans を「米国政府のデザインシステム用」と既に記録している。

## 具体的な値・ルール

| 項目 | 値 |
|---|---|
| 公式サイト | https://designsystem.digital.gov/ |
| npm | `@uswds/uswds` 3.14.0 |
| 現行メジャー | 3.0 |
| 書体 | Public Sans、Source Sans Pro、Merriweather、Roboto Mono |

## AwesomeDS への反映

- 反映済み: Public Sans をフォント一覧に掲載 (`AwesomeDS/data` 経由の fonts)。Brief が USWDS を指名したときは公式パッケージを使う (`foundations/stack.md`)。
- 反映不要: 連邦政府向けのパッケージ分割と Twig テンプレート。AwesomeDS は React + トークンの既定。

## 出典

1. https://designsystem.digital.gov/ (取得日 2026-10-07)。og:title、og:description、og:image 200x200。
2. https://github.com/uswds/uswds README (取得日 2026-10-07)。3.0、パッケージ構成、フォント、Twig。
3. https://registry.npmjs.org/@uswds/uswds/latest (取得日 2026-10-07)。3.14.0。
