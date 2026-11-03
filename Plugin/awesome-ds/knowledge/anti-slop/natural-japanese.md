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

主に SKILL.md §1 と §3 から、AwesomeDS の文章にもそのまま使えるものを選び、言い換えてまとめた。例文は自作した。

- 見出しは節の結論にする。とはいえ、どの見出しも「名詞: 結論文」にそろえると、そろっていること自体が機械らしく見える。短い節はラベルでもよい。本文が留保していることを、見出しで言い切らない（SKILL.md §1「主メッセージと見出し」）。
- 読み手が「何のこと?」と止まる言い回しは、元の文書にある事実と名前で書き直す。SKILL.md §3 はこれを 7 種類に分ける: 1 中身が見えない言い回し（比喩に限らない）、2 すでに名前のあるものの呼び直し、3 擬人化、4 英語の逐語訳、5 名詞と動詞の組み合わせのずれ、6 エンジニアの話し言葉、7 動作の名詞化。
- 4、5、7 は書いた側にも読み直す側にも自然に見えるので、手で確かめる。4 は英語に訳し戻して、決まった言い方を 1 語ずつ移しただけでないかを見る。5 はその組み合わせを会話で言うかを考える。7 は「誰が何をする」の文に直してみて、そのほうがはっきりするかを見る。例:「設定の見直しは未着手」は「どの設定を変えるかは、まだ決めていない」と書ける。
- 意味の決まらない言い回しは、周りの文から意味が 1 つに決まる場合に限って書き直し、その解釈を報告に添えて、違えば選び直せるようにする。どの解釈も同じ程度にありうるときは手を付けず、解釈の案を示して依頼した人に決めてもらう（SKILL.md §3）。
- 打ち消しは中身で分ける。誰も言っていない思い込みを先回りして打ち消す文は、次の文に中身があれば文ごと外し、外すと次の文がつながらないなら残す。「A は B ではない。C だ。」は肯定の 1 文にまとめる。語の意味を絞る、誤解されやすい事実を示す、注意を書く、違いを説明する、のどれかに当たる打ち消しは残す（SKILL.md §3）。
- 演出の言葉（徹底的に、例外なく、劇的に のような誇張、大げさな場面の描写、読み手への呼びかけ）は、外しても文の言うことが変わらないときだけ外す。別の言葉に置き換えたり、締めの一言を足したりはしない。足した言葉に新しい演出が入りやすいため（SKILL.md §3「演出の言葉」）。
- 太字は重ねない。README の「太字を重ねない」の測定では、5 種類の文書をそれぞれ 5 つのモデルに書かせ、太字はスキルなし 25 本で 551 か所、スキルあり 25 本で 13 か所だった。
- 専門用語は、それが何をするかを説明してから名前を出す。ブランチ名や条件名のような作業中の呼び名は、読み手向けの文に出さない（SKILL.md §2）。

## 確かめ方

lint が動く環境では `uv run scripts/lint.py <file>` を使う。動かない環境向けに、同じ点検を目で行う手動チェックリスト（references/manual-checklist.md）がある。

1. 候補を出す。`lint.py` は禁止語、翻訳調、打ち消しの多用、文の長さの単調さなどを出し、文書の種類が分かれば `--genre` を付ける。`--reading-load` を付けると、長すぎる文、二重否定、「の」の連続など読みにくそうな箇所も出る（SKILL.md §4、§5）。手動のときは、チェックリストの 1〜3 をまず見て、気になる文書なら 4〜9 も見る。
2. 段落ごとに書き出す。通して読むと「もう読みやすい」と思って見落とすため（SKILL.md §3）。見出し、箇条書きの 1 項目、表の 1 行、地の文の段落ごとに番号を付け、「番号: 言い回し → 指しているもの」または「番号: なし」を最後の段落まで書いてから直す。lint の出力の末尾にこの一覧の枠が出る。手動のときはチェックリストの 10 で、既存の文書を直すときは省かない。
3. 構造を見る。少なくとも見出しと各段落の 1 文目を通して読む。詳しく見るときは `outline.py` と `terms.py` も使う（SKILL.md §5）。
4. 終わりは回数でなく状態で決める。見つけた箇所の扱いが「直した」と「理由をつけて残す」のどちらかに決まり、直したところから新しい問題が出ていなければ終わり。同じ箇所の問題が 2 回続けて出たら、その文か段落の組み立てから書き直すか、理由を書いて残す（manual-checklist.md「収束と仕上げ」）。
5. 分野の言葉と照らす。`calques.py` は、機械の動きを人や物の動作の動詞で書いた箇所と、仕組みを場所の名詞で書いた箇所を候補として並べるだけで、判断はしない。読み手が自分で書くときもその呼び名を使うか、その動詞だけで何が起きるか分かるかを、1 つずつ決める（SKILL.md §6）。
6. 元にないことを足していないか確かめる。`newfacts.py` は、直した後にだけある数値、固有名詞、英字の語を出す。一覧に何もなくても安心はできない。数値や固有名詞を使わずに足した説明、言い切りの強さの変化、誰の発言かの取り違えはこの方法では拾えないので、元の文書と並べて読む。一覧に出た語でも、略語の正式名称のように元の文書から直接言える補足なら残してよい（SKILL.md §6）。

## AwesomeDS への反映

- 反映済み: `/sites` のスキル欄（`AwesomeDS/data/sites.json`）と `/anti-slop` のハック集。
- 反映済み: `Knowledge/skills/anti-ai-slop.md` の「ハック（入れる・読む）」の表。
- 参考にする: 実測の示し方（条件つきの数、苦手なことも書く）は、AwesomeDS のレポートと Plugin の説明文を書くときの見本になる。
- 使い方: 「直すときの規則」と「確かめ方」は、Knowledge やサイトの文言を AI に直させたあとの確認に使う。文の検査は `content-and-tone.md` の禁止語と CI のまま。
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
