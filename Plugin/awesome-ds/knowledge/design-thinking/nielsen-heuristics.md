---
title: "Nielsen の 10 ユーザビリティヒューリスティクス"
category: design-thinking
type: article
sources:
  - url: https://raw.githubusercontent.com/aashishGitHub/UI-UX/HEAD/Principles/6.%2010%20Usability%20Heuristics%20by%20Jakob%20Nielsen.md
    title: "aashishGitHub/UI-UX: 10 Usability Heuristics by Jakob Nielsen (NN/g 各記事を引用したノート)"
  - url: https://raw.githubusercontent.com/microsoft/code-with-engineering-playbook/HEAD/docs/non-functional-requirements/usability.md
    title: "Microsoft Code With Engineering Playbook: Usability"
  - url: https://www.nngroup.com/articles/ten-usability-heuristics/
    title: "10 Usability Heuristics for User Interface Design - Nielsen Norman Group"
tags: [nielsen, heuristics, usability, nngroup, evaluation, review]
updated: 2026-09-06
---

# Nielsen の 10 ユーザビリティヒューリスティクス

## 概要

Jakob Nielsen が 1994 年に整理した 10 のヒューリスティクスは、UI をレビューするときの最も広く使われる基準である。NN/g のサイトは本環境から取得できなかったため、NN/g の各ヒューリスティクス記事 URL を引用する GitHub 上のノートと、NN/g の記事を参照する Microsoft のエンジニアリングプレイブックを資料とした。各項目に UI の具体例と AwesomeDS の規則を添える。

## 要点

| # | ヒューリスティクス | 要約 (ノートからの訳) | UI の例 |
|---|---|---|---|
| 1 | Visibility of System Status | 適切なフィードバックを適切な時間内に返し、何が起きているかを常に知らせる | ローディングのスケルトン、保存済みの表示、進捗バー |
| 2 | Match Between System and the Real World | 利用者に馴染みのある言葉、概念、慣習を使う | 「削除」を「destroy」と言わない、日付は利用者のロケール |
| 3 | User Control and Freedom | 元に戻す、やり直す、取り消せる | Undo トースト、モーダルの Escape、破壊的操作の確認 |
| 4 | Consistency and Standards | デザイン、言葉、機能が一貫し、認識できる見た目を保つ | 同じ操作は同じボタン型、プラットフォーム慣習に従う |
| 5 | Error Prevention | エラーが起きる前に防ぐ | 入力の制約、無効状態の明示、確認ダイアログ |
| 6 | Recognition Rather Than Recall | 記憶から呼び出すより、見て分かるようにする | ラベルを常時表示、最近使った項目、プレースホルダーをラベルにしない |
| 7 | Flexibility and Efficiency of Use | 個々の好みに合わせられ、熟練者には近道を | キーボードショートカット、コマンドメニュー、既定値 |
| 8 | Aesthetic and Minimalist Design | 不要な要素を除き、整った見た目にする | 装飾のない面、1 画面 1 主要操作 |
| 9 | Help Users Recognize, Diagnose, and Recover from Errors | 明確で役立つエラーメッセージで解決へ導く | 入力欄の直下に原因と直し方を示す |
| 10 | Help and Documentation | 分かりやすく到達しやすいヘルプと文書 | 空状態からの導線、インラインの説明 |

## 具体的な値・ルール

ヒューリスティクスを AwesomeDS の検査項目に翻訳した表。

| # | AwesomeDS の対応 (DESIGN.md) |
|---|---|
| 1 | 8. 「Every data view ships with loading (skeleton), empty and error states」。7. モーションは操作へのフィードバック |
| 2 | 9. 「Write UI copy the way you would say it to a colleague. Short, direct, specific」 |
| 3 | 11. 「dismissible by Escape」。8. 破壊的操作は `danger` 色 + ラベル |
| 4 | 5. 「One radius family per product」、8. 「One icon family per product」、shadcn/ui の標準部品 |
| 5 | 8. hover / focus / active / disabled / loading の全状態を用意 |
| 6 | 8. 「Never placeholder as label」、label above |
| 7 | 11. 「everything reachable by Tab ... operable by Enter/Space」 |
| 8 | 1. 「No gradients on backgrounds, no glass, no glow」、8. 「One primary button per view」 |
| 9 | 8. 「error below in `danger` with an icon」 |
| 10 | 8. empty state に次の行動を示す |

## AwesomeDS への反映

- 採用: 10 項目すべてが DESIGN.md のどこかに対応している (上表)。特に 1 (状態の可視化)、6 (ラベル常時表示)、8 (最小限の装飾)、9 (エラーの場所と内容) は数値や必須要件として明文化されている。
- 採用: 設計レビュー (`components/checklist.md`) の観点として 10 項目を使う。詳細は `design-review-and-critique.md`。
- 翻案: 7 (効率) は AwesomeDS ではキーボード到達性として最低限を定め、ショートカットやコマンドメニューは製品側の判断にした。
- 不採用: なし。ヒューリスティクスは評価基準であり、AwesomeDS の規則と矛盾する項目はない。

## 出典

- https://raw.githubusercontent.com/aashishGitHub/UI-UX/HEAD/Principles/6.%2010%20Usability%20Heuristics%20by%20Jakob%20Nielsen.md : 取得済み。10 項目の要約と、NN/g の各ヒューリスティクス記事 URL (visibility-system-status、mental-models、user-control-and-freedom、consistency-in-ui-design、error-prevention、recognition-and-recall、flexibility-and-efficiency-of-use、aesthetic-and-minimalist-design、error-message-guidelines、help-and-documentation)。
- https://raw.githubusercontent.com/microsoft/code-with-engineering-playbook/HEAD/docs/non-functional-requirements/usability.md : 取得済み。NN/g の ten-usability-heuristics 記事を参照。
- https://www.nngroup.com/articles/ten-usability-heuristics/ : ネットワーク制限で取得不可。URL は上記 2 資料内で確認。原文の定義は未確認のため、本エントリの要約はノートからの訳。
