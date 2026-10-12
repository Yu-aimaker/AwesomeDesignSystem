---
title: "GitLab Pajamas Design System"
category: design-systems
type: design-system
sources:
  - url: https://design.gitlab.com/
    title: "Pajamas Design System"
  - url: https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com
    title: "GitLab: design.gitlab.com (Pajamas source)"
  - url: https://www.figma.com/file/qEddyqCrI7kPSBjGmwkZzQ/Pajamas-UI-Kit
    title: "Pajamas UI Kit (Figma)"
tags: [gitlab, pajamas, design-system, storybook, figma, gitlab-ui]
updated: 2026-10-07
---

# GitLab Pajamas Design System

## 概要

Pajamas は GitLab のデザインシステムで、リソース、コンポーネント、指針の単一の正本 (SSOT) である。公式サイトは design.gitlab.com。コンポーネント実装は GitLab UI から取り込み、製品に使われる。Figma UI kit は SSOT ではなく参照用、と README が明記する。コンポーネントの実装タブは Component Story Format の Storybook を埋め込み、静的画像で最終形を表さない方針である。

## 要点

- 公式 title / og:title は「Pajamas Design System」。og:image は /img/social/link-preview.png (1908x1020)。
- ローカル開発は mise と yarn。ドキュメントは localhost:2018、GitLab UI の Storybook は localhost:9001 (`yarn start:full`)。
- 各コンポーネントは `component:` 接頭辞の GitLab ラベルを持つ。フォームなどグループに属する部品は `component:form-checkbox` のようにグループ名を付ける。
- 画像は JPEG / PNG / SVG。写真は JPEG/PNG、アイコンと単純な UI は SVG。`site/static/img/` に置き、`<figure-img>` で出す。
- 採用状況の計測に Pajamas Adoption Scanner を使う、と README が他プロジェクト連携先に挙げる。

## 具体的な値・ルール

| 項目 | 値 |
|---|---|
| 公式サイト | https://design.gitlab.com/ |
| ソース | gitlab.com/gitlab-org/gitlab-services/design.gitlab.com |
| ドキュメント開発ポート | 2018 |
| Storybook ポート | 9001 |
| コンポーネントラベル | `component:` 接頭辞 |

## AwesomeDS への反映

- 採用: 実装の正本を Storybook / コードに置き、Figma を参照に留める考え方。AwesomeDS は DESIGN.md と tokens を正本にし、サイトは実物で見せる。
- 反映不要: GitLab 固有のラベル運用と Adoption Scanner。

## 出典

1. https://design.gitlab.com/ (取得日 2026-10-07)。title、og:image。
2. https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com README (取得日 2026-10-07)。SSOT、GitLab UI、Figma は参照、CSF、ラベル、画像規則。
