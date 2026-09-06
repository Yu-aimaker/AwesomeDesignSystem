---
title: "Atlassian, Carbon, Polaris, Primer (比較)"
category: design-systems
type: design-system
sources:
  - url: https://github.com/primer/primitives
    title: "primer/primitives: Color, spacing, and typography primitives in json"
  - url: https://raw.githubusercontent.com/primer/primitives/HEAD/src/tokens/base/typography/typography.json5
    title: "primer/primitives typography.json5"
  - url: https://raw.githubusercontent.com/carbon-design-system/carbon/HEAD/packages/type/src/styles.ts
    title: "carbon/packages/type styles.ts (type tokens)"
  - url: https://raw.githubusercontent.com/carbon-design-system/carbon/HEAD/packages/type/src/scale.ts
    title: "carbon/packages/type scale.ts (type scale)"
  - url: https://raw.githubusercontent.com/carbon-design-system/carbon/HEAD/packages/type/src/fontFamily.ts
    title: "carbon/packages/type fontFamily.ts (IBM Plex)"
  - url: https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/themes/base/font.ts
    title: "Shopify/polaris polaris-tokens font.ts"
  - url: https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/themes/base/border.ts
    title: "Shopify/polaris polaris-tokens border.ts"
  - url: https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/size.ts
    title: "Shopify/polaris polaris-tokens size.ts"
  - url: https://github.com/atlassian/atlassian-frontend-mirror
    title: "atlassian/atlassian-frontend-mirror (Atlassian Design System packages)"
tags: [atlassian, carbon, polaris, primer, tokens, type-scale, radius, density, enterprise]
updated: 2026-09-06
---

# Atlassian, Carbon, Polaris, Primer (比較)

## 概要

4 つの大規模エンタープライズ向けデザインシステムを、トークンの構造、書体とタイプスケール、角丸、密度の 4 観点で比較する。IBM Carbon、Shopify Polaris、GitHub Primer はトークンのソースコードを GitHub から取得できた。Atlassian Design System は atlassian.design と該当ソースパスが取得できず、リポジトリの存在確認のみで、値は本エントリに含めていない。

## 要点

- Primer (GitHub): `@primer/primitives` が「Color, spacing, and typography primitives in json」を提供し、CSS 変数として配布。テーマは light / dark / high-contrast / colorblind 派生。余白は `--space-*` の単一スケール。MIT。
- Primer の基本サイズ: xs 12px (0.75rem)、sm 14px (既定 UI 本文)、md 16px、lg 20px、xl 32px、2xl 40px。ウェイト light 300 / normal 400 / medium 500 / semibold 600。行間 tight 1.25 / snug 1.375 / normal 1.5 / relaxed 1.625 / loose 1.75。
- Carbon (IBM): IBM Plex Sans / Mono / Serif。タイプスケールは式 `Yn = Yn-1 + {FLOOR[(n - 2) / 4] + 1} * 2` で、12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 54, 60, 68, 76, 84px。
- Carbon のトークン: body01 は scale02 (14px) / regular / 1.42857 / letter-spacing 0.16px。body02 は 16px / 1.5 / 0。label01 と helperText01 と code01 は 12px / 1.33333 / 0.32px。heading01 は 14px / semibold、heading02 は 16px / semibold。大見出し (heading03 から 07) は productiveHeading の alias で light または regular。
- Polaris (Shopify): font-family-sans は `'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif`。ウェイトは regular 450 / medium 550 / semibold 650 / bold 700 と、variable font 前提の中間値。
- Polaris のサイズは size スケールを参照: 275 = 11px、300 = 12px、325 = 13px、350 = 14px、400 = 16px、450 = 18px、500 = 20px、550 = 22px、600 = 24px、750 = 30px、800 = 32px、900 = 36px、1000 = 40px。行間は 300 から 1200 の同じ size スケール。
- Polaris の角丸は `border-radius-0` から `750` (size 参照、0 から 30px) と `full: 9999px`。border-width は 0 / 0165 (0.66px) / 025 (1px) / 050 (2px) / 100 (4px)。
- 密度: Carbon と Polaris は 14px を UI 本文にし、Primer も sm 14px を「Default body text size for UI」とする。3 者とも 12px を最小の UI 文字にする。
- Atlassian: `atlassian-frontend-mirror` の `design-system/tokens` パッケージがトークン (color, spacing, typography, shape) を管理するが、本環境からは値を取得できなかった。

