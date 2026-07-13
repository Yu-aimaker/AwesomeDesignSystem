export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const localeConfig: Record<Locale, { name: string; dir: "ltr" | "rtl" }> = {
  en: { name: "English", dir: "ltr" },
  ja: { name: "日本語", dir: "ltr" },
};

type WidenStrings<T> = { [K in keyof T]: T[K] extends string ? string : WidenStrings<T[K]> };

const en = {
  localeName: "English",
  metadata: { title: "Awesome Design System", description: "Evidence-backed design bible, Reference Atlas, React components, and motion recipes." },
  shell: { skipToContent: "Skip to content", primary: "Primary", site: "Site", home: "AwesomeDS home", tagline: "The evidence-backed design field manual", language: "Language" },
  theme: { label: "Color theme", light: "Light", dark: "Dark", highContrast: "High contrast" },
  nav: { Home: "Home", Foundations: "Foundations", Review: "Review", Canon: "Canon", Principles: "Principles", Brand: "Brand", Interaction: "Interaction", Patterns: "Patterns", "AI Design": "AI design", Components: "Components", Motion: "Motion", "Reference Atlas": "Reference Atlas", Playground: "Playground", Status: "Status" },
  home: { kicker: "Living design intelligence · 2026", title: "Build with taste.", titleEmphasis: "Prove every choice.", lede: "AwesomeDS turns the world's best design doctrine into principles, tokens, accessible components, motion contracts, and agent-ready proof.", canonCta: "Enter the canon", sourcesCta: "Explore {count} sources", rules: "canonical rules", sources: "curated sources", fresh: "fresh references", graph: "evidence graph", entryEyebrow: "One system, four ways in", entryTitle: "From doctrine to shipped interface", liveCanon: "Live canon", liveCanonTitle: "Rules that compile into action", atlasTitle: "Reference Atlas", atlasBody: "Trace every conclusion back to standards, first-party systems, and maintained evidence.", atlasMeta: "{count} sources · freshness tracked", componentsTitle: "Components", componentsBody: "Accessible React primitives with state and keyboard contracts.", motionTitle: "Motion", motionBody: "Intent-based recipes with performance and reduced-motion alternatives.", playgroundTitle: "Playground", playgroundBody: "Tune semantic tokens and compose approved UI without breaking the contract." },
  references: { title: "Reference Atlas", intro: "Structured evidence — not a raw link dump. Each source links to AwesomeDS conclusions.", search: "Search", searchPlaceholder: "Search title, lesson, owner…", topic: "Topic / medium", sourceClass: "Source class", owner: "Organization", language: "Language", evidenceLevel: "Evidence level", region: "Region", freshness: "Freshness", allTopics: "All topics and media", allClasses: "All source classes", allOwners: "All organizations", allLanguages: "All languages", allEvidence: "All evidence levels", allRegions: "All regions", allFreshness: "All freshness", apply: "Apply filters", source: "Source", topics: "Topics", linkedRules: "Linked rules", noResults: "No references match these filters.", count: "{shown} of {total} sources", filterLabel: "Filter references" },
  status: { title: "System status", intro: "Integrity signals for content graph, freshness, and coverage.", graph: "Evidence graph", references: "References", rules: "Canon rules", artifacts: "Artifacts", signals: "Signals (quarantined)", buckets: "Freshness buckets", latest: "Latest freshness report", observations: "Source observations", reviewQueue: "Review queue", changed: "Changed", unchanged: "Unchanged", fetchFailed: "Fetch failed", adapterDegraded: "GitHub adapter degraded", changedSources: "Changed sources", fetchFailures: "Source fetch failures", adapterFailures: "GitHub adapter failures", adapterRecoveries: "GitHub adapter recoveries", reportGenerated: "Generated", reportStale: "Report stale", reportCurrent: "Report current", daysOld: "days old", firstFailure: "first failure", days: "days", persistent: "persistent", allowlisted: "allowlisted", error: "error", noReport: "No report yet. Run pnpm check:freshness.", issues: "Graph issues" },
  components: { title: "Components", intro: "{count} baseline components with semantic tokens, state matrices, and rule IDs.", gallery: "Live gallery" },
  componentDetail: { breadcrumb: "Components", rules: "Rules", stateMatrix: "State matrix", required: "required", anatomy: "Anatomy", keyboard: "Keyboard contract", screenReader: "Screen-reader contract", contentRules: "Content rules", publicApi: "Public API", publicApiRegion: "{name} public API", prop: "Prop", type: "Type", description: "Description", adaptation: "Adaptation contracts", rtl: "RTL", highContrast: "High contrast", reducedMotion: "Reduced motion", tests: "Verification IDs", live: "Live", previewFailed: "The live preview failed in isolation. The component documentation remains available.", copyable: "Copyable example", implementation: "Implementation", importPrefix: "Import", importMiddle: "from", importSuffix: "Consume semantic tokens only." },
  motion: { title: "Motion recipes", intro: "Intent-based, CSS-first recipes with reduced-motion alternatives.", intent: "Intent", purpose: "Purpose", reduced: "Reduced motion", rules: "Rules", demo: "Live enter recipe", demoDescription: "This card uses ads-motion-enter." },
  motionDetail: { cssClass: "CSS class", allowed: "Allowed", prohibited: "Prohibited", performance: "Performance" },
  referenceDetail: { teaches: "What this source teaches", applied: "Where AwesomeDS applied it", implementations: "Implementations and artifacts", noImplementations: "No directly linked artifacts.", caveats: "Caveats & anti-imitation", evidence: "Evidence", verified: "Verified", cadence: "Cadence" },
  playground: { title: "Playground", intro: "Allowlisted controls only — no arbitrary code execution. Theme persists locally.", theme: "Theme", controls: "Controls", buttonLabel: "Button label", variant: "Variant", size: "Size", loading: "Loading", disabled: "Disabled", showBadge: "Show badge", reset: "Reset", copied: "Copied", copyFailed: "Copy failed", copyCode: "Copy code", preview: "Preview", output: "Output" },
  brand: { title: "Brand", intro: "{count} canon modules in this domain. Full Markdown is rendered from design-system/.", workbench: "Open the Brand Workbench", featured: "Featured", empty: "No modules found." },
  workbench: { eyebrow: "Executable brand system", title: "Brand Workbench", intro: "Duolingo's transferable lesson, made brand-neutral: personality becomes governed identity, language, expression, and assets — with schemas and checks.", manifest: "Brand manifest", manifestTitle: "One personality. Every medium.", identity: "Identity", identityDetail: "marks · color · type · imagery", language: "Language", languageDetail: "narrative · voice · tone · lexicon", expression: "Expression", expressionDetail: "illustration · character · motion · sound", operations: "Operations", operationsDetail: "assets · rights · owner · versions", lexicon: "Product Lexicon · live contract", interfaceCopy: "Interface copy", noViolations: "No lexicon violations.", warning: "warning", error: "error", deprecated: "“{term}” is deprecated.", forbidden: "Do not use “{term}”.", replacement: "Use “{replacement}”." },
  canon: { fallbackNotice: "This canonical document is not translated yet. The English source is shown below.", fallbackLanguage: "English", sourceLabel: "Source file", libraryTitle: "Canon library", libraryIntro: "{count} Markdown modules from design-system/, fully readable on the site.", domainIntro: "{count} canon modules in this domain. Full Markdown is rendered from design-system/.", featured: "Featured", empty: "No modules found.", breadcrumb: "Canon", traceability: "Structured traceability" },
  notFound: { title: "Page not found", description: "That route is outside the AwesomeDS documentation map.", home: "Return home" },
} as const;

