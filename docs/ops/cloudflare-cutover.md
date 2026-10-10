# Vercel から Cloudflare への切替

AwesomeDS（https://awesomeds.yumaker.studio）を Cloudflare Workers Static Assets（Free）へ切り替える手順の正本です。本番は 2026-10-11 08:14 JST に切替済みです。下の手順は実施時の段取りで、結果は「実施記録」にあります。移行計画（2026-10-11）の §5 を、各段の確認コマンドまで含めてここに固定します。前の段の確認が通ってから次へ進む。

戻しは [cloudflare-rollback.md](cloudflare-rollback.md)。本番の 5xx、白画面、アセット 404、ルートの不一致、証明書エラー、転送の誤り、または Sir / Jarvis の指示なら、切替を続けず戻しに入る。

Vercel の pause は切替確認（C5 と C6）と観察（S8）のあとだけ行う。DNS 切替の直後には pause しない。

Cloudflare は無料プランのまま。Workers Paid、カード登録、新しい API トークンの作成はしない。DNS レコードの値、TTL、ゾーンの SSL / HSTS、Worker Route 以外のルート、ドメインの追加削除はしない。変えてよい DNS は次の 2 件の proxy だけ。

| record id | 切替で変えるもの | 値（変えない） |
|---|---|---|
| `77b5fdc26bf6c99ee31df7866f0278b2` | proxy OFF → ON（S6） | `CNAME` `awesomeds` → `9f78d866e8562a1a.vercel-dns-017.com`、TTL Auto |
| `4476578663be4019a4d1e885ef67881a` | proxy OFF → ON（S7、Redirect ルールのあと） | `CNAME` `awesome-design-system` → `1f17e96dd40531da.vercel-dns-017.com`、TTL Auto |

触らないもの（全段）:

- Tunnel の CNAME 4 件: `api` / `gpu-api` / `ssh-gpu` / `line`（`*.cfargotunnel.com`、proxy ON のまま）
- TXT `_vercel` ×4
- MX（このゾーンには無い。作らない）
- apex の TXT、および apex A `3ae87182cb8829ff250d833d162a6118`（`76.76.21.21`、proxy ON）と www CNAME `acfb4966aa418accd2d830a53cdb462b`（`cname.vercel-dns.com`、proxy ON）の値
- linear-grok-relay（別 Vercel プロジェクト。ドメインは vercel.app のみ）
- Vercel 側のドメイン登録（外さない。戻しに使う）

ゾーン `yumaker.studio`（id `c1a402ec676bb003dfa92e672eabd332`）。Worker 名 `awesomeds`。Vercel プロジェクト `awesome-design-systems-claude`（id `prj_DeivC43MpipiBZWuOe5kbIjh9kKw`、team `yus-projects-9bf1ac09`）。

## S0. 戻し手順を先に置く

Linear の移行票へ戻し全文を載せる作業は、Sir の指示があるときだけ行う。このリポジトリの戻し正本は [cloudflare-rollback.md](cloudflare-rollback.md)。

確認:

```bash
test -s docs/ops/cloudflare-rollback.md && echo rollback-present
```

期待: `rollback-present`。

## S1. 前提確認

#9 から #14 がマージ済みで、リポ名が `Yu-aimaker/AwesomeDesignSystem`、main の CI が緑であること。この段は何も変えない。

確認:

```bash
gh repo view Yu-aimaker/AwesomeDesignSystem --json nameWithOwner --jq .nameWithOwner
for n in 9 10 11 12 13 14; do
  gh pr view "$n" --repo Yu-aimaker/AwesomeDesignSystem --json number,state,mergedAt
done
gh run list --repo Yu-aimaker/AwesomeDesignSystem --branch main --limit 5
```

期待: `nameWithOwner` が `Yu-aimaker/AwesomeDesignSystem`。#9 から #14 の `state` が `MERGED`。main の直近 check が成功。

## S2. PR-A（ルートなし）

`feat/cf-workers-hosting`（この作業ブランチは `feat/sta-92-cf-workers`）で、`web/wrangler.jsonc`（`main` なし、`routes` なし）、`web/public/_headers`、`web/.assetsignore`、CI の `check-cf-assets.mjs` と `wrangler deploy --dry-run` を入れる。`vercel.json` は残す。README は Vercel と Cloudflare の並行中と書く。

