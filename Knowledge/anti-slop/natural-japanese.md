---
title: "natural-japanese"
category: anti-slop
type: skill
sources:
  - url: https://github.com/coji/natural-japanese
    title: "coji/natural-japanese"
  - url: https://raw.githubusercontent.com/coji/natural-japanese/main/README.md
    title: "natural-japanese README"
  - url: https://raw.githubusercontent.com/coji/natural-japanese/main/skills/natural-japanese/SKILL.md
    title: "natural-japanese SKILL.md"
  - url: https://raw.githubusercontent.com/coji/natural-japanese/main/PRODUCT.md
    title: "natural-japanese PRODUCT.md"
  - url: https://github.com/coji/natural-japanese/releases/tag/v1.6.3
    title: "natural-japanese v1.6.3"
  - url: https://github.com/coji/natural-japanese/releases/tag/v1.6.4
    title: "natural-japanese v1.6.4"
  - url: https://github.com/coji
    title: "coji (GitHub)"
  - url: https://www.techtalk.jp/
    title: "株式会社TechTalk"
tags: [japanese, skill, lint, mit, evaluation]
updated: 2026-10-30
---

# natural-japanese

## 概要

AI が書いた仕事の日本語（議事録、調査レポート、技術記事、PR の説明文など）を読みやすく直す Agent Skill。新しく書くときにも使う。作者は coji（溝口 浩二、株式会社TechTalk 代表取締役）。GitHub API（2026-10-30）では MIT、1,993 stars、最新は v1.6.4（2026-10-28）。

## 要点

- いちばん上の規則は「元にない内容を足さない」。直すときに、元の文書にない事実、数値、意見、方針を足さず、確信の度合いも変えない（SKILL.md）。「次回また相談する」を「合意した」にする直しは、書き手が言っていないことを書き手の言葉にする、と理由も書く。
- 検出と判断を分ける。疑わしい箇所は `lint.py` が sudachipy の形態素解析で見つけ、直すかどうかはエージェントが文脈で決める。モデルは自分の書き癖に気づきにくいから、という理由。直した文書にだけある数値と固有名詞は `newfacts.py` で洗い出す。
- 書くときの原則は 12 条（SKILL.md §2）。結論を先に書く、見出しに節の結論を書く、因果は箇条書きにせず地の文で書く、確信の度合いを語尾でぼかさず書き分ける、事実と意見を分ける、など。
- 効果は実測で示す（PRODUCT.md）。同じ素材をスキルあり、なし、前の版で書かせ、モデル、本数、判定の方法と一緒に数を出す。本数が少なければ少ないと書き、苦手なことも同じ重さで書く。
- 例: v1.6.3 は、ふだん使う外来語を漢語に言い換えすぎる癖を止めた版。報告文 5 本ずつで、ソフトのバージョンを「版」と書いた箇所が 13 から 0 になった。直しすぎていないかの確認では、同じものでも回によって 1 から 4 か所動くので、その範囲の差はばらつきとして扱う、とリリースに書く。
- v1.6.4 は、括弧に文を詰め込む書き方を本文に出して直す版。Opus が書いた文書 9 本にあった、文や読点の入った括弧 21 個のうち、残った数が 17・16 から 4・5 になった（2 回ずつ）。
- 苦手なこと（README）: 英語の言い方を 1 語ずつ訳した熟語や、動作を名詞にまとめた言い回しは半分ほど見逃す。effort を下げると手順を省く。
- インストール: `npx skills add coji/natural-japanese`。Claude Code では `/plugin marketplace add coji/natural-japanese` のあと `/plugin install natural-japanese@natural-japanese`。採点だけなら `/natural-japanese score <ファイル>`。
- 依存が uv と sudachipy なので、AwesomeDS の Node CI には入れない。
- 例文と規則の本文は MIT の著作物。ここでは要約にとどめ、AwesomeDS 用の文は作り直す。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| ライセンス | MIT |
| stars | 1,993（2026-10-30） |
| 最新 | v1.6.4（2026-10-28） |
| 検査 | lint.py、outline.py、terms.py、paragraphs.py、calques.py、newfacts.py |
| 書くときの原則 | 12 条（SKILL.md §2） |
| CI | 入れない |

## AwesomeDS への反映

- 反映済み: `/sites` のスキル欄（`AwesomeDS/data/sites.json`）と `/anti-slop` のハック集。
- 反映済み: `Knowledge/skills/anti-ai-slop.md` の「ハック（入れる・読む）」の表。
- 参考にする: 実測の示し方（条件つきの数、苦手なことも書く）は、AwesomeDS のレポートと Plugin の説明文を書くときの見本になる。
- 反映しない: CI ジョブ。禁止語の正本は変えない。

## 出典

- https://github.com/coji/natural-japanese : API で MIT、stars、最新の版（2026-10-30）。
- https://raw.githubusercontent.com/coji/natural-japanese/main/README.md : 直した例、守ること、苦手なこと、インストール（2026-10-30）。
- https://raw.githubusercontent.com/coji/natural-japanese/main/skills/natural-japanese/SKILL.md : 元にない内容を足さない規則、12 条の原則、検査スクリプト（2026-10-30）。
- https://raw.githubusercontent.com/coji/natural-japanese/main/PRODUCT.md : 検出と判断の分担、実測で示す方針（2026-10-30）。
- https://github.com/coji/natural-japanese/releases/tag/v1.6.3 : 外来語の直しと、その測り方（2026-10-30）。
- https://github.com/coji/natural-japanese/releases/tag/v1.6.4 : 括弧の直しと、その測り方（2026-10-30）。
- https://github.com/coji : 作者のプロフィール。名前 Coji Mizoguchi、所属 TechTalk Inc.（2026-10-30）。
- https://www.techtalk.jp/ : 株式会社TechTalk。代表取締役 溝口 浩二、設立 2019 年 7 月（2026-10-30）。
