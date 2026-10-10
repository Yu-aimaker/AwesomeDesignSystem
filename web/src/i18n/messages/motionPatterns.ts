import type { Localized } from "../locales";

const ja = {
  title: "動くパターン",
  lead: "トークンの値で実際に動かしています。どれも transform と opacity だけを使い、操作するまで動きません（一覧の最初の 1 回だけ、画面に入ったときに再生します）。",
  replay: "もう一度",
  tokensLabel: "使うトークン",
  // Reduced motion note (role="status": announced when it changes)
  modeNormal: "通常のモーションで表示しています。",
  modeReducedOs: "OS で動きを減らす設定が有効です。移動と拡大は省き、不透明度の変化だけを見せています。タブの下線と並べ替えは、動かさずに切り替えます。",
  modeReducedPage: "このページで動きを減らしています。移動と拡大は省き、不透明度の変化だけを見せています。タブの下線と並べ替えは、動かさずに切り替えます。",
  // Duration ladder
  ladderTitle: "時間の 5 段階",
  ladderRule: "同じ 8px の入場を、5 つの時間で同時に再生します。部品の中は 300ms までに収めます。",
  ladderChip: "保存しました",
  ladderUse: {
    instant: "色、ホバー、フォーカス",
    fast: "チェック、スイッチ、タブの下線",
    base: "ポップオーバー、メニュー、トースト",
    slow: "ダイアログ、シート",
    slower: "ページ単位の切り替え（まれ）",
  } as Record<string, string>,
  // Menu
  menuTitle: "メニュー",
  menuRule: "200ms・ease-out で 4px 下りて、0.98 から拡大して現れます。消えるときは約 130ms・ease-in。",
  menuButton: "表示",
  menuItems: ["リスト", "ボード", "タイムライン"],
  // Toast
  toastTitle: "トースト",
  toastRule: "下から 8px 上がって 200ms で現れ、130ms で消えます。操作のないトーストは 5 秒で閉じます。",
  toastButton: "書き出す",
  toastText: "24 行を書き出しました",
  toastClose: "閉じる",
  // Dialog
  dialogTitle: "ダイアログ",
  dialogRule: "背景は不透明度だけ、本体は 300ms で 0.98 から拡大します。閉じるときは 200ms。",
  dialogButton: "削除を確認",
  dialogHeading: "「請求書 INV-1044」を削除します",
  dialogBody: "元に戻せません。",
  dialogCancel: "キャンセル",
  dialogConfirm: "削除する",
  dialogStage: "ダイアログの見本（ページの中に表示）",
  // Tabs
  tabsTitle: "タブの下線",
  tabsRule: "選ばれたタブの下線が 150ms・ease-out で移動します。",
  tabs: ["概要", "アクティビティ", "設定"],
  // Reorder
  reorderTitle: "並べ替え",
  reorderRule: "位置の変化はばね（stiffness 170、damping 26）で動かします。行き過ぎて戻ることはほぼありません。",
  reorderButton: "並べ替える",
  reorderItems: ["デザインレビュー", "トークンの更新", "リリースノート", "アクセシビリティ確認"],
  // Performance note
  perfNote: "どのデモも transform と opacity だけを動かし、レイアウトの再計算を起こしません。並べ替えも、位置の差分を transform で埋める方法（FLIP）です。",
};

export type MotionPatternsMessages = typeof ja;

const en: MotionPatternsMessages = {
  title: "Patterns in motion",
  lead: "These run on the token values. Every one animates only transform and opacity, and none moves until you act (the duration ladder plays once when it scrolls into view).",
  replay: "Replay",
  tokensLabel: "Tokens",
  modeNormal: "Showing normal motion.",
  modeReducedOs: "Your system asks for reduced motion. Movement and scaling are dropped; only opacity changes are shown. The tab underline and the reorder switch without moving.",
  modeReducedPage: "Motion is reduced on this page. Movement and scaling are dropped; only opacity changes are shown. The tab underline and the reorder switch without moving.",
  ladderTitle: "Five durations",
  ladderRule: "The same 8px enter, played at all five durations at once. Anything inside a view stays at 300ms or less.",
  ladderChip: "Saved",
  ladderUse: {
    instant: "Color, hover, focus",
    fast: "Checkbox, switch, tab underline",
    base: "Popover, menu, toast",
    slow: "Dialog, sheet",
    slower: "Page-level transitions (rare)",
  },
  menuTitle: "Menu",
  menuRule: "Enters in 200ms with ease-out, moving 4px and scaling from 0.98. Exits in about 130ms with ease-in.",
  menuButton: "View",
  menuItems: ["List", "Board", "Timeline"],
  toastTitle: "Toast",
  toastRule: "Rises 8px and fades in over 200ms; leaves in 130ms. A toast without an action closes after 5 seconds.",
  toastButton: "Export",
  toastText: "Exported 24 rows",
  toastClose: "Close",
  dialogTitle: "Dialog",
  dialogRule: "The backdrop only fades. The panel scales from 0.98 over 300ms and closes in 200ms.",
  dialogButton: "Confirm delete",
  dialogHeading: "Delete invoice INV-1044",
  dialogBody: "This cannot be undone.",
  dialogCancel: "Cancel",
  dialogConfirm: "Delete",
  dialogStage: "Dialog example (shown inside the page)",
  tabsTitle: "Tab underline",
  tabsRule: "The underline moves to the selected tab in 150ms with ease-out.",
  tabs: ["Overview", "Activity", "Settings"],
  reorderTitle: "Reorder",
  reorderRule: "Position changes use a spring (stiffness 170, damping 26). It barely overshoots.",
  reorderButton: "Reorder",
  reorderItems: ["Design review", "Token update", "Release notes", "Accessibility check"],
  perfNote: "Every demo animates only transform and opacity, so nothing triggers layout. The reorder also fills position changes with transforms (FLIP).",
};

export const motionPatternsMessages: Localized<MotionPatternsMessages> = { ja, en };
