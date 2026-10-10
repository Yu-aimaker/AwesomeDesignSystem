# AwesomeDS ブランド素材

| ファイル | 用途 |
|---|---|
| `icon.svg` | 標準アイコン。OS のダークモードで白タイルに切り替わる。`web/public/favicon.svg` と同一 |
| `icon-light.svg` | 明るい背景用（黒タイル）。固定色 |
| `icon-dark.svg` | 暗い背景用（白タイル）。固定色 |
| `banner-light.png` / `banner-dark.png` | ルート README のバナー（2560x800、2x）。GitHub の `<picture>` でテーマ別に出し分ける |
| `banner.html` | バナーの元データ |
| `render.sh` | `banner.html` から PNG を再生成する（headless Chrome、Google Fonts 取得にネットワークが必要） |

## 設計

- マーク: 角丸 8/32 のタイルに幾何学的な「A」。横棒だけをアクセント `#2f5bea` にし、「アクセントは 1 色だけ」という AwesomeDS の規則をそのまま形にした。
- 色・角丸・書体は `AwesomeDS/tokens/tokens.css` と同じ値（canvas、ink、hairline、accent、Geist + Noto Sans JP）。
- 16px でも「A」の形が読める線幅にしている。暗い背景では黒タイルが沈むので、`icon.svg` は `prefers-color-scheme: dark` で反転する。

## 再生成

```
bash docs/assets/brand/render.sh
```
