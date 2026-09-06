---
title: "CSS scroll-driven animations"
category: animation
type: guideline
sources:
  - url: https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/guides/scroll-driven_animations/index.md
    title: "MDN: CSS scroll-driven animations (guide, source of developer.mozilla.org which is proxy blocked)"
  - url: https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/reference/properties/animation-timeline/index.md
    title: "MDN: animation-timeline"
  - url: https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/animation-timeline.json
    title: "MDN browser-compat-data: css.properties.animation-timeline"
  - url: https://github.com/Leonxlnx/taste-skill
    title: "Leonxlnx/taste-skill SKILL.md §5.D (allowed alternatives to scroll listeners)"
tags: [css, scroll-driven, animation-timeline, view, scroll, browser-support, reduced-motion]
updated: 2026-09-06
---

# CSS scroll-driven animations

## 概要

CSS scroll-driven animations は、アニメーションの進行を時間ではなくスクロール位置に結びつける CSS モジュール。`animation-timeline` プロパティに `scroll()`（スクローラーのスクロール量）か `view()`（要素がスクロールポートに入る度合い）を与え、`animation-range` で開始と終了の範囲を指定する。JavaScript なしで進捗バーや出現アニメーションが作れる。Chrome 115 と Safari 26 で利用でき、Firefox は Preview 段階。AwesomeDS では「単純な出現と進捗」に使い、pin や複雑な連動は GSAP に残す。

## 要点

- 2 種類のタイムライン: Scroll progress timeline はスクローラー全体のスクロール位置（`scroll-timeline-name`、`scroll-timeline-axis`）。View progress timeline は対象要素がスクロールポート内を通過する度合い（`view-timeline-name`、`view-timeline-axis`、`view-timeline-inset`）。
- 無名タイムライン: `animation-timeline: scroll()` と `animation-timeline: view()`。`scroll()` の引数はスクローラー（`root`、`nearest`、`self`）と軸（`block`、`inline`、`x`、`y`）。例 `scroll(x root)`、`scroll(inline nearest)`。`view()` の引数は軸と inset。例 `view(inline)`、`view(x 200px auto)`。
- 名前付きタイムライン: `scroll-timeline-name: --my-timeline` をスクローラーに、`view-timeline-name: --reveal` を対象に付け、`animation-timeline: --my-timeline` で参照する。`timeline-scope` で祖先に名前を持ち上げ、兄弟以外からも参照できる。
- `animation-range`: キーフレームがタイムライン上のどの範囲で実行されるかを指定（例 `animation-range: entry 0% cover 40%`）。
- `animation-timeline` の値: `none`（タイムラインなし、動かない）、`auto`（既定、文書のタイムライン）、`scroll()`、`view()`、名前付き、グローバル値。複数アニメーションにはカンマ区切りで宣言順に対応。
- ブラウザ対応（browser-compat-data）: Chrome 115、Chrome Android 115、Edge 115、Opera 115、Samsung Internet 115、Safari 26、Safari iOS 26、Firefox は Preview（安定版未対応）。ステータスは standard track、experimental ではない、deprecated ではない。
- taste-skill §5.D: `window.addEventListener("scroll")` の代替として、Motion `useScroll()`、GSAP ScrollTrigger、IntersectionObserver と並んで CSS `animation-timeline: view()` を挙げる。§7 MOTION 8-10 でも「CSS animation-timeline または GSAP ScrollTrigger」。

## 具体的な値・ルール（あれば）

| ブラウザ | 対応版 |
|---|---|
| Chrome / Edge / Opera / Samsung Internet | 115 |
| Chrome Android | 115 |
| Safari / Safari iOS | 26 |
| Firefox | Preview（安定版なし） |

AwesomeDS 向けの書き方（出現アニメーション、reduced motion 対応込み）。

```css
@keyframes ds-reveal {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}

.ds-reveal {
  animation: ds-reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}

@supports not (animation-timeline: view()) {
  .ds-reveal { animation: none; }
}

@media (prefers-reduced-motion: reduce) {
  .ds-reveal {
    animation-name: ds-reveal-fade;   /* opacity only */
  }
  @keyframes ds-reveal-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
}
```

注記: スクロール駐動のアニメーションでは `animation-timing-function` を `linear` にしてスクロール量と進行を 1 対 1 にする。第 7 節の「`linear` を使わない」は時間ベースの動きに対する規則で、スクロール連動はユーザーの操作量そのものが進行なので例外にあたる。

## AwesomeDS への反映

- 採用: 出現アニメーションと読み進み進捗バーには CSS scroll-driven animations を第一候補にする。JavaScript なしで動き、`transform` と `opacity` だけで完結し（第 7 節）、Firefox では `@supports not` で静的表示に落ちる。
- 採用: 第 7 節「Enter transforms travel 4 to 8px」をそのまま keyframe に適用（上の例は 8px）。
- 採用: reduced motion では transform を外し opacity のみ残す（第 7 節、第 11 節）。上の例のとおり `@media (prefers-reduced-motion: reduce)` で keyframe を差し替える。
- 変更: Firefox 未対応のため、機能検出（`@supports (animation-timeline: view())`）を必須にし、非対応では「最初から表示」にする。IntersectionObserver での polyfill は行わない（依存を増やさないため）。
- 不採用: pin（固定）と scrub の複雑な連動を CSS だけで組むこと。`position: sticky` と `view()` の組み合わせで一部は可能だが、複数要素の同期や `endTrigger` 相当の制御は GSAP ScrollTrigger に任せる（Knowledge/animation/gsap.md）。
- 不採用: スクロール連動の視差（parallax）。第 1 節「no decorative blobs」、第 9 節の装飾禁止に照らして、内容の理解に寄与しない動きは入れない。
- 記録: MDN 本体はプロキシで取得不可。`mdn/content` の同じ Markdown と `browser-compat-data` の JSON を読んだ。MDN のパスは `files/en-us/web/css/guides/scroll-driven_animations/` と `files/en-us/web/css/reference/properties/animation-timeline/` に移っている。

## 出典

- https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/guides/scroll-driven_animations/index.md : モジュール概要、2 種のタイムライン、関数、プロパティ、`animation-range`、`timeline-scope`。取得済み。
- https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/reference/properties/animation-timeline/index.md : 値の一覧と例。取得済み。
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/animation-timeline.json : 各ブラウザの対応版とステータス。取得済み。
- https://github.com/Leonxlnx/taste-skill : `skills/taste-skill/SKILL.md` §5.D と §7 の scroll-driven animation への言及。ローカルクローンで読んだ。
