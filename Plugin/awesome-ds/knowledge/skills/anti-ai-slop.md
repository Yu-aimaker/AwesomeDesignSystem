---
title: "脱AIスロップ"
category: skills
type: guideline
sources:
  - url: https://github.com/Leonxlnx/taste-skill
    title: "Leonxlnx/taste-skill"
  - url: https://github.com/ibelick/ui-skills
    title: "ibelick/ui-skills"
  - url: https://github.com/anthropics/skills
    title: "anthropics/skills"
  - url: https://raw.githubusercontent.com/anthropics/skills/main/skills/web-artifacts-builder/SKILL.md
    title: "web-artifacts-builder SKILL.md"
  - url: https://github.com/53able/no-ai-slop-ja
    title: "53able/no-ai-slop-ja"
  - url: https://raw.githubusercontent.com/53able/no-ai-slop-ja/main/README.md
    title: "no-ai-slop-ja README"
  - url: https://github.com/imxv/Pretty-mermaid-skills
    title: "imxv/Pretty-mermaid-skills"
  - url: https://raw.githubusercontent.com/imxv/Pretty-mermaid-skills/main/README.md
    title: "Pretty Mermaid README"
  - url: https://github.com/zarazhangrui/frontend-slides
    title: "zarazhangrui/frontend-slides"
  - url: https://raw.githubusercontent.com/zarazhangrui/frontend-slides/main/README.md
    title: "Frontend Slides README"
  - url: https://raw.githubusercontent.com/anthropics/skills/main/skills/pptx/SKILL.md
    title: "anthropics/skills pptx SKILL.md"
  - url: https://github.com/petergyang/no-ai-slop
    title: "petergyang/no-ai-slop"
  - url: https://github.com/miqdadbadjuber/anti-slop
    title: "miqdadbadjuber/anti-slop"
tags: [anti-slop, japanese, before-after, mermaid, slides, skill]
updated: 2026-10-14
---

# 脱AIスロップ

## 概要

モデルが繰り返す既定（紫のグラデーション、3 枚の同じカード、中身のない日本語）を、デザイン、コンポーネント、文章の 3 分野で Before / After にする一覧。数値と禁止項目の正本は `AwesomeDS/foundations/anti-patterns.md` と `content-and-tone.md`。ハックの出典を 1 か所にまとめる。サイトでは `/anti-slop` で見せる。

## 要点

- 2026-10-11 に GitHub API で確認した stars: taste-skill 94,574（最終 push 2026-10-09）、ui-skills 9,606（最終 push 2026-10-11）、anthropics/skills 180,427（最終 push 2026-10-09）、frontend-slides 30,450（最終 push 2026-06-23、MIT）、Pretty Mermaid 1,525（最終 push 2026-08-22、MIT）。
- 日本語専用でパターンが具体的だったのは `53able/no-ai-slop-ja`。検索 API の stars は 2（2026-10-14）。人気のリポジトリではない。21 パターンを README が列挙する。
- 英語の文章で stars が多いのは `petergyang/no-ai-slop`（12,303）。画面と文章とコメントをまとめて落とすのは `miqdadbadjuber/anti-slop`（6,011）。どちらも 2026-10-14 の GitHub API、MIT。詳細は `Knowledge/anti-slop/`。
- Anthropic の `web-artifacts-builder` は、AI slop として「中央寄せの多用、紫グラデーション、均一な角丸、Inter」を避けると SKILL.md に書く（2026-10-11 に raw を取得）。

### デザイン

| | 例 | どこがダメか |
|---|---|---|
| Before | 暗いメッシュの上に、中央の見出しと紫のグラデーション | taste-skill の Anti-Default。中身の決定がなく、モデルの既定に見える（`anti-patterns.md` の Visual） |
| After | 左揃え。背景は `canvas`。アクセント `#2f5bea` はリンク、フォーカス、選択だけ。主ボタンは黒地に白文字 | AwesomeDS 原則 3 と 7 |

### コンポーネント

| | 例 | どこがダメか |
|---|---|---|
| Before | div で描いた偽のダッシュボード。アイコンだけのナビ | 製品ではなく絵。タッチではホバーの説明が出ない（`anti-patterns.md` の Components） |
| After | 本物のコンポーネントか、ラベル付きの空スロット `<!-- TODO: hero image 1600x1200 -->`。ナビの項目には見える文字 | 同じファイルの置換 |

### 文章（変な日本語）

下は、よくあるパターンを組み合わせた作例。

| | 文 |
|---|---|
| Before | 本サービスは、あらゆるシーンにおいて、革新的でシームレスな体験を実現することができます。最新の機能にご注目ください。 |
| どこがダメか | 「ことができます」は空の名詞殻。`革新的` `シームレス` は禁止語（`content-and-tone.md`）。「注目」は根拠がない（no-ai-slop-ja の「注目されています」）。1 文に用事が 3 つある |
| After | 請求書を 3 分で作り、そのまま送れます。送ったあとの入金も 1 画面で確かめられます。 |

