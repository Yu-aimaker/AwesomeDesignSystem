# STA-53 監査: /sources の 27 件は AwesomeDS に効いているか

- 日付: 2026-10-08
- 対象: `web/src/lib/design-systems.ts` の flagship 27 件（PR #9 時点）
- 方法: 各ソースについて、対応する Knowledge エントリの「AwesomeDS への反映」節、`AwesomeDS/DESIGN.md`、`AwesomeDS/foundations/*.md`、`AwesomeDS/components/README.md` での引用を突き合わせた。foundations の出典節に URL が出るかは `grep` で数えた。

## 結論

1. 27 件すべてに Knowledge エントリがあり、採用 / 翻案 / 不採用が書かれている。値の吸収はおおむね十分。
2. 欠けていたのはサイト側の接続。`/sources` のカードは外部リンクだけで、AwesomeDS が何を採ったかに辿れなかった。
3. 内容の欠けで最も大きいのは「通知の使い分け」。Carbon / Atlassian / Primer / GOV.UK の 4 件がそろって詳しく書いている領域だが、AwesomeDS には Toast の仕様しかなく、インライン / バナー / トースト / ダイアログの選び方がなかった。
4. `/foundations` の「ほかの観点」14 件は GitHub の `blob/main` にリンクしていた。リポジトリは private なので、サイト訪問者には 404 だった。

## ソース別

度合い: 採用 = 値や規則をそのまま使う、翻案 = 考え方を取り値は変える、参照のみ = Brief が指名したら公式パッケージを使う。

| ソース | 度合い | 既に AwesomeDS にあるもの | 欠け | 対応 |
|---|---|---|---|---|
| Apple HIG | 採用 | 44px ターゲット、色だけで伝えない、モーション原則 | なし | カードに記録 |
| Material 3 | 採用 | 時間の刻み、ダークの面明度、角丸の刻み、密度 | なし | カードに記録 |
| Vercel Geist | 採用 | Geist、4px 余白、ink の主ボタン | なし | カードに記録 |
| shadcn/ui | 採用 | 既定コンポーネント層、無彩色 primary | なし | カードに記録 |
| Goodpatch | 採用 | 和文行間 1.8、palt は見出しのみ | なし | カードに記録 |
| Duolingo | 翻案 | 失敗に優しい文言、色だけで伝えない | 祝福表現の扱いが未記載 | feedback.md「Celebration」 |
| デジタル庁 | 採用 | トークン階層、44px、全角入力の正規化 | なし | カードに記録 |
| Fluent 2 | 参照のみ | stack.md の指名時ルール | なし | カードに記録 |
| Carbon | 採用 | 文字サイズの合意、密度 | 通知パターン未吸収 | feedback.md |
| Polaris | 採用 | 罫線 1px / フォーカス 2px、トークン分離 | なし | カードに記録 |
| Primer | 採用 | 行間トークン | 通知とトーストの a11y 未吸収 | feedback.md、Toast 仕様修正 |
| Atlassian | 翻案 | 比較表のみ | 時限消去の禁止、警告とエラーの書き分け | feedback.md |
| Stripe | 採用 | tabular-nums、ink の影、1 バンド 1 CTA | なし | カードに記録 |
| Linear | 採用 | 罫線優先、アクセントを希少に | なし | カードに記録 |
| SmartHR | 採用 | ブランド色を primary にしない、2px フォーカス | なし | カードに記録 |
| Adobe Spectrum | 参照のみ | 振る舞いはプリミティブに任せる | なし | カードに記録 |
| Ant Design | 参照のみ | 別系統として記録 | なし | カードに記録 |
| Base UI | 採用 | 代替プリミティブ、data-* 状態 | なし | カードに記録 |
| Radix | 採用 | 既定プリミティブ、状態の 1 段ルール | なし | カードに記録 |
| GOV.UK | 翻案 | 指名時ルール、44px | バナー 1 つ、検証エラーはサマリー | feedback.md |
| USWDS | 参照のみ | Public Sans、指名時ルール | なし | カードに記録 |
| GitLab Pajamas | 参照のみ | 正本をコードに置く | なし | カードに記録 |
| Nord | 参照のみ | Web Components の記録 | なし | カードに記録 |
| Inclusive Components | 採用 | セマンティック HTML 優先、ラベル常時表示 | なし | カードに記録 |
| Laws of UX | 採用 | Fitts / Hick / Proximity の対応表 | なし | カードに記録 |
| Refactoring UI | 採用 | 階層の作り方、余白スケール | なし | カードに記録 |
| Nielsen 10 | 採用 | レビュー観点 | なし | カードに記録 |

集計: 採用 18、翻案 3、参照のみ 6。

## 優先度付きの改善

| 優先 | 内容 | 本 PR |
|---|---|---|
| P1 | `/sources` カードに度合い、1 行の要旨、Knowledge の記録へのリンクを載せる | 済 |
| P1 | `AwesomeDS/foundations/feedback.md` を追加し、DESIGN.md 8 と components/README.md Toast を揃える（v0.3.0） | 済 |
| P1 | `/foundations`「ほかの観点」のリンクを private な GitHub からサイト内の `/knowledge/awesomeds/<slug>` に変える | 済 |
| P2 | foundations の出典節に、比較表でしか触れていない Polaris / Primer / Atlassian / Stripe / Linear の URL を足す（DESIGN.md の主張と出典をつなぐ） | 次回 |
| P2 | コンポーネントの成熟度表示（Primer、Carbon、Atlassian が公開している alpha / beta / stable / deprecated）を components/README.md に定義する | 次回 |
| P3 | Polaris の toast 仕様は shopify.dev に移って取得できなかった。取得できたら feedback.md の出典に追加 | 保留 |
| P3 | 薄い foundations（imagery、internationalization、layers、density は 50 行未満）に例と画面写真を足す | 次回 |

## 検証

- `node scripts/validate-knowledge.mjs`、`node scripts/validate-data.mjs`、`node scripts/build-reference.mjs`（差分なし）、`bash Plugin/awesome-ds/scripts/check-sync.sh`、`node scripts/check-links.mjs`
- `cd web && pnpm typecheck && pnpm build`
- feedback.md の出典 URL は 2026-10-08 に取得して内容を確認した。
