---
title: "脱AIスロップ"
category: skills
type: guideline
sources:
  - url: https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md
    title: "Anthropic frontend-design SKILL.md"
  - url: https://github.com/anthropics/skills/blob/main/skills/web-artifacts-builder/SKILL.md
    title: "Anthropic web-artifacts-builder SKILL.md"
  - url: https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb
    title: "Claude cookbooks: Prompting for frontend aesthetics"
  - url: https://github.com/Leonxlnx/taste-skill
    title: "Leonxlnx/taste-skill"
  - url: https://github.com/pbakaus/impeccable
    title: "pbakaus/impeccable"
  - url: https://github.com/Nutlope/hallmark
    title: "Nutlope/hallmark"
  - url: https://github.com/ibelick/ui-skills
    title: "ibelick/ui-skills (baseline-ui)"
  - url: https://github.com/Laith0003/ux-skill/wiki/How-to-detect-AI-slop-in-your-design
    title: "ux-skill wiki: How to detect AI slop in your design"
  - url: https://github.com/blader/humanizer
    title: "blader/humanizer"
  - url: https://github.com/petergyang/no-ai-slop
    title: "petergyang/no-ai-slop"
  - url: https://github.com/miqdadbadjuber/anti-slop
    title: "miqdadbadjuber/anti-slop"
  - url: https://github.com/vercel-labs/agent-skills
    title: "vercel-labs/agent-skills"
  - url: https://github.com/53able/no-ai-slop-ja
    title: "53able/no-ai-slop-ja"
  - url: https://github.com/textlint-ja/textlint-rule-preset-ai-writing
    title: "textlint-rule-preset-ai-writing"
  - url: https://github.com/coji/natural-japanese
    title: "coji/natural-japanese"
  - url: https://github.com/geonwoo-jeong/japanese-humanizer
    title: "geonwoo-jeong/japanese-humanizer"
  - url: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
    title: "Wikipedia: Signs of AI writing"
tags: [anti-slop, ai-defaults, before-after, japanese, copy, skill]
updated: 2026-10-15
---

# 脱AIスロップ

## 概要

生成 AI が既定で出しがちな見た目・部品・文章の一覧。製品や利用者で正解が変わるものは載せない。複数の出典が「AI の既定」と呼ぶ典型だけを集め、それぞれに直し方を付けた。数値と禁止項目の正本は `AwesomeDS/foundations/anti-patterns.md` と `content-and-tone.md`、原則は `principles.md` の原則 7。サイトでは `/anti-slop` で見せる。

## 要点

- 典型は「組み合わせ」で起きる。中央寄せのヒーロー単体は問題ではなく、中央寄せ → 同じカード 3 枚 → CTA → フッターの定型がそろうと AI の既定に見える（hallmark、taste-skill）。
- 「Inter を避けて」と頼むと、次の既定（Space Grotesk、Fraunces、Instrument Serif）に寄る（Claude cookbooks、taste-skill）。禁止リストを回すだけでは抜けない。ブリーフから選ぶ。
- 生成 AI 向けの既定のキットも新しく生まれている。クリーム色の背景＋高コントラストのセリフ＋テラコッタの差し色（frontend-design、taste-skill）。
- 文章は英語・日本語とも「中身のない言い回し」が中心。日本語では直訳調（〜することができます）、責任を隠す敬語、カタカナ抽象語の重なりが典型（no-ai-slop-ja、textlint ai-writing）。
- 個別の言葉（delve、em dash）だけで AI と決めつけない。Wikipedia の指針も記述であって禁止リストではない。ここでは「中身を薄くする書き方」として扱う。

### デザイン（見た目）

