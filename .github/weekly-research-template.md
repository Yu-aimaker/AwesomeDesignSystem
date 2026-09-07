## 今週のリサーチ

AwesomeDS を最新のベストプラクティスに保つための定期チェックです。Claude Code で `/awesome-ds:knowledge-curator` を起動し、この Issue 番号を渡してください。確認対象の一覧は `Plugin/awesome-ds/skills/knowledge-curator/reference/watchlist.md` にもまとまっています。

### 自動実行について

リポジトリの Secrets に `ANTHROPIC_API_KEY` を設定すると、この Issue を開くジョブとは別に `.github/workflows/weekly-research.yml` の `research` ジョブが同じスケジュールで自動的に動きます。`anthropics/claude-code-action@v1` が knowledge-curator スキルの週次ルーティンをそのまま実行し、ランキングの更新（`node scripts/fetch-repos.mjs`）、新規/更新エントリの追加、`Reference/REFERENCE.md` の再生成までを行い、最後に PR を開きます。人がこの Issue を見て手動で起動する必要はなくなりますが、Issue 自体は変更のログとして毎週引き続き開かれます。`ANTHROPIC_API_KEY` が未設定の場合、`research` ジョブは失敗せずスキップされます（設定は任意です）。

### 確認する更新
- [ ] shadcn/ui, Radix, Base UI のリリースノート
- [ ] Motion, GSAP, Lottie, three.js のリリースノート
- [ ] Tailwind CSS, Next.js, Vite のリリースノート
- [ ] Apple Human Interface Guidelines, Material Design の更新
- [ ] WCAG / W3C の更新
- [ ] 新しく公開されたデザインシステム、DESIGN.md コレクションの追加分
- [ ] awesome-design-md / awesome-design-md-jp / taste-skill の変更
- [ ] Agent Skills 系リポジトリの更新（ui-skills, archify, superpowers など。一覧は watchlist.md）
- [ ] `AwesomeDS/data/repos.json` のランキング（`node scripts/fetch-repos.mjs` の実行結果、fetchErrors の有無）

### 成果物
- [ ] Knowledge/ に新規または更新エントリ（出典リンク付き）
- [ ] `node scripts/validate-knowledge.mjs` が通ることを確認
- [ ] `node scripts/build-reference.mjs` を実行して Reference と Knowledge/README を再生成
- [ ] AwesomeDS への変更提案があれば DESIGN.md / tokens / foundations を更新し CHANGELOG に追記
- [ ] Plugin 内の DS コピーを `Plugin/awesome-ds/scripts/sync-ds.sh` で同期
- [ ] PR を作成し、この Issue にリンク
