---
title: "デザインレビューとクリティーク"
category: design-thinking
type: article
sources:
  - url: https://raw.githubusercontent.com/opensesh/DESIGN-OPS/HEAD/skills/design-critique-facilitator.md
    title: "opensesh/DESIGN-OPS: design-critique-facilitator.md"
  - url: https://raw.githubusercontent.com/TrentM6/baseline-core/HEAD/skills/ux-design/references/design-critique.md
    title: "TrentM6/baseline-core: design-critique.md"
  - url: https://github.com/18F/methods
    title: "18F/methods (heuristic-evaluation, cognitive-walkthrough, design-studio を含む手法集)"
  - url: https://www.nngroup.com/articles/design-critiques/
    title: "Design Critiques: Encourage a Positive Culture to Improve Products - NN/g"
tags: [critique, design-review, facilitation, feedback, heuristic-evaluation, adversarial-review]
updated: 2026-09-06
---

# デザインレビューとクリティーク

## 概要

デザインクリティークは、作品ではなく「述べられた問題を意図した利用者に対して解いているか」を検討する構造化された会議である。進行役 (facilitator)、提示者 (presenter)、参加者 (critics) の役割を分け、文脈の共有、無言のレビュー、質問、所見、次の行動という順序で進める。敵対的レビュー (adversarial review) は、あえて壊す視点 (最悪の入力、極端な画面幅、キーボードのみ、色覚) で欠陥を探す派生形。NN/g、Figma blog、GitLab handbook は本環境から取得できず、GitHub 上のファシリテーション手引き 2 件と 18F の手法集を資料とした。

## 要点

- 中心の問い (DESIGN-OPS): 「Does this design effectively solve the stated problem for the intended user?」
- 5 段階の流れ (DESIGN-OPS): (1) Context Setting 2 分: 問題、利用者、制約、欲しいフィードバックの種類。(2) Observation 5 分: 視覚階層、フロー、要素を記述する。(3) Analysis 10 分: 整合、ニーズ、階層、視覚、ユーザビリティ、一貫性、エッジケースの 7 観点。(4) Feedback 10 分: 強み、質問、懸念、提案。(5) Next Steps 3 分。
- 30 分の標準タイムライン (DESIGN-OPS): Setup 2 / Silent review 3 / Questions 5 / Feedback 15 / Synthesis 5。
- 無言レビューの理由 (baseline-core): 「Everyone reviews the designs independently」「No discussion yet - this prevents anchoring on the first opinion.」
- 役割: Presenter は「Shares context and listens without defending」。Facilitator は提示者以外の人が務め、時間と発言の偏りを管理する。参加者は質問と所見を出す。
- グラウンドルール: 「Critique the work, not the person」「questions before judgments」「specific, not vague」「suggest rather than prescribe」。baseline-core は「Be specific」「Be actionable」「Ground in principles or data」。
- 質問の型 (baseline-core): 「What was the thinking behind [choice]?」「What happens when a user has more than 10 items?」。
- 18F の関連手法: heuristic-evaluation (Nielsen の 10 項目で検査)、cognitive-walkthrough (タスクを 1 手順ずつ追う)、design-studio (複数案を短時間で描いて批評する)。

## 具体的な値・ルール

### 標準クリティーク (30 分)

| 段階 | 時間 | 内容 |
|---|---|---|
| Setup | 2 分 | 問題、利用者、制約、欲しいフィードバック |
| Silent review | 3 から 5 分 | 各自が無言で見る |
| Questions | 5 分 | 判断ではなく質問 |
| Feedback | 15 分 | 強み、懸念、提案。原則かデータに紐付ける |
| Synthesis | 5 分 | 決定事項と次の行動 |

### 敵対的レビューの観点 (AwesomeDS 用)

| 観点 | 具体的な検査 |
|---|---|
| 入力 | 空、最大長、絵文字、RTL、10 件超の一覧 |
| 画面 | 390px 幅で hero が 1 画面に収まるか、1536px で行長が 65ch を超えないか |
| 操作 | Tab だけで全操作、Escape で閉じる、focus が隠れない |
| 色 | グレースケールで階層が残るか、状態が色以外でも分かるか |
| 状態 | loading / empty / error / success の画面が存在するか |
| 動き | `prefers-reduced-motion` で機能が失われないか |
| コピー | 「seamless」「unlock」などの空語、説明が必要な比喩、em dash |

### フィードバックの書式

```
[観点] [場所] [所見] [根拠: 原則 / データ] [提案 (任意)]
例: [色] 入力枠 #d4d4d4 は白地で 1.5:1。1.4.11 の対象外だが focus 前に枠が見えにくい。hover で hairline-strong に上げる案。
```

## AwesomeDS への反映

- 採用: 「Before finishing, run the checklist in `components/checklist.md`. If you cannot, say what you skipped」(DESIGN.md 12. Agent prompt guide 5)。クリティークの Synthesis を、生成 UI では自己チェックリストとして実装した。
- 採用: 「原則かデータに紐付ける」。AwesomeDS の各規則は `foundations/*.md` に理由を持つため、レビューの根拠として引用できる。
- 採用: 敵対的レビューの観点を DESIGN.md の数値に対応させた (390px hero、65ch、Tab / Escape、reduced-motion、状態 4 種、コピーの禁止語)。
- 採用: 「Critique the work, not the person」。エージェントが生成した UI のレビューでも、所見は場所と根拠で書き、評価語 (「悪い」「美しい」) を避ける。
- 翻案: 無言レビューは、エージェント単独のレビューでは「実装を見る前にチェックリストを読む」手順に置き換えた。
- 不採用: Design studio (複数案の同時作成)。AwesomeDS は「既定を 1 つ決める」システムであり、代替案の比較は `ds-creator` の段階で行う。

## 出典

- https://raw.githubusercontent.com/opensesh/DESIGN-OPS/HEAD/skills/design-critique-facilitator.md : 取得済み。5 段階、役割、グラウンドルール、30 分タイムライン。
- https://raw.githubusercontent.com/TrentM6/baseline-core/HEAD/skills/ux-design/references/design-critique.md : 取得済み。無言レビューの理由、3 原則、質問の型。
- https://github.com/18F/methods : 取得済み。heuristic-evaluation、cognitive-walkthrough、design-studio を含む手法一覧。design-critique 単体のファイルは存在しない。
- https://www.nngroup.com/articles/design-critiques/ : ネットワーク制限で取得不可。Figma blog、GitLab handbook (handbook.gitlab.com) も取得不可。