確認（`web/`、Node 22）:

```bash
export PATH="$HOME/.local/opt/node-lts/bin:$PATH"
node -v
cd web && pnpm build && node ../scripts/check-cf-assets.mjs && pnpm exec wrangler deploy --dry-run
git grep -n '"routes"' -- web/wrangler.jsonc || echo 'no-routes'
```

期待（この段を実施した時点）: Node が v22。build と資産検査と dry-run が成功。`wrangler.jsonc` に `routes` が無い。`not_found_handling` を外すと `check-cf-assets.mjs` が exit 1 になる（検査を戻してから次へ）。切替後の `routes` は実施記録のとおり後から入れた。今の `check-cf-assets.mjs` は Worker Route が 1 件あることを要求する。

## S3. Workers Builds を接続する

ダッシュボード: Workers & Pages → Create → Import a repository。Worker 名 `awesomeds`。Production branch `main`、Root directory `web`、Build `pnpm build`、Deploy `pnpm exec wrangler deploy`、Preview `pnpm exec wrangler preview`、非本番ブランチのビルド ON。Build variable は `NODE_VERSION=22`。秘密は置かない。

GitHub App「Cloudflare Workers and Pages」の対象は、Sir の設定に従う。新しい API トークンは作らない。Cloudflare がビルド用トークンを自動作成したら、ゾーン範囲を `yumaker.studio` だけに絞る。無料プランのまま。

確認:

```bash
gh api repos/Yu-aimaker/AwesomeDesignSystem/issues/16/comments --jq '.[].body' | head
```

期待: PR-A に Cloudflare の Preview URL コメントがある。トークン値はログに出さない。

## C1. プレビューを画面確認する

ローカルの全ルート検査に加え、Preview URL のヘッダと深いリンクを見る。この段はデプロイしない。

確認:

```bash
export PATH="$HOME/.local/opt/node-lts/bin:$PATH"
cd web && pnpm exec node scripts/screenshot.mjs --check
cd ..
node scripts/preview-headers.mjs "https://<preview-host>"
node scripts/hosting-smoke.mjs "https://<preview-host>"
curl -sI "https://<preview-host>/en/sources"
curl -sI "https://<preview-host>/og-image.png"
```

`screenshot.mjs --check` はローカルの `vite preview` を見る（外部 URL は取らない）。Preview URL の画面は `node scripts/preview-pages.mjs "https://<preview-host>" <out-dir>`（390 / 1280、ライト / ダーク）。

期待: ローカル検査はコンソールエラー 0、横はみ出しなし。`/en/sources` と `/` は 200、`content-type` が HTML、`x-robots-tag: noindex, nofollow`。`/og-image.png` は 200、`image/png`。`/assets/*.js` は JavaScript。

## S4. PR-A をマージする

main が workers.dev にデプロイされる。カスタムドメインはまだ Vercel。マージは Sir の判断。main へ直接 push しない。

確認:

```bash
curl -sI https://awesomeds.yumaker.workers.dev/
curl -sI https://awesomeds.yumaker.studio/
```

期待: workers.dev が 200 で `server: cloudflare`。本番ホストはまだ `server: Vercel`（S6 の前）。

## C2. workers.dev と Vercel 本番を比べる

確認:

```bash
node scripts/hosting-smoke.mjs \
  https://awesomeds.yumaker.studio \
  https://awesomeds.yumaker.workers.dev
```

期待: ステータス、`x-robots-tag`、HSTS（`max-age=63072000`）、content-type が一致。`server` の差（Vercel と cloudflare）は失敗にしない。

## C3. 別 PR の Preview URL

別 PR（例: キャラ作業）で、PR-A とは別の Preview URL が出て、push で同じブランチ URL が更新されること。

確認:

```bash
gh pr view <number> --repo Yu-aimaker/AwesomeDesignSystem --comments
```

期待: Preview URL のコメントが 2 件以上、または同一ブランチ URL への更新コメントがある。

## S5. PR-B（Worker Route）

`web/wrangler.jsonc` に次だけを足してマージする。DNS が proxy OFF の間、ルートは本番ホストに効かない。

