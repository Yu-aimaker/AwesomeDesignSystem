import { useMemo, useState } from "react";
import { Link } from "../i18n/router";
import { useLocale } from "../i18n/context";
import { ArrowRight, ChevronDown, ExternalLink, Globe } from "lucide-react";
import { PageHeader } from "../layout/Page";
import { FlagshipArt } from "../layout/FlagshipPoster";
import { Input } from "../ds/components/Input";
import { Button } from "../ds/components/Button";
import { EmptyState } from "../ds/components/EmptyState";
import { Badge, type BadgeTone } from "../ds/components/Badge";
import { entries, groupSourcesByDomain } from "../lib/knowledge";
import { flagshipSystems, categoryLabel, absorptionLabel, ogpStats, type AbsorptionLevel, type DesignSystemRef } from "../lib/design-systems";

const levelTone: Record<AbsorptionLevel, BadgeTone> = {
  adopted: "accent",
  adapted: "neutral",
  reference: "neutral",
};

function DesignSystemCard({ system }: { system: DesignSystemRef }) {
  const { level, knowledge, takeaway } = system.absorption;
  const { locale } = useLocale();
  return (
    <article className="group relative flex min-w-0 max-w-full flex-col overflow-hidden rounded-lg border border-hairline bg-surface text-ink transition-[transform,box-shadow] duration-fast ease-out-ds hover:-translate-y-0.5 hover:shadow-2 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent">
      <div className="relative aspect-[1200/630] w-full max-w-full overflow-hidden bg-canvas-soft">
        <div className="absolute inset-0 origin-center transition-transform duration-base ease-out-ds group-hover:scale-[1.02]">
          <FlagshipArt system={system} />
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <h3 className="t-h4 min-w-0" style={{ overflowWrap: "anywhere" }}>
            {/* Stretched link: the whole card opens the source; the Knowledge link below sits above it. */}
            <a href={system.url} target="_blank" rel="noreferrer" className="text-ink no-underline outline-none after:absolute after:inset-0 after:content-['']">
              {system.nameJa ?? system.name}
            </a>
          </h3>
          <ExternalLink className="mt-0.5 size-4 shrink-0 text-ink-muted transition-colors group-hover:text-ink" strokeWidth={1.75} aria-hidden />
        </div>
        <p className="t-body-sm line-clamp-2 min-w-0 text-ink-secondary" style={{ overflowWrap: "anywhere" }}>
          {system.descriptionJa}
        </p>
        <div className="mt-1 flex min-w-0 flex-col gap-1.5 border-t border-hairline pt-3">
          <span className="flex items-center gap-2">
            <Badge tone={levelTone[level]}>{absorptionLabel(level, locale)}</Badge>
            <span className="t-caption text-ink-muted">AwesomeDS での扱い</span>
          </span>
          <p className="t-body-sm min-w-0 text-ink" style={{ overflowWrap: "anywhere" }}>
            {takeaway[locale]}
          </p>
        </div>
        <div className="mt-auto flex min-w-0 items-center justify-between gap-3 pt-1">
          <span className="t-caption flex min-w-0 items-center gap-1.5 text-ink-muted">
            <Globe className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
            <span className="min-w-0 truncate">{system.domain}</span>
          </span>
          <Link
            to={`/knowledge/${knowledge}`}
            className="t-caption relative z-10 inline-flex shrink-0 items-center gap-1 font-medium"
            aria-label={`${system.nameJa ?? system.name} の採用・不採用の記録`}
          >
            記録を読む
            <ArrowRight className="size-3.5" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

function OgpNote() {
  const stats = ogpStats();
  const missing = flagshipSystems.filter((s) => s.ogp.status === "missing");
  return (
    <p className="t-caption mt-3 max-w-[75ch] text-ink-muted" style={{ overflowWrap: "anywhere" }}>
      {stats.ok}/{stats.total} 件が公式 og:image（取得 2026-10-07）。
      {missing.length > 0
        ? ` 幾何マーク: ${missing.map((s) => s.nameJa ?? s.name).join("、")}。`
        : ""}
    </p>
  );
}

function FlagshipGallery() {
  const { locale } = useLocale();
  const grouped = useMemo(() => {
    const map = new Map<DesignSystemRef["category"], DesignSystemRef[]>();
    for (const s of flagshipSystems) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return [...map.entries()].map(([cat, items]) => ({
      category: cat,
      label: categoryLabel(cat, locale),
      items,
    }));
  }, [locale]);

  return (
    <section aria-labelledby="flagship" className="mb-16">
      <div className="mb-6">
        <h2 id="flagship" className="t-h2 text-ink">
          注目のデザインシステム
        </h2>
        <p className="t-body mt-2 max-w-[65ch] text-ink-secondary">
          AwesomeDS が値と規則の出典にしたデザインシステムとガイドライン。各カードに、何を採ったかと採用の度合いを載せています。
        </p>
        <dl className="t-caption mt-3 flex max-w-[75ch] flex-wrap gap-x-4 gap-y-1 text-ink-secondary">
          <div className="flex gap-1">
            <dt className="font-medium text-ink">採用</dt>
            <dd>値や規則をそのまま使う</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-medium text-ink">翻案</dt>
            <dd>考え方を取り、値は変える</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-medium text-ink">参照のみ</dt>
            <dd>指名されたときに公式を使う</dd>
          </div>
        </dl>
        <OgpNote />
      </div>
      {grouped.map((g) => (
        <div key={g.category} className="mb-8">
          <h3 className="t-label mb-4 text-ink-muted">{g.label}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {g.items.map((s) => (
              <DesignSystemCard key={s.id} system={s} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export function Sources() {
  const [q, setQ] = useState("");
  const [openAll, setOpenAll] = useState(false);
  const all = useMemo(() => groupSourcesByDomain(entries), []);
  const total = all.reduce((n, g) => n + g.sources.length, 0);

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return all;
    return all
      .map((g) => ({
        ...g,
        sources: g.sources.filter((s) => [g.domain, s.title, s.url, ...s.citedBy.map((e) => e.title)].some((t) => t.toLowerCase().includes(needle))),
      }))
      .filter((g) => g.sources.length > 0);
  }, [q, all]);

  const searching = q.trim().length > 0;

  return (
    <div>
      <PageHeader
        title="出典・ガイドライン"
        lead={`デザインシステムの公式ガイドラインと、ナレッジ・AwesomeDS 解説が参照する外部リンクの一覧です。${total} 件、${all.length} ドメイン。`}
      />

      <FlagshipGallery />

      <section aria-labelledby="all-sources">
        <h2 id="all-sources" className="t-h2 mb-6 text-ink">
          全出典リンク
        </h2>

        {all.length === 0 ? (
          <EmptyState title="出典はまだありません" description="frontmatter の sources に URL が書かれると、ここに集計されます。" />
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="w-full max-w-md">
                <Input label="検索" placeholder="ドメイン、タイトル、URL、引用元" value={q} onChange={(e) => setQ(e.target.value)} type="search" />
              </div>
              <Button variant="secondary" size="sm" onClick={() => setOpenAll((v) => !v)}>
                {openAll ? "すべて閉じる" : "すべて開く"}
              </Button>
            </div>

            {groups.length === 0 ? (
              <EmptyState title="一致する出典がありません" description="別の語で検索してください。" />
            ) : (
              <ul className="divide-y divide-hairline border-y border-hairline">
                {groups.map((g) => (
                  <li key={g.domain}>
                    <details className="group" open={openAll || searching}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-ink hover:bg-canvas-soft sm:-mx-3 sm:rounded-md sm:px-3">
                        <span className="flex min-w-0 items-baseline gap-3">
                          <span className="t-body truncate font-medium">{g.domain}</span>
                          <span className="t-caption tabular text-ink-muted">{g.sources.length}</span>
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-ink-muted transition-transform duration-fast ease-out-ds group-open:rotate-180" strokeWidth={1.75} aria-hidden />
                      </summary>
                      <ul className="mb-4 flex flex-col gap-4 pl-0 sm:pl-4">
                        {g.sources.map((s) => (
                          <li key={s.url} className="flex flex-col gap-1">
                            <a href={s.url} target="_blank" rel="noreferrer" className="t-body-sm inline-flex items-start gap-1" style={{ overflowWrap: "anywhere" }}>
                              {s.title}
                              <ExternalLink className="mt-1 size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
                            </a>
                            <span className="t-caption text-ink-muted" style={{ overflowWrap: "anywhere" }}>
                              {s.url}
                            </span>
                            <span className="t-caption flex flex-wrap gap-x-2 text-ink-secondary">
                              引用:
                              {s.citedBy.map((e) => (
                                <Link key={e.id} to={`/knowledge/${e.category}/${e.slug}`}>
                                  {e.title}
                                </Link>
                              ))}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  );
}
