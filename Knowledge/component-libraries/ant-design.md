---
title: "Ant Design"
category: component-libraries
type: library
sources:
  - url: https://ant.design/
    title: "Ant Design - The world's second most popular React UI framework"
  - url: https://github.com/ant-design/ant-design
    title: "ant-design/ant-design"
  - url: https://registry.npmjs.org/antd/latest
    title: "npm: antd latest"
  - url: https://ant.design/docs/spec/introduce
    title: "Ant Design Introduction"
tags: [antd, ant-design, react, enterprise, typescript, theming, i18n]
updated: 2026-10-07
---

# Ant Design

## 概要

Ant Design は企業向けの UI デザイン言語と React 実装である。公式サイト ant.design の og:description は「enterprise-class UI design language and React UI library」と述べる。README は TypeScript、CSS-in-JS のテーマ、数十言語の国際化、モダンブラウザ / SSR / Electron を特徴とする。インストールは `npm install antd`。

## 要点

- 公式 og:image は 200x200 のブランドマーク (Alipay CDN)。1200x630 の SNS カードではない。
- npm `antd` 最新は 6.6.5 (2026-10-07 取得)、MIT、homepage は https://ant.design。
- サポートブラウザは Edge / Firefox / Chrome / Safari / Electron の last 2 versions。
- README の Features: 企業向け UI、すぐ使える高品質 React 部品、TypeScript、デザイン資源と開発ツール、数十言語、CSS-in-JS テーマ。
- 仕様ページ /docs/spec/introduce の og:image も同じ 200x200 ロゴ。

## 具体的な値・ルール

| 項目 | 値 |
|---|---|
| 公式サイト | https://ant.design/ |
| npm | `antd` 6.6.5 |
| ライセンス | MIT |
| ブラウザ | last 2 versions (Edge, Firefox, Chrome, Safari, Electron) |

## AwesomeDS への反映

- 反映不要: AwesomeDS の既定コンポーネント層は shadcn + Radix。Ant Design は完成度の高い別系統であり、トークンと部品を混ぜない。
- 記録: 企業向け密度と CSS-in-JS テーマは、AwesomeDS が避ける「大きなコンポーネントライブラリを npm のまま使う」例として参照できる。

## 出典

1. https://ant.design/ (取得日 2026-10-07)。og:title、og:description、og:image 200x200。
2. https://github.com/ant-design/ant-design README (取得日 2026-10-07)。Features、ブラウザ表、install。
3. https://registry.npmjs.org/antd/latest (取得日 2026-10-07)。6.6.5、MIT。
4. https://ant.design/docs/spec/introduce (取得日 2026-10-07)。og:title「Introduction - Ant Design」、同じ og:image。