ボタンの対も同じ原則。

| Before | After |
|---|---|
| 体験をはじめる | 保存する |
| 正常に保存が完了しました | 保存しました |

### ハック

各 URL は 2026-10-11 に開いた。stars は同日の GitHub API。

| 用途 | 名前 | 入れ方 | URL |
|---|---|---|---|
| 日本語 | no-ai-slop-ja | `npx skills add 53able/no-ai-slop-ja --skill no-ai-slop-ja --global --yes` | https://github.com/53able/no-ai-slop-ja |
| taste | taste-skill | `npx skills add https://github.com/Leonxlnx/taste-skill` | https://github.com/Leonxlnx/taste-skill |
| デザイン監査 | ui-skills `baseline-ui` | `npx ui-skills`（詳細は Knowledge/skills/ui-skills.md） | https://github.com/ibelick/ui-skills |
| デザインの方向 | Anthropic `frontend-design` | `/plugin marketplace add anthropics/skills` | https://github.com/anthropics/skills |
| Mermaid | Pretty Mermaid | `npx skills add imxv/pretty-mermaid-skills@pretty-mermaid -g -y` | https://github.com/imxv/Pretty-mermaid-skills |
| スライド（HTML） | Frontend Slides | `/plugin marketplace add https://github.com/zarazhangrui/frontend-slides` | https://github.com/zarazhangrui/frontend-slides |
| スライド（pptx） | Anthropic `pptx` | document-skills。新規は pptxgenjs。既定キャンバスは 10 x 5.625 インチ | https://github.com/anthropics/skills/blob/main/skills/pptx/SKILL.md |
| 人気のリポジトリ（英語の文章） | No AI Slop | `npx skills add petergyang/no-ai-slop --skill no-ai-slop --global --yes` | https://github.com/petergyang/no-ai-slop |
| 人気のリポジトリ（画面・文章・コメント） | anti-slop | `npx antislop-ai` | https://github.com/miqdadbadjuber/anti-slop |

Pretty Mermaid の 6 種: Flowchart、Sequence、State、Class、ER、XY。テーマは 15（zinc、tokyo-night、catppuccin、github、solarized、nord、dracula、one-dark の明暗）。ブラウザ不要。Node 16 以上。

Frontend Slides は依存なしの HTML 1 枚、16:9 固定。README は紫グラデーションを避けると書く。大きな読み面を白基調にするのは AwesomeDS の原則で、この Skill の全プリセットがそうとは README からは確認できない。AwesomeDS のスライド Skill 側で白キャンバスを既定にする。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| アクセント | `#2f5bea`。リンク、フォーカス、選択だけ |
| 主ボタン | 黒地 `#0a0a0a`、文字 `#ffffff` |
| 本文の幅 | 65ch、左揃え |
| 日本語の 1 文 | 60 字未満（`content-and-tone.md`） |
| em dash | UI コピーに置かない |
| Mermaid の型 | 6（上記） |
| pptx 既定 | `LAYOUT_16x9` = 10 x 5.625 インチ。色は `#` なし 6 桁 |

## AwesomeDS への反映

- 反映済み (AwesomeDS 0.5.0, foundations/principles.md 原則 7): モデルの既定を設計判断にしない。
- 反映済み (AwesomeDS 0.5.0, foundations/content-and-tone.md): 日本語の Before / After を 2 行足した。
- 反映済み: サイトの `/anti-slop` ページ。トークンは変えない。

## 出典

- https://github.com/Leonxlnx/taste-skill : GitHub API、stars 94,574、push 2026-10-09（2026-10-11）。
- https://github.com/ibelick/ui-skills : GitHub API、stars 9,606、push 2026-10-11。
- https://github.com/anthropics/skills : README と GitHub API、stars 180,427、push 2026-10-09（2026-10-11）。
- https://raw.githubusercontent.com/anthropics/skills/main/skills/web-artifacts-builder/SKILL.md : AI slop の 4 項目（2026-10-11）。
- https://raw.githubusercontent.com/anthropics/skills/main/skills/pptx/SKILL.md : 既定キャンバスと色の書き方（2026-10-11）。
- https://raw.githubusercontent.com/53able/no-ai-slop-ja/main/README.md : 21 パターンとインストール（2026-10-11）。stars 2 は検索 API。
- https://raw.githubusercontent.com/imxv/Pretty-mermaid-skills/main/README.md : 6 種、15 テーマ、インストール（2026-10-11）。stars は API。
- https://raw.githubusercontent.com/zarazhangrui/frontend-slides/main/README.md : HTML 1 枚、16:9、インストール（2026-10-11）。stars は API。
- https://github.com/petergyang/no-ai-slop : GitHub API、stars 12,303、MIT（2026-10-14）。要点は `Knowledge/anti-slop/no-ai-slop.md`。
- https://github.com/miqdadbadjuber/anti-slop : GitHub API、stars 6,011、MIT、package 3.2.20（2026-10-14）。要点は `Knowledge/anti-slop/anti-slop.md`。
