---
title: "Impeccable"
category: anti-slop
type: skill
sources:
  - url: https://github.com/pbakaus/impeccable
    title: "pbakaus/impeccable"
  - url: https://raw.githubusercontent.com/pbakaus/impeccable/main/README.md
    title: "Impeccable README"
  - url: https://impeccable.style
    title: "impeccable.style"
tags: [skill, detector, apache-2.0, design]
updated: 2026-10-13
---

# Impeccable

## 概要

AI 向けのデザイン指示と、決定的な検出ルールを持つ Skill。GitHub API（2026-10-13）では Apache-2.0、80,619 stars。README 冒頭は「1 skill、24 commands、59 deterministic detector rules」と書く。

## 要点

- 導入: プロジェクト直下で `npx impeccable install`。更新は `npx impeccable update`。その後、エージェント内で `/impeccable init`。
- 検出だけなら `npx impeccable detect src/`。公開 URL は `npx impeccable detect https://example.com`。README は、検出 CLI が LLM も API キーも使わないと書く。
- ルールの例（README の Anti-Patterns）: Arial、Inter、システム既定フォントを多用しない。色面の上の灰色文字を避ける。純黒と純グレーを避けて色味を足す。カードの全面使用と入れ子を避ける。bounce と elastic を避ける。
- AwesomeDS の既定書体は Geist である。README の禁止例に Geist は出ていない。検出が Geist を過剰使用と出すかは、この下書きでは未実行。出すなら無視設定を別 PR で足す。
- `npx impeccable install` は対応ハーネスに Hook も置く。初回にエンジンのバイナリを `~/.impeccable/bin/` へ落とす。この下書きでは Hook もバイナリもリポジトリに入れない。
- コマンドは `/impeccable` 経由で 24 個。README の表には craft、init、document、extract、shape、critique、audit、polish、bolder、quieter、distill、harden、onboard、animate、colorize、typeset、layout、delight、overdrive、clarify、adapt、optimize、live、generate がある。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| ライセンス | Apache-2.0 |
| stars | 80,619（2026-10-13） |
| 検出ルール | 59（README 冒頭） |
| コマンド | 24 |

## AwesomeDS への反映

- 未反映: 警告だけの `npx impeccable detect`。版を固定してから。
- 反映しない: Skill 本体のコピー、Hook、バイナリ。アクセントと主ボタンの正本は AwesomeDS トークンのまま。

## 出典

- https://github.com/pbakaus/impeccable : API で Apache-2.0 と stars（2026-10-13）。
- https://raw.githubusercontent.com/pbakaus/impeccable/main/README.md : 59 ルール、24 コマンド、detect、Hook、禁止例（2026-10-13）。
- https://impeccable.style : README が案内するドキュメント。2026-10-13 に HTTP 200。
