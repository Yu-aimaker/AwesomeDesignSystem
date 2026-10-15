---
title: "No AI Slop (petergyang)"
category: anti-slop
type: skill
sources:
  - url: https://github.com/petergyang/no-ai-slop
    title: "petergyang/no-ai-slop"
  - url: https://raw.githubusercontent.com/petergyang/no-ai-slop/main/README.md
    title: "No AI Slop README"
  - url: https://raw.githubusercontent.com/petergyang/no-ai-slop/main/skills/no-ai-slop/SKILL.md
    title: "no-ai-slop SKILL.md"
tags: [english, skill, prose, mit]
updated: 2026-10-14
---

# No AI Slop (petergyang)

## 概要

英語の下書きから AI の定型を外す Skill。声は残し、検出だけもできる。日本語の `53able/no-ai-slop-ja`（stars 2、2026-10-14 の GitHub API）とは別物で、こちらが英語の文章向けに stars が多い。

## 要点

- 2026-10-14 の GitHub API: stars 12,303、ライセンス MIT、最終 push 2026-09-02。
- 入れ方は README の `npx skills add petergyang/no-ai-slop --skill no-ai-slop --global --yes`。呼び出しは `/no-ai-slop`。検出は `/no-ai-slop is this slop?`。
- README が名前を挙げる型は 10 個。対比（It's not X. It's Y.）、前置き、偽の洞察、コロンの種明かし、断片、表面的な分析、重要性の水増し、出典のない専門家、同義語の回転、偽の締め。
- SKILL.md は編集が既定。検出は書き換えない。読者か掲載先が不明なら質問は 1 つ。事実、数値、意見は足さない。
- 移植テスト: 人、会社、製品を入れ替えても文が成立するなら中身がない。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| ライセンス | MIT |
| stars | 12,303（2026-10-14 の GitHub API） |
| 型 | README は 20 以上と書き、名前は 10 個 |
| 対象 | 英語の文章。画面の色や余白は扱わない |

## AwesomeDS への反映

- 反映済み: ハック一覧の「人気のリポジトリ」行。`Knowledge/skills/anti-ai-slop.md`。
- 未反映: Skill の本文はコピーしない。日本語の禁止語の正本は `AwesomeDS/foundations/content-and-tone.md`。

## 出典

- https://github.com/petergyang/no-ai-slop : GitHub API、stars 12,303、MIT、push 2026-09-02（2026-10-14）。
- https://raw.githubusercontent.com/petergyang/no-ai-slop/main/README.md : インストール、10 型、MIT（2026-10-14）。
- https://raw.githubusercontent.com/petergyang/no-ai-slop/main/skills/no-ai-slop/SKILL.md : 編集と検出、移植テスト（2026-10-14）。
