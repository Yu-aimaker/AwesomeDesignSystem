---
title: "Nord Design System"
category: design-systems
type: design-system
sources:
  - url: https://nordhealth.design/
    title: "Nord Design System"
  - url: https://registry.npmjs.org/@nordhealth/components/latest
    title: "npm: @nordhealth/components latest"
tags: [nord, nordhealth, design-system, web-components, healthcare]
updated: 2026-10-07
---

# Nord Design System

## 概要

Nord Design System は Nordhealth の公開デザインシステムで、公式サイト nordhealth.design の og:description は「Design, build, and ship coherent experiences with Nordhealth」である。実装の中心は Web Components パッケージ `@nordhealth/components` で、フレームワーク非依存を掲げる。医療・ヘルスケア製品向けの密度とフォームパターンがサイトの OGP カードに示されている (予約フォームの見本)。

## 要点

- 公式 title / og:title は「Nord Design System」。og:image は動的バナー (1200x630) で、左に説明、右に「New appointment」フォーム。
- npm `@nordhealth/components` 最新は 5.4.3 (2026-10-07 取得)。description は「This package includes Nord Design System Web Components」。
- サイト文言は「Works with any framework」。

## 具体的な値・ルール

| 項目 | 値 |
|---|---|
| 公式サイト | https://nordhealth.design/ |
| npm | `@nordhealth/components` 5.4.3 |
| 実装 | Web Components |

## AwesomeDS への反映

- 反映不要: Nord はヘルスケア製品のブランドシステム。AwesomeDS は汎用既定であり、Nord の色と部品を取り込まない。
- 記録: Web Components でフレームワーク非依存にする選択は、AwesomeDS が React 既定・他は Brief 次第とする方針と並立する。

## 出典

1. https://nordhealth.design/ (取得日 2026-10-07)。title、og:title、og:description、og:image 1200x630。
2. https://registry.npmjs.org/@nordhealth/components/latest (取得日 2026-10-07)。5.4.3、Web Components。