| パターン | 直し方 | 主な出典 |
|---|---|---|
| 紫から青のグラデーション | 単色のアクセント 1 つ。ブリーフにない装飾グラデーションは使わない | web-artifacts-builder、cookbooks、impeccable、baseline-ui、hallmark |
| 表示書体に Inter / Roboto / Arial / システム既定 | 意図して選んだ表示書体。Inter は本文まで | cookbooks、web-artifacts-builder、impeccable、hallmark、taste-skill |
| 「次の既定」の書体（Space Grotesk、Fraunces、Instrument Serif） | ブリーフとブランドから選ぶ | cookbooks、taste-skill |
| クリーム背景＋セリフ＋テラコッタのキット | ブリーフが求めるときだけ | frontend-design、taste-skill |
| グラデーション文字 | 単色。強弱は大きさと太さで | impeccable、hallmark、taste-skill |
| 飾りのガラス・ぼかし | 動く内容の上の重なりなど理由があるときだけ。普段は不透明な面 | taste-skill、impeccable |
| ネオンの光・光るボタン | 枠線か控えめな影。状態は色と文字で | impeccable、baseline-ui、taste-skill |
| どこも同じ大きな角丸 | 役割で角丸を変える | web-artifacts-builder、frontend-design、ux-skill |
| どこも同じ灰色の影、影＋枠＋色の重ね掛け | 面の分け方は 1 つ（影か枠か背景差） | frontend-design、ux-skill、taste-skill |
| カードの片側だけ太い色帯 | 外す。状態はアイコンと文字か、面全体の色 | impeccable、hallmark |
| 絵文字のアイコン（✨🚀⚡🔥） | 1 つのアイコンセットを同じ大きさで | hallmark、impeccable、taste-skill、ux-skill |
| 純黒・純白・無彩色の灰色、色地の上の灰色文字 | 中立色をブランドの色相にわずかに寄せる。色地のコントラストを測る | impeccable、hallmark、taste-skill |
| 飾りのメッシュ・ブロブ背景 | 無地か、意味のある画像 1 枚 | frontend-design、taste-skill、hallmark、ux-skill |
| 全セクションのフェードイン、全カードのホバー、バウンス | 動きは操作への応答だけ。`prefers-reduced-motion` を守る | frontend-design、impeccable、hallmark、baseline-ui |
| 字間を広げた大文字ラベル、飾りの等幅書体 | ラベルは普通の書き方。等幅はコードと数値だけ | frontend-design、impeccable |

### コンポーネントとレイアウト

| パターン | 直し方 | 主な出典 |
|---|---|---|
| 中央寄せヒーロー → 同じカード 3 枚 → CTA → フッター | 内容の順に並べる。ページごとにレイアウトの型を変える | hallmark、taste-skill、ux-skill、web-artifacts-builder |
| 角丸アイコンタイル＋見出し＋本文のカード 3 枚 | 主役に面積を割く。並列なら一覧か表 | impeccable、hallmark、taste-skill、ux-skill |
| 何でもカードで囲む、カードの入れ子 | 余白と区切り線。カードは 1 段まで | impeccable、hallmark |
| 見出しの上のアイブロウ・ピル（NEW、✨ Introducing） | 消す。必要な文脈は見出しか導入文に | impeccable、frontend-design、hallmark |
| 意味のない 01 / 02 / 03 | 番号は本当に順番があるときだけ | frontend-design、impeccable、taste-skill、hallmark |
| 大きな数字＋小さなラベルのヒーロー | 本物で出典のある数字が主題のときだけ | frontend-design、impeccable、hallmark |
| div で描いた偽の画面（ダッシュボード、偽ブラウザ枠） | 本物のスクリーンショットか、載せない | hallmark、taste-skill、impeccable |
| 作った社会的証明（ロゴの壁、推薦文、Trusted by 50,000+） | 許可を得た本物か、明示した仮置き。なければ外す | hallmark、taste-skill、ux-skill |
| すべてのボタンとリンクの末尾に → | 動詞で結果を言う。矢印は本当の移動だけ | frontend-design、ux-skill、taste-skill |
| 同じ高さ・余白・見出しのセクションの繰り返し | 主役の 1〜2 セクションを大きく。型を変える | ux-skill、hallmark、taste-skill |
| 空・読み込み中・エラー・無効の状態がない、ホバーでだけ出る操作 | 全状態を作る。空の状態には次の操作を 1 つ | ux-skill、baseline-ui、hallmark |

### 文章（英語）

| パターン | Before | After | 主な出典 |
|---|---|---|---|
| 誇大な動詞（Unlock、Elevate、Seamless、Supercharge） | Unlock seamless productivity | Approve invoices from email in one click | taste-skill、hallmark、ux-skill |
| 約束でなく分類の見出し | The AI-powered platform for modern teams | Close the month in 2 days | frontend-design ほか（検索のみ） |
| 「X ではなく Y だ」 | It's not just a tool, it's a partner. | It drafts replies; you approve them. | humanizer、Wikipedia |
| 無理な 3 つ並べ | Fast, secure, and scalable. | Deploys in 40 s. | humanizer、Wikipedia |
| em dash の多用 | Fast（em dash）and reliable. | Fast. Reliable under load. | taste-skill、humanizer |
| AI 語彙（delve、tapestry、pivotal、landscape） | Delve into the evolving landscape | See what changed in v3 | humanizer |
| 大げさな意義づけ | This marks a pivotal shift. | Exports now include tax IDs. | humanizer、Wikipedia |
| 仮の名前（John Doe、Acme） | John Doe, CEO at Acme | 地域に合った実在しそうな名前か、明示した仮置き | taste-skill、hallmark、ux-skill |
| 作った数字（99.9%、10x、+47%） | Trusted by 50,000+ teams | 本物になるまで外す | hallmark、ux-skill、taste-skill |
| 飾りの太字・絵文字の見出しと箇条書き | 🚀 **Fast** setup | Setup takes 5 minutes | humanizer、textlint ai-writing |
| チャットの残り（Great question!、I hope this helps） | Here's a quick overview! | 消す | humanizer、Wikipedia |
| 前置き（It's important to note） | It's important to note that exports are limited. | Exports are limited to 10k rows. | humanizer |

