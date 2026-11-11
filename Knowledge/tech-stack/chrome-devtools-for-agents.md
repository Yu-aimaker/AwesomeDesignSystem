---
title: "Chrome DevTools for agents"
category: tech-stack
type: library
sources:
  - url: https://github.com/ChromeDevTools/chrome-devtools-mcp
    title: "ChromeDevTools/chrome-devtools-mcp"
  - url: https://developer.chrome.com/docs/devtools/agents
    title: "Chrome for Developers: DevTools for agents"
  - url: https://raw.githubusercontent.com/ChromeDevTools/chrome-devtools-mcp/main/README.md
    title: "README"
  - url: https://raw.githubusercontent.com/ChromeDevTools/chrome-devtools-mcp/main/LICENSE
    title: "Apache-2.0 LICENSE"
  - url: https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md
    title: "Configuration (--isolated)"
tags: [chrome-devtools, mcp, verification, apache-2.0, accessibility, performance]
updated: 2026-11-11
---

# Chrome DevTools for agents

## 概要

Chrome DevTools for agents（`chrome-devtools-mcp`）は、コーディングエージェントから起動中の Chrome を操作し、コンソール、ネットワーク、スクリーンショット、パフォーマンストレースを読む MCP サーバーと CLI である。AwesomeDS のスクリーンショット手順（Playwright）はそのまま残し、接続済みのときに追加で読む。

## 要点

- ライセンスは Apache-2.0。GitHub API（2026-11-11）: 55,099 stars、最終 push 2026-11-11、archived ではない。
- README は、ブラウザの中身が MCP クライアントから見えると書く。個人情報を載せるプロファイルでは使わない。
- 使用統計は既定でオン。止めるフラグは `--no-usage-statistics`。環境変数 `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS` か `CI` でも止まる。
- 性能ツールはトレース URL を CrUX API へ送ることがある。止めるフラグは `--no-performance-crux`。
- `--isolated` は一時 user-data-dir を作り、ブラウザ終了時に消す。既定は false。個人のプロファイルは使わない。
- 同梱スキルに `a11y-debugging` がある（README の表、2026-11-11）。
- 文書: https://developer.chrome.com/docs/devtools/agents （HTTP 200、2026-11-11）。

## 具体的な値・ルール（あれば）

| フラグ | 効果 | 確認 |
|---|---|---|
| `--isolated` | 一時プロファイル | docs/configuration.md |
| `--no-usage-statistics` | 使用統計を止める | README |
| `--no-performance-crux` | CrUX 送信を止める | README |

## AwesomeDS への反映

- 反映済み: `design-verifier` は、MCP が既に接続されているとき、コンソール、通信、アクセシビリティツリー、トレースを追加で読む。隔離プロファイル、使用統計オフ、私的なページでは CrUX オフ。Playwright のキャプチャは残す。
- 反映不要: このリポジトリの CI へ MCP を既定では入れない。

## 出典

- https://raw.githubusercontent.com/ChromeDevTools/chrome-devtools-mcp/main/README.md : 機能、統計、CrUX、スキル名（2026-11-11）。
- https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md : `--isolated`（2026-11-11）。
- https://raw.githubusercontent.com/ChromeDevTools/chrome-devtools-mcp/main/LICENSE : Apache-2.0（2026-11-11）。
- https://github.com/ChromeDevTools/chrome-devtools-mcp : API（2026-11-11）。
- https://developer.chrome.com/docs/devtools/agents : HTTP 200（2026-11-11）。
