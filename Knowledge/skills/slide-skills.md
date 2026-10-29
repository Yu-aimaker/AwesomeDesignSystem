---
title: "人気のスライド作成Skill"
category: skills
type: guideline
sources:
  - url: https://github.com/zarazhangrui/frontend-slides
    title: "zarazhangrui/frontend-slides"
  - url: https://raw.githubusercontent.com/zarazhangrui/frontend-slides/main/README.md
    title: "Frontend Slides README"
  - url: https://github.com/chuspeeism/dashi-ppt-skill
    title: "chuspeeism/dashi-ppt-skill"
  - url: https://raw.githubusercontent.com/chuspeeism/dashi-ppt-skill/main/README.md
    title: "Dashi PPT Skill README"
  - url: https://github.com/Gabberflast/academic-pptx-skill
    title: "Gabberflast/academic-pptx-skill"
  - url: https://raw.githubusercontent.com/Gabberflast/academic-pptx-skill/main/README.md
    title: "Academic Presentations Skill README"
  - url: https://github.com/ItsssssJack/power-design
    title: "ItsssssJack/power-design"
  - url: https://raw.githubusercontent.com/ItsssssJack/power-design/main/README.md
    title: "Power Design README"
  - url: https://github.com/addsumtech/slides_maker
    title: "addsumtech/slides_maker"
  - url: https://raw.githubusercontent.com/addsumtech/slides_maker/main/README.md
    title: "slide-maker README"
  - url: https://github.com/archlizheng/frontend-slides-editable
    title: "archlizheng/frontend-slides-editable"
  - url: https://raw.githubusercontent.com/archlizheng/frontend-slides-editable/main/README.md
    title: "Frontend Slides Editable README"
  - url: https://github.com/anthropics/skills
    title: "anthropics/skills"
  - url: https://raw.githubusercontent.com/anthropics/skills/main/skills/pptx/SKILL.md
    title: "pptx SKILL.md"
tags: [slides, skill, catalog, pptx, html]
updated: 2026-10-14
---

# 人気のスライド作成Skill

## 概要

スライドを作る公開 Skill の一覧。stars とライセンスは 2026-10-14 の GitHub API。README の主張は同日に raw を開いて確認した。AwesomeDS のデッキ手順は `Plugin/awesome-ds/skills/slides/SKILL.md`。この一覧はそれを置き換えない。

## 要点

検索は `slides skill claude`、並びは stars（2026-10-14）。スライド Skill 以外（Office 一式、モーション動画）は入れていない。`robonuggets/marp-slides` は API で 324 stars だったが、main の README は 404 だったので表に入れない。

| 名前 | stars | 最終 push | ライセンス | 何をするか | URL |
|---|---|---|---|---|---|
| Frontend Slides | 30,596 | 2026-06-23 | MIT | HTML 1枚。16:9 固定。pptx からの変換。紫グラデーションを避ける | https://github.com/zarazhangrui/frontend-slides |
| Dashi PPT Skill | 9,473 | 2026-09-12 | AGPL-3.0 | HTML デッキと、編集できる PPTX への書き出し。書き出しエンジンは専有で、Skill の外へ切り出して再配布しない | https://github.com/chuspeeism/dashi-ppt-skill |
| Academic Presentations | 1,176 | 2026-07-14 | MIT | 学会・ゼミ向け。題は結論の文。面は白。色は3色まで | https://github.com/Gabberflast/academic-pptx-skill |
| Power Design | 728 | 2026-08-10 | README は MIT。API の license は NOASSERTION | スライド 20 規則と Web 20 規則。紫グラデーションと、6項目の箇条書きを避ける | https://github.com/ItsssssJack/power-design |
| slide-maker | 556 | 2026-10-10 | MIT | 編集できる PPTX。16:9 以外の比率もある。LibreOffice と Python 依存がある | https://github.com/addsumtech/slides_maker |
| Frontend Slides Editable | 529 | 2026-07-01 | MIT（README は親と同じ、と書く） | frontend-slides の派生。生成後にブラウザで編集する | https://github.com/archlizheng/frontend-slides-editable |
| Anthropic pptx | 親リポ 180,922 | 2026-10-09 | API の license は空 | `.pptx` の読み書き。新規は pptxgenjs | https://github.com/anthropics/skills/blob/main/skills/pptx/SKILL.md |

