import type { Localized } from "../locales";
import type { SourceLink } from "../../layout/Page";
import type { MascotMotion, MascotPose } from "../../mascot/Mascot";
import type { ProposalId } from "../../mascot/Proposals";

interface ProposalCard {
  title: string;
  diff: string;
}

interface NameRow {
  name: string;
  reading: string;
  reason: string;
}

interface MotionRow {
  what: string;
  time: string;
  still: string;
}

const ja = {
  title: "キャラクター",
  lead: (name: string) => `${name}は AwesomeDS のアイコンから描いたマスコットです。このサイトの中だけに置き、モーションの見本と設計の記録を兼ねます。`,
  figure: (name: string, state: string) => `${name}、${state}`,
  motionsTitle: "モーション",
  motionsLead: "ボタンで再生します。待機は 3 周（約 7 秒）で止まります。縮小モーションでは、動かさずに各モーションの静止ポーズを出します。",
  motion: { idle: "待機", wave: "手を振る", happy: "よろこぶ", blink: "まばたき", nod: "うなずく" } satisfies Record<MascotMotion, string>,
  picker: "再生するモーション",
  replay: "もう一度",
  pause: "一時停止",
  resume: "再開",
  statusPlaying: (m: string) => `${m}を再生中`,
  statusPaused: (m: string) => `${m}を一時停止中`,
  statusDone: (m: string) => `${m}の再生が終わりました`,
  statusStill: (m: string) => `${m}の静止ポーズ`,
  reducedSwitch: "縮小モーション（このページだけ）",
  noteNormal: "アニメーションが動きます。OS の設定か上のスイッチで、静止ポーズに切り替わります。",
  noteOs: "OS で視差効果を減らす設定がオンです。アニメーションは止め、各モーションの静止ポーズを出します。",
  notePage: "このページの縮小モーションがオンです。アニメーションは止め、各モーションの静止ポーズを出します。",
  colMotion: "モーション",
  colWhat: "内容",
  colTime: "時間",
  colStill: "縮小モーション時",
  rows: {
    idle: { what: "呼吸。胴体を 2px 下げて縦に 2% 縮め、腕を 4° 揺らす。途中で 2 回まばたきする", time: "2.4s × 3", still: "中立" },
    wave: { what: "右腕を肩から上げ、約 20° で 2 往復して下ろす。胴体は 2° 傾く", time: "800ms", still: "右腕を上げたまま" },
    happy: { what: "かがんで 8px 跳ぶ。両腕を上げ、アクセントの小さなタイル 4 つが opacity だけで出て消える", time: "700ms", still: "両腕を上げ、タイルが見える" },
    blink: { what: "目を縦に潰して戻す", time: "160ms", still: "目を一度閉じて開く。切り替えだけで動かさない" },
    nod: { what: "胴体を 2px、顔をさらに 2px 下げて戻す", time: "400ms", still: "少しうつむいたまま" },
  } satisfies Record<MascotMotion, MotionRow>,
  posesTitle: "静止ポーズ",
  posesLead: "縮小モーションのときに出す形です。意味は色ではなく、腕と目の形で伝えます。",
  pose: { neutral: "中立", wave: "手を上げる", happy: "両腕を上げる", blink: "目を閉じる", nod: "うつむく" } satisfies Record<MascotPose, string>,
  sizesTitle: "サイズと背景",
  sizesLead: "見本は 96px 以上、一覧は 64px、最小は 32px。32px でも上辺とベルトが残ります。16px はファビコンの役割なので使いません。",
  bg: { canvas: "canvas", surface: "surface", sunken: "surface-sunken" },
  sizesCaption: "96 / 64 / 32 px",
  designTitle: "形の由来",
  designLead: "ヘッダー左上のアイコンと同じ文法で、手で描いています。",
  iconCaption: "アイコン",
  mascotCaption: (name: string) => name,
  design: [
    "胴体はアイコンの「A」の外形を閉じた形です。上辺は平らで、側面は A と同じ 5:16 の傾き。文字の A は描かないので、ヘッダーのアイコンと取り違えません。",
    "ベルトは A の横棒です。アクセントはこの 1 色だけで、頬の色や影は付けません。",
    "塗りだけで描きます。線、グラデーション、ラスタ画像は使いません。",
    "96×96 の格子に整数の座標で置き、腕は肩を原点に回る別のグループにしています。",
    "インライン SVG と CSS だけで動きます。追加の依存はありません。色はトークンなので、ライトとダークで自動で切り替わります。",
  ],
  colPart: "部分",
  colToken: "トークン",
  parts: [
    { part: "胴体、腕、足", token: "--ds-ink" },
    { part: "目、口", token: "--ds-canvas" },
    { part: "ベルト、よろこぶときのタイル", token: "--ds-accent" },
  ],
  proposalsTitle: "候補の比較",
  proposalsLead: "胴体の形を 3 案描きました。どれを採るかと名前は、メンテナーが決めます。今の既定は A です。",
  currentBadge: "今の既定",
  proposals: {
    a: { title: "A. Peak", diff: "A の外形を閉じた上すぼまりの胴体。ベルトは胴体の幅に沿う。" },
    b: { title: "B. Tile", diff: "正方形に近いタイルの胴体に、小さな頂点を載せる。" },
    c: { title: "C. Stack", diff: "頭と胴を分けた 2 段。ベルトは首の位置に来る。" },
  } satisfies Record<ProposalId, ProposalCard>,
  defaultWhy: "A を既定にした理由: 側面の傾きがアイコンの A と同じで、マークとのつながりが 32px でも読めます。B はタイルの輪郭がヘッダーのアイコンとほぼ同じで、小さいと取り違えます。C はアイコンの文法から離れ、ベルトが首輪に見えます。",
  filesLabel: "元のファイル",
  namesTitle: "名前の候補",
  namesLead: (name: string) => `呼び方は未定です。このサイトでは仮に「${name}」と書いています。差し替えは web/src/mascot/name.ts の 1 行です。`,
  colName: "候補",
  colReading: "読み",
  colReason: "理由",
  names: [
    { name: "エース", reading: "Ace", reason: "マークの「A」から。短い。" },
    { name: "タイル", reading: "Tile", reason: "胴体が角丸タイルであること。" },
    { name: "マーク", reading: "Mark", reason: "ブランドマークが動く、という意味。" },
  ] satisfies NameRow[],
  usageTitle: "出す場所と出さない場所",
  showTitle: "出す",
  show: ["このページ（/character と /en/character）", "docs/assets/brand/ の静止画（README や資料）"],
  hideTitle: "出さない",
  hide: [
    "ヘッダーとモバイルシート。左上は静的なアイコンだけ",
    "404、空状態、トースト、フォームのエラー",
    "製品 UI のクロム、ボタンの中、読み込み中の表示",
    "マーケティング用のヒーロー",
  ],
  a11yTitle: "アクセシビリティ",
  a11y: [
    "図は role=\"img\" で、名前と今の状態を表示言語で持ちます。",
    "再生や一時停止の状態は、ライブリージョンで知らせます。",
    "OS の視差効果を減らす設定と、このページのスイッチのどちらでもアニメーションを止め、静止ポーズに置き換えます。",
    "自動で動くのは待機だけで、約 7 秒で止まり、途中で一時停止できます。",
    "動きは transform と opacity だけで、移動は 8px 以内です。",
  ],
  why: [
    "キャラクターは親しみを足すためのもので、操作の手がかりではありません。そのため製品 UI のモーション上限（300ms、ループなし）とは別の枠にし、このページだけで長めの動きを許しています。",
    "形をアイコンから取ると、別の絵柄を足さずにサイトの一貫性を保てます。外部のイラスト素材や生成したラスタ画像は使わず、このリポジトリの中で描いています。",
    "モーションの判断木はイラストに Lottie を勧めています。ここでは 5 つの短い動きだけなので、依存を足さずに CSS で書き、色をトークンに追従させています。",
  ],
  sources: [
    { title: "WCAG 2.2 Understanding 2.2.2 Pause, Stop, Hide", url: "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html", note: "5 秒を超えて自動で動くものは止められること" },
    { title: "WCAG 2.2 Understanding 2.3.3 Animation from Interactions", url: "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html", note: "操作で起きる動きを無効にできること" },
    { title: "MDN prefers-reduced-motion", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion", note: "OS の設定を読むメディア特性" },
    { title: "MDN transform-box", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform-box", note: "SVG の部品を viewBox 座標で回す" },
  ] as SourceLink[],
};

export type CharacterMessages = typeof ja;

const en: CharacterMessages = {
  title: "Character",
  lead: (name) => `${name} is a mascot drawn from the AwesomeDS icon. It appears only on this site, as a motion sample and a record of how it was designed.`,
  figure: (name, state) => `${name}, ${state}`,
  motionsTitle: "Motions",
  motionsLead: "Buttons play each motion. Idle stops after three cycles (about 7 seconds). With reduced motion, nothing moves and each motion shows its still pose instead.",
  motion: { idle: "Idle", wave: "Wave", happy: "Happy", blink: "Blink", nod: "Nod" },
  picker: "Motion to play",
  replay: "Replay",
  pause: "Pause",
  resume: "Resume",
  statusPlaying: (m) => `Playing ${m.toLowerCase()}`,
  statusPaused: (m) => `${m} paused`,
  statusDone: (m) => `${m} finished`,
  statusStill: (m) => `${m}, still pose`,
  reducedSwitch: "Reduced motion (this page only)",
  noteNormal: "Animation is on. The OS setting or the switch above changes it to still poses.",
  noteOs: "Your OS asks for reduced motion. Animation is off and each motion shows its still pose.",
  notePage: "Reduced motion is on for this page. Animation is off and each motion shows its still pose.",
  colMotion: "Motion",
  colWhat: "What moves",
  colTime: "Duration",
  colStill: "With reduced motion",
  rows: {
    idle: { what: "Breathing. The body drops 2px and shortens 2%, and the arms sway 4°. Blinks twice", time: "2.4s × 3", still: "Neutral" },
    wave: { what: "Raises the right arm from the shoulder, swings about 20° twice, lowers it. The body leans 2°", time: "800ms", still: "Right arm raised" },
    happy: { what: "Crouches and jumps 8px. Both arms go up; four small accent tiles fade in and out (opacity only)", time: "700ms", still: "Both arms up, tiles visible" },
    blink: { what: "Eyes squash vertically and return", time: "160ms", still: "Eyes close once and open again, as a swap with no movement" },
    nod: { what: "The body drops 2px and the face a further 2px, then both return", time: "400ms", still: "Head slightly lowered" },
  },
  posesTitle: "Still poses",
  posesLead: "Shown under reduced motion. Each pose carries its meaning through arm and eye shape, not colour.",
  pose: { neutral: "Neutral", wave: "Arm raised", happy: "Both arms up", blink: "Eyes closed", nod: "Head lowered" },
  sizesTitle: "Sizes and backgrounds",
  sizesLead: "96px or larger for the sample, 64px in lists, 32px at the smallest. The flat top and the belt still read at 32px. Not used at 16px, which is the favicon's job.",
  bg: { canvas: "canvas", surface: "surface", sunken: "surface-sunken" },
  sizesCaption: "96 / 64 / 32 px",
  designTitle: "Where the shape comes from",
  designLead: "Drawn by hand with the same rules as the icon in the top-left corner.",
  iconCaption: "Icon",
  mascotCaption: (name) => name,
  design: [
    "The body is the outline of the icon's \"A\", closed into one shape: a flat top and sides at the same 5:16 slope. The letter itself is not drawn, so it is not mistaken for the header icon.",
    "The belt is the A's crossbar. It is the only accent colour; no cheek colour, no shadows.",
    "Fills only. No outlines, gradients or raster images.",
    "Placed on a 96×96 grid with integer coordinates. Each arm is its own group that rotates around the shoulder.",
    "Runs on inline SVG and CSS. No added dependencies. Colours are tokens, so light and dark switch on their own.",
  ],
  colPart: "Part",
  colToken: "Token",
  parts: [
    { part: "Body, arms, feet", token: "--ds-ink" },
    { part: "Eyes, mouth", token: "--ds-canvas" },
    { part: "Belt, tiles in Happy", token: "--ds-accent" },
  ],
  proposalsTitle: "Proposals",
  proposalsLead: "Three body shapes were drawn. The maintainer picks one and the name. A is the current default.",
  currentBadge: "Current default",
  proposals: {
    a: { title: "A. Peak", diff: "A tapered body closed from the outline of the A. The belt follows the body's width." },
    b: { title: "B. Tile", diff: "A near-square tile body with a small peak on top." },
    c: { title: "C. Stack", diff: "Head and body as two tiles. The belt sits at the neck." },
  },
  defaultWhy: "Why A is the default: its sides share the icon A's slope, so the link to the mark still reads at 32px. B's outline is almost the header icon and is easy to confuse at small sizes. C drifts from the icon's rules and its belt reads as a collar.",
  filesLabel: "Source files",
  namesTitle: "Name candidates",
  namesLead: (name) => `The name is not decided. This site uses "${name}" as a placeholder. Changing it is one line in web/src/mascot/name.ts.`,
  colName: "Candidate",
  colReading: "Reading",
  colReason: "Reason",
  names: [
    { name: "エース", reading: "Ace", reason: "From the A in the mark. Short." },
    { name: "タイル", reading: "Tile", reason: "The body is a rounded tile." },
    { name: "マーク", reading: "Mark", reason: "The brand mark that moves." },
  ],
  usageTitle: "Where it appears, and where it does not",
  showTitle: "Appears",
  show: ["This page (/character and /en/character)", "Still images in docs/assets/brand/ (README and documents)"],
  hideTitle: "Does not appear",
  hide: [
    "The header and the mobile sheet. The top-left corner keeps the static icon",
    "404, empty states, toasts, form errors",
    "Product UI chrome, inside buttons, loading indicators",
    "Marketing heroes",
  ],
  a11yTitle: "Accessibility",
  a11y: [
    "The figure is role=\"img\" with its name and current state in the page language.",
    "Play and pause states are announced through a live region.",
    "Both the OS reduced-motion setting and this page's switch stop the animation and swap in still poses.",
    "Only idle plays on its own. It stops after about 7 seconds and can be paused.",
    "Only transform and opacity move, never more than 8px.",
  ],
  why: [
    "The character adds familiarity; it is not an interaction cue. So it sits outside the product UI motion limits (300ms, no loops) and longer motion is allowed on this page only.",
    "Taking the shape from the icon keeps the site consistent without adding a second visual style. It is drawn in this repository, with no external illustration packs and no generated raster images.",
    "The motion decision tree suggests Lottie for illustrations. With five short motions, CSS does the job without a new dependency and keeps the colours on tokens.",
  ],
  sources: [
    { title: "WCAG 2.2 Understanding 2.2.2 Pause, Stop, Hide", url: "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html", note: "Anything that moves on its own for more than 5 seconds can be stopped" },
    { title: "WCAG 2.2 Understanding 2.3.3 Animation from Interactions", url: "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html", note: "Motion triggered by interaction can be disabled" },
    { title: "MDN prefers-reduced-motion", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion", note: "Media feature for the OS setting" },
    { title: "MDN transform-box", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform-box", note: "Rotating SVG parts in viewBox coordinates" },
  ],
};

export const characterMessages: Localized<CharacterMessages> = { ja, en };
