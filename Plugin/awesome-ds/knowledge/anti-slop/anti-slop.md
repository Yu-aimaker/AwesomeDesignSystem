---
title: "anti-slop (miqdadbadjuber)"
category: anti-slop
type: skill
sources:
  - url: https://github.com/miqdadbadjuber/anti-slop
    title: "miqdadbadjuber/anti-slop"
  - url: https://raw.githubusercontent.com/miqdadbadjuber/anti-slop/main/README.md
    title: "anti-slop README"
  - url: https://raw.githubusercontent.com/miqdadbadjuber/anti-slop/main/antislop.md
    title: "antislop.md"
  - url: https://raw.githubusercontent.com/miqdadbadjuber/anti-slop/main/package.json
    title: "anti-slop package.json"
tags: [skill, filter, mit, ui, copy]
updated: 2026-10-14
---

# anti-slop (miqdadbadjuber)

## 概要

画面、文章、コードのコメントから、生成の既定を落とすフィルタ。README はスタイルガイドではないと書く。色、書体、レイアウトは指定しない。方向は別の DESIGN.md が持つ。

## 要点

- 2026-10-14 の GitHub API: stars 6,011、ライセンス MIT、最終 push 2026-10-13。`package.json` の version は 3.2.20。
- 入れ方は README の `npx antislop-ai`、または `npx skills add miqdadbadjuber/anti-slop`。単体ファイルは `antislop.md`。
- Skill は 6 つ。本体、UI、コピー、アクセシビリティ、幅、コードのコメント。
- 使い方は During（作りながら）と After（あとから監査）。既定は毎回聞く。
- 規則は R-01 から R-38。Hard Gate は例外なし。Purpose-Gate は理由を書いたときだけ技法を許す。Quality Locks は一貫性。
- Hard Gate の例（`antislop.md`、2026-10-14 に取得）: R-02 は em dash 文字を禁止。R-03 は横あふれ禁止、タップは 44px。R-17 は出典のない数値を禁止。R-18 は架空の推薦を禁止。R-23 は指示のない最終アセットを作る前に確認する。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| ライセンス | MIT |
| stars | 6,011（2026-10-14 の GitHub API） |
| 版 | 3.2.20 |
| 規則 | R-01 から R-38 |
| タップ | 44px（R-03） |
| ダイヤル | ENERGY、RHYTHM、MOTION |

## AwesomeDS への反映

- 反映済み: ハック一覧の「人気のリポジトリ」行。`Knowledge/skills/anti-ai-slop.md`。
- 未反映: 規則本文はコピーしない。タップ 44px と em dash 禁止は、すでに `AwesomeDS/foundations/` の別出典にある。このリポの数値でトークンは変えない。

## 出典

- https://github.com/miqdadbadjuber/anti-slop : GitHub API、stars 6,011、MIT、push 2026-10-13（2026-10-14）。
- https://raw.githubusercontent.com/miqdadbadjuber/anti-slop/main/README.md : 6 Skill、38 規則、インストール（2026-10-14）。
- https://raw.githubusercontent.com/miqdadbadjuber/anti-slop/main/antislop.md : Hard Gate の R-02、R-03、R-17、R-18、R-23（2026-10-14）。
- https://raw.githubusercontent.com/miqdadbadjuber/anti-slop/main/package.json : version 3.2.20（2026-10-14）。
