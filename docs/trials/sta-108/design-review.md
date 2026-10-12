# Design review: 設定画面、2026-10-12

DS は `Plugin/awesome-ds/ds/DESIGN.md`。ルートは `/`。幅は 390、768、1280。配色は light と dark。スクショは `shots/`。

## 見たこと

390 のライトでは、見出し、説明、表示名、通知、密度、テーマ、保存ボタンが最初の画面に入る。主ボタンは黒地に白文字。カードに影はない。

390 のダークでは同じ並びで、地は黒、保存ボタンは白地に黒文字。テーマの選択はダークになっている。

1280 のライトとダークでも、テーマのラジオと保存ボタンはフッターの上に見える。カードは左揃えで、入力欄は名前の長さに合わせてある。

768 ではフッターの上に余白がある。フォーカス時は表示名の枠に青の輪が出る。`shots/390-light-focus.png`。

## Scores, 0-5

| Section | Score | Worst finding |
| --- | --- | --- |
| hierarchy | 5 | |
| alignment | 5 | |
| rhythm | 4 | S3 group gap |
| contrast | 5 | |
| density | 5 | |
| consistency | 5 | |
| states | 5 | |
| first-viewport hero | 5 | |
| copy | 5 | |
| japanese typography | 5 | |
| ds conformance | 4 | S3 resting accent |
| human comfort | 3 | S2 compact target |
| Total | 56/60 | S1 0, S2 1, S3 2 |

## Findings, severity 1 to 3

S2 compact-target. 密度をコンパクトにすると操作の高さが 40px になり、390px 幅で求める 44px より低い。標準の高さは 48px。場所は `Plugin/awesome-ds/ds/tokens/tokens.css:138`。規則は design-verifier rubric の human comfort。直すなら、コンパクトでも min-height を 44px 以上にする。

S3 group-gap. グループの間隔が 16px で、forms のグループ間隔 32px より狭い。場所は `shots/390-light.png`。規則は `Plugin/awesome-ds/ds/foundations/forms.md:19`。直すなら、画面の高さを足してグループ間隔を 32px に戻す。

S3 resting-accent. 静止時にアクセント色の要素がない。フォーカス輪は `--ds-focus-ring` で、色はアクセントと同じ。場所は `shots/390-light.png` と `shots/390-light-focus.png`。規則は DESIGN.md の accent で、対象は links と focus と selection。直すなら、遷移先のあるリンクを 1 つ置く。

## Fix list, one PR each

1. コンパクト密度の操作高さを 44px 以上にする。トークンを変えるなら AwesomeDS 側の別 PR。
2. グループ間隔を 32px に戻す。390px の最初の画面からテーマが欠けないことを確認する。
3. 静止時のアクセントとして、本当に開くリンクを 1 つ足す。

## Human comfort

1. Yes. 保存するは 390 の最初の画面にあり、ラベルは保存する。
2. No. ユーザー操作なしで動くものはない。
3. Yes. body は 16px、行間は 28.8px。
4. Yes. 撮った画面の標準密度では操作が 48px。コンパクトは上の S2。
5. Yes. 見出し、説明 1 つ、保存するが 390 の最初の画面にある。`shots/390-light.png`。
6. Yes. `lang=ja`。本文の行間は 1.8。見出しの letter-spacing は 0。行頭の 。、」はない。

## Not checked

試作リポジトリは公開していない。本サイトのルートはこのレビューの対象外。ホバーと reduced-motion のキャプチャは取り、静止画との差はフォーカス輪だけだった。エラー文と「保存しました」はブラウザ操作で確認し、このスクショ一式には入れてない。
