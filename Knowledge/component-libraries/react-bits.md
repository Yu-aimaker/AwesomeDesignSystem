---
title: "React Bits"
category: component-libraries
type: library
sources:
  - url: https://github.com/DavidHDev/react-bits
    title: "DavidHDev/react-bits: An open source collection of animated, interactive & fully customizable React components"
  - url: https://reactbits.dev/
    title: "React Bits (site, proxy blocked, link recorded)"
  - url: https://github.com/Leonxlnx/taste-skill
    title: "Leonxlnx/taste-skill README (lists React Bits as a sponsor)"
tags: [react-bits, animation, components, backgrounds, text-animation, jsrepo, shadcn-registry]
updated: 2026-09-06
---

# React Bits

## 概要

React Bits は David Haz が公開する、アニメーション付き React コンポーネントのオープンソース集。テキストアニメーション、UI 要素、背景を中心に 165 以上のコンポーネントを、JS / TS と CSS / Tailwind の 4 変種で提供する。CLI（shadcn、jsrepo）か手動コピーで導入する。ライセンスは MIT + Commons Clause。サイト reactbits.dev はプロキシで取得できず、GitHub README を一次資料とした。

## 要点

- 規模: 165 以上のコンポーネント、46.8k stars、2.3k forks。
- 4 変種: JavaScript + CSS、JavaScript + Tailwind、TypeScript + CSS、TypeScript + Tailwind。プロジェクト構成に合わせて選ぶ。
- 導入: 各コンポーネントページに shadcn CLI と jsrepo 用のコマンドがあり、手動コピーも可能。依存は最小で tree-shakeable と説明される。
- カテゴリ: text animations、animations、components、backgrounds。README の見出しは「animated, interactive & fully customizable」。
- ライセンス: MIT + Commons Clause。個人・商用での利用は許可されるが、Commons Clause により「コンポーネント自体を販売する」用途は制限される。
- taste-skill の README にスポンサーとして掲載され、「animated React components for creative interfaces」と紹介されている。taste-skill §9.E は外部コンポーネントの無検証利用を tell として挙げるので、React Bits を使う場合も依存を確認する（§3.F Dependency Verification）。
- 動機となる用途: ランディングページのヒーローや背景、テキストの登場演出。製品 UI のフォームやテーブルには向かない。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| コンポーネント数 | 165+ |
| 変種 | JS-CSS、JS-TW、TS-CSS、TS-TW |
| 導入 | shadcn CLI、jsrepo、手動コピー |
| ライセンス | MIT + Commons Clause |
| 公開サイト | reactbits.dev（未取得） |
| GitHub | 46.8k stars、2.3k forks |

## AwesomeDS への反映

- 位置づけ: 任意（optional）。AwesomeDS 第 7 節のライブラリ順序は CSS transitions → Motion → GSAP ScrollTrigger → Lottie → three.js で、React Bits はこの順序の外にある「完成品の演出部品」。ブランドサイトのヒーローなど、`ds-creator` で MOTION を強くすると決めた場面だけ候補にする。
- 採用: 「4 変種から Tailwind + TypeScript を選び、コードをプロジェクトに複製して所有する」導入方法。shadcn と同じ Open Code の扱いで、AwesomeDS のトークン（`--color-*`、`--duration-*`）に差し替えてから使う。
- 制約: 取り込んだコンポーネントも AwesomeDS 第 7 節の規則に従わせる。`prefers-reduced-motion: reduce` で transform を止め opacity だけ残す、無限ループは進捗表示以外禁止、enter の移動量は 4 から 8px。React Bits の多くは無限ループや大きな移動を既定に持つので、そのままでは規則に反する。
- 不採用: 背景系コンポーネント（パーティクル、グリッド、オーロラなど）を既定 UI に入れること。第 1 節「no decorative blobs by default」、第 9 節「gradients, glow, glass, or blurred blobs as decoration」に反する。
- 記録: 依存に GSAP や three.js を含むコンポーネントは、AwesomeDS の「GSAP / three.js と Motion を同じツリーで混ぜない」規則（Knowledge/skills/taste-skill.md）に注意。導入前に各コンポーネントの依存を確認する。

## 出典

- https://github.com/DavidHDev/react-bits : README（コンポーネント数、変種、導入方法、ライセンス、stars）。取得済み。
- https://reactbits.dev/ : 公開サイト。プロキシで取得不可、リンクのみ記録。
- https://github.com/Leonxlnx/taste-skill : README のスポンサー欄に React Bits の紹介。ローカルクローンで確認。
