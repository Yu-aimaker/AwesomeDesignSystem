# Plugin: awesome-ds

AwesomeDS を Claude Code（と Cursor）で使うためのプラグインです。デザインシステム本体のコピー、5 つのスキル、Cursor 用ルールを 1 つのフォルダに同梱しています。

**English summary:** `awesome-ds` is a Claude Code plugin that bundles the AwesomeDS design system (a synced copy of `../AwesomeDS/`), five skills (apply the DS, create a brand DS by interview, adversarial screenshot review, UX design-thinking, knowledge curation) and Cursor rule files. Install from this repo's marketplace or load it locally with `--plugin-dir`.

## インストール（Claude Code）

```
/plugin marketplace add Yu-aimaker/AwesomeDesignSystem
/plugin install awesome-ds@awesome-design-systems
```

インストール後、スキルは `/awesome-ds:<skill>` で呼び出せます（他と名前が衝突しなければ `/<skill>` でも可）。

## ローカルで試す

```
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem
cd AwesomeDesignSystem
claude --plugin-dir ./Plugin/awesome-ds
```

検証は `claude plugin validate ./Plugin/awesome-ds`。

## Cursor で使う

```
mkdir -p .cursor/rules
cp Plugin/awesome-ds/cursor/*.mdc .cursor/rules/
mkdir -p design-system/awesome-ds && cp -R Plugin/awesome-ds/ds/. design-system/awesome-ds/
```

詳細は [`awesome-ds/cursor/README.md`](awesome-ds/cursor/README.md)。`awesome-ds.mdc` は tsx/css 編集時に自動で付き、他の 3 つは `@design-verifier` のようにメンションで呼び出します。

## スキル一覧

| スキル | 呼び出し | 1 行説明 |
|---|---|---|
| awesome-ds | 自動（UI を作る・直す時） | AwesomeDS を読み、スタックを検出してトークンを配線し、shadcn/ui をトークンで再スタイルし、禁止パターンを避け、チェックリストで締める |
| ds-creator | `/awesome-ds:ds-creator <製品名>` | 1 ターン 1 質問のインタビューでブランド用 DS を作る。DESIGN.md、tokens.css、tailwind.css、RATIONALE.md、preview.html を出力し、コントラストを計算で検証 |
| design-verifier | `/awesome-ds:design-verifier <url>` | 静的監査 + Playwright で 390/768/1280 × light/dark を撮影 + ルーブリック採点。`design-review.md` に file:line 付きの指摘と修正リストを出す |
| design-thinking | `/awesome-ds:design-thinking <機能>` | ペルソナ、ユーザーストーリー、ジャーニーマップ、Mermaid の画面フロー、スクリーンショットのウォークスルー、影響×工数で並べた提案を `docs/ux/` に出す |
| knowledge-curator | `/awesome-ds:knowledge-curator <url or weekly>` | Knowledge/ にエントリを追加し、Reference/REFERENCE.md を更新し、AwesomeDS 変更を CHANGELOG 付きで提案。週次リサーチ用（手動呼び出しのみ） |

すべてのスキルは日本語での指示に対応しています。

## DS コピーの同期

`awesome-ds/ds/` は `../AwesomeDS/` のコピーです。マーケットプレイスからインストールした時にプラグイン単体で完結するために同梱しています。

- 更新: `bash Plugin/awesome-ds/scripts/sync-ds.sh`（`rsync -a --delete`）
- 検証: `bash Plugin/awesome-ds/scripts/check-sync.sh`（差分があれば exit 1。CI で使う）

`ds/` を直接編集しないでください。変更は `AwesomeDS/` に対して行い、同期スクリプトで反映します。

## 構成

```
Plugin/
  README.md
  awesome-ds/
    .claude-plugin/plugin.json
    README.md
    ds/                      AwesomeDS のコピー（sync-ds.sh で生成）
    scripts/sync-ds.sh, check-sync.sh
    skills/
      awesome-ds/            SKILL.md, reference/stack-wiring.md, reference/anti-patterns.md
      ds-creator/            SKILL.md, templates/, reference/interview-guide.md, scripts/contrast.mjs
      design-verifier/       SKILL.md, reference/rubric.md, reference/capture-playbook.md, scripts/capture.mjs, scripts/static-audit.mjs
      design-thinking/       SKILL.md, templates/, reference/methods.md
      knowledge-curator/     SKILL.md, templates/entry.template.md
    cursor/                  README.md と .mdc ルール 4 本
```

## 必要なもの

- Claude Code 2.1 以上
- Node.js 18 以上（contrast.mjs、static-audit.mjs、capture.mjs）
- スクリーンショットを撮る場合: `npm i -D playwright && npx playwright install chromium`
