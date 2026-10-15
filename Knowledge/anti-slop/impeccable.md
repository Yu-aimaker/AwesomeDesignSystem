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
tags: [skill, detector, apache-2.0, design, anti-slop]
updated: 2026-10-14
---

# Impeccable

## 概要

AI 向けのデザイン指示と、決定的な検出ルールを持つ Skill。GitHub API（2026-10-14）では Apache-2.0、stars 80,936。最終 push は 2026-10-13。README 冒頭は「1 skill、24 commands、59 deterministic detector rules」と書く。

## 要点

- 導入: プロジェクト直下で `npx impeccable install`。その後、エージェント内で `/impeccable init`。更新は `npx impeccable update`。
- 検出だけなら `npx impeccable detect src/`。公開 URL は `npx impeccable detect https://example.com`。README は、CLI とブラウザ拡張の決定的ルールが LLM も API キーも使わないと書く。
- ルールの例（README の Anti-Patterns）: Arial、Inter、システム既定フォントを多用しない。色面の上の灰色文字を避ける。純黒と純グレーを避ける。カードの全面使用と入れ子を避ける。bounce と elastic を避ける。
- AwesomeDS の既定書体は Geist である。README の禁止例に Geist は出ていない。検出が Geist を過剰使用と出すかは、この個票では未実行。
- `npx impeccable install` は対応ハーネスに Hook も置く。ランチャーはエンジンのバイナリを使う。この個票では Skill 本体、Hook、バイナリをリポジトリに入れない。
- コマンドは `/impeccable` 経由で 24 個。README の表には craft、init、audit、polish、critique、animate などがある。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| ライセンス | Apache-2.0 |
| stars | 80,936（2026-10-14） |
| 検出ルール | 59（README 冒頭） |
| コマンド | 24 |

## AwesomeDS への反映

- 反映済み: ハック集のデザイン検出に 1 行。正本は `Knowledge/skills/anti-ai-slop.md`。
- 反映しない: Skill 本体のコピー、Hook、バイナリ。アクセントと主ボタンの正本は AwesomeDS トークンのまま。
- 未反映: `npx impeccable detect` を CI に載せることは、版を固定してから別 PR にする。

## 出典

- https://github.com/pbakaus/impeccable : API で Apache-2.0、stars 80,936、push 2026-10-13（2026-10-14）。
- https://raw.githubusercontent.com/pbakaus/impeccable/main/README.md : 59 ルール、24 コマンド、detect、Hook、禁止例（2026-10-14）。
- https://impeccable.style : README が案内するドキュメント。2026-10-14 に HTTP 200。
