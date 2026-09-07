---
title: "AI Elements (Vercel)"
category: component-libraries
type: library
sources:
  - url: https://github.com/vercel/ai-elements
    title: "vercel/ai-elements: AI-native components built on shadcn/ui"
  - url: https://raw.githubusercontent.com/vercel/ai-elements/main/README.md
    title: "ai-elements README"
  - url: https://raw.githubusercontent.com/vercel/ai-elements/main/packages/cli/package.json
    title: "ai-elements packages/cli/package.json (version 1.9.0)"
  - url: https://raw.githubusercontent.com/vercel/ai-elements/main/skills/ai-elements/SKILL.md
    title: "ai-elements skills/ai-elements/SKILL.md"
tags: [ai-elements, vercel, shadcn, ai-sdk, chat, registry, agent-skill]
updated: 2026-09-07
---

# AI Elements (Vercel)

## 概要

AI Elements は Vercel が公開する、AI SDK と shadcn/ui の上に作られたコンポーネント集で、`vercel/ai-elements`（2,407 stars、TypeScript、2026-09-01 最終 push、ライセンス表記は GitHub 上「Other」だが `packages/cli/package.json` は Apache-2.0 を明記）として GitHub で確認できる。会話、メッセージ、コードブロック、推論表示、ツール呼び出しなど 49 個のコンポーネントを `packages/elements/src` に持ち、shadcn の CLI（`npx shadcn add https://elements.ai-sdk.dev/api/registry/<name>.json`）または専用 CLI（`npx ai-elements@latest`）でプロジェクトに複製する。リポジトリには同じ 49 コンポーネントを SKILL.md 化した Agent Skill（`skills/ai-elements/`）も同梱されており、エージェントが各コンポーネントの `references/<name>.md` を読んで生成できるようにしている。

## 要点

- インストール: `npx ai-elements@latest`（全コンポーネント）、`npx ai-elements@latest add <name>`（個別）、または shadcn 標準 CLI で `npx shadcn@latest add https://elements.ai-sdk.dev/api/registry/all.json`。前提は Node 18+、Next.js + AI SDK、shadcn/ui 初期化済み、Tailwind CSS の CSS Variables モード。
- CLI の動作: パッケージマネージャ（npm/pnpm/yarn/bun）を自動検出し、`https://elements.ai-sdk.dev/api/registry/registry.json` から registry を取得、shadcn/ui CLI を内部で呼び出してコンポーネントと依存関係をインストールする。設置先は `components.json` の設定に従い、既定では `@/components/ai-elements/`。
- コンポーネント一覧（`packages/elements/src`、49 件）: agent、artifact、attachments、audio-player、canvas、chain-of-thought、checkpoint、code-block、commit、confirmation、connection、context、controls、conversation、edge、environment-variables、file-tree、image、inline-citation、jsx-preview、message、mic-selector、model-selector、node、open-in-chat、package-info、panel、persona、plan、prompt-input、question、queue、reasoning、sandbox、schema-display、shimmer、snippet、sources、speech-input、stack-trace、suggestion、task、terminal、test-results、toolbar、transcription、voice-selector、web-preview。
- Agent Skill 版（`skills/ai-elements/SKILL.md`）は同じ 49 コンポーネントそれぞれに `references/<name>.md` の詳細ドキュメントと、`scripts/` 配下に実装例の `.tsx`（例: `terminal-streaming.tsx`、`file-tree-selection.tsx`、`persona-glint.tsx` など、1 コンポーネントに複数バリアント）を持つ。
- 最小構成の例（README）: `useChat`（`@ai-sdk/react`）で得た `messages` を `Conversation` / `ConversationContent` / `Message` / `MessageContent` / `MessageResponse` に流し込む。
- 推奨セットアップ: Vercel AI Gateway（`AI_GATEWAY_API_KEY`）、shadcn の CSS Variables テーマ、TypeScript。
- リポジトリ構成: `packages/elements`（本体）、`packages/cli`（`elements` バイナリ、npm パッケージ名 `ai-elements`）、`packages/examples`、`packages/shadcn-ui`、`apps/docs`、`skills/ai-elements`。Turborepo + pnpm workspace、Changesets でバージョン管理。

## 具体的な値・ルール（あれば）

```bash
# 全コンポーネントを一括インストール
npx ai-elements@latest

# 個別インストール
npx ai-elements@latest add message
npx ai-elements@latest add conversation
npx ai-elements@latest add code-block

# shadcn CLI 経由（同じ registry を参照）
npx shadcn@latest add https://elements.ai-sdk.dev/api/registry/all.json
npx shadcn@latest add https://elements.ai-sdk.dev/api/registry/message.json
```

```tsx
"use client";
import { useChat } from "@ai-sdk/react";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";

export default function Chat() {
  const { messages } = useChat();
  return (
    <Conversation>
      <ConversationContent>
        {messages.map((m, i) => (
          <Message key={i} from={m.role}>
            <MessageContent><MessageResponse>{m.content}</MessageResponse></MessageContent>
          </Message>
        ))}
      </ConversationContent>
    </Conversation>
  );
}
```

| 項目 | 値 |
|---|---|
| CLI パッケージ名 | `ai-elements`（npm）、bin エントリ `elements` |
| バージョン | 1.9.0（`packages/cli/package.json`） |
| ライセンス | Apache-2.0（`packages/cli/package.json`）、GitHub の repository license バッジは "Other" |
| registry エンドポイント | `https://elements.ai-sdk.dev/api/registry/registry.json`、個別は `/api/registry/<name>.json` |
| 対応前提 | Node >=18、Next.js + AI SDK、shadcn/ui 初期化済み、Tailwind CSS Variables モード |
| コンポーネント数 | 49（`packages/elements/src`） |

## AwesomeDS への反映

- 記録: assistant-ui（Knowledge/component-libraries/assistant-ui.md）と同じ「shadcn registry から複製する」配布方式を、Vercel という別ベンダーがチャット UI 領域で採用している事実として記録する。AwesomeDS 第 8 節の「shadcn/ui 上にコンポーネントを配布する」方針の妥当性を補強する追加事例（反映不要、既存方針の裏付け）。
- 提案: SKILL.md + `references/<name>.md` + `scripts/<name>-<variant>.tsx` という「1 コンポーネント = 仕様書 1 枚 + バリアント別サンプル複数」という Agent Skill の構造は、本リポジトリが将来 AwesomeDS のコンポーネントを Agent Skill として配布する際のテンプレート候補として `Plugin/awesome-ds/skills/knowledge-curator/reference/entry-template.md` 付近に記録する（AwesomeDS 本体の変更はまだ提案しない）。
- 反映不要: AI チャット特有のコンポーネント（`reasoning`、`chain-of-thought`、`tool` など）は AwesomeDS の汎用 UI の対象外。

## 出典

- https://github.com/vercel/ai-elements : リポジトリ本体。2,407 stars、TypeScript、最終 push 2026-09-01（GitHub 検索 API で確認）。
- https://raw.githubusercontent.com/vercel/ai-elements/main/README.md : インストール方法、CLI の動作、推奨セットアップ。`git clone` で取得。
- https://raw.githubusercontent.com/vercel/ai-elements/main/packages/cli/package.json : CLI のバージョンとライセンス。取得済み。
- https://raw.githubusercontent.com/vercel/ai-elements/main/skills/ai-elements/SKILL.md : Agent Skill 版の構造。取得済み。
