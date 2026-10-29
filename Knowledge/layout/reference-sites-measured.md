---
title: "参考サイトの余白と幅の実測（2026-10-21）"
category: layout
type: article
sources:
  - url: https://www.apple.com/jp/macbook-air/
    title: "Apple MacBook Air（日本）"
  - url: https://www.duolingo.com/
    title: "Duolingo"
  - url: https://stripe.com/
    title: "Stripe"
  - url: https://linear.app/
    title: "Linear"
  - url: https://vercel.com/geist/button
    title: "Vercel Geist: Button"
  - url: https://developer.apple.com/design/human-interface-guidelines/layout
    title: "Apple HIG: Layout"
  - url: https://m3.material.io/styles/typography/overview
    title: "Material 3: Typography overview"
  - url: https://design.digital.go.jp/dads/
    title: "デジタル庁デザインシステム"
  - url: https://smarthr.design/
    title: "SmartHR Design System"
  - url: https://www.gov.uk/service-manual/design/writing-for-user-interfaces
    title: "GOV.UK Service Manual: Writing for user interfaces"
  - url: https://design-system.service.gov.uk/styles/spacing/
    title: "GOV.UK Design System: Spacing"
  - url: https://ui.shadcn.com/docs
    title: "shadcn/ui docs"
  - url: https://tailwindcss.com/docs
    title: "Tailwind CSS docs"
tags: [layout, spacing, measure, gutter, container, measurement, apple, duolingo, japanese]
updated: 2026-10-21
---

# 参考サイトの余白と幅の実測（2026-10-21）

## 概要

17 ページを Playwright（Chromium）で 390・1280・1440px 幅で開き、本文の左端、本文を制限している要素の最大幅、段落の行長、見出しの上下の余白、カードグリッドの列と間隔を `getBoundingClientRect` と `getComputedStyle` で測った。すべて HTTP 200。1 サイト 1 から 3 ページだけの計測で、サイト全体の規則ではない。規則の側は [余白・グリッド・グルーピングの規則](spacing-grid-grouping.md)。

## 要点

- **スマホの左端は 15 から 25px**（17 ページ中 14）。15 から 16px が 6（Stripe、GOV.UK 2 ページ、デジタル庁、SmartHR トップ、Tailwind）、約 24px が 8（Apple JP と HIG は画面幅の 87.5% で 24.4px、Linear、Vercel、Geist、M3、shadcn、Duolingo ブログ）。SmartHR の記事ページは 40px。
- **ページの最大幅**: 宣伝ページ 980 から 1448px（Apple JP 980、Duolingo 988、Stripe 1266、Vercel 1448）。文書サイト 960 から 1220px（GOV.UK 960、GOV.UK DS 1100、Geist 1220）。
- **文書サイトの本文の列は 1280 幅で 539 から 760px**（9 ページ中 7）。Tailwind 560、HIG 539、GOV.UK 630、shadcn 640、SmartHR 640、GOV.UK DS 722、M3 760。外れ値は Geist 862、デジタル庁 881（右に目次がある記事では 577）。
- **文書サイトの 8 / 9 は左にナビ**（1280 で 200 から 289px）。本文は中央か、ナビの右で読む幅に収まる。
- **行長**: 英語 390 で 39 から 47 字、1280 で 60 から 88 字。日本語 390 で 19 から 24 字、1280 で SmartHR 40 字、デジタル庁 43 から 61 字。Apple JP の本文段落は 816px に 21px で 55 字。
- **見出しと本文**: 見出しから本文まで 13.6 から 24px。h2 の上は多くのサイトで 33 から 64px。上 : 下は 4 サイトで 2.2 から 3.8 倍、3 サイトで 6 から 7 倍。GOV.UK は上下とも 20 から 30。
- **カードグリッド**: 390 ではすべて 1 列。1280 で 2 から 3 列（まれに 4）。間隔は 12 から 24px が多い（Apple 12、Linear 12、Stripe 16、Vercel 20、HIG 20、Apple JP 20）。デジタル庁 32。ブレークポイントで間隔を変えるサイトはほぼない。
- **宣伝ページのセクション**: padding は 390 で 72 から 96px、1280 で 96 から 160px（Apple JP 110 / 120 / 160、Duolingo 96）。

