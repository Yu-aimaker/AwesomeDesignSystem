## 今週のリサーチ

AwesomeDS を最新のベストプラクティスに保つための定期チェックです。Claude Code で `/awesome-ds:knowledge-curator` を起動し、この Issue 番号を渡してください。確認対象の一覧は `Plugin/awesome-ds/skills/knowledge-curator/reference/watchlist.md` にもまとまっています。

### 実行について

この Issue はチェックリストです。調査は Claude Code で `/awesome-ds:knowledge-curator` を起動して行います。従量課金の無人調査ジョブは動かしていません。API キーを足して自動実行に戻さないでください。

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
