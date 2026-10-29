---
title: "Laws of UX"
category: design-thinking
type: article
sources:
  - url: https://raw.githubusercontent.com/ahastudio/til/HEAD/ux/laws-of-ux.md
    title: "ahastudio/til: ux/laws-of-ux.md (lawsofux.com の要約ノート)"
  - url: https://lawsofux.com/
    title: "Laws of UX"
tags: [laws-of-ux, heuristics, psychology, fitts, hick, doherty, gestalt, jon-yablonski]
updated: 2026-09-06
---

# Laws of UX

## 概要

Laws of UX は Jon Yablonski がまとめた、UI 設計に関わる心理学の法則と原則のコレクションで、lawsofux.com に各法則の 1 行定義と背景が掲載されている。サイトは本環境から取得できなかったため、サイトを出典として明記した GitHub 上の要約ノート (韓国語、30 法則) を資料とし、定義は日本語に訳した。各法則を AwesomeDS の具体的な規則に 1 つずつ対応付ける。

## 要点

各法則の 1 行定義 (要約ノートからの訳) と、対応する AwesomeDS の規則。

| 法則 | 定義 (要約) | AwesomeDS の規則 |
|---|---|---|
| Aesthetic-Usability Effect | 美しいデザインは使いやすいと知覚される | 1. 「calm, precise, legible」を目標に、装飾ではなく整った余白と型で美しさを作る |
| Doherty Threshold | 400ms 未満の応答で生産性が上がる | 7. 遷移は 100 から 300ms、ページ級でも 500ms まで |
| Fitts's Law | 対象までの距離と大きさがクリック時間を決める | 4. タッチ 44x44、デスクトップ 24x24 以上。ボタン高さ 40px |
| Hick's Law | 選択肢の数と複雑さが判断時間を延ばす | 8. 「One primary button per view」 |
| Jakob's Law | 利用者は他サイトで慣れた挙動を期待する | 8. shadcn/ui の標準部品を使い、独自挙動を作らない |
| Law of Common Region | 明確な境界を共有する要素はグループに見える | 6. カードは 1px hairline で囲む |
| Law of Proximity | 近い要素はグループに見える | 4. 関連要素 16 から 24px、グループ間 32 から 48px |
| Law of Prägnanz | 複雑な像は単純な形に解釈される | 5. 1 つの角丸ファミリー、8 / 12 / 16 の 3 段 |
| Law of Similarity | 似た要素は同じグループに見える | 8. 「One icon family per product」、同じ役割は同じ型 |
| Law of Uniform Connectedness | 視覚的に接続された要素は関係が強く見える | 8. ラベルは入力の直上、エラーは直下 |
| Miller's Law | 作業記憶は平均 7 ± 2 項目 | 10. ナビゲーションは 1 行に収まる数に絞る |
| Chunking | 情報を意味のある塊にまとめる | 4. セクション間 64 から 96px で塊を作る |
| Cognitive Load | 理解と操作に必要な精神資源の量 | 9. 「Cut copy that does not change what the user will do」 |
| Occam's Razor | 同じ説明力なら単純な方を選ぶ | 1. 「No gradients, no glass, no glow」 |
| Pareto Principle | 結果の 80% は原因の 20% から | 12. 主要な導線を先に設計し、周辺は既定に任せる |
| Parkinson's Law | 作業は使える時間いっぱいに膨らむ | 12. チェックリストで完了条件を固定する |
| Peak-End Rule | 経験はピークと最後で評価される | 8. success 状態とエラー回復を必ず設計する |
| Postel's Law | 入力に寛容、出力に厳格 | 8. 入力はゆるく受け、表示は tabular-nums で揃える |
| Serial Position Effect | 最初と最後が記憶に残る | 10. 主要 CTA をヒーローとフッターに置く |
| Tesler's Law | 取り除けない複雑さが存在する | 8. 複雑さは部品側 (shadcn/ui) に寄せ、利用者に渡さない |
| Von Restorff Effect | 他と違うものが記憶に残る | 2. accent は 1 画面に 1 要素 |
| Zeigarnik Effect | 未完の課題の方が記憶に残る | 8. 進捗と空状態で「次にすること」を示す |
| Goal-Gradient Effect | 目標に近づくほど意欲が増す | 8. loading と progress を実状態で見せる |
| Choice Overload | 選択肢が多すぎると回避や不満が起きる | 9. 「three identical cards in a row」を既定にしない |
| Paradox of the Active User | 利用者はマニュアルを読まずに使い始める | 9. 「Write UI copy the way you would say it to a colleague」 |
| Mental Model | 利用者がシステムの動きに持つ圧縮モデル | 8. 標準部品と標準キー操作 |
| Selective Attention | 環境刺激の一部だけに注意を向ける | 2. 「Status colors carry an icon or a label」 |
| Working Memory | 課題に必要な情報を一時保持する | 8. フォームは 1 画面に必要な項目だけ |
| Flow | 活動への没入状態 | 7. モーションは操作に付随し、待たせない |
| Cognitive Bias | 判断の系統的な偏り | 12. 設計レビューで前提を明示する |

## 具体的な値・ルール

| 法則 | AwesomeDS の数値 |
|---|---|
| Doherty Threshold (400ms) | duration-base 200ms、duration-slow 300ms、duration-slower 500ms (稀) |
| Fitts's Law | 44x44 (mobile)、24x24 (desktop)、button 40 / 32 / 48px |
| Law of Proximity | spacing 16 から 24 (関連)、32 から 48 (グループ)、64 から 96 (セクション) |
| Von Restorff | accent 1 要素 / view |
| Hick's Law | primary button 1 個 / view |

## AwesomeDS への反映

- 採用: 上表のとおり、30 法則の大半が DESIGN.md の既存規則に対応する。特に Fitts (ターゲットサイズ)、Hick と Von Restorff (1 画面 1 主要操作、1 accent)、Proximity と Common Region (余白と罫線で群を作る)、Doherty (200ms 帯) は数値として反映済み。
- 翻案: Aesthetic-Usability Effect は「装飾を増やす」根拠にせず、整った余白と型で「美しさ」を満たすと解釈した。
- 不採用: Peak-End Rule を祝福アニメーションの根拠にすること。AwesomeDS は「Motion only as feedback」で、祝福はブランド側 (`ds-creator`) の判断。

## 出典

- https://raw.githubusercontent.com/ahastudio/til/HEAD/ux/laws-of-ux.md : 取得済み。30 法則の 1 行定義 (韓国語) と出典 https://lawsofux.com/ の明記。
- https://lawsofux.com/ : ネットワーク制限で取得不可。定義の原文は未確認のため、本エントリの定義は要約ノートからの訳。
