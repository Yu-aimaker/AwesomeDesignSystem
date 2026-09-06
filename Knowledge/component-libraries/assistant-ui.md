---
title: "assistant-ui"
category: component-libraries
type: library
sources:
  - url: https://github.com/assistant-ui/assistant-ui
    title: "assistant-ui/assistant-ui: The UX of ChatGPT in your React app"
  - url: https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/README.md
    title: "assistant-ui README"
  - url: https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/content/docs/primitives/thread.mdx
    title: "assistant-ui docs: Thread primitive"
  - url: https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/content/docs/primitives/composer.mdx
    title: "assistant-ui docs: Composer primitive"
  - url: https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/content/docs/(getting-started)/installation.mdx
    title: "assistant-ui docs: Installation"
  - url: https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/content/docs/(getting-started)/cli.mdx
    title: "assistant-ui docs: CLI"
  - url: https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/content/docs/(getting-started)/base-ui.mdx
    title: "assistant-ui docs: Radix UI and Base UI"
  - url: https://github.com/assistant-ui/assistant-ui/tree/main/apps/registry
    title: "assistant-ui apps/registry (the component registry app behind r.assistant-ui.com)"
tags: [assistant-ui, chat, primitives, shadcn, registry, thread, composer, gallery]
updated: 2026-09-06
---

# assistant-ui

## 概要

assistant-ui は AI チャット UI 向けの TypeScript / React ライブラリ。`Thread`、`Message`、`Composer`、`ThreadList`、`ActionBar` などの headless primitive と、shadcn/ui 形式で CLI がプロジェクトに複製する styled component の 2 層を持つ。styled 層は `r.assistant-ui.com` の registry から `npx shadcn add` で入る。本リポジトリでは、primitive と完成形コンポーネントを並べて見せる「elements」のギャラリー構成を Web サイトの手本として参照する。

## 要点

- 特徴（README）: 合成可能な primitive、ストリーミング、自動スクロール、リトライ、添付、Markdown、コードハイライト、音声入力、キーボード操作、アクセシビリティが揃った production UX、ツール呼び出しと JSON を React コンポーネントとして描く Generative UI、端から端まで型付き。MIT、YC 支援、12k stars。
- インストール: 新規は `npx assistant-ui@latest create`（テンプレート `default`、`minimal`、`cloud`、`langchain`、例として `with-langgraph` など）、既存は `npx assistant-ui@latest init`。直接は `npm install @assistant-ui/react @assistant-ui/ai-sdk`。
- CLI: `create`、`init`（依存追加、コンポーネント追加、設定）、`add`（registry から `thread`、`thread-list`、`assistant-modal`、`markdown-text`、`attachment`、`tool-fallback` などを `components/assistant-ui/` に複製）、`update`（`@assistant-ui/*` を最新に）、`upgrade` / `codemod`。
- shadcn registry: `components.json` に registry を登録し `npx shadcn@latest add https://r.assistant-ui.com/thread.json`。style を意識した URL は `https://r.assistant-ui.com/styles/{style}/{name}.json` で、style が `base-` で始まると Base UI 版、それ以外は Radix 版が配られる。primitive は Radix の `asChild` と Base UI の `render` の両方を受ける。
- 対応ランタイム: Vercel AI SDK（`@assistant-ui/ai-sdk`）、LangGraph / LangChain、AG-UI / A2A、Google ADK / OpenCode、カスタム data-stream、Assistant Cloud。
- リポジトリ構成: `packages/`（react、react-ui、react-markdown、react-ai-sdk、cli、core、ui、next、svelte、vue、react-langchain、react-langgraph、react-mcp、store、ai-sdk、cloud、cloud-ai-sdk、他にハイライト、Markdown、devtools、glass / shimmer などの UI ユーティリティ）、`apps/`（docs、registry、social-media）、`examples/`、`templates/`。
- docs 構成（`apps/docs/content/docs`）: `(getting-started)`（architecture、base-ui、cli、devtools、index、installation、llm、rtl）、`primitives`（thread、composer、message、action-bar、thread-list、branch-picker、attachment、assistant-modal、chain-of-thought、error、selection-toolbar、suggestion）、`runtimes`、`guides`、`tools`、`integrations`、`react-native`、`vue`、`ink`、`cloud`、`utilities`、`migrations`、`copilots`、`(reference)/api-reference`。
- `apps/registry`: Next.js アプリ（`components.json`、`app/`、`src/`、`scripts/`、`templates/`、`vercel.json`）。registry JSON と styled component のプレビューを配信する。本セッションでは assistant-ui.com が取得できないため、公開サイト上のギャラリーページの実際の見え方は未確認。
- Thread primitive: `ThreadPrimitive.Root`（div）、`Viewport`（自動スクロール、`turnAnchor` "top" / "bottom"、`autoScroll`、`scrollToBottomOnRunStart` など）、`Messages`（role で描き分ける render function）、`ViewportFooter`（高さを登録する sticky footer）、`ScrollToBottom`（最下部では自動で無効）、`Suggestions`。`Empty` と `If` は非推奨で `AuiIf` と `s.thread.isEmpty` に移行。
- Composer primitive: `ComposerPrimitive.Root`（form）、`Input`（textarea、`submitMode` "enter" / "ctrlEnter" / "none"、`cancelOnEscape`、`placeholder`、`rows`）、`Send`、`Cancel`、`AddAttachment`（`multiple`）、`Attachments`。Thread 内では新規作成、Message 内では編集に自動で切り替わる。