### 同じ計測での AwesomeDS（変更前）

1280 で本文の領域は 1232px（max-width 1280、左右 24px）。ナビの列も中央の読む列もなく、すべて左寄せ。12px の注記が 1 行 121 字。見出しから本文まで 12px、h2 の上は 390 で 64 から 89px、1280 で 96 から 153px（比 7 から 10）。カードは 16px 間隔で 3 列。

## 具体的な値・ルール（あれば）

| 項目 | 実測 |
|---|---|
| スマホの左端 | 15 から 25px（17 ページ中 14） |
| 文書サイトのページ幅 | 960 から 1220px |
| 文書サイトの本文列（1280） | 539 から 760px（9 ページ中 7） |
| 日本語の行長（1280） | SmartHR 40 字、デジタル庁 43 から 61 字 |
| 見出しから本文 | 13.6 から 24px |
| h2 の上 | 33 から 64px（文書サイト） |
| カードの間隔 | 12 から 24px、幅で変えない |
| 宣伝ページのセクション padding | 390 で 72 から 96、1280 で 96 から 160 |

## AwesomeDS への反映

- 反映済み（AwesomeDS CHANGELOG の Unreleased）: スマホの左右 20px（15 から 25 の中央）、文書ページ 760px の中央寄せ（実測の本文列の上限）と本文 40em / 65ch、見出しから本文 8 から 24px、文書ページのセクション間 48 / 64、カード間隔 16 を幅で変えない。`foundations/spacing.md`、`layout.md`。
- 反映済み: 体験サイトの全ページ。
- 反映しない: 左のナビ列。AwesomeDS のサイトは上部ナビとページ内の目次で足りる、と判断した。ページが増えたら見直す。

## 出典

- https://www.apple.com/jp/macbook-air/ : 390 で左 24.4px、1280 で本文の外枠 980px、段落 55 字、カード間隔 20、セクション padding 110 から 160（2026-10-21 実測）。
- https://www.duolingo.com/ : 390 で左 25 から 30px、1280 で外枠 988px、段落 473px で 65 字、セクション padding 96（2026-10-21 実測）。
- https://stripe.com/ : 390 で左 16px、外枠 1266px、カード間隔 16（2026-10-21 実測）。
- https://linear.app/ : 390 で左 24px、カード間隔 12（2026-10-21 実測）。
- https://vercel.com/geist/button : 外枠 1220px、本文列 862px（2026-10-21 実測）。
- https://developer.apple.com/design/human-interface-guidelines/layout : 本文列 539px、左ナビあり（2026-10-21 実測）。
- https://m3.material.io/styles/typography/overview : 本文列 760px、左 88px のレール（2026-10-21 実測。layout のページは 404 だった）。
- https://design.digital.go.jp/dads/ : 390 で左 16px、本文列 881px（目次ありは 577px）、行長 43 から 61 字、カード間隔 32（2026-10-21 実測）。
- https://smarthr.design/ : 390 で左 16px（記事は 40px）、本文列 640px、行長 40 字（2026-10-21 実測）。
- https://www.gov.uk/service-manual/design/writing-for-user-interfaces : 390 で左 15px、外枠 960px、本文列 630px（2026-10-21 実測。依頼の guidance の URL は別サイトへ転送されたため置き換えた）。
- https://design-system.service.gov.uk/styles/spacing/ : 外枠 1100px、本文列 722px（2026-10-21 実測）。
- https://ui.shadcn.com/docs : 390 で左 24px、本文列 640px、右に 288px の目次（2026-10-21 実測）。
- https://tailwindcss.com/docs : 390 で左 16px、本文列 560px（2026-10-21 実測）。
