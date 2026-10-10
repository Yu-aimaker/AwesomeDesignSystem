---
title: "Material Design 3"
category: platform-guidelines
type: guideline
sources:
  - url: https://m3.material.io/
    title: "Material Design"
  - url: https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-motion.scss
    title: "material-web tokens: md-sys-motion (v0.192)"
  - url: https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-typescale.scss
    title: "material-web tokens: md-sys-typescale (v0.192)"
  - url: https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-shape.scss
    title: "material-web tokens: md-sys-shape (v0.192)"
  - url: https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-color.scss
    title: "material-web tokens: md-sys-color (v0.192)"
  - url: https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-ref-palette.scss
    title: "material-web tokens: md-ref-palette (v0.192)"
  - url: https://developer.android.com/develop/ui/compose/designsystems/material3
    title: "Material Design 3 in Compose | Android Developers"
tags: [material, google, tokens, tonal-palette, type-scale, shape, motion, elevation]
updated: 2026-10-07
---

# Material Design 3

## 概要

Material Design 3 (M3) は Google のデザインシステムで、色は「キーカラーからトーナルパレットを生成し、ロールに割り当てる」方式、余白と形は dp スケール、モーションはイージングと duration のトークンで定義する。公式サイト m3.material.io は本環境からアクセス不可だったため、Google が公開する `material-web` リポジトリのトークン定義 (v0.192) を一次資料として値を取得した。

## 要点

- 色は 6 つのキーカラー (primary, secondary, tertiary, neutral, neutral-variant, error) からそれぞれ 13 トーン (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100) のトーナルパレットを作る。
- ロールへの割り当ては明るいテーマで primary = tone 40、暗いテーマで tone 80。on-primary は 100 / 20。primary-container は 90 / 30。
- 標高 (elevation) は影ではなく surface の明度差で表す。surface-container-lowest から highest まで 5 段の面色があり、light では neutral 100 → 90、dark では neutral 4 → 22。
- タイプスケールは Display / Headline / Title / Body / Label × Large / Medium / Small の 15 段。Body Large は 16sp / 24 行送り / tracking 0.5sp。
- シェイプは 7 段。none 0、extra-small 4、small 8、medium 12、large 16、extra-large 28、full 9999 (px 表記)。
- イージングは emphasized 系 3 種 + standard 系 3 種 + legacy 3 種 + linear。emphasized = `cubic-bezier(0.2, 0, 0, 1)`、standard も同じ曲線を使う。
- duration は short1 50ms から extra-long4 1000ms まで 16 段。
- Android 実装 (Compose) では最小タッチターゲット 48dp が既定 (material3 の `minimumInteractiveComponentSize`)。

## 具体的な値・ルール

### 色ロールとトーン (light / dark)

| Role | Light | Dark |
|---|---|---|
| primary | primary40 | primary80 |
| on-primary | primary100 | primary20 |
| primary-container | primary90 | primary30 |
| on-primary-container | primary10 | primary90 |
| surface / background | neutral98 | neutral6 |
| surface-dim | neutral87 | neutral6 |
| surface-bright | neutral98 | neutral24 |
| surface-container-lowest | neutral100 | neutral4 |
| surface-container-low | neutral96 | neutral10 |
| surface-container | neutral94 | neutral12 |
| surface-container-high | neutral92 | neutral17 |
| surface-container-highest | neutral90 | neutral22 |
| on-surface | neutral10 | neutral90 |
| on-surface-variant | neutral-variant30 | neutral-variant80 |
| outline | neutral-variant50 | neutral-variant60 |
| outline-variant | neutral-variant80 | neutral-variant30 |
| inverse-surface | neutral20 | neutral90 |
| surface-tint | primary40 | primary80 |

参照パレットの既定値 (baseline)。primary: 10 `#21005d`, 40 `#6750a4`, 80 `#d0bcff`, 90 `#eaddff`。neutral: 10 `#1d1b20`, 50 `#79767d`, 90 `#e6e0e9`, 99 `#fffbff`。

### タイプスケール (rem, 1rem = 16px)

