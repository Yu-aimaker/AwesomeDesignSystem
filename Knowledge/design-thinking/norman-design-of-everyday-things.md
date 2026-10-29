---
title: "Norman『誰のためのデザイン?』(The Design of Everyday Things)"
category: design-thinking
type: article
sources:
  - url: https://raw.githubusercontent.com/wondelai/skills/HEAD/design-everyday-things/SKILL.md
    title: "wondelai/skills: design-everyday-things (Norman の概念の整理、MIT)"
  - url: https://raw.githubusercontent.com/Heydon/inclusive-design-checklist/HEAD/README.md
    title: "Heydon/inclusive-design-checklist (perceived affordance の項目)"
  - url: https://www.nngroup.com/articles/signifiers-not-affordances/
    title: "Signifiers, not affordances - Don Norman (jnd.org / NN/g)"
tags: [norman, affordance, signifier, feedback, mapping, constraints, conceptual-model]
updated: 2026-09-06
---

# Norman『誰のためのデザイン?』(The Design of Everyday Things)

## 概要

Don Norman の The Design of Everyday Things (改訂版 2013) は、アフォーダンス、シグニファイア、マッピング、フィードバック、制約、概念モデルという語彙で「使えるもの」の条件を説明した。UI では「押せそうに見えるか」「押した結果が返るか」「コントロールと効果の配置が対応しているか」に直結する。Norman 自身のサイトと NN/g は本環境から取得できなかったため、概念を整理した GitHub 上の資料と、perceived affordance を項目化した Heydon Pickering のチェックリストを資料とした。

## 要点

- Affordance (アフォーダンス): 「The relationship between an object's properties and a user's capabilities that determines how the object could be used」。物と人の能力の関係であり、見えるかどうかとは別。
- Signifier (シグニファイア): 「Signals that communicate where the action should take place」。Norman が「Signifiers, not affordances」で強調したのは、デザイナーが制御できるのはシグニファイア (手がかり) であること。
- Mapping (マッピング): 「The relationship between controls and their effects」。コンロのつまみと火口の配置が対応していれば説明がいらない。
- Feedback (フィードバック): 「Communicating the results of an action back to the user」。即時で、内容が分かり、過剰でないこと。
- Constraints (制約): 「Limiting the possible actions to prevent errors」。物理的、文化的、意味的、論理的の 4 種。
- Conceptual model (概念モデル): デザイナーのモデルと利用者のメンタルモデルは「システムイメージ」(製品そのものと文書) を通してしか一致しない。
- Seven stages of action: Goal → Plan → Specify → Perform → Perceive → Interpret → Compare。実行の隔たりと評価の隔たりを埋めるのがデザインの仕事。
- Heydon のチェックリストは同じ考えを実務項目にする: 「Make controls look like controls; give them strong perceived affordance」。
- Norman door (押すか引くか分からない扉) は、シグニファイアの欠如を示す典型例。UI では「クリックできるのか分からないテキスト」「フラットで枠のないボタン」「hover でしか分からないリンク」がこれに当たる。
- 良いフィードバックの条件: 即時 (100ms 以内に何かが変わる)、情報がある (何が起きたか分かる)、過剰でない (毎回の操作で大きく動かない)。

## 具体的な値・ルール

UI での翻訳表。

| 概念 | UI での意味 | AwesomeDS の規則 |
|---|---|---|
| Signifier | ボタンはボタンに見える、リンクは下線か accent 色 | 8. button は塗り (ink) または 1px 枠、ghost は文字色 `ink-secondary`。本文リンクは accent |
| Feedback | hover / active / loading / success を返す | 8. 「hover, focus-visible, active, disabled, loading states」、7. 100 から 200ms のフィードバック |
| Mapping | ラベルは入力の直上、エラーは直下、ダイアログの主要操作は右下 | 8. 「label above, helper text below, error below」 |
| Constraints | 無効状態、入力制約、確認 | 8. disabled 状態 (`ink-disabled #a3a3a3`)、`danger` の確認 |
| Conceptual model | 標準部品と標準キー操作で利用者のモデルに合わせる | 8. shadcn/ui、11. Tab / Escape / Enter |
| Gulf of evaluation | 状態が見えないと評価できない | 8. skeleton / empty / error を必須に |

## AwesomeDS への反映

- 採用: シグニファイアの原則。AwesomeDS では「Primary actions are ink on canvas (black button, white text)」とし、ボタンとリンクの見え方を固定した (DESIGN.md 2. Color 規則 1、8. Components)。フラットで境界のないボタンは ghost に限定し、`ink-secondary` の文字色で押せることを示す。
- 採用: フィードバックの即時性。100ms (色、opacity)、150ms (小さな移動)、200ms (enter) の刻みは、操作の直後に結果が返ることを保証する (7. Motion)。
- 採用: マッピング。フォームの label above / error below、ダイアログの構造を固定 (8. Components)。
- 採用: 制約。全部品に disabled 状態を用意し、破壊的操作は `danger` + ラベルで確認する。
- 翻案: Norman の「概念モデル」は、AwesomeDS では「標準部品を使い独自挙動を作らない」という運用ルールに置き換えた。
- 不採用: 「押せる見え方」を影や立体感で作ること。AwesomeDS は「Borders before shadows」で、シグニファイアは塗り、枠、色、カーソルで表す。Duolingo の 3D lip はその対極の例として `duolingo.md` に記録した。

## 出典

- https://raw.githubusercontent.com/wondelai/skills/HEAD/design-everyday-things/SKILL.md : 取得済み。affordance / signifier / mapping / feedback / constraints / conceptual model / seven stages の定義 (MIT ライセンス)。
- https://raw.githubusercontent.com/Heydon/inclusive-design-checklist/HEAD/README.md : 取得済み。「strong perceived affordance」の項目。
- https://www.nngroup.com/articles/signifiers-not-affordances/ : ネットワーク制限で取得不可。jnd.org も取得不可。原文の引用は含めていない。
