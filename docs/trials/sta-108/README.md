# STA-108 設定画面の試作

別のリポジトリに `Plugin/awesome-ds` を入れ、設定画面を 1 枚作った。画面は本サイトには載せていない。試作リポジトリは手元の git だけで、push していない。公開リポジトリにはしていない。

## 手順

1. Vite、React、TypeScript、Tailwind CSS v4 で空のリポジトリを作る。
2. `Plugin/awesome-ds` を `plugin/awesome-ds` へコピーする。
3. `ds/tokens/tokens.css` と `ds/tokens/tailwind.css` を `src/styles/` へコピーする。`tokens.css` の先頭に、AwesomeDS v0.5.0 からの同期である旨を書く。
4. `@fontsource-variable/geist`、`@fontsource-variable/noto-sans-jp`、`@fontsource-variable/geist-mono` を入れる。Fontsource の家族名は `Geist Variable` なので、`globals.css` で `--ds-font-sans` をその名前にする。
5. 設定画面を書く。項目は表示名、週次メール、密度、テーマ。保存先はブラウザの localStorage。
6. `design-verifier` の static-audit、contrast、capture をそのリポジトリで実行する。

手元のコミットは `ab8e1a9`。このリポジトリには手順とスクショと検証結果だけを入れる。

## 結果

静的検査は 0 件。トークン色の割合は 100%。コントラストは 48 組で失敗 0。

390、768、1280 のライトとダークで、コンソールエラーは 0、横方向のはみ出しは 0。表示名を空にして離すとエラーが出て、文字を戻すと消える。保存すると「保存しました」になる。ダークを選ぶと `data-theme` が dark になる。

採点は [design-review.md](design-review.md)。合計 56/60。S1 は 0。

Plugin の不足で画面が止まった箇所はない。フォント家族名の差は `skills/awesome-ds/reference/stack-wiring.md` に既にある。

## スクショ

静止画は次のとおり。

- [390 light](shots/390-light.png)
- [390 dark](shots/390-dark.png)
- [768 light](shots/768-light.png)
- [768 dark](shots/768-dark.png)
- [1280 light](shots/1280-light.png)
- [1280 dark](shots/1280-dark.png)
- [390 light focus](shots/390-light-focus.png)
