import type { ComponentCatalogItem } from "@awesome-ds/core/contracts";

export const componentSlugs = [
  "button", "icon-button", "link", "badge", "input", "textarea", "checkbox", "switch",
  "radio-group", "select", "dialog", "alert-dialog", "popover", "tooltip", "dropdown-menu",
  "tabs", "accordion", "breadcrumb", "pagination", "card", "callout", "skeleton", "spinner",
  "progress", "toast", "empty-state", "error-state", "stack", "cluster", "grid", "container",
  "visually-hidden",
] as const;
type ComponentSlug = (typeof componentSlugs)[number];

const descriptions: Record<ComponentSlug, string> = {
  button: "読み込み中・無効状態を備えた主要アクション。", "icon-button": "必ずアクセシブルな名前を持つアイコン専用ボタン。", link: "移動先を明確に伝えるセマンティックなリンク。", badge: "状態や分類を短く示すラベル。",
  input: "ラベル、補足、エラーを関連付けた一行入力。", textarea: "長文入力のためのラベル付き複数行フィールド。", checkbox: "複数選択に使う二値の選択肢。", switch: "設定を即時に切り替えるオン・オフ操作。", "radio-group": "名前付き候補から一つだけ選ぶグループ。", select: "ラベルとエラーを備えたネイティブ選択欄。",
  dialog: "フォーカスを管理し、Escapeで閉じられるモーダル。", "alert-dialog": "取り消せない操作を安全に確認する警告ダイアログ。", popover: "現在の文脈を保ったまま補足を開く非モーダル面。", tooltip: "操作対象へ短い補足説明を加える表示。", "dropdown-menu": "キーボード操作に対応したアクションメニュー。",
  tabs: "関連する表示を同じ階層で切り替えるタブ。", accordion: "必要な箇所だけ展開できる開閉リスト。", breadcrumb: "現在地までの階層を示すナビゲーション。", pagination: "ページ位置を通知しながら前後へ移動する操作。",
  card: "関連内容を一つの面にまとめるコンテナ。", callout: "重要なヒントや注意を本文内で強調する領域。", skeleton: "読み込み後の形状を先に示すプレースホルダー。", spinner: "完了時刻が未定の処理を示す進捗表示。", progress: "処理の完了割合を示す進捗バー。", toast: "操作結果を一時的に知らせるステータス通知。", "empty-state": "内容がない理由と次の行動を示す空状態。", "error-state": "失敗内容と回復手段を示すエラー状態。",
  stack: "トークン化した間隔で縦に並べるレイアウト。", cluster: "折り返し可能な横並びレイアウト。", grid: "画面幅に適応する自動グリッド。", container: "読みやすい最大幅に内容を収めるコンテナ。", "visually-hidden": "視覚表示を増やさず支援技術へ文脈を渡すテキスト。",
};

const anatomy: Record<ComponentSlug, string[]> = {
  button: ["button要素", "操作ラベル", "読み込み表示"], "icon-button": ["button要素", "装飾アイコン", "アクセシブルな名前"], link: ["a要素", "移動先を示す文言", "任意の外部リンク表示"], badge: ["インライン領域", "短い状態ラベル"],
  input: ["ラベル", "テキスト入力", "補足", "エラーメッセージ"], textarea: ["ラベル", "複数行入力", "補足またはエラー"], checkbox: ["チェックボックス", "表示ラベル", "任意の説明"], switch: ["スイッチ", "トラックとつまみ", "常時表示ラベル"], "radio-group": ["fieldset", "legend", "ラジオ選択肢"], select: ["ラベル", "select要素", "選択肢", "エラーメッセージ"],
  dialog: ["背景オーバーレイ", "名前付きダイアログ", "タイトル", "本文", "閉じる操作"], "alert-dialog": ["背景オーバーレイ", "alertdialog", "結果の説明", "確定", "キャンセル", "エラー通知"], popover: ["開閉トリガー", "非モーダル面", "本文"], tooltip: ["対象要素", "ツールチップ面", "補足説明"], "dropdown-menu": ["メニュートリガー", "メニュー面", "メニュー項目"],
  tabs: ["タブリスト", "タブ", "選択中のパネル"], accordion: ["開閉リスト", "見出しボタン", "内容領域"], breadcrumb: ["名前付きナビゲーション", "順序付き階層", "現在ページ"], pagination: ["名前付きナビゲーション", "前へ", "ページ状態", "次へ", "ライブ通知"],
  card: ["グループ面", "任意のタイトル", "本文"], callout: ["aside要素", "タイトル", "補足内容"], skeleton: ["実コンテンツに合うプレースホルダー"], spinner: ["status領域", "回転表示", "アクセシブルなラベル"], progress: ["ラベル", "進捗トラック", "進捗量"], toast: ["ライブ通知領域", "メッセージ", "任意の操作"], "empty-state": ["任意の図版", "タイトル", "説明", "次の行動"], "error-state": ["エラー見出し", "平易な説明", "回復操作"],
  stack: ["縦方向flexコンテナ", "順序付きの子要素", "トークン間隔"], cluster: ["折り返すflexコンテナ", "横並びの子要素", "トークン間隔"], grid: ["レスポンシブグリッド", "繰り返しセル"], container: ["中央寄せの幅制約", "内容スロット", "レスポンシブ余白"], "visually-hidden": ["画面外テキスト領域", "支援技術向け文言"],
};

