---
title: "GSAP and ScrollTrigger"
category: animation
type: library
sources:
  - url: https://github.com/greensock/GSAP
    title: "greensock/GSAP: GSAP (GreenSock Animation Platform)"
  - url: https://registry.npmjs.org/gsap/latest
    title: "npm: gsap latest"
  - url: https://raw.githubusercontent.com/greensock/GSAP/master/types/scroll-trigger.d.ts
    title: "GSAP types/scroll-trigger.d.ts (ScrollTrigger config)"
  - url: https://github.com/Leonxlnx/taste-skill
    title: "Leonxlnx/taste-skill SKILL.md §5 (canonical GSAP skeletons)"
  - url: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
    title: "GSAP docs: ScrollTrigger (proxy blocked, link recorded)"
tags: [gsap, scrolltrigger, pin, scrub, webflow, free, scrolltelling]
updated: 2026-09-06
---

# GSAP and ScrollTrigger

## 概要

GSAP はフレームワーク非依存の JavaScript アニメーションライブラリ。Webflow の支援により、以前は有料会員限定だった SplitText や MorphSVG を含む全プラグインが個人・商用ともに無料になった。ScrollTrigger はスクロール連動アニメーションのプラグインで、pin（固定）と scrub（スクロール量に進行を結ぶ）が中核。AwesomeDS では「pin か scrub を伴うスクロール演出」に限って使う。gsap.com はプロキシで取得できないため、GitHub README、npm メタデータ、型定義を一次資料にした。

## 要点

- バージョンとライセンス: npm `gsap` 3.15.0。license フィールドは「Standard 'no charge' license: https://gsap.com/standard-license」。README は「Thanks to Webflow, GSAP is now 100% free including all plugins（SplitText、MorphSVG など）」で、個人・商用に適用。
- インストール: `npm install gsap`。プラグインは import 後に登録する。`gsap.registerPlugin(ScrollTrigger, Draggable, Flip, MotionPathPlugin)`。
- ScrollTrigger の主要オプション（型定義より）: `trigger`（開始判定の要素）、`start` / `end`（文字列、数値、関数。例 `"top top"`、`"bottom bottom"`）、`endTrigger`（終了判定の別要素）、`scrub`（true でスクロールに直結、数値で追従の滑らかさを秒で指定）、`pin`（true か要素）、`pinSpacing`（固定中の余白を足すか）、`pinType`（`"fixed"` か `"transform"`）、`markers`（開発用ガイド表示）、`toggleActions`（onEnter onLeave onEnterBack onLeaveBack の 4 語、例 `"play none none reverse"`）、`toggleClass`、`snap`、`anticipatePin`、`once`、`fastScrollEnd`、`preventOverlaps`、`invalidateOnRefresh`、`horizontal`、`containerAnimation`。
- コールバック: `onEnter`、`onLeave`、`onEnterBack`、`onLeaveBack`、`onUpdate`、`onToggle`、`onRefresh`、`onKill`。
- 静的メソッド: `ScrollTrigger.create()`（アニメーションなしの単独トリガー）、`refresh()`、`getAll()`、`killAll()`、`batch()`、`matchMedia()`（ビューポート条件付き）、`normalizeScroll()`。
- React での型: taste-skill §5.A の Sticky-Stack skeleton。`"use client"`、`gsap.registerPlugin(ScrollTrigger)`、`useEffect` 内で `gsap.context(() => { ... }, ref)` に包み、クリーンアップで `ctx.revert()`。最後のカード以外を `ScrollTrigger.create({ trigger: card, start: "top top", endTrigger: lastCard, end: "top top", pin: true, pinSpacing: false })` で固定し、次カードの `scrollTrigger: { trigger: next, start: "top bottom", ... }` で `scale: 0.92, opacity: 0.55, ease: "none"` を scrub する。`useReducedMotion()` が真なら何もしない。
- taste-skill §10「Animation Library Choice」: GSAP + ScrollTrigger はフルページの scrolltelling とスクロールハイジャック用。専用の葉コンポーネントに隔離し `useEffect` でクリーンアップ。GSAP と Motion を同じコンポーネントツリーで混ぜない（同じフレームを取り合う）。
- taste-skill §14: GSAP を使う場合は canonical skeleton どおり（`start: "top top"`、`pin: true`、正しい scrub）であることをチェック項目にしている。「GSAP-for-show」（見せるためだけの GSAP）は不合格。

