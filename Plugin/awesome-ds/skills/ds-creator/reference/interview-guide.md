# ds-creator interview guide

The interview is a decision tree. Ask the most upstream open node first; its answer prunes or unlocks the ones below. One node per turn. Each node lists: the question, the options to offer, the recommended default, what the answer changes, and what it unlocks or skips.

## Tree

```
audience
└─ product category + density
   └─ brand adjectives (3)
      ├─ existing colours / logo (skip if intake found them)
      │  └─ accent preference
      │     └─ primary button colour? (only if user pushes for a coloured primary)
      ├─ type preference
      │  └─ serif name and role (only if serif chosen)
      ├─ tone of copy
      ├─ motion appetite
      ├─ dark mode need
      │  └─ default theme (only if both)
      ├─ platforms
      ├─ accessibility constraints
      └─ references liked / disliked
```

## Nodes

### 1. Audience
Q: Who uses this most days: A) consumers, B) business users inside one company (internal tool), C) business buyers or admins (B2B SaaS), D) developers, E) other.
Recommended: none; this is the user's fact.
Changes: density default (internal tools and developer tools lean dense), body size floor (consumers 16, never less), tone.
Unlocks: category.

### 2. Product category and density
Q: Which is closest: A) marketing site or landing pages, B) content or documentation, C) transactional app (forms, dashboards, tables), D) commerce, E) other. Then, in the same question, density: comfortable (AwesomeDS default, 16px body, 24px card padding) or compact (14px UI text, 16px padding, 32px controls).
Recommended: AwesomeDS default (medium) unless C or D with daily heavy use.
Changes: `--ds-control-md`, card padding, body size for UI text (never below 14), section spacing.

### 3. Brand adjectives
Q: Pick exactly 3 that the product should feel like: calm, precise, warm, playful, premium, technical, trustworthy, bold, friendly, editorial, minimal, energetic, serious, crafted, fast.
Recommended: calm, precise, trustworthy (AwesomeDS's own).
Changes: this is the "atmosphere" section of DESIGN.md. Mapping hints:
- warm, friendly, playful: radius up one step (controls 8 to 10 or 12, cards 16), accent can be warmer, motion medium.
- premium, editorial, crafted: consider serif for display only, letter-spacing tighter on display, more whitespace (sections 96 to 128), never more shadow.
- technical, precise, fast: keep AwesomeDS radii or reduce (6/8), mono for data, motion low, dense tables.
- bold, energetic: accent may appear on one hero element in addition to links, display weight 700 allowed, motion medium. Still no gradients by default.
- serious, trustworthy: nothing changes from AwesomeDS; that is what it is built for.

### 4. Existing colours and logo
Skip when intake found a logo or CSS palette; state what was found instead.
Q: Do you have brand colours already? A) yes, here they are (hex), B) yes, in the logo I will point you to, C) no, pick with me, D) other.
Recommended: use what exists; do not invent.
Changes: candidate accent, sometimes canvas tint (only when the brand insists; AwesomeDS neutrals stay true gray otherwise).

### 5. Accent preference
Q: Which accent should carry links, focus and selection: A) AwesomeDS blue #2f5bea, B) the brand colour <hex from node 4>, C) a shifted version of the brand colour tuned for 4.5:1 on white, D) other.
Recommended: B if it passes 4.5:1 on white as text, else C.
Changes: `--ds-accent`, `--ds-accent-hover`, `--ds-accent-soft`, `--ds-focus-ring`, `--ds-selection`, dark accent (lightened for 4.5:1 on #0a0a0a). Run the contrast script before locking.
Follow-up only if the user asks for coloured buttons: "AwesomeDS keeps primary buttons ink on canvas so the accent stays meaningful. Keep that, or make the primary button the brand colour?" Record the answer verbatim.

### 6. Type preference
Q: Typeface direction: A) Geist + Noto Sans JP (AwesomeDS default), B) another sans (name it), C) a serif for display headings only, D) a serif for headings and body (editorial), E) other.
Recommended: A. Serif only if the brand asks for it.
Changes: `--ds-font-sans`, optionally `--ds-font-display` (new token), loading strategy. If B, C or D: ask for the exact family name in the next turn (node 6b) and require an open licence or a confirmed licence.
Skip 6b if A.

