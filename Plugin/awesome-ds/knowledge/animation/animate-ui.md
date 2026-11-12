---
title: "Animate UI"
category: animation
type: library
sources:
  - url: https://github.com/imskyleen/animate-ui
    title: "imskyleen/animate-ui"
  - url: https://animate-ui.com
    title: "animate-ui.com"
  - url: https://raw.githubusercontent.com/imskyleen/animate-ui/main/README.md
    title: "README"
  - url: https://raw.githubusercontent.com/imskyleen/animate-ui/main/LICENSE.md
    title: "MIT + Commons Clause"
tags: [animate-ui, motion, radix, base-ui, commons-clause]
updated: 2026-11-11
---

# Animate UI

## 概要

Animate UI は、Radix、Base UI、React Aria 向けの Motion 部品を、import を差し替えて使う配布である。ライセンスは MIT に Commons Clause が付く。制限のない OSS ではない。部品のソースを AwesomeDS やプラグインへ再配布しない。

## 要点

- LICENSE.md（2026-11-11）: アプリやサイトへの組み込みは商用を含めてよい。部品そのものを元の形で販売、再配布することはできない。GitHub API の license は NOASSERTION。
- API（2026-11-11）: 4,968 stars、最終 push 2026-11-09、archived ではない。
- README: `npx @animate-ui/cli@latest animate all`。import の例は `radix-ui` から `@animate-ui/react/primitives/radix-ui` への差し替え。
- reduced-motion のテスト（`apps/v2/tests/interaction/reduced-motion-setting.spec.ts`）は user / never / always の 3 モードを見る。`prefers-reduced-motion: reduce` のとき user は reduced、never は full のまま、always は reduced。AwesomeDS の reduced-motion はこのトークン側の規則のままにする。

## AwesomeDS への反映

- 反映済み: サイト一覧の既存行は `MIT + Commons Clause` と licenseUrl を持つ。OSS ランキングの選定リストへは入れない。
- 反映不要: 部品ソースの同梱。既定のモーションは Motion とトークンのまま。

## 出典

- https://raw.githubusercontent.com/imskyleen/animate-ui/main/README.md : drop-in と import 差し替え（2026-11-11）。
- https://raw.githubusercontent.com/imskyleen/animate-ui/main/LICENSE.md : Commons Clause（2026-11-11）。
- https://github.com/imskyleen/animate-ui/blob/main/apps/v2/tests/interaction/reduced-motion-setting.spec.ts : 3 モード（2026-11-11）。
- https://github.com/imskyleen/animate-ui : API（2026-11-11）。
- https://animate-ui.com : HTTP 200（2026-11-11）。
