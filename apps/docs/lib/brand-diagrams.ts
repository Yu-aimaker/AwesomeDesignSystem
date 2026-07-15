import type { Locale } from "./i18n";

/**
 * The proof-grammar diagrams are authored once as static SVG artifacts under
 * `assets/` (so the README and any external surface can reuse the exact same
 * file). The wide SVG (960×380) is legible at desktop widths but would shrink to
 * unreadable ~4px text on a 320–390px phone. So on the site the diagram renders
 * responsively: the wide SVG on desktop, and an accessible, localized **stacked**
 * HTML representation on narrow viewports. The stacked stations carry the
 * accessible description across every breakpoint (real localized text), so the
 * inlined SVG can be marked decorative (`aria-hidden`) without losing meaning.
 */
export type BrandDiagramId = "evidence-loop" | "canon-to-verify";

export type DiagramStation = {
  index: string;
  /** Monospace registration label, e.g. "01 · CANON". */
  label: string;
  /** The station's identifier/value, rendered in mono. */
  value: string;
  /** A short plain-language note. */
  note: string;
};

type DiagramCopy = {
  /** Accessible name for the whole figure. */
  title: string;
  /** Registration index line (mono), locale-invariant. */
  registration: string;
  stations: DiagramStation[];
  /** How the stations connect — the ember relationship, stated in words. */
  flow: string;
};

const DIAGRAM_COPY: Record<BrandDiagramId, Record<Locale, DiagramCopy>> = {
  "evidence-loop": {
    en: {
      title: "The AwesomeDS evidence loop",
      registration: "[ EVIDENCE LOOP · RULE→REF→ARTIFACT→VERIFY→RULE ]",
      stations: [
        { index: "01", label: "01 · CANON", value: "rule.*", note: "A decision, stated." },
        { index: "02", label: "02 · REFERENCE", value: "ref.*", note: "The first-party evidence it rests on." },
        { index: "03", label: "03 · IMPLEMENTATION", value: "token · component · motion", note: "An executable artifact." },
        { index: "04", label: "04 · VERIFY", value: "proof", note: "Checked against tests, accessibility, and freshness." },
      ],
      flow: "A single ember return path arcs from Verify back to Canon: every rule is re-checked against its evidence.",
    },
    ja: {
      title: "AwesomeDS の根拠ループ",
      registration: "[ EVIDENCE LOOP · RULE→REF→ARTIFACT→VERIFY→RULE ]",
      stations: [
        { index: "01", label: "01 · 体系", value: "rule.*", note: "言葉にした、ひとつの判断。" },
        { index: "02", label: "02 · 情報源", value: "ref.*", note: "その判断が拠って立つ一次情報。" },
        { index: "03", label: "03 · 実装", value: "トークン · 部品 · モーション", note: "実行可能な成果物。" },
        { index: "04", label: "04 · 検証", value: "proof", note: "テスト・アクセシビリティ・鮮度に照らして確認。" },
      ],
      flow: "検証から体系へ、エンバーの帰り道が一本だけ弧を描く。すべてのルールは根拠に対して繰り返し確認されます。",
    },
  },
  "canon-to-verify": {
    en: {
      title: "Canon to verify — the AwesomeDS build path",
      registration: "[ BUILD PATH · CANON→TOKENS·COMPONENTS·MOTION→VERIFY ]",
      stations: [
        { index: "01", label: "01 · CANON", value: "rule.*", note: "One decision." },
        { index: "02", label: "02 · BUILD", value: "tokens · components · motion", note: "A bounded set of executable artifacts." },
        { index: "03", label: "03 · VERIFY", value: "proof", note: "Checked against states, accessibility, evidence, and freshness before it ships." },
      ],
      flow: "Fan-out arrows are ink; the converging arrow into Verify is the single ember signal.",
    },
    ja: {
      title: "体系から検証へ — AwesomeDS の構築経路",
      registration: "[ BUILD PATH · CANON→TOKENS·COMPONENTS·MOTION→VERIFY ]",
      stations: [
        { index: "01", label: "01 · 体系", value: "rule.*", note: "ひとつの判断。" },
        { index: "02", label: "02 · 構築", value: "トークン · 部品 · モーション", note: "範囲を定めた、実行可能な成果物の集合。" },
        { index: "03", label: "03 · 検証", value: "proof", note: "状態・アクセシビリティ・根拠・鮮度を確認してから出荷。" },
      ],
      flow: "枝分かれの矢印はインク。検証へ収束する矢印だけが、単一のエンバー信号です。",
    },
  },
};

export function getBrandDiagram(id: BrandDiagramId, locale: Locale): DiagramCopy {
  return DIAGRAM_COPY[id][locale];
}
