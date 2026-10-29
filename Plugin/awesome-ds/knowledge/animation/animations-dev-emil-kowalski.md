---
title: "animations.dev and Emil Kowalski"
category: animation
type: article
sources:
  - url: https://animations.dev/
    title: "animations.dev: Web Animations course by Emil Kowalski (proxy blocked, link recorded)"
  - url: https://emilkowal.ski/
    title: "Emil Kowalski's site and blog (proxy blocked, link recorded)"
  - url: https://github.com/emilkowalski/sonner
    title: "emilkowalski/sonner: An opinionated toast component for React"
  - url: https://github.com/emilkowalski/vaul
    title: "emilkowalski/vaul: Drawer component for React"
  - url: https://github.com/Leonxlnx/taste-skill
    title: "Leonxlnx/taste-skill README (lists Emil Kowalski / animations.dev as a sponsor)"
tags: [animations-dev, emil-kowalski, easing, duration, sonner, vaul, principles]
updated: 2026-09-06
---

# animations.dev and Emil Kowalski

## 概要

animations.dev は Emil Kowalski による Web アニメーションの有料コース。Kowalski は Sonner（toast）と Vaul（drawer）の作者で、Vercel でのデザインエンジニア経験を背景に、持続時間、イージング、いつ動かさないかを扱う記事を自サイトに書いている。本セッションでは animations.dev と emilkowal.ski の両方がプロキシで取得できず、コース本文とブログ記事は未確認。確認できたのは GitHub 上の Sonner と Vaul、taste-skill README のスポンサー記載のみ。以下の「要点」は取得できた資料に限定し、コースの内容は引用しない。

## 要点

- animations.dev: taste-skill README のスポンサー欄に「Emil Kowalski · animations.dev」として掲載。コース内容（モジュール構成、価格、教える原則）は本セッションで未取得。
- Sonner: 「An opinionated toast component for React」。`npm install sonner`。`<Toaster />` をアプリに置き、任意の場所から `toast('My first toast')` を呼ぶ。ドキュメントは sonner.emilkowal.ski（未取得）。README には `position`、`richColors`、`expand`、`duration` の詳細は載っておらず、ドキュメントサイトに委ねている。shadcn/ui の toast 実装は Sonner を採用している。
- Vaul: React 向け drawer コンポーネント。8.6k stars、MIT。README 冒頭で「現在はメンテナンスしていない、時間ができたら戻るかもしれない」と明記。ドキュメントは vaul.emilkowal.ski（未取得）。API（`Drawer.Root`、`Trigger`、`Content`、`snapPoints`、`direction`）は README 本文を取得できず本エントリでは確認していない。
- Kowalski の作品が示す設計方針（取得できた README から読み取れる範囲）: 「opinionated」を掲げ、API を小さく保つ。toast は関数呼び出し 1 つ、描画は 1 つの `<Toaster />`。
- 未取得の資料一覧（後日確認する）: コースのカリキュラム、ブログ記事「Great Animations」「Good vs Great Animations」ほか、Sonner と Vaul のドキュメントサイト。

## 具体的な値・ルール（あれば）

取得できた資料に数値規則はない。AwesomeDS 側の値（第 7 節）を参照用に再掲する。

| 項目 | AwesomeDS の値 |
|---|---|
| duration-instant | 100ms（色、opacity の hover） |
| duration-fast | 150ms（小さな移動） |
| duration-base | 200ms（既定の enter） |
| duration-slow | 300ms（dialog、sheet） |
| duration-slower | 500ms（ページ単位、まれ） |
| ease-out | `cubic-bezier(0.16, 1, 0.3, 1)`（enter） |
| ease-in | `cubic-bezier(0.7, 0, 0.84, 0)`（exit） |
| ease-in-out | `cubic-bezier(0.65, 0, 0.35, 1)`（位置の移動） |
| spring-gentle / snappy | stiffness 170 damping 26 / stiffness 400 damping 30 |
| 禁止 | `linear`（ユーザーが見る動き）、`ease`（CSS 既定、対称） |

## AwesomeDS への反映

- 反映の状態: AwesomeDS 第 7 節の値（100 から 300ms、ease-out で enter、exit は enter より短く ease-in、`linear` と `ease` の禁止、enter の移動量 4 から 8px、scale は 0.98 から）は、要件が animations.dev の原則を参照して決めたものだが、本セッションではコース本文でその根拠を確認できていない。値の出典としては AwesomeDS/foundations/motion.md（作成予定）で、Motion の既定値（Knowledge/animation/motion.md）と taste-skill の `cubic-bezier(0.16, 1, 0.3, 1)`（Knowledge/skills/taste-skill.md）を確認済みの根拠として挙げる。
- 採用: Sonner を toast の実装にする。shadcn/ui の toast が Sonner ベースであることと、API が「1 関数 + 1 コンポーネント」で第 8 節の「Install components into the project」と両立するため。位置と色は AwesomeDS トークンで上書きする（`richColors` は使わず、status 色は第 2 節の success / warning / danger を当てる）。
- 保留: Vaul。README がメンテナンス停止を明記しているため、drawer / sheet は shadcn の Sheet（Radix Dialog ベース）を使う。モバイルのボトムシートで snap point が必要になった場合のみ再検討する。
- 記録: animations.dev と emilkowal.ski が取得できたら、本エントリの「要点」に記事ごとの原則と数値を追記し、AwesomeDS 第 7 節の各値に出典を対応させる。それまで第 7 節の値は「本リポジトリの決定」として扱い、Kowalski の主張として引用しない。

## 出典

- https://animations.dev/ : コースサイト。プロキシで取得不可、リンクのみ記録。
- https://emilkowal.ski/ : ブログ。プロキシで取得不可、リンクのみ記録。
- https://github.com/emilkowalski/sonner : README（説明、インストール、`<Toaster />` と `toast()`、ドキュメント URL）。取得済み。
- https://github.com/emilkowalski/vaul : リポジトリページ（説明、stars、MIT、メンテナンス停止の注記）。取得済み。README 本文の API 部分は未取得。
- https://github.com/Leonxlnx/taste-skill : README のスポンサー欄。ローカルクローンで確認。