入れ方（README より、2026-10-14）。

- Frontend Slides: `/plugin marketplace add https://github.com/zarazhangrui/frontend-slides`
- slide-maker: `npx skills add addsumtech/slides_maker`。Claude Code なら `/plugin marketplace add addsumtech/slides_maker` のあと `/plugin install slide-maker@slides-maker`。依存は README の LibreOffice、SVG のラスタライザ、`skills/slide-maker/requirements.txt`
- Academic Presentations: ZIP を claude.ai の Customize、Skills に入れる。marketplace の1行は README にない
- Anthropic pptx: 親は `anthropics/skills`。キャンバスは `LAYOUT_16x9`（10 x 5.625 インチ）。色は `#` なしの6桁

### 良い例と悪い例

出典は上の README。数値の正本は AwesomeDS の slides Skill。

| | スライド |
|---|---|
| 悪い | 題が「結果」だけのラベル。面が紫のグラデーション。1枚に箇条書きが6つ |
| どこがダメか | Academic Presentations は題を結論の文にする。Frontend Slides と Power Design は紫のグラデーションを避ける。Power Design は 6 項目の箇条書きを避ける |
| 良い | 題は「未収は3件減った」のような文。面は白、文字は濃い。1枚に主張は1つ。比率は 16:9 |

Academic Presentations は白地、サンセリフ1種、色は3色まで、と README が書く。AwesomeDS のアクセントはリンクか、その枚の数字1つに限る。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| 確認日 | 2026-10-14 |
| 検索 | GitHub `slides skill claude`、stars 順 |
| 採用の下限 | README を開けたものだけ。404 の marp-slides は除外 |
| AwesomeDS の既定 | HTML 1枚、白 `#ffffff`、文字 `#0a0a0a`、16:9、1枚1主張 |

## AwesomeDS への反映

- 反映不要: トークンは変えない。手順の正本は Plugin の slides Skill。
- 反映済み: この一覧。サイトの `/slides` は変えていない。

## 出典

- https://api.github.com/search/repositories?q=slides+skill+claude&sort=stars : 候補の検索（2026-10-14）。
- https://api.github.com/repos/zarazhangrui/frontend-slides : stars 30,596、push 2026-06-23、MIT。
- https://raw.githubusercontent.com/zarazhangrui/frontend-slides/main/README.md : 16:9、紫グラデーションを避ける、marketplace の入れ方。
- https://api.github.com/repos/chuspeeism/dashi-ppt-skill : stars 9,473、push 2026-09-12、AGPL-3.0。
- https://raw.githubusercontent.com/chuspeeism/dashi-ppt-skill/main/README.md : AGPL-3.0 と、書き出しエンジンが専有である例外。
- https://api.github.com/repos/Gabberflast/academic-pptx-skill : stars 1,176、push 2026-07-14、MIT。
- https://raw.githubusercontent.com/Gabberflast/academic-pptx-skill/main/README.md : action title、白地、色は3色まで、ZIP での導入。
- https://api.github.com/repos/ItsssssJack/power-design : stars 728、push 2026-08-10、license フィールドは NOASSERTION。
- https://raw.githubusercontent.com/ItsssssJack/power-design/main/README.md : 紫グラデーションと six-bullet heroes を避ける。License 節は MIT。
- https://api.github.com/repos/addsumtech/slides_maker : stars 556、push 2026-10-10、MIT。
- https://raw.githubusercontent.com/addsumtech/slides_maker/main/README.md : 16:9 以外の比率、`npx skills add`、marketplace、実行時の依存。
- https://api.github.com/repos/archlizheng/frontend-slides-editable : stars 529、push 2026-07-01、MIT。
- https://raw.githubusercontent.com/archlizheng/frontend-slides-editable/main/README.md : frontend-slides からの派生。License 節は MIT。
- https://api.github.com/repos/anthropics/skills : stars 180,922、push 2026-10-09、license フィールドは空。
- https://raw.githubusercontent.com/anthropics/skills/main/skills/pptx/SKILL.md : pptx の読み書き。
