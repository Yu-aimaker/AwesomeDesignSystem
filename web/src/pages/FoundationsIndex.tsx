import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Wall } from "../layout/Playground";
import { tokens } from "../lib/tokens";
import { cx } from "../ds/cx";
import { AWESOMEDS_CATEGORY } from "../lib/knowledge";

/** Visual index of every design-system perspective AwesomeDS defines. */
const tiles: Array<{ to: string; title: string; caption: string; visual: React.ReactNode; wide?: boolean }> = [
  {
    to: "/foundations/typography",
    title: "文字",
    caption: "Geist + Noto Sans JP、8 段階、3 つの太さ",
    visual: (
      <div className="flex h-full items-end justify-between p-5">
        <span className="t-display text-ink" style={{ fontSize: 64 }}>
          Aa
        </span>
        <span className="t-display text-ink" style={{ fontSize: 64 }}>
          あ
        </span>
      </div>
    ),
  },
  {
    to: "/foundations/color",
    title: "色",
    caption: "白地、黒文字、アクセントは 1 色だけ",
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
    title: "余白とレイアウト",
    caption: "4px 単位。距離は関係の強さ",
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
    title: "角丸",
    caption: "操作部品 8、カード 12、ダイアログ 16",
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
    title: "奥行き",
    caption: "線が先。影は浮くものだけ",
    visual: (
      <div className="relative h-full p-5">
        <span className="absolute inset-x-8 top-6 h-16 rounded-lg border border-hairline bg-surface" />
        <span className="absolute inset-x-14 top-12 h-16 rounded-lg border border-hairline bg-surface shadow-3" />
      </div>
    ),
  },
  {
    to: "/foundations/motion",
    title: "モーション",
    caption: "200ms、ease-out、動きは 4〜8px",
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
const more = [
  ["ダークモード", "dark-mode", "明度だけを反転する"],
  ["状態", "states", "hover / focus / disabled / loading / empty"],
  ["フォーム", "forms", "ラベルは上、エラーは下"],
  ["フィードバック", "feedback", "見えている結果に通知は要らない。エラーは消さない"],
  ["ナビゲーション", "navigation", "深さは 2 段まで"],
  ["密度", "density", "標準 40px、コンパクト 32px"],
  ["データ可視化", "data-visualization", "8 色、識別できる差"],
  ["レイヤー", "layers", "z-index は 8 段階"],
  ["文章", "content-and-tone", "動詞で終える、感嘆符なし"],
  ["画像", "imagery", "16:9 / 4:3 / 1:1、角丸 12"],
  ["国際化", "internationalization", "lang 属性、伸縮の余地"],
  ["レスポンシブ", "responsive", "5 つの幅、タッチ 44px"],
  ["アクセシビリティ", "accessibility", "WCAG 2.2 AA が下限"],
  ["アイコン", "iconography", "Lucide、1.75、16 / 20 / 24"],
  ["アンチパターン", "anti-patterns", "AI 生成の印を避ける"],
] as const;

export function FoundationsIndex() {
  return (
    <div>
      <header className="mb-10">
        <h1 className="t-display text-ink">基盤</h1>
        <p className="t-body-lg mt-3 text-ink-secondary">見て、触って、比べる。理由は各ページの「なぜ」に。</p>
      </header>

      <Wall min={280}>
        {tiles.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className={cx(
              "group flex h-64 flex-col overflow-hidden rounded-lg border border-hairline bg-surface text-ink no-underline transition-[transform,box-shadow] duration-fast ease-out-ds hover:-translate-y-0.5 hover:shadow-2",
            )}
          >
            <div className="relative min-h-0 flex-1 bg-canvas-soft">
              <div className="absolute inset-0">{t.visual}</div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-hairline px-5 py-4">
              <div className="min-w-0">
                <p className="t-h4">{t.title}</p>
                <p className="t-caption truncate text-ink-secondary">{t.caption}</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-ink-muted transition-transform duration-fast ease-out-ds group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
            </div>
          </Link>
        ))}
      </Wall>

      <section className="mt-16" aria-labelledby="more-title">
        <h2 id="more-title" className="t-h2 text-ink">
          ほかの観点
        </h2>
        <p className="t-body-sm mt-2 text-ink-secondary">仕様と理由は各解説に。1 行は覚えるべき規則。</p>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {more.map(([label, slug, rule]) => (
            <li key={slug} className="bg-surface">
              <Link
                to={`/knowledge/${AWESOMEDS_CATEGORY}/${slug}`}
                className="flex h-full flex-col gap-1 px-5 py-4 text-ink no-underline transition-colors duration-instant hover:bg-canvas-soft"
              >
                <span className="t-h4">{label}</span>
                <span className="t-caption text-ink-secondary">{rule}</span>
              </Link>
            </li>
          ))}
          <li className="bg-canvas-soft">
            <Link
              to={`/knowledge?category=${AWESOMEDS_CATEGORY}`}
              className="flex h-full items-center justify-between gap-2 px-5 py-4 text-ink no-underline transition-colors duration-instant hover:bg-surface-sunken"
            >
              <span className="t-h4">すべての解説を読む</span>
              <ArrowRight className="size-4 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden />
            </Link>
          </li>
        </ul>
        <p className="t-caption mt-3 text-ink-muted">
          トークンは {Object.keys(tokens.color.light).length} 色役割、{Object.keys(tokens.space).length} 段階の余白、{Object.keys(tokens.radius).length} 段階の角丸。
        </p>
      </section>
    </div>
  );
}
