---
title: "stop-slop"
category: anti-slop
type: skill
sources:
  - url: https://github.com/hardikpandya/stop-slop
    title: "hardikpandya/stop-slop"
  - url: https://raw.githubusercontent.com/hardikpandya/stop-slop/main/README.md
    title: "stop-slop README"
tags: [english, skill, prose, mit]
updated: 2026-10-13
---

# stop-slop

## 概要

英語の文章から AI らしい句と構造を外す Skill ファイル。GitHub API（2026-10-13）では MIT、17,972 stars。最終 push は 2026-03-17。

## 要点

- 中身は `SKILL.md` と `references/phrases.md`、`structures.md`、`examples.md`。Claude Code ではフォルダを Skill として置く、と README は書く。
- 検出対象（README）: 前置き、強調の支え、ビジネス用語、副詞の多用、あいまいな断定、メタ解説。構造では二項対比、否定の羅列、断片化、受動態。文では Wh で始める文、em dash、極端な言い切り。
- 採点は 5 軸を各 1 から 10。Directness、Rhythm、Trust、Authenticity、Density。35/50 未満は書き直す。
- Humanizer と同じく英語用。日本語の正本にはしない。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| ライセンス | MIT |
| stars | 17,972（2026-10-13） |
| 合格線 | 35/50 未満は改稿 |
| 軸 | 5 |

## AwesomeDS への反映

- 未反映: 同梱はしない。英語コピーを見るときの参照。
- 反映済みの近い規則: AwesomeDS は UI コピーに em dash を置かない（`content-and-tone.md`）。stop-slop の英語規則を日本語へ広げてはいない。

## 出典

- https://github.com/hardikpandya/stop-slop : API で MIT と stars（2026-10-13）。
- https://raw.githubusercontent.com/hardikpandya/stop-slop/main/README.md : 構成、検出対象、5 軸（2026-10-13）。
