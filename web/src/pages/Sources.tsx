import { useMemo, useState } from "react";
import { Link } from "../i18n/router";
import { useLocale, useT } from "../i18n/context";
import { sourcesMessages } from "../i18n/messages/sources";
import { langFor } from "../i18n/messages/knowledge";
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
  const t = useT(sourcesMessages);
  const name = locale === "ja" ? (system.nameJa ?? system.name) : system.name;
  return (
    <article className="group relative flex min-w-0 max-w-full flex-col overflow-hidden rounded-lg border border-hairline bg-surface text-ink transition-[transform,box-shadow] duration-fast ease-out-ds hover:-translate-y-0.5 hover:shadow-2 has-[h3_a:focus-visible]:ring-2 has-[h3_a:focus-visible]:ring-accent">
      <div className="relative aspect-[1200/630] w-full max-w-full overflow-hidden bg-canvas-soft">
        <div className="absolute inset-0 origin-center transition-transform duration-base ease-out-ds group-hover:scale-[1.02]">
          <FlagshipArt system={system} />
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="t-h4 min-w-0" style={{ overflowWrap: "anywhere" }}>
          {/* Stretched link: tapping anywhere on the card opens the AwesomeDS record for this source. */}
          <Link to={`/knowledge/${knowledge}`} className="text-ink no-underline outline-none after:absolute after:inset-0 after:content-['']">
            {name}
          </Link>
        </h3>
        <p className="t-body-sm line-clamp-2 min-w-0 text-ink-secondary" style={{ overflowWrap: "anywhere" }}>
          {locale === "ja" ? system.descriptionJa : system.description}
        </p>
        <div className="mt-1 flex min-w-0 flex-col gap-1.5 border-t border-hairline pt-3">
          <span className="flex items-center gap-2">
            <Badge tone={levelTone[level]}>{absorptionLabel(level, locale)}</Badge>
            <span className="t-caption text-ink-muted">{t.treatment}</span>
          </span>
          <p className="t-body-sm min-w-0 text-ink" style={{ overflowWrap: "anywhere" }}>
            {takeaway[locale]}
          </p>
          <span aria-hidden className="t-caption inline-flex items-center gap-1 font-medium text-accent">
            {t.readRecord}
            <ArrowRight className="size-3.5 transition-transform duration-fast ease-out-ds group-hover:translate-x-0.5" strokeWidth={1.75} />
          </span>
        </div>
        <a
          href={system.url}
          target="_blank"
          rel="noreferrer"
          aria-label={t.officialSiteLabel(name)}
          className="t-caption relative z-10 -mx-2 mt-auto flex min-h-11 min-w-0 items-center gap-1.5 self-start rounded-md px-2 text-ink-secondary no-underline transition-colors duration-instant hover:bg-surface-sunken hover:text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <Globe className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="min-w-0 truncate">{t.officialSite(system.domain)}</span>
          <ExternalLink className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        </a>
      </div>
    </article>
  );
}

function OgpNote() {
  const stats = ogpStats();
  const { locale } = useLocale();
  const t = useT(sourcesMessages);
  const missing = flagshipSystems.filter((s) => s.ogp.status === "missing");
  return (
    <p className="t-caption mt-3 max-w-[75ch] text-ink-muted" style={{ overflowWrap: "anywhere" }}>
      {t.ogpOk(stats.ok, stats.total)}
      {missing.length > 0 ? t.ogpMissing(missing.map((s) => (locale === "ja" ? (s.nameJa ?? s.name) : s.name))) : ""}
    </p>
  );
}

function FlagshipGallery() {
  const { locale } = useLocale();
  const t = useT(sourcesMessages);
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
          {t.flagship}
        </h2>
        <p className="t-body mt-2 max-w-[65ch] text-ink-secondary">
          {t.flagshipLead}
        </p>
        <dl className="t-caption mt-3 flex max-w-[75ch] flex-wrap gap-x-4 gap-y-1 text-ink-secondary">
          {t.levels.map(([term, def]) => (
            <div key={term} className="flex gap-1">
              <dt className="font-medium text-ink">{term}</dt>
              <dd>{def}</dd>
            </div>
          ))}
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
  const t = useT(sourcesMessages);
  const { locale } = useLocale();
  const [openAll, setOpenAll] = useState(false);
  const all = useMemo(() => groupSourcesByDomain(entries), []);
  const total = all.reduce((n, g) => n + g.sources.length, 0);

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return all;
    return all
      .map((g) => ({
        ...g,
        sources: g.sources.filter((s) => [g.domain, s.title, s.url, ...s.citedBy.map((e) => e.title)].some((v) => v.toLowerCase().includes(needle))),
      }))
      .filter((g) => g.sources.length > 0);
  }, [q, all]);

  const searching = q.trim().length > 0;

  return (
    <div>
      <PageHeader
        title={t.title}
        lead={t.lead(total, all.length)}
      />

      <FlagshipGallery />

      <section aria-labelledby="all-sources">
        <h2 id="all-sources" className="t-h2 mb-6 text-ink">
          {t.allSources}
        </h2>

        {all.length === 0 ? (
          <EmptyState title={t.emptyTitle} description={t.emptyBody} />
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="w-full max-w-md">
                <Input label={t.search} placeholder={t.searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} type="search" />
              </div>
              <Button variant="secondary" size="sm" onClick={() => setOpenAll((v) => !v)}>
                {openAll ? t.closeAll : t.openAll}
              </Button>
            </div>

            {groups.length === 0 ? (
              <EmptyState title={t.noMatchTitle} description={t.noMatchBody} />
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
                              {t.citedBy}
                              {s.citedBy.map((e) => (
                                <Link key={e.id} to={`/knowledge/${e.category}/${e.slug}`} lang={langFor(e.title, locale)}>
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