export type Dictionary = WidenStrings<typeof en>;

const ja: Dictionary = {
  localeName: "日本語",
  metadata: { title: "Awesome Design System", description: "根拠に基づくデザインバイブル、リファレンス・アトラス、Reactコンポーネント、モーションレシピ。" },
  shell: { skipToContent: "本文へ移動", primary: "メイン", site: "サイト", home: "AwesomeDS ホーム", tagline: "根拠に基づくデザイン実践体系", language: "言語" },
  theme: { label: "カラーテーマ", light: "ライト", dark: "ダーク", highContrast: "ハイコントラスト" },
  nav: { Home: "ホーム", Foundations: "基礎", Review: "レビュー", Canon: "体系", Principles: "原則", Brand: "ブランド", Interaction: "インタラクション", Patterns: "パターン", "AI Design": "AIデザイン", Components: "コンポーネント", Motion: "モーション", "Reference Atlas": "リファレンス", Playground: "プレイグラウンド", Status: "ステータス" },
  home: { kicker: "進化し続けるデザイン知識 · 2026", title: "美意識をもって作る。", titleEmphasis: "すべての選択に根拠を。", lede: "AwesomeDSは、世界最高水準のデザイン知識を、原則、トークン、アクセシブルなコンポーネント、モーション契約、AIエージェントが検証できる根拠へ変換します。", canonCta: "体系を読む", sourcesCta: "{count}件の情報源を見る", rules: "標準ルール", sources: "厳選情報源", fresh: "最新情報源", graph: "根拠グラフ", entryEyebrow: "ひとつのシステム、4つの入口", entryTitle: "原則から実装済みインターフェースへ", liveCanon: "最新の体系", liveCanonTitle: "実践へ変換できるルール", atlasTitle: "リファレンス・アトラス", atlasBody: "標準、一次情報、実装へ遡り、すべての結論の根拠を確認できます。", atlasMeta: "{count}件 · 鮮度を追跡", componentsTitle: "コンポーネント", componentsBody: "状態とキーボード操作を契約化したアクセシブルなReactプリミティブ。", motionTitle: "モーション", motionBody: "性能と動きを減らす設定まで含む、目的起点のレシピ。", playgroundTitle: "プレイグラウンド", playgroundBody: "契約を壊さず、セマンティックトークンと承認済みUIを調整できます。" },
  references: { title: "リファレンス・アトラス", intro: "単なるリンク集ではありません。構造化した根拠からAwesomeDSの結論まで追跡できます。", search: "検索", searchPlaceholder: "タイトル、学び、提供元を検索…", topic: "トピック・媒体", sourceClass: "情報源の種別", owner: "組織", language: "言語", evidenceLevel: "証拠レベル", region: "地域", freshness: "鮮度", allTopics: "すべてのトピック・媒体", allClasses: "すべての種別", allOwners: "すべての組織", allLanguages: "すべての言語", allEvidence: "すべての証拠レベル", allRegions: "すべての地域", allFreshness: "すべての鮮度", apply: "絞り込む", source: "情報源", topics: "トピック", linkedRules: "関連ルール", noResults: "条件に一致する情報源はありません。", count: "全{total}件中{shown}件", filterLabel: "リファレンスを絞り込む" },
  status: { title: "システムステータス", intro: "コンテンツグラフ、鮮度、網羅性の健全性を確認できます。", graph: "根拠グラフ", references: "リファレンス", rules: "標準ルール", artifacts: "成果物", signals: "隔離中のシグナル", buckets: "鮮度の内訳", latest: "最新の鮮度レポート", observations: "情報源の観測結果", reviewQueue: "確認待ちキュー", changed: "変更あり", unchanged: "変更なし", fetchFailed: "取得失敗", adapterDegraded: "GitHub監視の縮退", changedSources: "変更された情報源", fetchFailures: "情報源の取得失敗", adapterFailures: "GitHub監視の障害", adapterRecoveries: "GitHub監視の回復", reportGenerated: "生成日時", reportStale: "レポート期限切れ", reportCurrent: "レポート最新", daysOld: "日前", firstFailure: "初回失敗", days: "日", persistent: "継続中", allowlisted: "許可リスト対象", error: "エラー", noReport: "レポートはまだありません。pnpm check:freshness を実行してください。", issues: "グラフの問題" },
  components: { title: "コンポーネント", intro: "セマンティックトークン、状態マトリクス、ルールIDを備えた{count}個の標準コンポーネント。", gallery: "ライブギャラリー" },
  componentDetail: { breadcrumb: "コンポーネント", rules: "関連ルール", stateMatrix: "状態マトリクス", required: "必須", anatomy: "構造", keyboard: "キーボード操作契約", screenReader: "スクリーンリーダー契約", contentRules: "コンテンツ規則", publicApi: "公開API", publicApiRegion: "{name}の公開API", prop: "プロパティ", type: "型", description: "説明", adaptation: "環境適応契約", rtl: "RTL", highContrast: "ハイコントラスト", reducedMotion: "動きを減らす設定", tests: "検証ID", live: "ライブ表示", previewFailed: "ライブプレビューだけでエラーが発生しました。コンポーネントのドキュメントは引き続き利用できます。", copyable: "コピー可能な実装例", implementation: "実装", importPrefix: "インポート:", importMiddle: "提供元", importSuffix: "セマンティックトークンだけを使用してください。" },
  motion: { title: "モーションレシピ", intro: "目的を起点としたCSS優先のレシピ。動きを減らす設定にも対応します。", intent: "目的", purpose: "役割", reduced: "動きを減らす場合", rules: "ルール", demo: "表示モーションのデモ", demoDescription: "このカードは ads-motion-enter を使用しています。" },
  motionDetail: { cssClass: "CSSクラス", allowed: "使用できる場面", prohibited: "使用しない場面", performance: "パフォーマンス" },
  referenceDetail: { teaches: "この情報源から得られる知見", applied: "AwesomeDSへの反映先", implementations: "実装・成果物", noImplementations: "直接リンクされた成果物はありません。", caveats: "注意事項と模倣防止", evidence: "証拠レベル", verified: "最終確認", cadence: "確認周期" },
  playground: { title: "プレイグラウンド", intro: "許可されたコントロールだけを使用し、任意コードは実行しません。テーマ設定は端末内に保存されます。", theme: "テーマ", controls: "設定", buttonLabel: "ボタンのラベル", variant: "種類", size: "サイズ", loading: "読み込み中", disabled: "無効", showBadge: "バッジを表示", reset: "リセット", copied: "コピーしました", copyFailed: "コピーできませんでした", copyCode: "コードをコピー", preview: "プレビュー", output: "出力" },
  brand: { title: "ブランド", intro: "この領域には{count}件の標準モジュールがあります。design-system/ のMarkdown原文を表示しています。", workbench: "ブランド・ワークベンチを開く", featured: "注目", empty: "モジュールがありません。" },
  workbench: { eyebrow: "実行可能なブランドシステム", title: "ブランド・ワークベンチ", intro: "Duolingoから抽出した再利用可能な知見をブランド非依存で実装。人格を、統制されたアイデンティティ、言語、表現、アセットへ変換し、スキーマと検証で支えます。", manifest: "ブランド設計書", manifestTitle: "ひとつの人格を、すべての接点へ。", identity: "アイデンティティ", identityDetail: "ロゴ · 色 · 書体 · イメージ", language: "言語", languageDetail: "物語 · ボイス · トーン · 用語", expression: "表現", expressionDetail: "イラスト · キャラクター · モーション · 音", operations: "運用", operationsDetail: "アセット · 権利 · 責任者 · バージョン", lexicon: "プロダクト用語集 · ライブ契約", interfaceCopy: "インターフェース文言", noViolations: "用語違反はありません。", warning: "警告", error: "エラー", deprecated: "「{term}」は非推奨です。", forbidden: "「{term}」は使用できません。", replacement: "「{replacement}」を使用してください。" },
  canon: { fallbackNotice: "この標準文書は未翻訳です。以下に英語の原文を表示します。", fallbackLanguage: "英語", sourceLabel: "原文ファイル", libraryTitle: "標準体系ライブラリ", libraryIntro: "design-system/ にある{count}件のMarkdown標準文書をサイト上で読めます。", domainIntro: "この領域には{count}件の標準モジュールがあります。design-system/ のMarkdown原文を表示しています。", featured: "注目", empty: "モジュールがありません。", breadcrumb: "標準体系", traceability: "構造化された追跡情報" },
  notFound: { title: "ページが見つかりません", description: "このURLはAwesomeDSドキュメントの範囲外です。", home: "ホームへ戻る" },
};

const dictionaries: Record<Locale, Dictionary> = { en, ja };
export function isLocale(value: string): value is Locale { return locales.includes(value as Locale); }
export function getDictionary(locale: Locale): Dictionary { return dictionaries[locale]; }
export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split(/[/?#]/)[1];
  return segment && isLocale(segment) ? segment : null;
}
export function stripLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname || "/";
  const result = pathname.replace(new RegExp(`^/${locale}(?=/|\\?|#|$)`), "");
  return result || "/";
}
export function localizePathname(pathname: string, locale: Locale): string {
  const route = stripLocaleFromPathname(pathname);
  return `/${locale}${route === "/" ? "" : route}`;
}
export function formatMessage(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
export function negotiateLocale(saved: string | undefined, acceptLanguage: string | null): Locale {
  if (saved && isLocale(saved)) return saved;
  const preferred = acceptLanguage?.split(",").map((part) => part.trim().split(";")[0]?.toLowerCase());
  return preferred?.some((language) => language === "ja" || language?.startsWith("ja-")) ? "ja" : DEFAULT_LOCALE;
}
