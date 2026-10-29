---
title: "natural-japanese"
category: anti-slop
type: skill
sources:
  - url: https://github.com/coji/natural-japanese
    title: "coji/natural-japanese"
  - url: https://raw.githubusercontent.com/coji/natural-japanese/main/README.md
    title: "natural-japanese README"
tags: [japanese, skill, lint, mit]
updated: 2026-10-14
---

# natural-japanese

## 概要

仕事の日本語（議事録、調査、社内ガイド、企画、ブログ）を、書く前の型と機械検査で読みやすくする Agent Skill。GitHub API（2026-10-14）では MIT、1,926 stars、最終 push 2026-10-13。

## 要点

- インストール: `npx skills add coji/natural-japanese`。Claude Code では `/plugin marketplace add coji/natural-japanese`。
- README の分け方: 書いたあとで匂いを抜くより、見出しの骨組みと文体の制約を先に置く。検出はスクリプト、採否は人がする。
- 検査は `uv run skills/natural-japanese/scripts/lint.py`。`--genre` と `--reading-load` がある。構成は `outline.py`、用語は `terms.py`。形態素は sudachipy。
- README は、語順や読点の位置は 180 本超の比較でも機械判定が難しい、と書く。そこは目視と読解負荷チェックを併用する。
- 依存が uv と sudachipy なので、AwesomeDS の Node CI には入れない。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| ライセンス | MIT |
| stars | 1,926（2026-10-14） |
| 検査 | lint.py、outline.py、terms.py |
| CI | 入れない |

## AwesomeDS への反映

- 反映済み: `Knowledge/skills/anti-ai-slop.md` のハック集「日本語（人気）」。
- 反映しない: サイトの `/anti-slop`。画面は変えていない。
- 反映しない: CI ジョブ。禁止語の正本は変えない。

## 出典

- https://github.com/coji/natural-japanese : API で MIT、stars、push（2026-10-14）。
- https://raw.githubusercontent.com/coji/natural-japanese/main/README.md : 設計、インストール、uv と lint コマンド（2026-10-14）。