```jsonc
"routes": [{ "pattern": "awesomeds.yumaker.studio/*", "zone_name": "yumaker.studio" }]
```

Tunnel 用ホストのルートは足さない。

確認（読み取り）:

```bash
cf workers routes list -z yumaker.studio
```

期待: `awesomeds.yumaker.studio/*` が 1 件。他ゾーンのルートは増えていない。

## C4. 切替前のホスト名テスト（任意）

proxy OFF のまま、Cloudflare のエッジへ名前を向けて見る。効かなければ省略する。

確認:

```bash
curl --resolve awesomeds.yumaker.studio:443:104.21.1.222 \
  -sI https://awesomeds.yumaker.studio/
```

期待（効いた場合）: `server: cloudflare`。`x-vercel-id` は無い。

## S6. 本番ホストの DNS（proxy だけ）

record `77b5fdc26bf6c99ee31df7866f0278b2` の proxy を ON にする。値と TTL は変えない。他のレコードは触らない。

作業（Sir の切替実施時だけ）:

```bash
cf dns records edit 77b5fdc26bf6c99ee31df7866f0278b2 -z yumaker.studio \
  --body '{"proxied":true}'
```

確認:

```bash
cf dns records get 77b5fdc26bf6c99ee31df7866f0278b2 -z yumaker.studio
cf dns records list -z yumaker.studio
```

期待: 対象だけ `proxied: true`。content は `9f78d866e8562a1a.vercel-dns-017.com`、TTL は Auto。Tunnel 4 件、TXT、apex、www、MX は一覧の前後で同じ。

## C5. 本番ホストの切替確認

5 分以内に確認する。古い DNS キャッシュのクライアントは最大 300 秒 Vercel に届く。Vercel はまだ生きているので、ここでも pause しない。

確認:

```bash
curl -sI https://awesomeds.yumaker.studio/
curl -sI http://awesomeds.yumaker.studio/
curl -sI https://awesomeds.yumaker.studio/og-image.png
node scripts/hosting-smoke.mjs https://awesomeds.yumaker.studio
node scripts/preview-pages.mjs https://awesomeds.yumaker.studio /tmp/sta-92-cutover-shots
```

期待: HTTPS の `/` は 200、`server: cloudflare`、`x-robots-tag: noindex, nofollow`。HTTP は HTTPS へ転送される。`/og-image.png` は 200、`image/png`。画面は 390 / 1280、ライト / ダークでコンソールエラー 0。SNS カード（X / Slack）は `og:image` が `https://awesomeds.yumaker.studio/og-image.png` を指すこと。

## S7. 転送を Cloudflare の Redirect ルールへ移す

C5 が通ってから。Single Redirect を 1 本作り、そのあと `awesome-design-system` の proxy だけ ON にする。

- 名前: `awesomeds host redirects`
- フェーズ: `http_request_dynamic_redirect`
- 条件: `(http.host in {"yumaker.studio" "www.yumaker.studio" "awesome-design-system.yumaker.studio"})`
- 動作: `concat("https://awesomeds.yumaker.studio", http.request.uri.path)`、クエリ保持 ON
- 計画 §5 の目標ステータスは 308。2026-10-11 08:11 JST に入ったルールは 301（ruleset `1e453e5fd0fc4f879fd9e295189180b9`、rule `6485ea84044e4d129dca1314ff7f9845`）。確認は入っているルールのステータスを記録する。ステータスを直すための再適用は、この手順の再実行ではない

作業（Sir の切替実施時だけ。ルールが無いとき）:

```bash
cf dns records edit 4476578663be4019a4d1e885ef67881a -z yumaker.studio \
  --body '{"proxied":true}'
```

値と TTL は変えない。apex と www のレコードは編集しない（すでに proxy ON）。

確認:

```bash
cf rulesets entrypoint get http_request_dynamic_redirect -z yumaker.studio
cf dns records get 4476578663be4019a4d1e885ef67881a -z yumaker.studio
```

期待: ルール名 `awesomeds host redirects` が 1 本。対象 CNAME の content は `1f17e96dd40531da.vercel-dns-017.com`、`proxied: true`、TTL Auto。

## C6. 3 ホストの転送確認

確認:

