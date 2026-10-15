---
title: "脱AIスロップ調査（B1）"
category: anti-slop
type: guideline
sources:
  - url: https://github.com/nanaism/yomiyasu
    title: "nanaism/yomiyasu"
  - url: https://github.com/pbakaus/impeccable
    title: "pbakaus/impeccable"
  - url: https://github.com/coji/natural-japanese
    title: "coji/natural-japanese"
  - url: https://github.com/textlint-ja/textlint-rule-preset-ai-writing
    title: "textlint-ja/textlint-rule-preset-ai-writing"
  - url: https://github.com/blader/humanizer
    title: "blader/humanizer"
  - url: https://github.com/hardikpandya/stop-slop
    title: "hardikpandya/stop-slop"
tags: [anti-slop, japanese, skill, lint, draft]
updated: 2026-10-13
---

# 脱AIスロップ調査（B1）

## 概要

AI スロップを減らすツールの調査メモ。サイトの `/anti-slop` と `Knowledge/skills/anti-ai-slop.md` は既にある。このフォルダは、2026-10-11 の調査でライセンスを確認し、2026-10-13 に GitHub API と README を開き直したツールの個票である。見た目の Before / After はサイト側に置く。

## 要点

- 正本の禁止項目は `AwesomeDS/foundations/anti-patterns.md` と `content-and-tone.md`。原則 7 は `foundations/principles.md`。
- ライセンスを GitHub API で再確認したものだけを個票にした（2026-10-13）。ライセンスがない投稿や記事は転記しない。
- 依存としてリポジトリに同梱するのはまだしない。導入コマンドは各個票に書き、CI への接続は別 PR。

| 個票 | ライセンス | stars（2026-10-13 API） | 使い方 |
|---|---|---|---|
| [yomiyasu](yomiyasu.md) | MIT | 1,939 | 日本語を構造から直す Skill。Python 標準ライブラリの lint |
| [Impeccable](impeccable.md) | Apache-2.0 | 80,619 | 画面の検出ルール 59。コピーせず CLI で呼ぶ |
| [natural-japanese](natural-japanese.md) | MIT | 1,924 | 書く前の型と sudachipy の検査。CI には入れない |
| [textlint AI writing](textlint-ai-writing.md) | MIT | 1,155 | Node の textlint。日本語の形を検査する本命候補 |
| [Humanizer](humanizer.md) | MIT | 56,465 | 英語の AI tell |
| [stop-slop](stop-slop.md) | MIT | 17,972 | 英語の禁止句と 5 軸採点 |

既存の taste-skill（MIT、同日 API で 95,424 stars）は [Knowledge/skills/taste-skill.md](../skills/taste-skill.md) にあり、`redesign-existing-projects` もそこにある。

## 具体的な値・ルール（あれば）

採否は次のまま。実装はしていない。

| 判断 | 内容 |
|---|---|
| 同梱しない | Skill 本体、カタログの例文、Impeccable の Hook（初回にバイナリを落とす） |
| 後で試す | `npx impeccable detect` と textlint は警告ジョブから。版を固定する |
| CI に入れない | natural-japanese（uv と sudachipy） |
| 載せない | ライセンス未確認のリポジトリと、ライセンスのない投稿の本文 |

## AwesomeDS への反映

- 反映済み: 原則 7、`/anti-slop`、`Knowledge/skills/anti-ai-slop.md`。
- この下書き: 上記 6 個票。トークン、画面、Plugin の Skill 定義は変えていない。
- 未反映: 検査の CI、`content-and-tone.md` の長文ルール拡張、design-verifier への日本語ルール。

## 出典

- https://github.com/nanaism/yomiyasu : README と API（2026-10-13）。
- https://github.com/pbakaus/impeccable : README と API（2026-10-13）。
- https://github.com/coji/natural-japanese : README と API（2026-10-13）。
- https://github.com/textlint-ja/textlint-rule-preset-ai-writing : README と API（2026-10-13）。
- https://github.com/blader/humanizer : README と API（2026-10-13）。
- https://github.com/hardikpandya/stop-slop : README と API（2026-10-13）。
- https://github.com/Leonxlnx/taste-skill : API の stars のみ（2026-10-13）。本文は既存エントリ。
