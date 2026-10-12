---
title: "GOV.UK Design System"
category: platform-guidelines
type: design-system
sources:
  - url: https://design-system.service.gov.uk/
    title: "GOV.UK Design System"
  - url: https://github.com/alphagov/govuk-frontend
    title: "alphagov/govuk-frontend"
  - url: https://registry.npmjs.org/govuk-frontend/latest
    title: "npm: govuk-frontend latest"
  - url: https://frontend.design-system.service.gov.uk/installing-with-npm/
    title: "Install GOV.UK Frontend with npm"
tags: [govuk, government, design-system, accessibility, wcag, frontend, public-sector]
updated: 2026-10-07
---

# GOV.UK Design System

## 概要

GOV.UK Design System は英国政府のサービス向けデザインシステムで、コンポーネントの実例と使い分けは design-system.service.gov.uk、実装は alphagov/govuk-frontend にある。Government Digital Service が保守する。Frontend を使うと WCAG 2.2 のレベル AA 達成を助けられるが、拡張や改変をしたサービスは別途アクセシビリティ確認が必要、と README が明記する。

## 要点

- 公式サイト title は「Home – GOV.UK Design System」。og:image は govuk-opengraph-image.png (1200x630)。
- 導入は npm 推奨、または CSS / JS / アセットのコピー。導入後は追従計画を持つよう案内される。
- ブラウザは A / B / C / X の 4 等級。JS 拡張は A, B, C のみ。grade X には IE11 とそれより古いブラウザを含む。
- grade C の下限は `<script type="module">` をサポートするブラウザ (Chrome 61+、Edge 16-18 と 79+、Firefox 60+、Safari 11+)。
- 推奨支援技術、Windows / Firefox / Chrome でのユーザー上書きカラーに対応する。
- コードは MIT。文書は Crown copyright、Open Government Licence 3.0。

## 具体的な値・ルール

| 項目 | 値 |
|---|---|
| 公式サイト | https://design-system.service.gov.uk/ |
| npm | `govuk-frontend` 6.5.1 (2026-10-07) |
| アクセシビリティ目標 | WCAG 2.2 AA |
| コードライセンス | MIT |
| 文書ライセンス | OGL 3.0 (Crown copyright) |

## AwesomeDS への反映

- 採用: 公共サービスでは公式パッケージを使う。`foundations/stack.md` は Brief が GOV.UK を指名したとき再実装しないと既に書いている。
- 翻案: AwesomeDS のコントラストと 44px ターゲットは WCAG 2.2 と同じ方向だが、GOV.UK のクラウン・ブランド色は取り込まない。
- 不採用: IE11 向けの段階的強化。AwesomeDS は現代ブラウザ前提。

## 出典

1. https://design-system.service.gov.uk/ (取得日 2026-10-07)。title、og:image 1200x630。
2. https://github.com/alphagov/govuk-frontend README (取得日 2026-10-07)。導入方法、ブラウザ等級、WCAG 2.2 AA、MIT と OGL 3.0。
3. https://registry.npmjs.org/govuk-frontend/latest (取得日 2026-10-07)。6.5.1、MIT、homepage は frontend.design-system.service.gov.uk。