## 具体的な値・ルール（あれば）

Thread の最小構成。

```tsx
<ThreadPrimitive.Root className="flex h-full flex-col">
  <ThreadPrimitive.Viewport turnAnchor="top">
    <AuiIf condition={(s) => s.thread.isEmpty}>
      <p>Welcome! Ask a question to get started.</p>
    </AuiIf>
    <ThreadPrimitive.Messages>
      {({ message }) => message.role === "user" ? <UserMessage /> : <AssistantMessage />}
    </ThreadPrimitive.Messages>
    <ThreadPrimitive.ViewportFooter>
      <MyComposer />
    </ThreadPrimitive.ViewportFooter>
  </ThreadPrimitive.Viewport>
</ThreadPrimitive.Root>
```

Composer の最小構成。

```tsx
<ComposerPrimitive.Root>
  <ComposerPrimitive.Input placeholder="Ask anything..." />
  <ComposerPrimitive.Send>Send</ComposerPrimitive.Send>
</ComposerPrimitive.Root>
```

## AwesomeDS への反映

- 採用（サイト構成の手本）: 要件が assistant-ui の「elements」ギャラリーを本リポジトリの Web サイトの手本に挙げる理由は 3 つ。1 つめは、headless primitive（挙動）と shadcn 形式の styled component（見た目）を同じ名前で対にして見せていること。AwesomeDS も `components/README.md` の仕様（挙動と状態）と、AwesomeDS トークンで塗った実装を 1 ページに並べる。2 つめは、各要素にコピー可能な `npx shadcn add <url>` を付け、ギャラリー自体が registry（`apps/registry`）から配信されていること。AwesomeDS も Web サイトを registry の配信元にし、`@awesome-ds/<name>` で入れられるようにする。3 つめは、Radix 版と Base UI 版を style 名で切り替えて同じギャラリーから配ること。AwesomeDS の第 8 節「Base UI is the accepted alternative」をサイト側で実現する具体例になる。
- 採用: `data-*` と `asChild` / `render` 両対応の primitive の書き方。AwesomeDS の独自コンポーネント（もし作る場合）はこの二重対応を規約にする。
- 採用: 状態の網羅。Thread の empty 状態、ScrollToBottom の自動無効、Composer の編集 / 新規の切り替えは、AwesomeDS 第 8 節「Every data view ships with loading (skeleton), empty and error states」の具体例。
- 変更: assistant-ui の styled component はチャット専用で、AwesomeDS の対象は汎用 UI。ギャラリーの構造だけを借り、コンポーネント一覧は shadcn の標準セット + AwesomeDS 固有（badge、dialog、input、card、button の 3 種）から始める。
- 不採用: `glass` や `shimmer` のユーティリティパッケージ。AwesomeDS 第 1 節「No gradients on backgrounds, no glass, no glow」に反する。
- 記録: 公開サイト assistant-ui.com のギャラリー本体は未取得。GitHub 上の `apps/registry` と docs 構成から推定した部分は、サイトにアクセスできる環境で確認する。

## 出典

- https://github.com/assistant-ui/assistant-ui : リポジトリ概要、パッケージ一覧、apps 一覧、docs フォルダ構成。取得済み。
- https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/README.md : 特徴、クイックスタート、ランタイム。取得済み。
- https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/content/docs/primitives/thread.mdx : Thread の anatomy と props。取得済み。
- https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/content/docs/primitives/composer.mdx : Composer の anatomy と props。取得済み。
- https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/content/docs/(getting-started)/installation.mdx : CLI と shadcn registry の add コマンド。取得済み。
- https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/content/docs/(getting-started)/cli.mdx : CLI サブコマンドと出力先。取得済み。
- https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/content/docs/(getting-started)/base-ui.mdx : Base UI 版の配布規則。取得済み。
- https://github.com/assistant-ui/assistant-ui/tree/main/apps/registry : registry アプリの構成。取得済み（assistant-ui.com 本体はプロキシで取得不可）。
