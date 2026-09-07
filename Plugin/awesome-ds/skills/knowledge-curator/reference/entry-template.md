# Entry template and worked example

The raw fill-in-the-blanks template lives at `templates/entry.template.md`. This file shows the same shape filled in with a short real example, plus the checklist to run before you save the file. Use it as the thing you compare your draft against, not as a copy source (copy `templates/entry.template.md` instead so you do not carry over example text by accident).

## Worked example

```markdown
---
title: "Example Library"
category: component-libraries
type: library
sources:
  - url: https://github.com/example-org/example-library
    title: "example-org/example-library: one-line description from GitHub"
  - url: https://raw.githubusercontent.com/example-org/example-library/main/README.md
    title: "example-library README"
tags: [example-library, react, tailwind, registry]
updated: 2026-09-07
---

# Example Library

## 概要

Example Library は example-org が公開する React コンポーネント集。2 から 4 文で、何であるか、誰が作っているか、AI エージェントが UI を作る上でなぜ重要かを書く。

## 要点

- インストール: `npm install example-library`。
- コンポーネント数: 24（`src/components/` を数えた実測値）。
- ライセンス: MIT。stars: 1,234、最終 push: 2026-09-01（GitHub 検索 API で確認）。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| 既定の角丸 | 8px |
| 既定のアクセント | #2563eb |

## AwesomeDS への反映

- 反映不要: AwesomeDS のトークンと衝突する値はない。

## 出典

- https://github.com/example-org/example-library : README、stars、最終 push（GitHub 検索 API で確認、2026-09-07）。
- https://raw.githubusercontent.com/example-org/example-library/main/README.md : インストールと機能一覧。取得済み。
```

Notes on the example:

- Every claim in 要点 and 具体的な値・ルール traces to a source in 出典. If you cannot point to which source a number came from, do not write the number.
- `stars` and `最終 push` come from a live check (GitHub search API, `git clone` + inspection, or an equivalent verified read), never from memory or from a training-time guess. State the date you checked them.
- 具体的な値・ルール is optional (write it only when there are concrete values); the other four body sections are never optional.
- No em dash (—) anywhere in the body, frontmatter included. Use a comma, a period, or restructure the sentence.

## Pre-save checklist

Run this before writing the file, and again before calling `node scripts/build-reference.mjs`:

1. Does `Knowledge/<category>/` already exist? List it with Glob; do not invent a new category unless truly nothing fits (see SKILL.md section 2).
2. Did you Grep the title and the primary URL across `Knowledge/**/*.md` for an existing entry? If one exists, update it instead of creating a duplicate.
3. Is `category` in the frontmatter exactly the folder name (case-sensitive, no trailing slash)?
4. Is `type` one of `repo | library | skill | article | product | guideline | design-system`?
5. Does every entry in `sources` have both a `url` (http or https) and a `title`?
6. Are `tags` 3 to 8 lowercase kebab-case items, reusing existing tags where they fit (`grep '^tags:' -A2 Knowledge/**/*.md` or read `Reference/REFERENCE.md`)?
7. Is `updated` today's date, `YYYY-MM-DD`?
8. Are all four required headings present in this exact form: `## 概要`, `## 要点`, `## AwesomeDS への反映`, `## 出典`?
9. Did you search the body for `—` (U+2014) and remove every instance?
10. Does `AwesomeDS への反映` say exactly one of `反映済み (...)`, `提案: ... → ...`, or `反映不要: ...` per bullet, and does every `提案:` line also appear as a change in section 3 (or explicitly deferred with a reason)?
11. Run `node scripts/validate-knowledge.mjs` and fix everything it reports before running `node scripts/build-reference.mjs`.

If a step fails, fix the draft before moving to the next step; do not save a file that fails the checklist "for now."