## 具体的な値・ルール（あれば）

| オプション | 型 | AwesomeDS での既定 |
|---|---|---|
| `start` | string / number / function | `"top top"`（pin する場合） |
| `end` | string / number / function | `"+=100%"` か `endTrigger` 指定 |
| `scrub` | boolean / number | `true` または `0.5`（追従の滑らかさ 0.5 秒） |
| `pin` | boolean / Element | 固定するセクションでのみ `true` |
| `pinSpacing` | boolean / string | スタック演出では `false` |
| `anticipatePin` | number | `1`（pin のズレ防止） |
| `markers` | boolean / object | 開発時のみ `true`、本番では削除 |
| `toggleActions` | string | `"play none none reverse"` |

AwesomeDS の使用条件。

1. 対象は pin または scrub を伴うスクロールシーケンスのみ。単純な出現アニメーションは CSS か Motion（第 7 節「GSAP ScrollTrigger only for pinned or scrubbed scroll sequences」）。
2. `'use client'` の葉コンポーネントに隔離し、`gsap.context` と `ctx.revert()` でクリーンアップする。
3. `useReducedMotion()` または `matchMedia("(prefers-reduced-motion: reduce)")` が真なら ScrollTrigger を作らない。
4. アニメーション対象は `transform` と `opacity` のみ。
5. 同じツリーで Motion と混ぜない。
6. `markers: true` を本番に残さない。

## AwesomeDS への反映

- 採用: ライブラリ順序で GSAP を「pin / scrub のスクロールシーケンス限定」に置く（第 7 節）。ScrollTrigger の pin と scrub は CSS scroll-driven animations でも Motion `useScroll` でも代替が難しいため。
- 採用: taste-skill の canonical skeleton（`gsap.context`、`start: "top top"`、`pin: true`、`pinSpacing: false`、`useReducedMotion` ガード）を `components/checklist.md` の GSAP 項目にする。
- 採用: 「GSAP と Motion を同じツリーで混ぜない」規則。
- 採用: 無料化の事実を前提に、SplitText などのプラグインをライセンス上の理由で避ける必要はないと記録。ただし AwesomeDS 第 7 節「Enter transforms travel 4 to 8px」と第 9 節の「kinetic typography を既定にしない」により、SplitText を使う場面はブランドサイトのヒーローに限られる。
- 変更: `scrub: true`（完全直結）ではなく `scrub: 0.5` 程度の追従を推奨する。理由は第 1 節「unhurried」と、直結だとホイール操作の段差がそのまま見えるため。
- 不採用: `normalizeScroll()` とスクロールハイジャック。第 11 節「Keyboard: everything reachable」と、スクロール位置の主導権をユーザーに残す方針に反する。
- 不採用: `ScrollTrigger` を単純なフェードインに使うこと。IntersectionObserver、CSS `animation-timeline: view()`、Motion `whileInView` で足りる。
- 記録: gsap.com の公式ドキュメントは未取得。オプション名と型は型定義ファイルから読んだもので、各オプションの細かな挙動は公式ページで再確認する。

## 出典

- https://github.com/greensock/GSAP : README（無料化、Webflow、インストール、registerPlugin、ScrollTrigger の紹介、ライセンス）。取得済み。
- https://registry.npmjs.org/gsap/latest : 3.15.0、license 文言。取得済み。
- https://raw.githubusercontent.com/greensock/GSAP/master/types/scroll-trigger.d.ts : ScrollTrigger の設定オプション、コールバック、静的メソッド。取得済み。
- https://github.com/Leonxlnx/taste-skill : `skills/taste-skill/SKILL.md` §5.A から §5.D と §10 の GSAP 規則。ローカルクローンで読んだ。
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/ : 公式ドキュメント。プロキシで取得不可、リンクのみ記録。
