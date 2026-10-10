import type { Localized } from "../locales";

const ja = {
  title: "モーション",
  lead: "duration と easing を動かして、目で決める。重いものは押すまで読み込まない。",
  statLabel: "デモ",
  reducedNote: "OS の「視差効果を減らす」が有効です。デモは移動を省き、フェードだけを残します。",
  all: "すべて",
  library: "ライブラリ",
  allLibraries: "全ライブラリ",
  searchPlaceholder: "デモを検索",
  notFoundTitle: "見つかりません",
  notFoundBody: "ライブラリの絞り込みを外すか、別の語で検索してください。",
  avoid: (what: string) => `避ける: ${what}`,
  dataNote: "既定は 200ms、ease-out、移動 4〜8px。無限ループはローディングだけ。すべて prefers-reduced-motion を尊重します。詳細は AwesomeDS/foundations/motion.md。",
};

export type MotionGalleryMessages = typeof ja;

const en: MotionGalleryMessages = {
  title: "Motion",
  lead: "Adjust duration and easing and judge by eye. Heavy demos load only when you press them.",
  statLabel: "demos",
  reducedNote: "Reduce motion is on in your OS settings. Demos skip movement and keep only the fade.",
  all: "All",
  library: "Library",
  allLibraries: "All libraries",
  searchPlaceholder: "Search demos",
  notFoundTitle: "No matches",
  notFoundBody: "Clear the library filter or try another term.",
  avoid: (what) => `Avoid: ${what}`,
  dataNote: "Defaults: 200ms, ease-out, 4 to 8px of travel. Only loading indicators loop. Every demo respects prefers-reduced-motion. Details: AwesomeDS/foundations/motion.md.",
};

export const motionGalleryMessages: Localized<MotionGalleryMessages> = { ja, en };
