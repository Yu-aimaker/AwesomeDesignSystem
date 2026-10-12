---
title: "mattpocock grill-me / grilling"
category: skills
type: skill
sources:
  - url: https://github.com/mattpocock/skills
    title: "mattpocock/skills: Skills For Real Engineers"
  - url: https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grill-me/SKILL.md
    title: "grill-me SKILL.md"
  - url: https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grilling/SKILL.md
    title: "grilling SKILL.md (the reusable interview primitive)"
tags: [skill, interview, planning, design-tree, ds-creator, questions]
updated: 2026-09-06
---

# mattpocock grill-me / grilling

## 概要

Matt Pocock の skills リポジトリにある、計画や設計を質問で追い詰めるスキル。ユーザーが呼び出す `grill-me` は薄いラッパーで、実体は model-invoked の `grilling`。設計を「決定の木（design tree）」として捉え、前提が確定した質問だけを毎ラウンド出し、木の枝がすべて解決するまで続ける。本リポジトリの `ds-creator` は、ブランド固有 DS をインタビューで作る際の質問プロトコルとしてこれを参照する。

## 要点

- インストール: `npx skills@latest add mattpocock/skills`、その後リポジトリごとに `/setup-matt-pocock-skills` を一度実行。代替として `claude plugins install mattpocock-skills`。
- `skills/productivity/grill-me/SKILL.md` の全文は次の 5 行。

```
---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Call the Skill tool with "grilling".
```

- `disable-model-invocation: true` なので、モデルが勝手に起動せず、ユーザーが `/grill-me` と打ったときだけ動く。実処理は `grilling` に委譲する。
- `grilling` の仕組み: 各決定はそこから派生する決定に枝分かれする（design tree）。「frontier」は前提が確定していて今すぐ答えられる質問の集合。1 ラウンドで frontier 全体を出し、回答を待ってから次の frontier を出す。回答が枝を確定させ、依存していた質問が解放される。
- ラウンドの書式: 番号付きの質問に、必ず推奨回答を添える。

```
❓ **Q1** – **Title**: Question text

➡️ Recommended answer

---

❓ **Q2** – **Title**: Question text

➡️ Recommended answer
```

- 事実はエージェントが調べる: 環境の事実（既存コード、ライブラリのバージョンなど）が必要なら、ユーザーに調べさせずサブエージェントを出す。その事実に依存する質問だけをブロックし、他は進める。
- 終了条件: frontier が空になる（木の全枝を訪問し、暗黙の仮定が残らない）こと。行動に移る前に、共有理解に達したことをユーザーに確認する。
- 同じ primitive を `grill-with-docs`（ドメインモデルを作りながら `CONTEXT.md` と ADR を更新）や他のスキルも使う。
- productivity カテゴリの他のスキル: `handoff`（会話を引き継ぎ文書に圧縮）、`teach`、`to-questionnaire`、`wait-what`、`writing-for-agents`。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| 呼び出し名 | `grill-me`（user-invoked）、`grilling`（model-invoked） |
| 1 ラウンドの単位 | frontier 全体（前提の確定した質問のみ） |
| 各質問の必須要素 | 番号、タイトル、質問文、推奨回答 |
| ブロックの範囲 | 未取得の事実に依存する質問だけ。他は続行 |
| 終了 | frontier が空 + ユーザーの確認 |
| 禁止 | 推測で先に進む、ユーザーに調査を頼む、確認前に実装する |

## AwesomeDS への反映

- 採用: `ds-creator` の質問プロトコル。`Plugin/awesome-ds` の説明文は「create a brand-specific DS by interview」で、この interview は grilling の frontier 方式に沿う。ブランド DS の決定木は AwesomeDS の節に対応させる: 第 2 節（アクセント 1 色、ニュートラルは維持するか）→ 第 3 節（Latin フォント、和文フォント、serif を入れるか）→ 第 5 節（角丸の族）→ 第 7 節（motion の強さ）→ 第 8 節（Radix か Base UI か）。前段が決まるまで後段は聞かない。
- 採用: 推奨回答を必ず添える形式。ds-creator では推奨回答に AwesomeDS の既定値（例: accent `#2f5bea`、radius 8/12/16、Geist + Noto Sans JP）を入れ、ユーザーが「既定でよい」と答えれば AwesomeDS をそのまま継承する。
- 採用: 事実はエージェントが調べる。既存ブランドのサイトやロゴ、既存 CSS の色は ds-creator が Playwright で取得し、ユーザーには判断だけを求める（Knowledge/tech-stack/playwright-visual-testing.md 参照）。
- 変更: taste-skill §0.C の「質問は 1 つだけ」と grilling の「frontier 全体を 1 ラウンドで出す」は矛盾する。ds-creator は折衷し、1 ラウンドあたり最大 3 問、各問に推奨回答を付け、前提が独立な質問だけを同時に出す。UI を作るだけの `awesome-ds` スキルは taste-skill 側（1 問）に従う。
- 不採用: `/setup-matt-pocock-skills` のようなリポジトリごとのセットアップ手順。AwesomeDS プラグインは `plugin.json` と `scripts/sync-ds.sh` で完結させる。
- 記録: 本エントリ執筆時点で `Plugin/awesome-ds/skills/ds-creator/` は空ディレクトリ。上記は SKILL.md 作成時の設計指針として残す。

## 出典

- https://github.com/mattpocock/skills : README（インストール手順、スキル一覧、grill-me と grilling の位置づけ）。取得済み。
- https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grill-me/SKILL.md : 5 行のラッパー。全文取得済み。
- https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grilling/SKILL.md : design tree、frontier、ラウンド書式、終了条件。取得済み。
