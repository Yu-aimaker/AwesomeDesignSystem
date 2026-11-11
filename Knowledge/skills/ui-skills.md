---
title: "UI Skills (ibelick)"
category: skills
type: skill
sources:
  - url: https://github.com/ibelick/ui-skills
    title: "ibelick/ui-skills: Skills for Design Engineers"
  - url: https://raw.githubusercontent.com/ibelick/ui-skills/main/README.md
    title: "ui-skills README"
  - url: https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/baseline-ui/SKILL.md
    title: "ui-skills: baseline-ui SKILL.md"
  - url: https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/ui-skills-root/SKILL.md
    title: "ui-skills: ui-skills-root SKILL.md (routing layer)"
  - url: https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/improve-ui/SKILL.md
    title: "ui-skills: improve-ui SKILL.md"
  - url: https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/create-design-md/SKILL.md
    title: "ui-skills: create-design-md SKILL.md"
  - url: https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/fixing-motion-performance/SKILL.md
    title: "ui-skills: fixing-motion-performance SKILL.md"
  - url: https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/fixing-accessibility/SKILL.md
    title: "ui-skills: fixing-accessibility SKILL.md"
  - url: https://raw.githubusercontent.com/ibelick/ui-skills/main/src/data/registry.ts
    title: "ui-skills: src/data/registry.ts (aggregated external skill registry)"
tags: [skill, ibelick, baseline-ui, deslop, registry, design-engineering, mcp]
updated: 2026-11-11
---

# UI Skills (ibelick)

## 概要

UI Skills は ibelick が公開する Design Engineer 向け Agent Skills と、配布サイト ui-skills.com である。2026-11-11 の GitHub API は 10,963 stars、MIT、最終 push 2026-11-11、archived ではない。この数字は同日の API であり、サイト一覧の既存行は更新していない。README は CLI、MCP、playbook の入口だけを書く。スキルディレクトリは `baseline-ui`、`component-canvas`、`create-canvas`、`create-design-md`、`fixing-accessibility`、`fixing-metadata`、`fixing-motion-performance`、`improve-ui`、`ui-skills-root`（2026-11-11 に一覧を取得）。`src/data/registry.ts` の件数は今回数えていない。

## 要点

2026-11-11。

- CLI: `npx ui-skills start`、`categories`、`list --category motion`、`get baseline-ui`。
- MCP: `https://www.ui-skills.com/mcp` 。ツールは `list_skills` と `get_skill`。
- Playbook: https://www.ui-skills.com/playbook 。本文は写していない。
- `baseline-ui` の SKILL.md: アニメーションは明示されない限り足さない。足すときは `transform` と `opacity`、操作のフィードバックは 200ms を超えない。`h-screen` ではなく `h-dvh`。`prefers-reduced-motion` を尊重する。グラデーションは明示されない限り使わない。レジストリ全体は入れない。トークンは置き換えない。

2026-09-07 の記録。レジストリ件数は今回確認していない。

## 記録（2026-09-07）

- CLI: `npx ui-skills start`（ルーティング用の `ui-skills-root` を提示）、`categories`、`list --category <name>`、`get <slug>`。MCP は `https://www.ui-skills.com/mcp` に `list_skills` / `get_skill` の 2 ツール。
- `ui-skills-root`（ルーティング層）: UI 関連かどうかを判定し、曖昧なら 1 つだけ質問し、カテゴリを特定し CLI で調べ、必要最小のスキルだけを読み込む。選択ルールは「1 スキルを優先、2 つは明確に 2 つの観点が要る場合のみ、3 つは広範なレビュー/リデザインのみ、3 つを超えない」。
- `baseline-ui`: AI 生成 UI の「slop」を素早く直すための強制ベースライン。Stack（Tailwind 既定値、JS アニメーションは `motion/react`、`tw-animate-css`、`cn` ユーティリティ）、Components（Base UI / React Aria / Radix のいずれかを使い混在禁止、アイコンのみボタンに `aria-label` 必須）、Interaction（破壊的操作は `AlertDialog`、`h-screen` 禁止で `h-dvh`）、Animation（`transform` と `opacity` のみ、200ms 超禁止、`prefers-reduced-motion` 尊重）、Typography（`text-balance` / `text-pretty` / `tabular-nums` 必須）、Design（グラデーション・グロー効果禁止、アクセントは 1 画面 1 色）の各節で MUST / SHOULD / NEVER を列挙する。
- `improve-ui`: 既存 UI を「その UI 自身の設計証跡」に対して監査する read-only スキル。プロダクトソースは変更せず `design-plans/` にのみ書く。所見は Contract（明文化された設計判断の引用）、Runtime（その値が実際にレンダーパスに到達する証明）、Correction（具体的な 1 つの修正）の 3 証明が揃って初めて採用され、最大 3 件まで報告する。アクセシビリティや機能不具合は明示要求がない限り対象外。
- `create-design-md`: 既存プロダクトまたは公開 URL から DESIGN.md を作成・更新する。Repository mode（ソースが正）と URL mode（DOM / computed style の観測が正、内部トークン名までは確定できない）の 2 モード。evidence pipeline は `role → value → source → scope → recurrence → confidence`。検証を通るまで生成した DESIGN.md を要約・表示しない。
- `fixing-motion-performance` / `fixing-accessibility`: 優先度付きルール表（例: motion は「never patterns」が最優先、次に「choose the mechanism」）を持つ監査スキルで、`/fixing-<name> <file>` で違反行・理由・修正案の 3 点セットを返す。
- レジストリ（`registry.ts`）は 290 件のスキルを 68 の GitHub アカウントから集約し、`accessibility` / `motion` / `systems` / `visual` / `interaction` / `performance` / `craft` / `taste` / `typography` / `color` / `3d` / `nextjs` / `vue` / `threejs` などのトピックタグで検索できる。多い提供元は antfu（19）、pbakaus（19）、MengTo（18）、figma（16）、Leonxlnx（14）、mattpocock（13）、emilkowalski（12）。
- taste-skill との違い（2026-11-11）: taste-skill 2.5.1 は会社サイトを配色とヒーローから作る。UI Skills は小さい監査スキルとレジストリである。3 ダイヤルの説明は 2026-09-07 時点の記述で、現行の taste-skill README には無い。

