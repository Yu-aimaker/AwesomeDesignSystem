---
title: "Appllama skills"
category: skills
type: skill
sources:
  - url: https://github.com/Appllama/appllama-skills
    title: "Appllama/appllama-skills"
  - url: https://raw.githubusercontent.com/Appllama/appllama-skills/main/README.md
    title: "README"
  - url: https://raw.githubusercontent.com/Appllama/appllama-skills/main/LICENSE
    title: "MIT LICENSE"
tags: [skill, appllama, react-native, expo, mit]
updated: 2026-11-11
---

# Appllama skills

## 概要

Appllama skills は、売上上位のモバイルアプリを調べ、Expo / React Native の画面を作るエージェントスキルである。Web の部品集ではない。見本帳としての Appllama（https://appllama.io）はサイト一覧に既にある。このエントリはそのスキルリポジトリである。

## 要点

- ライセンスは MIT。著作権は 2026 Antmind Ventures Private Limited。README は、名称とロゴの商標はライセンスに含まれないと書く。
- GitHub API（2026-11-11）: 5,113 stars、最終 push 2026-09-06、archived ではない、license は MIT。
- スキルは 2 つ。`appllama-usage` は調査、`appllama-app-design-skill` は Expo / React Native の画面、ナビゲーション、モーション、シミュレータでの流れ確認。
- インストール例: `npx skills@latest add appllama/appllama-skills`。デザインスキル単体は `--skill appllama-app-design-skill`。README は、デザインスキルが MCP なしでも動くと書く。
- MCP のエンドポイントは README にあり、Pro の有料機能で、呼び出しはクレジットを使う。AwesomeDS では有効にしない。

## AwesomeDS への反映

- 反映済み: `awesome-ds` は、この手順を Web の部品集として使わず、有料 MCP を有効にしない、と書く。調査して作り、流れ全体を確認する、という順番だけをネイティブアプリの参照として残す。
- 反映不要: Expo を AwesomeDS の Web スタックに足すこと。見本帳の行の複製。

## 出典

- https://raw.githubusercontent.com/Appllama/appllama-skills/main/README.md : 2 スキル、インストール、MCP が Pro であること（2026-11-11）。
- https://raw.githubusercontent.com/Appllama/appllama-skills/main/LICENSE : MIT（2026-11-11）。
- https://github.com/Appllama/appllama-skills : API（2026-11-11）。HTTP 200。