| Token | Size | Line height | Weight | Tracking |
|---|---|---|---|---|
| display-large | 3.5625rem (57px) | 4rem | regular | -0.015625rem |
| display-medium | 2.8125rem (45px) | 3.25rem | regular | 0 |
| display-small | 2.25rem (36px) | 2.75rem | regular | 0 |
| headline-large | 2rem (32px) | 2.5rem | regular | 0 |
| headline-medium | 1.75rem (28px) | 2.25rem | regular | 0 |
| headline-small | 1.5rem (24px) | 2rem | regular | 0 |
| title-large | 1.375rem (22px) | 1.75rem | regular | 0 |
| title-medium | 1rem (16px) | 1.5rem | medium | 0.009375rem |
| title-small | 0.875rem (14px) | 1.25rem | medium | 0.00625rem |
| body-large | 1rem (16px) | 1.5rem | regular | 0.03125rem |
| body-medium | 0.875rem (14px) | 1.25rem | regular | 0.015625rem |
| body-small | 0.75rem (12px) | 1rem | regular | 0.025rem |
| label-large | 0.875rem (14px) | 1.25rem | medium | 0.00625rem |
| label-medium | 0.75rem (12px) | 1rem | medium | 0.03125rem |
| label-small | 0.6875rem (11px) | 1rem | medium | 0.03125rem |

### モーション

| Easing token | Value |
|---|---|
| emphasized | cubic-bezier(0.2, 0, 0, 1) |
| emphasized-decelerate | cubic-bezier(0.05, 0.7, 0.1, 1) |
| emphasized-accelerate | cubic-bezier(0.3, 0, 0.8, 0.15) |
| standard | cubic-bezier(0.2, 0, 0, 1) |
| standard-decelerate | cubic-bezier(0, 0, 0, 1) |
| standard-accelerate | cubic-bezier(0.3, 0, 1, 1) |
| legacy | cubic-bezier(0.4, 0, 0.2, 1) |

duration: short1 50 / short2 100 / short3 150 / short4 200 / medium1 250 / medium2 300 / medium3 350 / medium4 400 / long1 450 / long2 500 / long3 550 / long4 600 / extra-long1 700 / extra-long2 800 / extra-long3 900 / extra-long4 1000 (ms)。

### シェイプ

corner-none 0px / extra-small 4px / small 8px / medium 12px / large 16px / extra-large 28px / full 9999px。

## AwesomeDS への反映

- 採用: 「標高は面の明度差で表す」を暗いテーマの規則にした。DESIGN.md 6. Depth and elevation の「On dark canvas, elevation is expressed by a lighter surface and a stronger hairline, not by shadow」と、2. Color の `#0a0a0a → #141414 → #1a1a1a` は M3 の surface-container 段階に対応する。
- 採用: duration の刻み。AwesomeDS の 100 / 150 / 200 / 300 / 500ms は M3 の short2 / short3 / short4 / medium2 / long2 に一致する。
- 採用: シェイプ 4 / 8 / 12 / 16 の刻み。AwesomeDS は 4, 6, 8, 12, 16, 24 で、M3 の extra-large 28 は採用せず 24 にした。
- 翻案: M3 の decelerate 系 (`0.05, 0.7, 0.1, 1`) の思想 (enter は減速) を採用したが、曲線自体は `cubic-bezier(0.16, 1, 0.3, 1)` を選んだ。M3 の standard は対称に近く、AwesomeDS は「never `ease` because it is symmetric」を掲げるため (7. Motion)。
- 翻案: 48dp ターゲットはモバイルの 44x44 に置き換えた。M3 と HIG の差 (48 vs 44) は、Web ではボタン高さ 40px + 余白で満たす。
- 不採用: トーナルパレット生成と primary-container のような tinted container。AwesomeDS は true gray の neutrals と単一 accent を選び、色の階層は type と余白で作る (2. Color 規則 3)。
- 不採用: 11px の label-small。AwesomeDS の最小は 12px。
- 不採用: tracking を正方向に付ける M3 の本文 (0.5sp)。AwesomeDS は本文 0、見出しは負のみ。

## 出典

- https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-motion.scss : easing と duration の全トークン。
- https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-typescale.scss : 15 段タイプスケール。
- https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-shape.scss : corner トークン 7 段。
- https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-color.scss : ロールとトーンの対応。
- https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-ref-palette.scss : 13 トーンと baseline hex。
- https://developer.android.com/develop/ui/compose/designsystems/material3 : Compose 実装 (検索結果で確認、未取得)。
- https://m3.material.io/ (取得日 2026-10-07): og:title「Material Design」、og:image `https://m3.material.io/static/assets/m3-social.jpg`。
- m3.material.io の本文トークンは GitHub の material-web を一次資料とした。
