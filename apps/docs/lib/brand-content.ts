import type { Locale } from "./i18n";

/**
 * Localized brand *personality* — authored natively in English and Japanese, not
 * machine-translated and not a caption. This is the meaningful brand content that
 * makes `/ja/brand` genuinely Japanese-first: the traits, emotional range, voice
 * qualities, and anti-personas from `design-system/brand/awesomeds-brand.md` §2/§4
 * read as first-class copy in each locale. Kept out of the WidenStrings dictionary
 * so the string arrays stay simply typed.
 */
const personality = {
  en: {
    eyebrow: "Personality",
    title: "One personality, reported like an instrument.",
    lede: "AwesomeDS behaves like a principal designer who keeps their sources open on the desk — and a laboratory instrument that reports an honest reading, even when the reading is “needs review.”",
    traitsLabel: "Traits, as verbs",
    traits: ["Measures", "Clarifies", "Proves", "Composes", "Restrains"],
    rangeLabel: "Emotional range",
    range: "Quietly assured, then precise, occasionally wry in a mono aside — never loud.",
    voiceLabel: "Voice qualities",
    voice: ["Precise", "Sourced", "Plain", "Unhurried"],
    antiLabel: "What it never becomes",
    anti: [
      "The hype deck",
      "The rule-less mood board",
      "The “AI slop” gradient-blob generator",
      "The logo wall",
    ],
  },
  ja: {
    eyebrow: "人格",
    title: "ひとつの人格を、計器のように正直に。",
    lede: "AwesomeDSは、机の上に出典を開いたまま仕事をする主席デザイナーのように振る舞います。そして、たとえ結果が「要確認」であっても、正直な計測値を報告する実験室の計器のように。",
    traitsLabel: "動詞で表す性格",
    traits: ["計測する", "明快にする", "証明する", "構成する", "抑制する"],
    rangeLabel: "感情の幅",
    range: "静かな自信、そして精密さ。ときに等幅の余白で控えめな皮肉を。決して声高にはなりません。",
    voiceLabel: "ボイスの質",
    voice: ["精密", "出典つき", "平明", "急がない"],
    antiLabel: "決してならないもの",
    anti: [
      "誇張だらけのピッチデッキ",
      "ルールのないムードボード",
      "「AIスロップ」なグラデーション量産機",
      "ロゴの壁",
    ],
  },
} as const;

export type BrandPersonality = (typeof personality)[Locale];

export function getBrandPersonality(locale: Locale): BrandPersonality {
  return personality[locale];
}
