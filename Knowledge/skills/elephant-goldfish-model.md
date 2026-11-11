---
title: "Elephant-Goldfish Model"
category: skills
type: skill
sources:
  - url: https://github.com/google/elephant-goldfish-model
    title: "google/elephant-goldfish-model"
  - url: https://egm.dev
    title: "egm.dev"
  - url: https://raw.githubusercontent.com/google/elephant-goldfish-model/main/README.md
    title: "README"
  - url: https://raw.githubusercontent.com/google/elephant-goldfish-model/main/LICENSE
    title: "Apache-2.0 LICENSE"
tags: [skill, review, specification, apache-2.0]
updated: 2026-11-11
---

# Elephant-Goldfish Model

## 概要

Elephant-Goldfish Model は、仕様を書いてから、前の会話を持たない別の文脈で読み直すオープンソースのプラグインである。README は、Google の公式サポート製品ではないと書く。ライセンスは Apache-2.0。レビューはテストの代わりにはならない。

## 要点

- GitHub API（2026-11-11）: 17,473 stars、最終 push 2026-11-11、archived ではない、license は Apache-2.0。
- Elephant はプロジェクトの文脈を持って仕様を書く。Goldfish は文書と参照されたソースだけを見て、前の会話なしで欠落やリスクを探す。決めるのは人間。
- README のレビューは、設計、明確さ、コードとの適合、実装計画を見る、と書く。レビュースキルは 5 段階と書く。段階の名前はこの回ではスキル本文を開いていないので、ここへは写さない。
- スキル名は Brainstorm、Draft、Resolve、Bootstrap、Review、Review loop、Drift report（README の表、2026-11-11）。
- サイト: https://egm.dev （HTTP 200、2026-11-11）。

## AwesomeDS への反映

- 反映不要: プラグインの導入。仕様や実装メモを、前の会話なしで読み直すやり方は参照に留める。テストと `design-verifier` は残す。

## 出典

- https://raw.githubusercontent.com/google/elephant-goldfish-model/main/README.md : 役割、スキル名、公式製品ではないこと、テストの代わりにならないこと（2026-11-11）。
- https://raw.githubusercontent.com/google/elephant-goldfish-model/main/LICENSE : Apache-2.0（2026-11-11）。
- https://github.com/google/elephant-goldfish-model : API（2026-11-11）。
- https://egm.dev : HTTP 200（2026-11-11）。
