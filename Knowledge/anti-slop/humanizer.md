---
title: "Humanizer"
category: anti-slop
type: skill
sources:
  - url: https://github.com/blader/humanizer
    title: "blader/humanizer"
  - url: https://raw.githubusercontent.com/blader/humanizer/main/README.md
    title: "Humanizer README"
tags: [english, skill, prose, mit]
updated: 2026-10-13
---

# Humanizer

## 概要

英語の文章から AI らしい型を外す Agent Skill。コードやデータは対象にしない、と README の説明範囲は文章である。GitHub API（2026-10-13）では MIT、56,465 stars。最終 push は 2026-09-28。

## 要点

- 呼び出しは `/humanizer`。Claude Code は `/plugin marketplace add blader/humanizer` のあと `/plugin install humanizer@humanizer`。README は Claude Code 2.1.142 以降を要し、それより古い場合は `npx skills add blader/humanizer --global --agent claude-code` と書く。
- README が最も強いとする 5 型: Not X but Y、一行で締める、深そうな決まり文句、前置きの演出、相手のいない反論。パターンは 26。
- 日本語 UI の正本には使わない。英語版の説明を直すときの参照。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| ライセンス | MIT |
| stars | 56,465（2026-10-13） |
| パターン | 26（うち強い 5） |
| 対象 | 英語の文章 |

## AwesomeDS への反映

- 未反映: Plugin への同梱はしない。ハック集の英語枠としてこの個票だけ置く。
- 反映しない: 英語の禁止句を日本語 UI の禁止語へそのまま移すこと。

## 出典

- https://github.com/blader/humanizer : API で MIT と stars（2026-10-13）。
- https://raw.githubusercontent.com/blader/humanizer/main/README.md : 5 型、26 パターン、インストール（2026-10-13）。
