---
title: "Superpowers (obra)"
category: skills
type: skill
sources:
  - url: https://github.com/obra/superpowers
    title: "obra/superpowers: an agentic skills framework and software development methodology"
  - url: https://raw.githubusercontent.com/obra/superpowers/main/README.md
    title: "Superpowers README"
  - url: https://raw.githubusercontent.com/obra/superpowers/main/skills/using-superpowers/SKILL.md
    title: "Superpowers: using-superpowers SKILL.md"
  - url: https://raw.githubusercontent.com/obra/superpowers/main/skills/brainstorming/SKILL.md
    title: "Superpowers: brainstorming SKILL.md"
tags: [skill, superpowers, sdlc, subagent-driven-development, brainstorming, tdd, multi-harness]
updated: 2026-09-07
---

# Superpowers (obra)

## 概要

Superpowers は `obra/superpowers` として公開される、コーディングエージェント向けの「完全なソフトウェア開発方法論」。GitHub で確認済み: 282,566 stars、Shell（インストール/同期スクリプト中心）、MIT、最終 push 2026-09-04。Claude Code、Cursor、Codex（App/CLI）、Devin CLI、Factory Droid、Gemini CLI、GitHub Copilot CLI、Grok Build CLI、Kimi Code、OpenCode、Pi、Hermes Agent など多数のハーネスに対応する移植レイヤーを持ち、14 の実装スキルと、それらを「必ず使わせる」ための強制的な起動ルールで構成される。UI 生成やデザイントークンに特化した taste-skill や UI Skills とは異なり、対象は要件定義からブランチ完了までのソフトウェア開発プロセス全体。

## 要点

- 基本ワークフロー（README）: 何かを作り始めたと感知したら即座にコードを書かず、まず何を実現したいかを聞き返す → 仕様を読める分量に区切って提示する → 実装計画を「判断力の低いジュニアエンジニアでも従える」粒度で作る → 承認後に subagent-driven development でタスクごとにサブエージェントを立ち上げ、レビューしながら数時間単位で自律的に進める。TDD（red/green）、YAGNI、DRY を強調する。
- 14 の実装スキル: `brainstorming`、`dispatching-parallel-agents`、`executing-plans`、`finishing-a-development-branch`、`receiving-code-review`、`requesting-code-review`、`subagent-driven-development`、`systematic-debugging`、`test-driven-development`、`using-git-worktrees`、`using-superpowers`、`verification-before-completion`、`writing-plans`、`writing-skills`。
- `using-superpowers`（起動ルール）: 「1% でも該当する可能性があればそのスキルを使わなければならない」という強制文言があり、応答や行動（明確化の質問や下調べを含む）の前に必ずスキルを確認させる。process スキル（brainstorming、systematic-debugging など）が implementation スキルより先に来る優先順位を明記し、"Let's build X" → まず brainstorming、"Fix this bug" → まず systematic-debugging、という具体例を示す。ハーネスごとの特別対応は `references/codex-tools.md` などに分離。
- `brainstorming`: 実装より前に必ず人間の承認を取る `<HARD-GATE>` を持つ。要求を Spike（実現可能性を答えるだけ）などの経路に分類し、宣言してから質問する。
- インストール方法はハーネスごとに異なり、公式マーケットプレイス（`/plugin install superpowers@claude-plugins-official`）、専用マーケットプレイス（`obra/superpowers-marketplace`）、各 CLI 固有のプラグイン/拡張機構（`devin plugins install obra/superpowers`、`gemini extensions install https://github.com/obra/superpowers` など）を個別に持つ。
- ライセンスと商用サポート: MIT。README は sales@primeradiant.com への企業向け商用サポートの案内を持つ。

## 具体的な値・ルール（あれば）

`using-superpowers` の Red Flags 表（合理化して確認を飛ばそうとする思考とその反論、抜粋）。

| Thought | Reality |
|---|---|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "This doesn't need a formal skill" | If a skill exists, use it. |

インストールコマンド例。

```bash
# Claude Code（公式マーケットプレイス）
/plugin install superpowers@claude-plugins-official

# Claude Code（専用マーケットプレイス経由）
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace

# Antigravity
agy plugin install https://github.com/obra/superpowers

# Devin CLI
devin plugins install obra/superpowers
```

## AwesomeDS への反映

- 記録: 「process スキルが implementation スキルより先に来る」という優先順位ルールは、本リポジトリの `awesome-ds` / `ds-creator` / `design-thinking` / `design-verifier` の呼び出し順序を今後整理する際の参考として記録する。現状は各スキルの `description` による自動発火に任せており、AwesomeDS 本体や Plugin の変更提案はしない（反映不要）。
- 記録: `<HARD-GATE>` のように「承認が出るまで実装に進まない」という明文化されたゲートは、`design-verifier` が敵対的検証で止める設計と考え方が近い。比較参照として記録するのみで、変更提案はしない。
- 反映不要: Superpowers はデザイントークンや UI ルールを一切持たない、汎用 SDLC 方法論のため、AwesomeDS の値そのものに影響する事実はない。

## 出典

- https://github.com/obra/superpowers : リポジトリ本体。282,566 stars、Shell、MIT、最終 push 2026-09-04（GitHub 検索 API で確認）。
- https://raw.githubusercontent.com/obra/superpowers/main/README.md : ワークフロー概要、対応ハーネス一覧、インストール方法。`git clone` で取得。
- https://raw.githubusercontent.com/obra/superpowers/main/skills/using-superpowers/SKILL.md : 強制起動ルールと Red Flags 表。取得済み。
- https://raw.githubusercontent.com/obra/superpowers/main/skills/brainstorming/SKILL.md : brainstorming の HARD-GATE と経路分類。取得済み。
