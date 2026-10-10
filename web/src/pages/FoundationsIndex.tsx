import { Link } from "../i18n/router";
import { ArrowRight } from "lucide-react";
import { Wall } from "../layout/Playground";
import { tokens } from "../lib/tokens";
import { cx } from "../ds/cx";
import { AWESOMEDS_CATEGORY } from "../lib/knowledge";
import { useLocale, useT } from "../i18n/context";
import { foundationsIndexMessages } from "../i18n/messages/foundationsIndex";
import type { Localized } from "../i18n/locales";

/** Visual index of every design-system perspective AwesomeDS defines. */
const tiles: Array<{ to: string; title: Localized<string>; caption: Localized<string>; visual: React.ReactNode; wide?: boolean }> = [
  {
    to: "/foundations/typography",
    title: { ja: "文字", en: "Typography" },
    caption: { ja: "Geist + Noto Sans JP、8 段階、3 つの太さ", en: "Geist + Noto Sans JP, 8 steps, 3 weights" },
    visual: (
      <div className="flex h-full items-end justify-between p-5">
        <span className="t-display text-ink" style={{ fontSize: 64 }}>
          Aa
        </span>
        <span lang="ja" className="t-display text-ink" style={{ fontSize: 64 }}>
          あ
        </span>
      </div>
    ),
  },
  {
    to: "/foundations/color",
    title: { ja: "色", en: "Color" },
    caption: { ja: "白地、黒文字、アクセントは 1 色だけ", en: "White canvas, black ink, one accent only" },
    visual: (
      <div className="grid h-full grid-cols-4 gap-2 p-5">
        <span className="rounded-md border border-hairline bg-canvas" />
        <span className="rounded-md bg-surface-sunken" />
        <span className="rounded-md bg-primary" />
        <span className="rounded-md bg-accent" />
      </div>
    ),
  },
  {
    to: "/foundations/spacing",
    title: { ja: "余白とレイアウト", en: "Spacing and layout" },
    caption: { ja: "4px 単位。距離は関係の強さ", en: "4px unit. Distance shows how related things are" },
    visual: (
      <div className="flex h-full flex-col justify-center gap-1 p-5">
        {[4, 8, 16, 24, 32, 48].map((w) => (
          <span key={w} className="h-2 rounded-xs bg-ink" style={{ width: `${w}%` }} />
        ))}
      </div>
    ),
  },
  {
    to: "/foundations/radius",
    title: { ja: "角丸", en: "Radius" },
    caption: { ja: "操作部品 8、カード 12、ダイアログ 16", en: "Controls 8, cards 12, dialogs 16" },
    visual: (
      <div className="flex h-full items-center justify-center gap-3 p-5">
        <span className="size-12 rounded-md border-2 border-ink" />
        <span className="size-14 rounded-lg border-2 border-ink" />
        <span className="size-16 rounded-xl border-2 border-ink" />
      </div>
    ),
  },
  {
    to: "/foundations/elevation",
    title: { ja: "奥行き", en: "Elevation" },
    caption: { ja: "線が先。影は浮くものだけ", en: "Borders first. Shadows only for floating layers" },
    visual: (
      <div className="relative h-full p-5">
        <span className="absolute inset-x-8 top-6 h-16 rounded-lg border border-hairline bg-surface" />
        <span className="absolute inset-x-14 top-12 h-16 rounded-lg border border-hairline bg-surface shadow-3" />
      </div>
    ),
  },
  {
    to: "/foundations/motion",
    title: { ja: "モーション", en: "Motion" },
    caption: { ja: "200ms、ease-out、動きは 4〜8px", en: "200ms, ease-out, move 4 to 8px" },
    visual: (
      <div className="flex h-full items-center gap-2 p-5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="size-3 rounded-full bg-accent motion-safe:animate-[tile-pulse_1.6s_var(--ds-ease-out)_infinite]"
            style={{ animationDelay: `${i * 120}ms`, opacity: 1 - i * 0.22 }}
          />
        ))}
        <style>{`@keyframes tile-pulse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }`}</style>
      </div>
    ),
  },
];