```bash
for host in yumaker.studio www.yumaker.studio awesome-design-system.yumaker.studio; do
  for path in / /sources/ '/foo/bar?x=1'; do
    echo "== https://$host$path"
    curl -sI "https://$host$path"
    echo "== http://$host$path"
    curl -sI "http://$host$path"
  done
done
```

期待: 3 ホスト × 3 パスが、パスとクエリを保った `location: https://awesomeds.yumaker.studio...`。`server: cloudflare`。HTTP も同じ転送。ステータスは入っているルールの値（2026-10-11 実施分は 301）。Tunnel ホストにはこの curl を向けない。

## S8. 観察（24 から 72 時間）

Workers のエラーと、Sir / ボットからの不具合が無いこと。Tunnel 4 ホストは疎通だけ見る。レコードは編集しない。

確認:

```bash
for host in api.yumaker.studio gpu-api.yumaker.studio ssh-gpu.yumaker.studio line.yumaker.studio; do
  echo "== $host"
  curl -sI --max-time 15 "https://$host/" | head -n 15
done
```

期待: 切替前と同じ種別の応答（接続できること）。DNS の content は `*.cfargotunnel.com` のまま。観察メモを残す。この間も Vercel は pause しない。

## S9. Vercel を pause する（削除しない）

C5、C6、S8 の確認のあとだけ。プロジェクト `prj_DeivC43MpipiBZWuOe5kbIjh9kKw`（team `yus-projects-9bf1ac09`）を pause する。削除しない。ドメインは外さない。linear-grok-relay は開かない。

pause の直後に再確認する。

```bash
curl -sI https://awesomeds.yumaker.studio/
curl -sI "https://yumaker.studio/foo/bar?x=1"
curl -sI "https://www.yumaker.studio/"
curl -sI "https://awesome-design-system.yumaker.studio/"
```

期待: 本番は 200、`server: cloudflare`。3 転送は S7 のルールと同じステータスで `https://awesomeds.yumaker.studio` へ。linear-grok-relay の vercel.app は触っていないこと（設定画面を開いて変えていない）。

## S10. ドキュメントの片付け

README、`README.en.md`、`web/README.md`、`CLAUDE.md` のホスティング記述を Cloudflare Workers に更新する。`vercel.json` は戻し期間が終わるまで残す。

この更新は Worker Route を `wrangler.jsonc` に入れる変更と同じブランチ（`feat/sta-92-cf-workers`）で行う。

確認: その PR の CI が緑。Linear を Done にするのは Sir の指示があるときだけ。Jarvis へは完了を 1 本で報告する。

## 実施記録（2026-10-11）

- 時刻: 2026-10-11 08:14 JST に本番ホストを Worker `awesomeds` へ切替済み。
- 停止: 0 秒。既存 CNAME の値は変えず、Worker Route で受けた。
- 方式: ダッシュボードで Worker Route `awesomeds.yumaker.studio/*`（zone `yumaker.studio`）を作成した。`custom_domain` は使っていない。`web/wrangler.jsonc` の `routes` は同じ pattern と zone を後から入れる。マージ後の `wrangler deploy` がこの Route を消さない、ずれないようにするため。
- 転送: Cloudflare Single Redirect。apex（`yumaker.studio`）/ www / `awesome-design-system.yumaker.studio` は 301 で `https://awesomeds.yumaker.studio` へ（パスとクエリを保持）。ルール投入は 2026-10-11 08:11 JST（ruleset `1e453e5fd0fc4f879fd9e295189180b9`、rule `6485ea84044e4d129dca1314ff7f9845`）。
- 本番 URL: https://awesomeds.yumaker.studio
- workers.dev: https://awesomeds.yumaker.workers.dev
- プレビュー: Workers Builds が PR に Preview URL をコメントする。
- Vercel プロジェクト `awesome-design-systems-claude` は戻し用に残置する（削除しない。pause は S9 の確認のあとだけ）。

## 関連

戻し: [cloudflare-rollback.md](cloudflare-rollback.md)

ヘッダの再確認:

```bash
node scripts/hosting-smoke.mjs https://awesomeds.yumaker.studio https://<preview-host>
node scripts/preview-headers.mjs https://<preview-host>
```

CI は両スクリプトの単体テストだけを実行し、ネットワークには出ない。