### 文章（日本語）

| パターン | Before | After | 主な出典 |
|---|---|---|---|
| 「〜することができます」 | 設定を変更することができます。 | 設定を変更できます。 | no-ai-slop-ja、textlint ai-writing、japanese-humanizer |
| 責任を隠す過剰な敬語 | こちらで確認させていただく形となっております。 | 担当者が確認します。 | no-ai-slop-ja、natural-japanese |
| 誇大語（革命的、次世代、可能性を解き放つ） | 業務をスーパーチャージします。 | 月次の照合作業を 2 日短縮します。 | textlint ai-writing、no-ai-slop-ja |
| カタカナ抽象語の重なり | アセットを活用し、シナジーのあるソリューションを提供します。 | 既存の顧客データで請求書を自動で作ります。 | no-ai-slop-ja、textlint ai-writing |
| 「単なる〜ではありません」 | これは単なるツールではありません。未来を変えるパートナーです。 | 返信の下書きを作り、承認後に送ります。 | no-ai-slop-ja、humanizer |
| 漢語＋「を行う」 | 課題の把握および改善の実施を行います。 | 課題を把握して改善します。 | no-ai-slop-ja、japanese-humanizer |
| 「の」の連鎖 | チームの開発の速度の改善の方法 | チームの開発速度を上げる方法 | no-ai-slop-ja、japanese-humanizer |
| 主体のない受け身、根拠のない権威 | 近年注目されています。 | 出典を添えるか、消す | no-ai-slop-ja、japanese-humanizer |
| 太字ラベル＋コロン、絵文字の箇条書き | ✅ 完了した項目 | 完了した項目 | textlint ai-writing、no-ai-slop-ja |
| 英語式のコロンでつなぐ | 実行します: | 実行方法は次のとおりです。 | textlint ai-writing |
| 同じ文末の繰り返し | 確認することが重要です。共有することが重要です。 | 確認と共有が重要です。 | no-ai-slop-ja、japanese-humanizer |
| 助走・劇的な断片・抽象的な締め | 答えは？ シンプルです。自動化。 | 答えは自動化です。 | no-ai-slop-ja、textlint ai-writing、humanizer |

### 製品や利用者で正解が変わるので、載せないもの

- ダークモード。アイコンだけのナビ（ツールチップとラベルがあれば密なアプリの標準）。中央寄せのヒーロー単体。ベントーグリッド。セリフの見出し。AI 機能の目印としての ✨（文字ラベルと組めば製品の判断）。OS に合わせたガラス表現。体言止めの見出し。「！」の多用（ブランドの声による）。

### ハック（入れる・読む）

| 名前 | 何をするか | 入れ方 |
|---|---|---|
| Anthropic frontend-design | AI に寄りがちな特徴を挙げ、設計で避けさせる | `/plugin marketplace add anthropics/skills` |
| taste-skill | 既定の書体・配色・カード・仮の名前を禁止 | `npx skills add https://github.com/Leonxlnx/taste-skill` |
| impeccable | 59 規則の検出器とデザインの床 | `npx impeccable install` |
| humanizer | 英語の AI 文 26 パターンを直す | `/plugin marketplace add blader/humanizer` |
| No AI Slop | 英語の文章から定型 10 型を外す。検出だけもできる | `npx skills add petergyang/no-ai-slop --skill no-ai-slop --global --yes` |
| anti-slop | 画面・文章・コードのコメントの既定を 38 規則で落とす | `npx antislop-ai` |
| hallmark | 58 項目のスロップテスト | `npx skills add nutlope/hallmark` |
| vercel-labs/agent-skills | UI の規則 100 以上（a11y、フォーカス、動き） | `npx skills add vercel-labs/agent-skills` |
| ui-skills (baseline-ui) | 頼まれない限りグラデーション・光・動きを足さない | `npx ui-skills get baseline-ui` |
| natural-japanese | 日本語のビジネス文の規則と lint | `npx skills add coji/natural-japanese` |
| textlint ai-writing | AI らしい日本語を lint で検出 | `npm i -D @textlint-ja/textlint-rule-preset-ai-writing` |
| no-ai-slop-ja | 日本語の 21 パターン、悪い例と良い例つき | `npx skills add 53able/no-ai-slop-ja --skill no-ai-slop-ja --global --yes` |
| japanese-humanizer | 翻訳調と冗長な言い回しを直す | `npx skills add geonwoo-jeong/japanese-humanizer` |

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| 載せる基準 | 2 つ以上の独立した出典が AI の既定と呼ぶもの |
| アクセント | 1 色。AwesomeDS の既定は `#2f5bea`（リンク・フォーカス・選択だけ） |
| 動き | 操作への応答だけ。全セクションのフェードインはしない |
| カード | 入れ子にしない。並列の 3 項目は一覧か表を先に検討 |
| 日本語の 1 文 | 60 字未満（`content-and-tone.md`） |

