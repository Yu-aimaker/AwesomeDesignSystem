# Cloudflare から Vercel への戻し

AwesomeDS（https://awesomeds.yumaker.studio）を Cloudflare Workers Static Assets に切り替えたあと、本番を Vercel に戻す手順の正本です。移行計画（2026-10-11 の読み取り棚卸し）の §6 を、DNS のレコード値と確認コマンドまで含めてここに固定します。

発動条件: 本番の 5xx、白画面、アセット 404、ルートの不一致、証明書エラー、転送の誤り、または Sir / Jarvis の指示。判断から 10 分以内に R1 から R3 まで終える。DNS の TTL は全レコード Auto（応答 300 秒）のまま。事前に下げる必要はない。どちらの向きでも旧向き先が生きているので、空白時間は出ない。

触らないもの: `api` / `gpu-api` / `ssh-gpu` / `line` の Tunnel CNAME、TXT `_vercel` ×4、ゾーンの SSL / HSTS 設定、linear-grok-relay、Vercel 側のドメイン登録。apex の A と www の CNAME は値を変えない。一致確認だけする。

## 戻し後の DNS

ゾーン `yumaker.studio`（id `c1a402ec676bb003dfa92e672eabd332`）。値は 2026-10-11 の `cf dns records list` 時点。

| record id | 戻し後 | proxy | TTL |
|---|---|---|---|
| `77b5fdc26bf6c99ee31df7866f0278b2` | `CNAME` `awesomeds.yumaker.studio` → `9f78d866e8562a1a.vercel-dns-017.com` | OFF（DNS only） | Auto |
| `4476578663be4019a4d1e885ef67881a` | `CNAME` `awesome-design-system.yumaker.studio` → `1f17e96dd40531da.vercel-dns-017.com` | OFF（DNS only） | Auto |
| `3ae87182cb8829ff250d833d162a6118` | `A` `yumaker.studio` → `76.76.21.21`（移行で値を変えない。一致だけ確認） | ON | Auto |
| `acfb4966aa418accd2d830a53cdb462b` | `CNAME` `www.yumaker.studio` → `cname.vercel-dns.com`（同上） | ON | Auto |

## R0. Vercel が pause 済みなら先に再開する

プロジェクト `awesome-design-systems-claude`（id `prj_DeivC43MpipiBZWuOe5kbIjh9kKw`）、team `yus-projects-9bf1ac09`。

Dashboard → Project → Settings で再開する。本番デプロイが Ready になってから確認する。`vercel.app` は SSO 付きなので確認に使わない。

```bash
curl -sI --resolve awesomeds.yumaker.studio:443:216.198.79.65 \
  https://awesomeds.yumaker.studio/
```

期待: `HTTP/2 200`（または `HTTP/1.1 200`）、`server: Vercel`。

## R1. 本番ホストを Vercel に戻す

1. Worker Route `awesomeds.yumaker.studio/*` を削除する。Dashboard → Workers → `awesomeds` → Settings → Domains & Routes。この時点で Cloudflare は proxy 経由で Vercel に流す。
2. record `77b5fdc26bf6c99ee31df7866f0278b2` を上の表どおりに戻す。値と TTL は変えず、proxy だけ OFF にする。他のレコードは触らない。

5 分以内に確認する。

```bash
curl -sI https://awesomeds.yumaker.studio/
```

期待: `server: Vercel`、`x-vercel-id` がある、`x-robots-tag: noindex, nofollow`。

## R2. 転送を Vercel に戻す

1. Redirect ルール `awesomeds host redirects` を無効化する（削除でもよい）。
2. record `4476578663be4019a4d1e885ef67881a` を上の表どおり、proxy OFF、TTL Auto に戻す。
3. apex（`3ae87182cb8829ff250d833d162a6118`）と www（`acfb4966aa418accd2d830a53cdb462b`）は値が表と一致することだけ確認する。

```bash
for host in awesome-design-system.yumaker.studio yumaker.studio www.yumaker.studio; do
  for path in / '/foo/bar?x=1'; do
    echo "== $host$path"
    curl -sI "https://$host$path"
  done
done
```

期待: 3 ホスト × 2 パスが `308` で `location: https://awesomeds.yumaker.studio` に同じパスとクエリを付けた URL。`awesome-design-system` は `server: Vercel`。apex と www は `server: cloudflare` 経由で Vercel の 308。`http://` でも同じ転送になる。

## R3. 再発防止

routes を足した PR を revert してマージする。しないと次の main デプロイで Route が再作成される。急ぐ場合は Workers Builds の自動ビルドを OFF にする（Settings → Build。Disconnect ではない）。

Worker `awesomeds` と workers.dev、プレビューは残してよい。本番ホストには影響しない。

Linear の移行票に発動時刻、原因、curl の証跡を書き、Jarvis へ詰まりとして報告する。

## 注意

- TXT `_vercel` ×4 と Vercel 側のドメイン登録は消さない。消すと戻しのときに Vercel の再検証が要る。
- proxy ON の間、Vercel は `awesomeds` の証明書を HTTP-01 で更新できない（Route が `/.well-known/` も受ける）。証明書は 2026-10-08 発行の推定で、失効は 2027-01 上旬の見込み。それ以降に戻す場合は R1 のあと、Vercel の Domains で再検証する（TXT `_vercel` を使う）。
- Tunnel 4 レコードとゾーン設定は、この手順でも触らない。

## 関連

切替手順（pause は切替確認のあと）: [cloudflare-cutover.md](cloudflare-cutover.md)

ヘッダとステータスの再確認（本番 URL とプレビュー URL）:

```bash
node scripts/hosting-smoke.mjs https://awesomeds.yumaker.studio https://<preview-host>
```

引数が 1 つのときはその URL だけを検査する。CI はこのスクリプトの単体テストだけを実行し、ネットワークには出ない。