const keyboard: Record<ComponentSlug, string> = {
  button: "EnterまたはSpaceで一度だけ実行します。無効・読み込み中は実行しません。", "icon-button": "EnterまたはSpaceで実行し、フォーカスリングを常に表示します。", link: "Tabでフォーカスし、Enterで移動します。", input: "標準の文字入力・選択・Tab移動を維持します。", textarea: "標準の複数行編集を維持し、Enterは改行として扱います。", checkbox: "Spaceで選択を切り替え、Tabで次へ移動します。", switch: "Spaceで設定を即時に切り替えます。", "radio-group": "矢印キーで候補を移動し、Tabでグループへ出入りします。", select: "OS標準のキー操作と先頭文字検索を維持します。",
  dialog: "内部へフォーカスを移し、Tabを閉じ込め、Escapeで閉じた後トリガーへ戻します。", "alert-dialog": "確認中以外はEscapeでキャンセルできます。確認中は操作を固定します。", popover: "EnterまたはSpaceで開き、Escapeで閉じてトリガーへ戻します。", tooltip: "キーボードフォーカスで表示し、blurまたはEscapeで閉じます。", "dropdown-menu": "矢印、Home、Endで移動し、Enterで実行、Escapeで閉じます。", tabs: "左右矢印でタブを移動し、Home・Endで端へ移動します。", accordion: "見出しへフォーカスし、EnterまたはSpaceで開閉します。", breadcrumb: "リンクは標準のTab・Enter操作を維持し、現在ページは不要にリンク化しません。", pagination: "前後ボタンは標準操作を使い、範囲の端では無効になります。",
  badge: "通常はフォーカスを受けません。操作要素の中で使う場合は、その要素の標準キー操作に従います。",
  card: "追加のキー操作は持たず、内部の操作要素をDOM順にTab移動します。",
  callout: "追加のキー操作は持たず、内部にリンクがある場合だけ標準のTab・Enter操作を使います。",
  skeleton: "操作対象にせず、読み込み後に現れる操作要素へフォーカスを自動移動しません。",
  spinner: "操作対象にせず、処理中も現在のフォーカス位置を保ちます。",
  progress: "操作対象にせず、進捗更新によってフォーカスを移動しません。",
  toast: "通知自体へフォーカスを強制せず、操作を含む場合だけ標準のTab・Enter操作を使います。",
  "empty-state": "次の行動がある場合は標準のTab・EnterまたはSpace操作を使います。",
  "error-state": "回復操作へTabで移動し、EnterまたはSpaceで再試行します。",
  stack: "追加のキー操作は持たず、子要素のDOM順を保ちます。",
  cluster: "追加のキー操作は持たず、折り返しても子要素のDOM順を保ちます。",
  grid: "追加のキー操作は持たず、視覚配置とDOM順を一致させます。",
  container: "追加のキー操作は持たず、内部要素のセマンティックな操作を維持します。",
  "visually-hidden": "文言自体はフォーカスを受けず、関連する操作要素のキー操作を変えません。",
};

