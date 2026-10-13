---
title: "yomiyasu"
category: anti-slop
type: skill
sources:
  - url: https://github.com/nanaism/yomiyasu
    title: "nanaism/yomiyasu"
  - url: https://raw.githubusercontent.com/nanaism/yomiyasu/main/README.md
    title: "yomiyasu README"
  - url: https://raw.githubusercontent.com/nanaism/yomiyasu/main/scripts/yomiyasu_lint.py
    title: "yomiyasu_lint.py"
tags: [japanese, skill, lint, mit]
updated: 2026-10-13
---

# yomiyasu

## 概要

AI が書いた日本語を、意味を保ったまま読みやすく直す Agent Skill。GitHub API（2026-10-13）では MIT、1,939 stars、最終 push は同日。

## 要点

- インストール: `npx skills add nanaism/yomiyasu`。更新は `npx skills update yomiyasu`。定義は `skills/yomiyasu/SKILL.md`。
- README の方針は、読み違いが起きる箇所だけ直し、自然な文は残す、である。
- 7 原則（README）: 主述と修飾の対応、文の働きと文体を保つ、擬人化を整理する、比喩を平易な動詞にする、前置きは主張が変わらないときだけ削る、原文にない主体や数値を足さない、文長と読点と装飾を調整する。
- 文長の目安は平均 30 から 45 文字、1 文の読点は 0 から 2。常体と敬体は指定がなければ変えない。
- 静的検査は `python3 scripts/yomiyasu_lint.py`。`--strict` と `--json` がある。差分は `yomiyasu_diff.py`。`yomiyasu_lint.py` の先頭は、Python 標準ライブラリだけで動くと書く（2026-10-13 に raw を取得）。
- 例文は README の著作物なので、ここには写さない。使うときは出典を残し、AwesomeDS 用の文は作り直す。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| ライセンス | MIT |
| stars | 1,939（2026-10-13） |
| 文長の目安 | 平均 30 から 45 文字 |
| 読点 | 1 文あたり 0 から 2 |

## AwesomeDS への反映

- 未反映: CI への接続。候補は `web/src/i18n/messages` の日本語と Knowledge 本文を、版を固定した lint で警告する。
- 反映しない: カタログ語の丸写し。禁止語の正本は `content-and-tone.md` のまま。

## 出典

- https://github.com/nanaism/yomiyasu : リポジトリ。API で MIT と stars（2026-10-13）。
- https://raw.githubusercontent.com/nanaism/yomiyasu/main/README.md : 7 原則、文長、インストール、lint コマンド（2026-10-13）。
- https://raw.githubusercontent.com/nanaism/yomiyasu/main/scripts/yomiyasu_lint.py : 標準ライブラリのみ、とファイル先頭に書く（2026-10-13）。