### 7. Tone of copy
Q: How should UI text sound: A) plain and direct (AwesomeDS default), B) warm and encouraging, C) formal (敬語, legal, finance), D) playful, E) other.
Recommended: A.
Changes: the copy section of DESIGN.md (sentence length, politeness level, exclamation policy, emoji policy). Japanese: A and C decide between です・ます and more formal phrasing; playful never means casual だ・である in UI.

### 8. Motion appetite
Q: Motion level: A) low (feedback only, AwesomeDS default), B) medium (enter animations on lists and dialogs, springs on gestures), C) high (scroll-driven sequences on marketing pages), D) other.
Recommended: A for apps, B for marketing.
Changes: which durations and libraries are allowed; C unlocks GSAP ScrollTrigger for marketing only and requires reduced-motion fallbacks.

### 9. Dark mode
Q: Dark mode: A) both, follow the OS (AwesomeDS default), B) light only, C) dark only, D) both with a manual switch.
Recommended: A.
Changes: whether dark tokens are kept, and the default theme. B removes the dark block from the override file only; the base still ships it.
Skip "default theme" unless D.

### 10. Platforms
Q: Where does this run: A) web desktop and mobile browsers, B) web plus native mobile wrappers, C) desktop app (Electron, Tauri), D) embedded in another product (Shopify, Slack, Chrome extension), E) other.
Recommended: A.
Changes: touch target floors, safe areas, host-platform constraints (D means the host DS may override AwesomeDS; record which one).

### 11. Accessibility constraints
Q: Any requirement above WCAG 2.2 AA (AwesomeDS floor): A) none, B) AAA contrast for body text (7:1), C) public sector or regulated (name the standard, for example JIS X 8341-3), D) users with low vision or older users as a primary audience, E) other.
Recommended: A unless the audience says otherwise.
Changes: contrast thresholds in the contrast script (`--aaa`), body size 18 for D, focus ring width 3px for D, motion low.

### 12. References
Q: Name one product whose look you want to be near, and one you want to stay away from.
Recommended: none.
Changes: nothing by itself; used to sanity-check the adjectives and to write the "not like" line in DESIGN.md. Never copy a reference's palette.

## Closing table format

```
| topic | value | status |
|---|---|---|
| audience | B2B admins, daily use | decided (Q1) |
| accent | #1d4ed8 | from asset (public/logo.svg) |
| type | Geist + Noto Sans JP | default, not decided |
```

## Japanese phrasing for the same questions

Use these when the user writes Japanese. Keep the same options and letters.

1. 主なユーザーは誰ですか: A) 一般消費者 B) 社内の業務担当者 C) 企業の管理者・購買担当 D) 開発者 E) その他
2. プロダクトの種類と密度: A) マーケティングサイト B) コンテンツ・ドキュメント C) 業務アプリ（フォーム、ダッシュボード、表） D) EC E) その他。密度は「ゆったり（既定）」か「コンパクト」か
3. ブランドの形容詞を3つ: 落ち着いた、精密、温かい、遊び心、上質、技術的、信頼できる、大胆、親しみやすい、編集的、ミニマル、エネルギッシュ、真面目、丁寧、速い
4. 既存のブランドカラーやロゴはありますか
5. アクセントカラーはどれにしますか
6. 書体の方向性
7. UI文言のトーン
8. モーションの量
9. ダークモードの要否
10. 動作環境
11. アクセシビリティの追加要件
12. 近づけたい参考プロダクトと、避けたい参考プロダクトを1つずつ
