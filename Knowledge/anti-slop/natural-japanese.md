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
  - url: https://raw.githubusercontent.com/coji/natural-japanese/main/skills/natural-japanese/references/manual-checklist.md
    title: "natural-japanese manual-checklist.md"
  - url: https://github.com/coji/natural-japanese/releases/tag/v1.6.3
    title: "natural-japanese v1.6.3"
  - url: https://github.com/coji/natural-japanese/releases/tag/v1.6.4
    title: "natural-japanese v1.6.4"
  - url: https://github.com/coji
    title: "coji (GitHub)"
  - url: https://www.techtalk.jp/
    title: "株式会社TechTalk"
tags: [japanese, skill, lint, mit, evaluation]
updated: 2026-11-03
---

# natural-japanese

## 概要

AI が書いた仕事の日本語（議事録、調査レポート、技術記事、PR の説明文など）を読みやすく直す Agent Skill。新しく書くときにも使う。作者は coji（溝口 浩二、株式会社TechTalk 代表取締役）。GitHub API（2026-11-03）では MIT、2,009 stars、最新は v1.6.4（2026-10-28）。

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
| stars | 2,009（2026-11-03） |
| 最新 | v1.6.4（2026-10-28） |
| 検査 | lint.py、outline.py、terms.py、paragraphs.py、calques.py、newfacts.py |
| 書くときの原則 | 12 条（SKILL.md §2） |
| CI | 入れない |

## 直すときの規則

SKILL.md §1 と §3 から、AwesomeDS の文章にもそのまま使えるものを選んだ。例文は自作した。

- 見出しには節の結論を書く。ただし全部の見出しを「名詞: 結論文」の同じ形にはしない。同じ形が並ぶと、それ自体が機械的に見える（SKILL.md §1「主メッセージと見出し」）。見出しで本文より強く言い切らない。
- 中身の見えない言い回しは、元の文書にある事実でふだんの言葉に戻す。SKILL.md は 7 種類に分ける: 比喩、名前のあるものの言い直し、擬人化、英語の逐語訳、語の組み合わせのずれ、話し言葉の持ち込み、動作の名詞化（SKILL.md §3）。
- 逐語訳と名詞化は、読んだ印象では見つからない。英語に訳し戻して決まった言い方の置き換えになっていないか、名詞の文を「誰が何をする」の文に書き直したほうがはっきりしないか、を手で確かめる。例:「設定の見直しは未着手」は「どの設定を変えるかは、まだ決めていない」と書ける。
- 前後から読み方が 1 つに決まるときだけ直し、どう読んだかを添える。2 通り以上に読めるときは直さず、書いた人に聞く。
- 打ち消しは 3 種類に分ける。誰も言っていない思い込みを先に打ち消す文は外す。「A は B ではない。C だ。」は肯定の文 1 つにする。意味を絞る、誤解されやすい事実を示す、注意を書く打ち消しは残す（SKILL.md §3）。
- 誇張の言葉（徹底的に、例外なく、劇的に）は、外しても文が同じことを言えるときだけ外す。別の言葉で言い換えたり、決め台詞を足したりしない。新しく足した言葉に、また演出が入りやすいため（SKILL.md §3）。
- 太字は重ねない。README の測定では、5 種類の文書を 5 つのモデルに書かせて、太字はスキルなし 25 本で 551 か所、スキルあり 25 本で 13 か所だった。
- 用語は、何をするものかを先に書いてから名前を出す。作業用の名前（ブランチ名、条件名）を読み手向けの文に出さない（SKILL.md §2）。

## 確かめ方

lint が使える環境では `uv run scripts/lint.py <file>` から始める。使えない環境のために、同じ手順を目で行う手動チェックリストがある（references/manual-checklist.md）。どちらでも次の順で進める。

1. 機械で候補を出す。`lint.py` は禁止語、翻訳調、打ち消しの多用を出し、`--reading-load` で長い文と漢字の連続を出す。
2. 段落ごとに書き出す。見出し、箇条書きの 1 項目、表の 1 行、地の文の段落に上から番号を振り、全部について「番号: 言い回し → 指しているもの」か「番号: なし」を書く。最後まで書き出してから直し始める。通して読むだけだと見落とす種類がある（manual-checklist.md §10）。
3. 回数でなく状態で終える。見つけた箇所がすべて「直した」か「残す（理由）」に分かれ、直したことで新しい箇所が生まれていなければ終える。同じ箇所が 2 回続けて戻るなら、段落ごと組み直すか、理由をつけて残す。
4. 分野の言葉と照らす。`calques.py` で、機械の処理に人や物の動きを当てた動詞と、仕組みを場所にたとえた名詞を出し、読み手がふだん使う呼び名かを確かめる。
5. 足していないかを確かめる。`newfacts.py` で、直した後にだけある数値、固有名詞、英字の語を出し、1 つずつ元の文書で探す。手で行うときも同じ作業をする。

AwesomeDS では、文の検査は `content-and-tone.md` の禁止語と CI のままにする。上の手順は、Knowledge やサイトの文言を AI に直させたあとに人かエージェントが行う確認として使う。

## AwesomeDS への反映

- 反映済み: `/sites` のスキル欄（`AwesomeDS/data/sites.json`）と `/anti-slop` のハック集。
- 反映済み: `Knowledge/skills/anti-ai-slop.md` の「ハック（入れる・読む）」の表。
- 参考にする: 実測の示し方（条件つきの数、苦手なことも書く）は、AwesomeDS のレポートと Plugin の説明文を書くときの見本になる。
- 反映しない: CI ジョブ。禁止語の正本は変えない。

## 出典

- https://github.com/coji/natural-japanese : API で MIT、stars、最新の版（2026-11-03）。
- https://raw.githubusercontent.com/coji/natural-japanese/main/README.md : 直した例、守ること、苦手なこと、インストール（2026-10-30）。
- https://raw.githubusercontent.com/coji/natural-japanese/main/skills/natural-japanese/SKILL.md : 元にない内容を足さない規則、12 条の原則、検査スクリプト（2026-10-30）。
- https://raw.githubusercontent.com/coji/natural-japanese/main/PRODUCT.md : 検出と判断の分担、実測で示す方針（2026-10-30）。
- https://raw.githubusercontent.com/coji/natural-japanese/main/skills/natural-japanese/references/manual-checklist.md : lint が使えないときの手順、段落ごとの書き出し、終え方、足していないかの確かめ方（2026-11-03）。
- https://github.com/coji/natural-japanese/releases/tag/v1.6.3 : 外来語の直しと、その測り方（2026-10-30）。
- https://github.com/coji/natural-japanese/releases/tag/v1.6.4 : 括弧の直しと、その測り方（2026-10-30）。
- https://github.com/coji : 作者のプロフィール。名前 Coji Mizoguchi、所属 TechTalk Inc.（2026-10-30）。
- https://www.techtalk.jp/ : 株式会社TechTalk。代表取締役 溝口 浩二、設立 2019 年 7 月（2026-10-30）。
