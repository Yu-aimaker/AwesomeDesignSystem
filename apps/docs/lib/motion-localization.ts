import type { MotionIntent, MotionRecipe } from "@awesome-ds/motion";
import type { Locale } from "./i18n";

type LocalizedMotionCopy = Pick<
  MotionRecipe,
  "purpose" | "allowedContexts" | "prohibited" | "reducedMotionAlternative" | "performanceNotes"
> & { intentLabel: string };

const jaMotionCopy = {
  enter: {
    intentLabel: "表示",
    purpose: "レイアウトを揺らさず、新しい内容の登場を伝えます。",
    allowedContexts: ["モーダル", "トースト", "ページ内セクション"],
    prohibited: ["注意を奪い続ける無限ループ"],
    reducedMotionAlternative: "不透明度を即時に切り替えます。",
    performanceNotes: "transformとopacityだけを使います。",
  },
  exit: {
    intentLabel: "退出",
    purpose: "内容が取り除かれることを短く伝えます。",
    allowedContexts: ["ダイアログ", "トースト", "メニュー"],
    prohibited: ["次の操作を妨げる長い退出待ち"],
    reducedMotionAlternative: "直ちにDOMから取り除きます。",
    performanceNotes: "標準の所要時間を200ms未満に保ちます。",
  },
  reveal: {
    intentLabel: "段階表示",
    purpose: "スクロールに合わせ、補助的な内容を段階的に示します。",
    allowedContexts: ["マーケティングセクション", "ドキュメントの章"],
    prohibited: ["入力に不可欠なフォーム項目"],
    reducedMotionAlternative: "最初から完全に表示します。",
    performanceNotes: "対応環境ではCSSのスクロール駆動アニメーションを優先します。",
  },
  expand: {
    intentLabel: "展開・折りたたみ",
    purpose: "階層の展開・折りたたみ関係を伝えます。",
    allowedContexts: ["アコーディオン", "開閉領域", "ナビゲーションツリー"],
    prohibited: ["領域を確保しない全画面のレイアウト移動"],
    reducedMotionAlternative: "高さを即時に切り替えます。",
    performanceNotes: "grid-template-rowsまたはmax-heightを慎重に扱います。",
  },
  "shared-layout": {
    intentLabel: "共有レイアウト",
    purpose: "状態間で同じ要素の位置関係を連続的に伝えます。",
    allowedContexts: ["カードから詳細への遷移", "サムネイルからライトボックスへの遷移"],
    prohibited: ["無関係な要素への同一レイアウトIDの付与"],
    reducedMotionAlternative: "クロスフェードだけを使います。",
    performanceNotes: "同時に動かす共有要素は原則一つにします。",
  },
  "list-change": {
    intentLabel: "リスト変更",
    purpose: "項目の追加・削除・並べ替えを追跡しやすくします。",
    allowedContexts: ["テーブル", "カンバン", "通知フィード"],
    prohibited: ["フィルター入力の一文字ごとのアニメーション"],
    reducedMotionAlternative: "即時に再配置します。",
    performanceNotes: "同時に行うFLIPアニメーション数を制限します。",
  },
  feedback: {
    intentLabel: "操作フィードバック",
    purpose: "利用者の入力を受け付けたことを即座に返します。",
    allowedContexts: ["ボタン", "切り替え操作", "ドラッグハンドル"],
    prohibited: ["すべてのホバーに付ける装飾的なバウンド"],
    reducedMotionAlternative: "色または境界線だけを切り替えます。",
    performanceNotes: "中断可能にし、ポインターが外れたら取り消します。",
  },
  drag: {
    intentLabel: "ドラッグ",
    purpose: "掴んだ対象とドロップ先を明確に示します。",
    allowedContexts: ["並べ替え可能なリスト", "キャンバス上のオブジェクト"],
    prohibited: ["ポインターキャプチャを伴わない自動ドラッグ"],
    reducedMotionAlternative: "ばね動作を使わず静的な持ち上げ表現にします。",
    performanceNotes: "ポインター操作で必ず中断できるようにします。",
  },
  scroll: {
    intentLabel: "スクロール連動",
    purpose: "スクロール位置を控えめな進捗の手掛かりへ対応させます。",
    allowedContexts: ["読了進捗", "控えめなパララックス装飾"],
    prohibited: ["スクロールジャック"],
    reducedMotionAlternative: "静的なインジケーターを使います。",
    performanceNotes: "コンポジターで処理しやすいプロパティを使います。",
  },
  "page-transition": {
    intentLabel: "ページ遷移",
    purpose: "画面間の空間的な連続性を保ちます。",
    allowedContexts: ["ドキュメント内の移動", "複数段階のプロダクトフロー"],
    prohibited: ["読む操作を遮る派手な全画面遷移"],
    reducedMotionAlternative: "画面を即時に切り替えます。",
    performanceNotes: "対応環境ではView Transitions APIを使います。",
  },
} satisfies Record<MotionIntent, LocalizedMotionCopy>;

export function localizeMotionRecipe(recipe: MotionRecipe, locale: Locale): MotionRecipe & { intentLabel: string } {
  if (locale === "en") return { ...recipe, intentLabel: recipe.intent };
  return { ...recipe, ...jaMotionCopy[recipe.intent] };
}