## 具体的な値・ルール

| 観点 | Primer | Carbon | Polaris |
|---|---|---|---|
| 書体 | (トークンに family 定義なし、GitHub は system stack) | IBM Plex Sans / Mono | Inter + system fallback |
| UI 本文 | 14px / 1.5 | 14px / 1.42857 / +0.16px | 14px (350) |
| 本文 (長文) | 16px | 16px / 1.5 | 16px (400) |
| 最小 | 12px | 12px / +0.32px | 11px (275) |
| ウェイト | 300 / 400 / 500 / 600 | light / regular / semibold | 450 / 550 / 650 / 700 |
| 行間トークン | 1.25 / 1.375 / 1.5 / 1.625 / 1.75 | 数値直書き (1.28572, 1.33333, 1.42857, 1.5) | size スケール参照 |
| 角丸 | (未取得) | (未取得) | 0 から 30px + full 9999px |
| 罫線 | (未取得) | (未取得) | 0.66 / 1 / 2 / 4px |
| 余白 | `--space-*` 単一スケール | (未取得) | size スケール 4px 刻み |

Carbon タイプスケール (px): 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 54, 60, 68, 76, 84。

## AwesomeDS への反映

- 採用: 3 者に共通する「12 / 14 / 16 を UI の基礎、14px を密度の高い UI 本文、12px を最小」という構造。AwesomeDS の body-sm 14、caption 12、「Never below 12」(DESIGN.md 3. Typography) はこの合意に沿う。
- 採用: primitive → semantic のトークン分離 (Primer の base / functional、Polaris の size 参照)。AwesomeDS の `components` セクションは `{colors.primary}` のような参照のみで hex を持たない。
- 採用: 1px を標準の罫線とし、2px は focus のみ (5. Shape)。Polaris の 025 = 1px と 050 = 2px の使い分けに対応する。
- 採用: 行間を数値トークンで持つ (1.2 から 1.6)。Primer の tight / normal / relaxed と同じ考え方。
- 翻案: Carbon の正の letter-spacing (12px に +0.32px) は、AwesomeDS では caption のみ +0.01em に留めた。
- 翻案: Polaris の 450 / 550 / 650 という中間ウェイトは採らず、400 / 500 / 600 の整数段にした。variable font (Geist, Noto Sans JP) なので中間値は可能だが、デザインツールとの往復で扱いにくいため。
- 不採用: IBM Plex と Inter。AwesomeDS は Geist。Inter は「Inter + slate + purple gradient」という AI 生成物の既定になっているため意図的に避けた (9. Do not)。
- 不採用: 16 段のタイプスケール (Carbon)。AwesomeDS は 8 段 (12 から 56) に絞った。
- 不採用: 11px (Polaris 275)。

## 出典

- https://github.com/primer/primitives : 取得済み。パッケージの説明、テーマ、`--space-*`、MIT。
- https://raw.githubusercontent.com/primer/primitives/HEAD/src/tokens/base/typography/typography.json5 : 取得済み。サイズ、ウェイト、行間。
- https://raw.githubusercontent.com/carbon-design-system/carbon/HEAD/packages/type/src/styles.ts : 取得済み。body / heading / label / code トークン。
- https://raw.githubusercontent.com/carbon-design-system/carbon/HEAD/packages/type/src/scale.ts : 取得済み。スケール式と 16 段の px。
- https://raw.githubusercontent.com/carbon-design-system/carbon/HEAD/packages/type/src/fontFamily.ts : 取得済み。IBM Plex の family 定義。
- https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/themes/base/font.ts : 取得済み。Inter スタック、ウェイト 450 / 550 / 650 / 700。
- https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/themes/base/border.ts : 取得済み。radius と width トークン。
- https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/size.ts : 取得済み。size スケール px 値。
- https://github.com/atlassian/atlassian-frontend-mirror : リポジトリ存在のみ確認。`design-system/tokens` 配下の値は取得不可。atlassian.design、carbondesignsystem.com、polaris.shopify.com、primer.style はネットワーク制限で取得不可。