const screenReader: Record<ComponentSlug, string> = {
  button: "buttonとして名前、無効状態、処理中状態を通知します。処理中も操作名は変えません。",
  "icon-button": "labelを操作名として公開し、アイコン自体は装飾として扱います。",
  link: "リンクであることと、移動先が分かる文言を読み上げます。",
  badge: "文書順に短い状態文言を読み上げます。装飾目的なら利用側で読み上げ対象から外します。",
  input: "ラベル、補足、入力エラー、無効状態を入力欄へ関連付けます。",
  textarea: "ラベルと補足またはエラーを複数行入力へ関連付けます。",
  checkbox: "選択肢名、選択状態、無効状態をチェックボックスとして通知します。",
  switch: "設定名とオン・オフ状態をswitchとして通知します。",
  "radio-group": "legendでグループを命名し、各候補の選択状態を通知します。",
  select: "ラベル、現在の選択肢、補足、エラー、無効状態を通知します。",
  dialog: "dialogとタイトルでモーダルな作業文脈を示し、開閉時のフォーカスを管理します。",
  "alert-dialog": "alertdialogとして結果、確認中状態、失敗通知、確定・キャンセル操作を伝えます。",
  popover: "トリガーの展開状態と、直後に続く補足面の内容を通知します。",
  tooltip: "操作対象の名前を置き換えず、補足説明としてツールチップを関連付けます。",
  "dropdown-menu": "トリガーの展開状態、menu、各menuitemの名前・無効状態を通知します。",
  tabs: "tablist、選択中のtab、対応するtabpanelの関係を通知します。",
  accordion: "各見出しの展開状態と、直後に続く内容領域を通知します。",
  breadcrumb: "名前付きナビゲーションとして現在地までの階層を読み、現在ページをaria-currentで示します。",
  pagination: "現在ページと総ページ数をライブ通知し、範囲端の無効な操作を伝えます。",
  card: "独自の操作役割は追加せず、見出しと本文のセマンティック構造をそのまま公開します。",
  callout: "補足領域として見出しと本文を文書順に読みます。緊急通知には別のライブ領域を使います。",
  skeleton: "形状は読み上げ対象から外し、読み込み状態は所有する領域で一度だけ通知します。",
  spinner: "アニメーション自体ではなく、簡潔な処理中ラベルをstatusとして通知します。",
  progress: "処理名、現在値、最小値、最大値をprogressbarとして通知します。",
  toast: "操作を中断しないpoliteなstatusとして結果を通知します。",
  "empty-state": "見出しで空の状態を特定し、説明と次の行動を順に伝えます。",
  "error-state": "エラーの見出し、平易な説明、回復操作をalertとしてまとめて通知します。",
  stack: "役割を追加せず、子要素のDOM順をそのまま読み上げ順として保ちます。",
  cluster: "役割を追加せず、折り返し後も子要素のDOM順を保ちます。",
  grid: "見た目だけの役割を追加せず、子要素の意味とDOM順を保ちます。",
  container: "役割を追加せず、ランドマークや見出しの意味は利用側の要素に委ねます。",
  "visually-hidden": "画面には表示せず、支援技術のアクセシビリティツリーには補足文言を残します。",
};

const contentRules: Record<ComponentSlug, string[]> = {
  button: ["具体的な動詞から始めます。", "処理中の文言は実行した操作と一致させます。"],
  "icon-button": ["一つの目的に対応する見慣れたアイコンを使います。", "形ではなく実行される操作をlabelにします。"],
  link: ["移動先を名前で示します。", "URLだけ、または「詳しく見る」のような曖昧な文言を避けます。"],
  badge: ["1〜2語の短い状態名にします。", "色やtoneだけに重要な意味を持たせません。"],
  input: ["求める値が分かるラベルを使います。", "エラーでは修正方法を具体的に示します。"],
  textarea: ["期待する内容と上限を示します。", "placeholderをラベルの代わりにしません。"],
  checkbox: ["選択できる内容を文として書きます。", "関連する複数項目にはグループのlegendを付けます。"],
  switch: ["「オン」ではなく切り替える設定名を付けます。", "即時に反映される設定だけに使います。"],
  "radio-group": ["候補が相互排他的である場合に使います。", "候補は簡潔で並列な表現にします。"],
  select: ["見分けやすい選択肢名を使います。", "無効なplaceholderだけに説明を依存しません。"],
  dialog: ["作業内容が分かる固有のタイトルを付けます。", "主要操作を見える位置に置き、結果を明確にします。"],
  "alert-dialog": ["取り消せない結果を具体的に示します。", "確定と安全なキャンセルを明示的に書き分けます。"],
  popover: ["短く、その場の文脈に必要な内容だけを置きます。", "主要フローをポップオーバー内へ隠しません。"],
  tooltip: ["操作名に追加する補足だけを書きます。", "操作可能な内容をツールチップ内へ置きません。"],
  "dropdown-menu": ["各項目を動詞で始めます。", "破壊的操作は視覚と意味の両方で分離します。"],
  tabs: ["短く並列なタブ名を使います。", "同じ階層の関連内容だけを切り替えます。"],
  accordion: ["見出しだけで展開後の内容が予測できるようにします。", "主要ナビゲーションを不必要に入れ子にしません。"],
  breadcrumb: ["URLではなくページ名を使います。", "省略する場合も中間階層だけにします。"],
  pagination: ["ページを表す名詞を一貫させます。", "ページ移動後も絞り込み条件とURL状態を保ちます。"],
  card: ["一枚につき一つの主題に絞ります。", "競合する複数の主要操作を入れません。"],
  callout: ["最初に要点を書きます。", "情報・注意・成功の意味に文体を合わせます。"],
  skeleton: ["読み込み後の形状に合わせます。", "1秒未満の更新には使いません。"],
  spinner: ["何を処理しているかを名前にします。", "回復手段のない無期限な待機を避けます。"],
  progress: ["対象の処理名を示します。", "実態のない増加表示を作りません。"],
  toast: ["完了した結果を伝えます。", "すぐ実行できる場合だけ回復操作を加えます。"],
  "empty-state": ["なぜ空なのかを説明します。", "役立つ次の行動を一つ提示します。"],
  "error-state": ["利用者を責めず、何が失敗したかを書きます。", "具体的な再試行または代替手段を示します。"],
  stack: ["一次元の縦方向リズムに使います。", "意味のあるDOM順を保ちます。"],
  cluster: ["同格の操作やメタデータに使います。", "見た目の位置だけで順序を表しません。"],
  grid: ["同程度の重みを持つ項目に使います。", "意味の順序が変わるmasonry配置を避けます。"],
  container: ["主要な読み幅を一つに保ちます。", "全幅表示が必要な子要素は別の構造で扱います。"],
  "visually-hidden": ["視覚から得られる文脈だけを補います。", "操作要素を意図せず見えなくしません。"],
};

