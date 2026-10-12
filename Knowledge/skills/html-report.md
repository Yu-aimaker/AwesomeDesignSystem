---
title: "HTMLレポート"
category: skills
type: guideline
sources:
  - url: https://github.com/anthropics/skills
    title: "anthropics/skills"
  - url: https://raw.githubusercontent.com/anthropics/skills/main/README.md
    title: "anthropics/skills README"
  - url: https://raw.githubusercontent.com/anthropics/skills/main/skills/web-artifacts-builder/SKILL.md
    title: "web-artifacts-builder SKILL.md"
  - url: https://www.anthropic.com/news/create-files
    title: "Claude can now create and edit files"
tags: [html-report, skill, anthropic, artifacts, white-canvas]
updated: 2026-10-11
---

# HTMLレポート

## 概要

報告を、人がブラウザで読む HTML 1 枚にするやり方。Anthropic は文書スキル（docx、pdf、pptx、xlsx）を `anthropics/skills` で公開し、複雑な画面は `web-artifacts-builder` が React を 1 枚の `bundle.html` にまとめる。AwesomeDS の報告はそれより狭い。状態もルーティングも要らないので、トークンを CSS 変数にした静的な 1 枚にする。

## 要点

- `anthropics/skills` の README（2026-10-11 取得）: 文書作成スキルは source-available。Claude の文書機能の実体だと書いてある。導入は `/plugin marketplace add anthropics/skills`。
- `web-artifacts-builder`（同日 raw を取得）: React 18、TypeScript、Vite、Tailwind、shadcn/ui。`scripts/init-artifact.sh` のあと `scripts/bundle-artifact.sh` で `bundle.html`。単純な 1 枚の HTML には使わない、と description が言う。
- 同じ SKILL.md の Design 節: AI slop として、中央寄せの多用、紫グラデーション、均一な角丸、Inter を避ける。
- GitHub API（2026-10-11）: `anthropics/skills` は 180,427 stars、最終 push 2026-10-09。
- AwesomeDS の報告の形: 結論 3 文、図か表を 1 つ、本文は短く、大きな面は白、文字は濃い。Skill は `Plugin/awesome-ds/skills/html-report/SKILL.md`。
- ニュース記事 https://www.anthropic.com/news/create-files は README が文書スキルの出典としてリンクしている。本文はこのセッションでは取得していない。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| 報告の入れ物 | HTML 1 枚。React バンドルは使わない |
| キャンバス / 文字 | `#ffffff` / `#0a0a0a` |
| アクセント | `#2f5bea`。リンクだけ |
| 結論 | 3 文。先に置く |
| 本文 | 日本語 1,500 字未満を目安 |
| 幅 | `max-width: 40rem`。390px で横スクロールしない |

## AwesomeDS への反映

- 反映不要: トークンは変えない。報告の手順は Plugin の Skill に置いた。
- 反映不要: サイトの報告ページ（別の変更で作る）。

## 出典

- https://raw.githubusercontent.com/anthropics/skills/main/README.md : 文書スキルの位置づけと marketplace の入れ方（2026-10-11）。
- https://raw.githubusercontent.com/anthropics/skills/main/skills/web-artifacts-builder/SKILL.md : 手順、スタック、AI slop の 4 項目（2026-10-11）。
- https://api.github.com/repos/anthropics/skills : stars 180,427、push 2026-10-09（2026-10-11）。
- https://www.anthropic.com/news/create-files : README からのリンク。本文は未取得。
