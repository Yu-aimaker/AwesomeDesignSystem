---
title: "Inclusive Components (Heydon Pickering)"
category: accessibility
type: article
sources:
  - url: https://github.com/Heydon/Inclusive-Components
    title: "Heydon/Inclusive-Components: Resources for the inclusive components blog"
  - url: https://raw.githubusercontent.com/Heydon/inclusive-design-checklist/HEAD/README.md
    title: "Heydon/inclusive-design-checklist: Inclusive Web Design Checklist"
  - url: https://inclusive-components.design/
    title: "Inclusive Components"
tags: [accessibility, inclusive-design, heydon-pickering, components, aria, checklist]
updated: 2026-09-06
---

# Inclusive Components (Heydon Pickering)

## 概要

Inclusive Components は Heydon Pickering が inclusive-components.design で連載した、UI コンポーネントをアクセシブルに作るためのパターン集である (後に書籍化)。各記事は 1 つの部品 (toggle button, tabs, menus, cards, tooltips, data tables, notifications, modal dialogs など) を取り上げ、HTML のネイティブ要素を優先し、ARIA は必要最小限に、状態は視覚と支援技術の双方に伝えるという方針で実装を示す。サイト本体は本環境から取得できず、同著者の GitHub リポジトリ (ブログのリソース、Inclusive Web Design Checklist) を資料とした。

## 要点

- リポジトリの説明: 「Resources for the inclusive components blog (inclusive-components.design)」。記事本文はサイト側にあり、今回は取得できていない。
- Inclusive Web Design Checklist (同著者) の関連項目:
  - Focus: 「Provide clear, unambiguous focus styles」「Ensure keyboard focus order is logical regarding visual layout」
  - Keyboard: 「Use screen reader and keyboard accessible HTML」「Make scrollable elements focusable for keyboard users」「Ensure disabled controls are not focusable」
  - Controls: 「Make controls look like controls; give them strong perceived affordance」「Ensure states (pressed, expanded, invalid, etc) are communicated to assistive software」
  - Links: 「Underline links — at least in body copy」「Make sure the purpose of a link is clearly described: 'read more' vs. 'read more about accessibility'」「Warn users of links that have unusual behaviors, like linking off-site, or loading a new tab」
  - Forms: 「Give all form elements permanently visible labels」「Place labels above form elements」「Mark invalid fields clearly and provide associated error messages」「Do not auto focus form fields, on page load」「Make forms as short as possible」
  - Motion: 「Include only clear, meaningful animations」「Honor requests to remove animation via the `prefers-reduced-motion` media query」
- 連載の代表的なパターン (一般に知られる内容、今回はサイト未取得): Toggle Button は `<button aria-pressed>` を使いラベルを変えない。Tabs は `role="tablist"` と矢印キー移動。Menu は本来のメニューとナビゲーションを区別する。Card は 1 つのリンクを疑似要素で広げる。Tooltip は hover と focus の両方で出し、Escape で閉じる。Notification は `role="status"` / `aria-live`。Modal は focus trap と `aria-modal`。

## 具体的な値・ルール

| 部品 | 主要ルール |
|---|---|
| Toggle button | `<button>` + `aria-pressed`。押下でラベルを変えない |
| Tabs | 1 つのタブストップ + 矢印キー (roving tabindex) |
| Menu button | `aria-expanded`、Escape で閉じる、focus を戻す |
| Card | 見出しのリンクをカード全体に広げ、リンクは 1 つ |
| Tooltip | hover と focus で表示、Escape で閉じる、`aria-describedby` |
| Notification | `role="status"` (polite) / `role="alert"` (assertive) |
| Modal dialog | focus を中に閉じ込め、閉じたら起点に戻す |
| Form | ラベルは常に可視、上に配置、エラーは関連付け |
| Link | 本文中は下線、目的が分かる文言 |

## AwesomeDS への反映

- 採用: 「Semantic HTML first, ARIA second」(DESIGN.md 11. Accessibility)。Pickering の一貫した方針をそのまま原則にした。
- 採用: 「Forms: label above, helper text below, error below in `danger` with an icon. Never placeholder as label」(8. Components)。チェックリストの「permanently visible labels」「labels above」「mark invalid fields clearly」に対応する。
- 採用: 「Every interactive component ships with hover, focus-visible, active, disabled, loading states」。状態を視覚と支援技術に伝える要件。
- 採用: 「Keyboard: everything reachable by Tab, dismissible by Escape, operable by Enter/Space」。メニュー、ツールチップ、モーダルの Escape 動作。
- 採用: `prefers-reduced-motion` で transform を止める (7. Motion)。
- 採用: 「Every icon-only button has an `aria-label`」。
- 翻案: 「Underline links in body copy」は、AwesomeDS では本文中のリンクを accent 色 + 下線にし、ナビゲーションのリンクは下線なしにする運用にした。
- 翻案: 実装は shadcn/ui (Radix Primitives) に委ねる。Radix が Pickering のパターン (roving tabindex、focus trap、aria 属性) を実装しているため、独自実装より優先する (8. Components)。
- 不採用: なし。連載の内容と AwesomeDS の方針に矛盾はない。

## 出典

- https://github.com/Heydon/Inclusive-Components : 取得済み。ブログのリソースリポジトリ (README は説明 1 行)。
- https://raw.githubusercontent.com/Heydon/inclusive-design-checklist/HEAD/README.md : 取得済み。focus、keyboard、controls、links、forms、motion の項目。
- https://inclusive-components.design/ : ネットワーク制限で取得不可。個別記事 (toggle-button 等) も取得不可。パターンの要約は一般知識に基づき、直接引用はしていない。