const propDescriptions: Record<string, string> = {
  children: "表示または読み上げ対象となる内容。", id: "ラベルや説明と関連付ける一意なID。", label: "利用者と支援技術へ示す名前。", title: "領域の目的を示す見出し。", hint: "入力へ関連付ける補足説明。", error: "入力へ関連付ける回復可能なエラー。", open: "表示状態を外部から制御します。", onClose: "閉じる操作を受け取るコールバック。", onConfirm: "確定操作を実行するコールバック。", confirming: "外部から制御する処理中状態。", confirmLabel: "確定操作のローカライズ済みラベル。", confirmingLabel: "確定処理中のローカライズ済みラベル。", cancelLabel: "キャンセル操作のローカライズ済みラベル。", closeLabel: "閉じる操作のローカライズ済みラベル。", confirmationErrorLabel: "確定失敗時に読み上げるローカライズ済み文言。", items: "表示する項目とその内容。", options: "選択可能な候補。", value: "外部から制御する現在値。", checked: "外部から制御する選択状態。", onChange: "値の変更を受け取るコールバック。", disabled: "操作を無効にします。", loading: "重複操作を防ぐ処理中状態。", variant: "意味に応じた操作の強調度。", size: "トークンで定義したコントロール寸法。", tone: "意味に応じた視覚tone。", href: "リンクの移動先。", legend: "選択肢グループを説明する見出し。", name: "ネイティブフォームのグループ名。", defaultValue: "初期選択する項目。", ariaLabel: "支援技術向けにローカライズした領域名。", page: "1から始まる現在ページ。", pageCount: "総ページ数。", formatPageStatus: "現在位置をロケールに合わせて整形します。", previousLabel: "前ページ操作のローカライズ済みラベル。", nextLabel: "次ページ操作のローカライズ済みラベル。", actionLabel: "次の行動を示すラベル。", onAction: "次の行動を実行するコールバック。", description: "状態と次の手順を説明する本文。", width: "想定する表示幅。", height: "想定する表示高さ。", gap: "トークン化した要素間隔。", "…native": "対応するネイティブ要素の標準属性。",
};

const stateLabels: Record<string, string> = { idle: "通常", hover: "ホバー", focus: "フォーカス", active: "押下中", disabled: "無効", loading: "読み込み中", visited: "訪問済み", unchecked: "未選択", checked: "選択済み", off: "オフ", on: "オン", error: "エラー", selected: "選択済み", unselected: "未選択", open: "開いている", closed: "閉じている", expanded: "展開", collapsed: "折りたたみ", current: "現在", first: "先頭", middle: "途中", last: "末尾", "0": "未開始", partial: "進行中", "100": "完了", visible: "表示中", empty: "空" };

const adaptation = {
  rtl: "論理方向の余白と配置を使い、DOMとフォーカスの順序を保ちます。方向を持つアイコンだけを反転します。",
  highContrast: "背景色だけに頼らず、境界・フォーカス・状態をシステムカラーでも判別可能にします。",
  reducedMotion: "状態とフォーカスの連続性を残し、移動や装飾的な遷移を取り除きます。",
};

export function localizeComponentContract(item: ComponentCatalogItem, locale: "en" | "ja"): ComponentCatalogItem {
  if (locale === "en") return item;
  if (!componentSlugs.includes(item.slug as ComponentSlug)) {
    throw new Error(`Missing Japanese component localization: ${item.slug}`);
  }
  const slug = item.slug as ComponentSlug;
  return {
    ...item,
    description: descriptions[slug],
    states: item.states.map((state) => stateLabels[state] ?? state),
    anatomy: anatomy[slug],
    keyboard: keyboard[slug],
    screenReader: screenReader[slug],
    contentRules: contentRules[slug],
    rtl: adaptation.rtl,
    highContrast: adaptation.highContrast,
    reducedMotion: adaptation.reducedMotion,
    publicApi: item.publicApi.map((api) => ({ ...api, description: propDescriptions[api.name] ?? api.description })),
  };
}
