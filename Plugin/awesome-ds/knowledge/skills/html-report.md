---
title: "HTMLレポート"
category: skills
type: guideline
sources:
  - url: https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html
    title: "Using Claude Code: The unreasonable effectiveness of HTML"
  - url: https://github.com/anthropics/claude-plugins-official/blob/main/plugins/session-report/skills/session-report/SKILL.md
    title: "session-report SKILL.md"
  - url: https://github.com/anthropics/skills
    title: "anthropics/skills"
  - url: https://raw.githubusercontent.com/anthropics/skills/main/README.md
    title: "anthropics/skills README"
  - url: https://raw.githubusercontent.com/anthropics/skills/main/skills/web-artifacts-builder/SKILL.md
    title: "web-artifacts-builder SKILL.md"
  - url: https://www.anthropic.com/news/create-files
    title: "Claude can now create and edit files"
tags: [html-report, skill, anthropic, artifacts, white-canvas]
updated: 2026-10-14
---

# HTMLレポート

## 概要

報告を、人がブラウザで読む HTML 1 枚にするやり方。Claude Code チームの Thariq Shihipar は、100 行を超える Markdown の計画より HTML の方が読まれやすいと公式ブログに書いた（2026-05-20）。AwesomeDS の報告は状態もルーティングも持たない。トークンを CSS 変数にした静的な 1 枚にする。

## 要点

- 公式ブログ（2026-10-14 に本文を取得）: Markdown は 100 行を超えると読まれない。HTML なら表、SVG、コード、リンクで同じ内容を短く見せられる。計画も報告も PR の説明も HTML にする。共有はファイルを開くだけで足りる。プロンプト例は「レートリミッタを 1 枚の HTML にする。トークンバケットの図、注釈付きのコード 3 から 4 個、末尾に注意点」。出典: https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html
- 公式プラグイン `session-report`（`anthropics/claude-plugins-official`、Apache-2.0、GitHub API 2026-10-14 で 37,809 stars、最終 push 2026-10-13）: セッション利用を自己完結の HTML にする。所見は 3 から 5 行、数字は合計トークンに対する割合。テンプレートの色は暗いターミナル（`--term-bg: #1a1918`、`--ivory: #FAF9F5`）。AwesomeDS はその配色を写さない。大きな面は白、文字は濃い。
- `create-files`（2025-09-09、本文は 2026-10-14 に取得）: Excel、文書、PowerPoint、PDF を作る機能。HTML レポートの話ではない。文書スキルの出典として README がリンクしているだけ。
- `anthropics/skills` の README（2026-10-11 取得）: 文書作成スキルは source-available。導入は `/plugin marketplace add anthropics/skills`。
- `web-artifacts-builder`（同日 raw を取得）: React 18、TypeScript、Vite、Tailwind、shadcn/ui。`scripts/init-artifact.sh` のあと `scripts/bundle-artifact.sh` で `bundle.html`。単純な 1 枚の HTML には使わない、と description が言う。Design 節は、中央寄せの多用、紫グラデーション、均一な角丸、Inter を避ける。
- GitHub API（2026-10-11）: `anthropics/skills` は 180,427 stars、最終 push 2026-10-09。
- AwesomeDS の報告の形: 結論 3 文、図か表を 1 つ、本文は短く、大きな面は白、文字は濃い。手順は `Plugin/awesome-ds/skills/html-report/SKILL.md`。

### 良い例と悪い例

数値の正本は Skill。ここは公式の言い方と、AwesomeDS が写さない点。

| | 例 | どこがダメか、または何が足りるか |
|---|---|---|
| 悪い例 | 100 行を超える Markdown の計画。図は ASCII。色は文字で代用する | 公式ブログが、長い Markdown は読まれず、ASCII 図は HTML より非効率だと書く |
| 悪い例 | 公式 `session-report` の暗いターミナル枠を、製品の報告にそのまま使う | テンプレートは利用量の画面用。AwesomeDS の大きな面は白、文字は `#0a0a0a` |
| 良い例 | 結論 3 文のあとに図か表を 1 つ。本文は日本語 1,500 字未満。出典 URL を末尾に置く | 公式の「1 枚で一度読む」と、Skill の順序が同じ |
| 良い例 | レートリミッタの説明を、流れの図と注釈付きコード 3 から 4 個と注意点に分ける | 公式ブログのプロンプト例。状態もルーティングも足さない |

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| 報告の入れ物 | HTML 1 枚。React バンドルは使わない |
| キャンバス / 文字 | `#ffffff` / `#0a0a0a` |
| アクセント | `#2f5bea`。リンクだけ |
| 結論 | 3 文。先に置く |
| 本文 | 日本語 1,500 字未満を目安 |
| 幅 | `max-width: 40rem`。390px で横スクロールしない |
| 写さない公式テンプレ | `session-report` の `--term-bg` `#1a1918` |

## AwesomeDS への反映

- 反映済み: 報告の手順は Plugin の Skill。トークンの値は変えない。
- 反映不要: サイトの `/report`。

## 出典

- https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html : Thariq Shihipar、2026-05-20。本文を 2026-10-14 に取得。100 行の Markdown、HTML の用途、レートリミッタのプロンプト。
- https://github.com/anthropics/claude-plugins-official/blob/main/plugins/session-report/skills/session-report/SKILL.md : 所見 3 から 5 行、割合で書く（2026-10-14 に raw を取得）。
- https://api.github.com/repos/anthropics/claude-plugins-official : stars 37,809、Apache-2.0、push 2026-10-13（2026-10-14）。
- https://raw.githubusercontent.com/anthropics/skills/main/README.md : 文書スキルの位置づけと marketplace の入れ方（2026-10-11）。
- https://raw.githubusercontent.com/anthropics/skills/main/skills/web-artifacts-builder/SKILL.md : 手順、スタック、AI slop の 4 項目（2026-10-11）。
- https://api.github.com/repos/anthropics/skills : stars 180,427、push 2026-10-09（2026-10-11）。
- https://www.anthropic.com/news/create-files : 2025-09-09。Excel、文書、PowerPoint、PDF。本文を 2026-10-14 に取得。HTML レポートの出典にはしない。
