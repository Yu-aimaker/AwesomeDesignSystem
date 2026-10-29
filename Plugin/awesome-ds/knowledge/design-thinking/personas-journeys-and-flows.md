---
title: "ペルソナ、ジャーニーマップ、ページフロー"
category: design-thinking
type: article
sources:
  - url: https://raw.githubusercontent.com/18F/methods/HEAD/_methods/personas.md
    title: "18F Methods: Personas"
  - url: https://raw.githubusercontent.com/18F/methods/HEAD/_methods/journey-mapping.md
    title: "18F Methods: Journey mapping"
  - url: https://github.com/18F/methods
    title: "18F/methods: The methods 18F uses to practice human-centered design"
  - url: https://www.nngroup.com/articles/persona/
    title: "Personas Make Users Memorable for Product Team Members - NN/g"
  - url: https://www.nngroup.com/articles/journey-mapping-101/
    title: "Journey Mapping 101 - NN/g"
tags: [persona, user-story, journey-map, page-flow, research, 18f, nngroup]
updated: 2026-09-06
---

# ペルソナ、ジャーニーマップ、ページフロー

## 概要

ペルソナは調査から作る利用者の原型、ユーザーストーリーは 1 つのニーズの定型文、ジャーニーマップは体験を時間軸で並べた図、ページフローは画面の遷移図である。18F (米国政府のデジタルサービス組織) の Methods は各手法の目的、所要時間、手順を公開しており、本エントリの一次資料とした (リポジトリは 2024 年にアーカイブ済みだが内容は残る)。NN/g、IDEO Design Kit、Atlassian Team Playbook は本環境から取得できなかった。

## 要点

### ペルソナ (18F)

- What: 「User archetypes based on conversations with real people.」
- Why: 設計判断の影響を受ける人々の「goals, behaviors, and pain points」を現実に基づいて考えるため。
- 所要時間: 2 から 3 時間。
- 手順: (1) contextual inquiry や stakeholder interview の記録を集める。仮置きのペルソナは考え方の練習にはなるが、実装の判断には使わない。(2) 想定される利用パターンを表す原型を作り、「Who is included? Who might be overlooked? Who decides inclusion?」を確認する。(3) 記録からパターン (目標、動機、行動、痛点、潜在的な害) を拾う。(4) 原型に名前、1 日の描写、写真を付ける。(5) 根拠となる調査記録に結び付け、前提を疑うときに参照できるようにする。

### ユーザーストーリー

- 形式: 「<誰> として、<何> をしたい、<なぜ> のために」。ニーズを 1 文に固定し、画面や機能の名前を入れない。
- 使い方: ペルソナ 1 人につき主要タスク 3 から 5 個。受け入れ条件を添えると設計レビューの基準になる。

### ジャーニーマップ (18F)

- What: 「A visualization of the major interactions shaping a user's experience of a product or service.」
- Why: サービス全体の接点を俯瞰し、順序、複雑さ、成功、痛点、感情を明らかにするため。
- 所要時間: 4 から 12 時間。
- 手順: (1) 文脈の要素 (人と目標、行動、支援する情報や機器、重要な瞬間、感情、潜在的な害) を記録する。(2) 行動、情報利用、判断、感情を時系列に並べ、ペルソナごとの物語を段階 (phase) に分ける。(3) 関係者と議論して洞察を出し、設計原則に落とし、段階を短縮する案を検討する。

### ページフロー

- 目的: ジャーニーの「デジタル接点」だけを画面単位に落とし、入口、分岐、終端 (成功、エラー、離脱) を明示する。
- 単位: 1 タスク 1 フロー。画面はワイヤーではなく名前と主要操作だけで表す。
- チェック: 各画面に 1 つの主要操作があるか、戻る手段があるか、空状態とエラー状態の画面が含まれるか。

## 具体的な値・ルール

| 成果物 | いつ使う | 最小の中身 | 所要時間 (18F) |
|---|---|---|---|
| ペルソナ | 調査後、設計前。対象が複数種類いるとき | 名前、目標、行動、痛点、根拠となる調査 | 2 から 3 時間 |
| ユーザーストーリー | ペルソナごとの主要タスクを固定するとき | 誰 / 何 / なぜ、受け入れ条件 | 30 分 / ペルソナ |
| ジャーニーマップ | 接点が多く、部門をまたぐとき | 段階、行動、感情、痛点、機会 | 4 から 12 時間 |
| ページフロー | 画面を作る直前 | 画面名、主要操作、分岐、終端 | 1 から 2 時間 / タスク |

テンプレート (Markdown):

```
## Persona: <名前> (<役割>)
- 目標:
- 行動:
- 痛点:
- 根拠: <インタビュー ID>

## Story
<役割> として、<行動> をしたい。<理由> のために。
受け入れ条件: 1. ... 2. ...

## Flow: <タスク名>
[入口] → [画面 A: 主要操作] → (分岐) → [画面 B] → [成功] / [エラー] / [離脱]
```

## AwesomeDS への反映

- 採用: 「State the page kind and audience in one line before writing code」(DESIGN.md 12. Agent prompt guide 1)。ペルソナとストーリーを 1 行に圧縮した形で、UI 生成の前提として要求する。
- 採用: 「Write the content first, then the layout」(12. 4)。ジャーニーマップとフローで内容と順序を決めてから画面を作る。
- 採用: 「Every data view ships with loading (skeleton), empty and error states」(8. Components)。ページフローの終端 (成功、エラー、離脱) を必ず画面として持つ要件に対応する。
- 採用: 「Hero fits in the first viewport on a 390px wide phone: heading max 2 lines at 32px, one paragraph, one primary button」(10. Responsive)。フローの入口画面に 1 つの主要操作を置く規則。
- 翻案: 18F の「placeholder personas は実装判断に使わない」は、AwesomeDS では「調査がない場合はペルソナを作らず、対象の 1 行記述に留める」運用にした。
- 不採用: 写真や架空の伝記を含む詳細ペルソナ。生成 UI の文脈では偏りを持ち込みやすく、目標と痛点だけで十分と判断した。

## 出典

- https://raw.githubusercontent.com/18F/methods/HEAD/_methods/personas.md : 取得済み。What / Why / 所要時間 / 手順。
- https://raw.githubusercontent.com/18F/methods/HEAD/_methods/journey-mapping.md : 取得済み。What / Why / 所要時間 / 手順。
- https://github.com/18F/methods : 取得済み。リポジトリの説明 (2024-05-31 アーカイブ、_methods 一覧)。
- https://www.nngroup.com/articles/persona/ と https://www.nngroup.com/articles/journey-mapping-101/ : ネットワーク制限で取得不可。
- IDEO Design Kit (designkit.org) と Atlassian Team Playbook (atlassian.com/team-playbook) も取得不可。
