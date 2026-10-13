# STA-94 の4つの原因と追加機能の対応

4つの原因を、AwesomeDS の B1、B2、B3、B4 のどれが止めるかを示す。数値と禁止の正本は表のファイル。この表は画面を追加しない。他プロダクトのサイト実例は入れない。

## 現状（2026-10-14）

表のファイル、スキル、3つの経路は main にある。サイトは `/anti-slop`、`/report`、`/slides`（英語は `/en` 接頭辞）。配信は Cloudflare Workers Static Assets（[cloudflare-cutover.md](../ops/cloudflare-cutover.md)）。週次のデータの更新は [awesomeds-weekly-growth-spec.md](../specs/awesomeds-weekly-growth-spec.md) の冒頭。画面の見た目は STA-152 で 2026-10-15 以降に確認するまで変えない。子票 B1〜B4 は、この表だけでは Done にしない。

| 原因 | 止める追加 | リポにある実体 |
| --- | --- | --- |
| 日本語が変 | B1 | `Knowledge/skills/anti-ai-slop.md` の文章節。禁止語と Before / After は `AwesomeDS/foundations/content-and-tone.md`。原則 7 は `AwesomeDS/foundations/principles.md`。サイトは `/anti-slop`。 |
| 文章が多すぎる | B3、B4 | `Plugin/awesome-ds/skills/html-report/SKILL.md` は結論を3文にし、本文を日本語 1,500 字以内にする。`Plugin/awesome-ds/skills/slides/SKILL.md` は1枚に主張1つ、スライド本文は日本語 40 字まで。サイトは `/report` と `/slides`。 |
| 可視化が見にくく分かりにくい | B1、B3、B4 | B1 は紫のグラデーション、暗いメッシュ、同じカード3枚を退ける。B3 は結論の直後に図か表を1つ置く。B4 は白地に濃色の文字で、1枚に主張1つ。 |
| バグやミス、ツッコミどころがある | B2 | `Plugin/awesome-ds/skills/design-verifier/SKILL.md` が `Plugin/awesome-ds/skills/design-verifier/scripts/static-audit.mjs` と `Plugin/awesome-ds/skills/design-verifier/scripts/capture.mjs` で画面を検査する。 |
