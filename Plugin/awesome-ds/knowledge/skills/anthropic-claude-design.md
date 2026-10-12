---
title: "Claude Design (Anthropic)"
category: skills
type: product
sources:
  - url: https://code.claude.com/docs/en/skills
    title: "Claude Code docs: Agent Skills (SKILL.md format, no design skill documented here)"
  - url: https://animaapp.com/blog/ai-design-en/claude-design-review-features-pros-cons-and-best-alternatives/
    title: "Anima blog: Claude Design Review (third-party, found via web search, page itself not fetchable from this session)"
  - url: https://www.datacamp.com/blog/claude-design
    title: "DataCamp: What Is Claude Design? (third-party, found via web search, page itself not fetchable from this session)"
  - url: https://pub.towardsai.net/anthropic-launched-a-design-tool-that-reads-your-codebase-and-builds-your-brand-into-every-prototype-187bc9032433
    title: "Towards AI: Anthropic's Claude Design launch article (third-party, found via web search, page itself not fetchable from this session)"
tags: [claude-design, anthropic, canvas, artboards, design-tool, research-preview, closed-source]
updated: 2026-09-07
---

# Claude Design (Anthropic)

## 概要

Claude Design は Anthropic Labs が公開したビジュアルキャンバスのワークスペースで、claude.ai/design に単独の URL を持つ研究プレビュー製品。GitHub 上に公開リポジトリはなく（`anthropics` org の公開リポジトリを検索したが design canvas 関連は見つからなかった）、closed-source の SaaS 機能として提供される。Anthropic の一次情報源（anthropic.com、claude.com）は本セッションのプロキシでアクセスできず、以下は WebSearch で得られた複数の第三者記事の要約に基づく。事実確認の強度が Knowledge の他エントリより弱いことを明記する。

## 要点

- WebSearch の要約によれば、2026-04-17 に Anthropic Labs から研究プレビューとして公開された。Claude と対話しながらデザイン、プロトタイプ、スライド、ワンページャーなどのビジュアル成果物を作る専用ワークスペース。
- キャンバスとアートボードの概念を持ち、独自のプロジェクト構造とエクスポートメニューを持つ。使用量は通常のチャットや Claude Code の上限とは別に計測される（third-party 記事の記述、Anthropic 公式ページで未確認）。
- `/design` スキルは Claude Code のコマンドラインとデスクトップアプリに同じアートボード的ワークフローを持ち込むと third-party 記事は説明するが、`code.claude.com/docs/en/skills`（Claude Code の公式スキル文書、本セッションで取得済み）には design skill、canvas、artboard への言及が見つからなかった。この食い違いは記録として残す。
- 操作フロー（third-party 記事）: 要望を記述 → 初回案をレビュー → チャット、インラインコメント、直接編集、Claude が生成する調整スライダーで改善する。コードリポジトリを紐付けると、実際の React コンポーネントを読んでプロジェクトのデザインシステムを適用できるとされる。
- 提供対象は Claude Pro / Max / Team / Enterprise。無料枠には含まれないと third-party 記事は報告する。
- Agent Skills の一般仕様（`code.claude.com/docs/en/skills`、確認済み）: `agentskills.io` のオープン標準に従い、`SKILL.md` に YAML frontmatter（`name`、`description`、`disable-model-invocation`、`allowed-tools`、`context: fork`、`arguments` など）と Markdown 本文を持つ。配置先は個人（`~/.claude/skills/`）、プロジェクト（`.claude/skills/`）、Enterprise（管理設定）、プラグイン（`<plugin>/skills/`）の 4 段。この一般仕様自体は本リポジトリの `Plugin/awesome-ds/skills/*/SKILL.md` の構成と一致する。

## 具体的な値・ルール（あれば）

該当なし。Claude Design 自体の具体的なトークン値、API、UI 仕様は一次情報源が未取得のため記載できない。Agent Skills の SKILL.md 一般仕様のみ確認済み。

```yaml
---
name: skill-name
description: What the skill does
disable-model-invocation: true   # optional
allowed-tools: [...]             # optional
context: fork                    # optional, isolated subagent context
---
```

## AwesomeDS への反映

- 反映不要: Claude Design はプロプライエタリな SaaS 機能であり、AwesomeDS のトークンやルールに転用できる具体的な値を一次情報源から確認できていない。
- 記録: 「コードリポジトリを読んで実際のコンポーネントにブランドを適用する」という third-party 記事の説明は、`ds-creator` スキルがプロダクトのブランドを聞き取って DESIGN.md を生成する設計と方向性が近い。ただし一次情報源未確認のため、AwesomeDS や `ds-creator` の変更提案はしない。
- 記録: Agent Skills の一般仕様（SKILL.md、4 段の配置場所）は確認済みであり、本リポジトリの `Plugin/awesome-ds/skills/` の構成がこの仕様に従っていることの追加出典として記録する（反映不要、既存構成の裏付け）。

## 出典

- https://code.claude.com/docs/en/skills : Claude Code の公式 Agent Skills 文書。SKILL.md の形式、配置場所を取得済み（2026-09-07 に fetch）。design skill / canvas / artboard への言及は本文中に見つからなかった。
- https://animaapp.com/blog/ai-design-en/claude-design-review-features-pros-cons-and-best-alternatives/ : WebSearch の検索結果に含まれたタイトルと URL。ページ本体は本セッションのプロキシで取得不可のため、WebSearch が返した要約のみを参照した。
- https://www.datacamp.com/blog/claude-design : 同上。ページ本体は取得不可、WebSearch の要約のみ参照。
- https://pub.towardsai.net/anthropic-launched-a-design-tool-that-reads-your-codebase-and-builds-your-brand-into-every-prototype-187bc9032433 : 同上。ページ本体は取得不可、WebSearch の要約のみ参照。
- 補足: www.anthropic.com と claude.com は本セッションのプロキシで "EGRESS_BLOCKED" となり、一次情報源に到達できなかった（2026-09-07 に確認）。GitHub 上にも `anthropics` org の design canvas 関連リポジトリは見つからなかった。
