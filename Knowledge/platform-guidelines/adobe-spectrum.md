---
title: "Adobe Spectrum"
category: platform-guidelines
type: guideline
sources:
  - url: https://spectrum.adobe.com/
    title: "Start with Spectrum"
  - url: https://github.com/adobe/react-spectrum
    title: "adobe/react-spectrum: React Spectrum, React Aria, React Stately"
  - url: https://registry.npmjs.org/@adobe/react-spectrum/latest
    title: "npm: @adobe/react-spectrum latest"
  - url: https://react-spectrum.adobe.com/
    title: "React Spectrum Libraries"
tags: [spectrum, adobe, react-aria, react-stately, accessibility, i18n, design-system]
updated: 2026-10-07
---

# Adobe Spectrum

## 概要

Spectrum は Adobe 製品横断のデザインシステムで、spectrum.adobe.com が公式サイトである。実装は adobe/react-spectrum にあり、見た目付きの React Spectrum、非スタイルの React Aria、状態管理の React Stately、30 言語超の Internationalized パッケージに分かれる。WAI-ARIA Authoring Practices に沿ったキーボードとスクリーンリーダー対応、マウス / タッチ / キーボード、RTL と日付・数値の国際化を掲げる。

## 要点

- 公式サイトの title / og:title は「Start with Spectrum」。og:description は「Spectrum is the system behind Adobe’s experiences」。
- React Spectrum は Adobe のビジュアルを含む完成ライブラリ。独自スタイルでゼロから作る場合は React Aria + React Stately から始める、と README が案内する。
- アクセシビリティは WAI-ARIA APG 1.2 を参照し、多くのスクリーンリーダーとデバイスで検証したと明記。
- 国際化は 30 言語超、RTL、日付と数値フォーマットを標準で含む。
- テーマはカスタム可能で、ダークモードに自動適応する。
- npm `@adobe/react-spectrum` 最新は 3.47.5 (2026-10-07 取得)、ライセンス Apache-2.0。

## 具体的な値・ルール

| 項目 | 値 |
|---|---|
| 公式サイト | https://spectrum.adobe.com/ |
| 実装ドキュメント | https://react-spectrum.adobe.com/ |
| npm | `@adobe/react-spectrum` 3.47.5 |
| ライセンス | Apache-2.0 |
| i18n | 30 言語超、RTL 含む |

## AwesomeDS への反映

- 反映済み: キーボード操作と WAI-ARIA 準拠は DESIGN.md 11. Accessibility。Radix / Base UI を既定プリミティブにする判断と、React Aria の「振る舞いだけ提供」は同じ役割分担。
- 反映不要: Spectrum の Adobe ビジュアルと 30 言語バンドルは AwesomeDS の範囲外。Brief が Adobe 実装を指名したとき公式パッケージを使う (`foundations/stack.md`)。

## 出典

1. https://spectrum.adobe.com/ (取得日 2026-10-07)。title、og:title、og:description、og:image (1957x1349 PNG)。
2. https://github.com/adobe/react-spectrum README (取得日 2026-10-07)。4 ライブラリ、Accessible / Adaptive / International / Customizable。
3. https://registry.npmjs.org/@adobe/react-spectrum/latest (取得日 2026-10-07)。3.47.5、Apache-2.0。