/** Perspectives documented in AwesomeDS/foundations; rendered by the Knowledge reader at /knowledge/awesomeds/<slug>. */
const more: Array<{ slug: string; label: Localized<string>; rule: Localized<string> }> = [
  { slug: "dark-mode", label: { ja: "ダークモード", en: "Dark mode" }, rule: { ja: "明度だけを反転する", en: "Invert lightness only" } },
  { slug: "states", label: { ja: "状態", en: "States" }, rule: { ja: "hover / focus / disabled / loading / empty", en: "hover / focus / disabled / loading / empty" } },
  { slug: "forms", label: { ja: "フォーム", en: "Forms" }, rule: { ja: "ラベルは上、エラーは下", en: "Label above, error below" } },
  { slug: "feedback", label: { ja: "フィードバック", en: "Feedback" }, rule: { ja: "見えている結果に通知は要らない。エラーは消さない", en: "No message for a visible result. Errors never disappear" } },
  { slug: "navigation", label: { ja: "ナビゲーション", en: "Navigation" }, rule: { ja: "深さは 2 段まで", en: "Two levels deep at most" } },
  { slug: "density", label: { ja: "密度", en: "Density" }, rule: { ja: "標準 40px、コンパクト 32px", en: "Comfortable 40px, compact 32px" } },
  { slug: "data-visualization", label: { ja: "データ可視化", en: "Data visualization" }, rule: { ja: "8 色、識別できる差", en: "8 colors, each distinguishable" } },
  { slug: "layers", label: { ja: "レイヤー", en: "Layers" }, rule: { ja: "z-index は 8 段階", en: "8 z-index steps" } },
  { slug: "content-and-tone", label: { ja: "文章", en: "Content and tone" }, rule: { ja: "動詞で終える、感嘆符なし", en: "Lead with the verb, no exclamation marks" } },
  { slug: "imagery", label: { ja: "画像", en: "Imagery" }, rule: { ja: "16:9 / 4:3 / 1:1、角丸 12", en: "16:9 / 4:3 / 1:1, radius 12" } },
  { slug: "internationalization", label: { ja: "国際化", en: "Internationalization" }, rule: { ja: "lang 属性、伸縮の余地", en: "lang attribute, room to expand" } },
  { slug: "responsive", label: { ja: "レスポンシブ", en: "Responsive" }, rule: { ja: "5 つの幅、タッチ 44px", en: "5 widths, 44px touch" } },
  { slug: "accessibility", label: { ja: "アクセシビリティ", en: "Accessibility" }, rule: { ja: "WCAG 2.2 AA が下限", en: "WCAG 2.2 AA is the floor" } },
  { slug: "iconography", label: { ja: "アイコン", en: "Iconography" }, rule: { ja: "Lucide、1.75、16 / 20 / 24", en: "Lucide, 1.75, 16 / 20 / 24" } },
  { slug: "anti-patterns", label: { ja: "アンチパターン", en: "Anti-patterns" }, rule: { ja: "AI 生成の印を避ける", en: "Avoid the tells of generated UI" } },
];

export function FoundationsIndex() {
  const t = useT(foundationsIndexMessages);
  const { locale } = useLocale();
  return (
    <div>
      <header className="mb-10">
        <h1 className="t-display text-ink">{t.title}</h1>
        <p className="t-body-lg mt-3 text-ink-secondary">{t.lead}</p>
      </header>

      <Wall min={280}>
        {tiles.map((tile) => (
          <Link
            key={tile.to}
            to={tile.to}
            className={cx(
              "group flex h-64 flex-col overflow-hidden rounded-lg border border-hairline bg-surface text-ink no-underline transition-[transform,box-shadow] duration-fast ease-out-ds hover:-translate-y-0.5 hover:shadow-2",
            )}
          >
            <div className="relative min-h-0 flex-1 bg-canvas-soft">
              <div className="absolute inset-0">{tile.visual}</div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-hairline px-5 py-4">
              <div className="min-w-0">
                <p className="t-h4">{tile.title[locale]}</p>
                <p className="t-caption truncate text-ink-secondary">{tile.caption[locale]}</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-ink-muted transition-transform duration-fast ease-out-ds group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
            </div>
          </Link>
        ))}
      </Wall>

      <section className="mt-16" aria-labelledby="more-title">
        <h2 id="more-title" className="t-h2 text-ink">
          {t.more}
        </h2>
        <p className="t-body-sm mt-2 text-ink-secondary">{t.moreLead}</p>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {more.map(({ slug, label, rule }) => (
            <li key={slug} className="bg-surface">
              <Link
                to={`/knowledge/${AWESOMEDS_CATEGORY}/${slug}`}
                className="flex h-full flex-col gap-1 px-5 py-4 text-ink no-underline transition-colors duration-instant hover:bg-canvas-soft"
              >
                <span className="t-h4">{label[locale]}</span>
                <span className="t-caption text-ink-secondary">{rule[locale]}</span>
              </Link>
            </li>
          ))}
          <li className="bg-canvas-soft">
            <Link
              to={`/knowledge?category=${AWESOMEDS_CATEGORY}`}
              className="flex h-full items-center justify-between gap-2 px-5 py-4 text-ink no-underline transition-colors duration-instant hover:bg-surface-sunken"
            >
              <span className="t-h4">{t.readAll}</span>
              <ArrowRight className="size-4 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden />
            </Link>
          </li>
        </ul>
        <p className="t-caption mt-3 text-ink-muted">
          {t.tokenSummary(Object.keys(tokens.color.light).length, Object.keys(tokens.space).length, Object.keys(tokens.radius).length)}
        </p>
      </section>
    </div>
  );
}
