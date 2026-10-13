---
title: "textlint AI writing"
category: anti-slop
type: library
sources:
  - url: https://github.com/textlint-ja/textlint-rule-preset-ai-writing
    title: "textlint-ja/textlint-rule-preset-ai-writing"
  - url: https://raw.githubusercontent.com/textlint-ja/textlint-rule-preset-ai-writing/main/README.md
    title: "preset-ai-writing README"
tags: [japanese, textlint, lint, mit]
updated: 2026-10-13
---

# textlint AI writing

## 概要

AI が書きがちな日本語の形を検出する textlint プリセット。パッケージ名は `@textlint-ja/textlint-rule-preset-ai-writing`。GitHub API（2026-10-13）では MIT、1,155 stars。README は「表現ではなく構造を縛る」と書く。

## 要点

- 導入: `npm install @textlint-ja/textlint-rule-preset-ai-writing`。`.textlintrc` の rules に `"@textlint-ja/preset-ai-writing": true`。
- 要件: textlint 15.1.0 以降。MCP は textlint 14.8.0 以降の `npx textlint --mcp`（README の記述。バージョンの前後関係は導入時にリリースノートで確認する）。
- README が挙げるルール: `no-ai-list-formatting`（太字ラベルの箇条書き、絵文字箇条書き）、`no-ai-hype-expressions`、`no-ai-emphasis-patterns`、`no-ai-colon-continuation`、`ai-tech-writing-guideline`。
- Node なので既存 CI に載せやすい。この下書きでは依存もジョブも足していない。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| ライセンス | MIT |
| stars | 1,155（2026-10-13） |
| パッケージ | `@textlint-ja/textlint-rule-preset-ai-writing` |
| textlint | 15.1.0 以降（README） |

## AwesomeDS への反映

- 未反映: 警告ジョブ。先に `web/src/i18n/messages` の日本語へかけ、誤検知数を PR に書く。
- 反映しない: ルールが挙げる例文の転載。

## 出典

- https://github.com/textlint-ja/textlint-rule-preset-ai-writing : API で MIT と stars（2026-10-13）。
- https://raw.githubusercontent.com/textlint-ja/textlint-rule-preset-ai-writing/main/README.md : 原則、パッケージ名、導入、ルール名（2026-10-13）。