## 具体的な値・ルール（あれば）

`baseline-ui` の主な数値制約（README / SKILL.md より抜粋）。

| 項目 | 値・ルール |
|---|---|
| アニメーション対象 | `transform`、`opacity` のみ。`width` / `height` / `top` / `left` / `margin` / `padding` は禁止 |
| インタラクション feedback | 200ms を超えない |
| 全画面高さ | `h-screen` 禁止、`h-dvh` を使う |
| アクセント色 | 1 画面あたり 1 色を上限にする（SHOULD） |
| z-index | 固定スケールを使い、任意の `z-*` を禁止 |
| 正方形要素 | `w-*` + `h-*` ではなく `size-*` |

`improve-ui` の所見が満たすべき 3 証明: Contract（拘束力のある設計判断の直接引用）、Runtime（実際のレンダリング経路への到達証明）、Correction（トークン・バリアント・プリミティブ名を明示した単一の修正）。3 つ揃わない候補は破棄する。

## AwesomeDS への反映

- 反映済み（2026-11-11）: `awesome-ds` は baseline-ui を第二のチェックリストとし、レジストリは入れず、トークンは置き換えない。baseline-ui の「頼まれない限りアニメーションを足さない」は採用しない。AwesomeDS のフィードバックのモーションは残す。
- 採用: `h-screen` 禁止 / `h-dvh` 使用。AwesomeDS のレイアウト方針とすでに一致しており、`components/README.md` の出荷前チェックリストに根拠として追記できる。
- 採用: アニメーション対象を `transform` と `opacity` に限定し 200ms 上限を設ける方針は、taste-skill 由来の第 7 節・第 10 節と同じ結論であることを裏付ける第二の出典として記録する。
- 採用: 「破壊的操作には `AlertDialog` を使う」というルール名を明示。AwesomeDS のダイアログ規約に一致するため、`components/*.md` の該当セクションに出典を追加する候補として記録する（別 PR）。
- 参考: `improve-ui` の 3 証明（Contract / Runtime / Correction）による所見の絞り込みは、`design-verifier` スキルの敵対的検証の粒度を見直す際の参考にする。今回は AwesomeDS 本体は変更しない。
- 不採用: レジストリ方式そのものの導入。AwesomeDS は自己完結した 1 つの DESIGN.md を正本とする方針であり、外部スキルを動的に集約するルーターは採用しない。

## 出典

- https://github.com/ibelick/ui-skills : API で 10,963 stars、MIT、最終 push 2026-11-11。スキルディレクトリ一覧も同日。2026-09-07 の 8,206 stars は当時の値。
- https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/baseline-ui/SKILL.md : アニメーションは明示時のみ、200ms、`h-dvh`（2026-11-11 に再取得）。
- https://raw.githubusercontent.com/ibelick/ui-skills/main/README.md : CLI と MCP の説明。取得済み。
- https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/baseline-ui/SKILL.md : ベースライン制約の全文。取得済み。
- https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/ui-skills-root/SKILL.md : ルーティングと選択ルール。取得済み。
- https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/improve-ui/SKILL.md : 監査プロトコルの全文。取得済み。
- https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/create-design-md/SKILL.md : DESIGN.md 生成の 2 モードと evidence pipeline。取得済み。
- https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/fixing-motion-performance/SKILL.md : モーション監査の優先度表。取得済み。
- https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/fixing-accessibility/SKILL.md : アクセシビリティ監査の優先度表。取得済み。
- https://raw.githubusercontent.com/ibelick/ui-skills/main/src/data/registry.ts : レジストリの提供元・トピック集計に使用。取得済み。