## AwesomeDS への反映

- 反映済み (AwesomeDS 0.5.0, foundations/principles.md 原則 7): モデルの既定を設計判断にしない。
- 反映済み: サイトの `/anti-slop` ページ。トークンは変えない。
- 個票: リポごとの導入方法、stars、規則の数は `Knowledge/anti-slop/`（Impeccable、natural-japanese、textlint ai-writing、Humanizer、stop-slop、yomiyasu、No AI Slop、anti-slop、調査のまとめ）。
- 反映不要: AwesomeDS の青いアクセント `#2f5bea` と黒の主ボタンは、紫から青のグラデーションの既定とは別物。

## 出典

確認の方法: GitHub 上のファイル（Anthropic の SKILL.md、cookbooks、taste-skill、impeccable、hallmark、ui-skills、humanizer、no-ai-slop-ja、No AI Slop と anti-slop（2026-10-14）、textlint ai-writing、natural-japanese、japanese-humanizer、ux-skill wiki）は 2026-10-13 に本文を読んだ。Wikipedia などその他のサイトは検索結果の要約だけで、本文は未確認。

- https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md : クリーム＋セリフ＋テラコッタ、同じ影、アイブロウ、01/02/03、→、フェードイン（2026-10-13）。
- https://github.com/anthropics/skills/blob/main/skills/web-artifacts-builder/SKILL.md : 中央寄せ、紫グラデーション、均一な角丸、Inter（2026-10-13）。
- https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb : 白地に紫グラデーション、避ける書体、次の既定への収束（2026-10-13）。
- https://github.com/Leonxlnx/taste-skill : 禁止する既定（書体、色、カード、光、仮の名前、数字、em dash）。stars 95.1k（2026-10-13）。
- https://github.com/pbakaus/impeccable : 検出器とデザインの床（片側の色帯、グラデーション文字、ガラス、アイブロウ、アイコンタイル）。stars 80.3k（2026-10-13）。
- https://github.com/Nutlope/hallmark : 58 項目のスロップテスト（定型の流れ、偽の画面、作った数字）。stars 30.0k（2026-10-13）。
- https://github.com/ibelick/ui-skills : baseline-ui（グラデーション・光・動きは頼まれたときだけ、空の状態）。stars 9.6k（2026-10-13）。
- https://github.com/Laith0003/ux-skill/wiki/How-to-detect-AI-slop-in-your-design : 約 35 の特徴と直し方（2026-10-13）。
- https://github.com/blader/humanizer : 英語の 26 パターン。stars 56.2k（2026-10-13）。
- https://github.com/petergyang/no-ai-slop : 英語の定型 10 型、編集と検出。stars 12,303、MIT（2026-10-14 の GitHub API）。個票は `Knowledge/anti-slop/no-ai-slop.md`。
- https://github.com/miqdadbadjuber/anti-slop : 画面・文章・コメントの 38 規則。stars 6,011、MIT（2026-10-14 の GitHub API）。個票は `Knowledge/anti-slop/anti-slop.md`。
- https://github.com/vercel-labs/agent-skills : web-design-guidelines と writing-guidelines。stars 32.3k（2026-10-13）。
- https://github.com/53able/no-ai-slop-ja : 日本語の 21 パターン（2026-10-13）。
- https://github.com/textlint-ja/textlint-rule-preset-ai-writing : 誇大表現、強調、箇条書き、コロンの規則（2026-10-13）。
- https://github.com/coji/natural-japanese : 日本語のビジネス文の規則。12 条の原則は SKILL.md §2 で確認した（2026-10-30）。詳しくは `Knowledge/anti-slop/natural-japanese.md`。
- https://github.com/geonwoo-jeong/japanese-humanizer : 翻訳調と冗長表現の例（2026-10-13）。
- https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing : 記述的な指針で、禁止リストではない（検索の要約のみ）。
