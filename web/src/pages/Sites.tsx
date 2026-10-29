import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router";
import { ExternalLink, Info, Star } from "lucide-react";
import { Link } from "../i18n/router";
import { sites, sitesMeta, siteCategoryLabel, compact, formatDay, type SiteCategory, type SiteEntry } from "../lib/data";
import { DataNote, FilterBar, FilterChip, GalleryHeader, SearchBox, SectionTitle } from "../layout/Gallery";
import { EmptyState } from "../ds/components/EmptyState";
import { Button } from "../ds/components/Button";
import { SegmentedControl } from "../ds/components/SegmentedControl";
import { useLocale, useT } from "../i18n/context";
import { localeMeta } from "../i18n/locales";
import { sitesMessages, type RestrictedSite, type SiteSort } from "../i18n/messages/sites";

const sorts: SiteSort[] = ["stars", "updated", "name"];
const isCategory = (v: string | null): v is SiteCategory => sitesMeta.categories.includes(v as SiteCategory);
const isSort = (v: string | null): v is SiteSort => sorts.includes(v as SiteSort);
const isRestricted = (id: string): id is RestrictedSite => id === "react-bits" || id === "animate-ui" || id === "gsap";

/** Entries without stars or dates go last, then by name. */
function compare(sort: SiteSort) {
  const byName = (a: SiteEntry, b: SiteEntry) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  if (sort === "name") return byName;
  if (sort === "stars") return (a: SiteEntry, b: SiteEntry) => (b.stars ?? -1) - (a.stars ?? -1) || byName(a, b);
  return (a: SiteEntry, b: SiteEntry) => (b.lastUpdated ?? "").localeCompare(a.lastUpdated ?? "") || byName(a, b);
}

/**
 * Recommended sites from AwesomeDS/data/sites.json, grouped by category.
 * `?cat=animation`, `?sort=updated` and `?q=motion` keep the view linkable.
 */
export function Sites() {
  const { locale } = useLocale();
  const t = useT(sitesMessages);
  const [params, setParams] = useSearchParams();
  const cat = isCategory(params.get("cat")) ? (params.get("cat") as SiteCategory) : "all";
  const sort = isSort(params.get("sort")) ? (params.get("sort") as SiteSort) : "stars";
  const q = params.get("q") ?? "";
  const chipsRef = useRef<HTMLDivElement>(null);

  // On narrow screens the chip row scrolls; keep the selected chip in view (e.g. on ?cat=skill).
  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>("[aria-pressed=true]");
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    row.scrollLeft = chip.offsetLeft - row.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
  }, [cat]);

  const setParam = (key: "cat" | "sort" | "q", value: string | null) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );

  // Drop unknown ?cat / ?sort values (e.g. ?cat=all) so the address bar matches what is shown.
  const rawCat = params.get("cat");
  const rawSort = params.get("sort");
  useEffect(() => {
    if ((rawCat === null || isCategory(rawCat)) && (rawSort === null || isSort(rawSort))) return;
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!isCategory(next.get("cat"))) next.delete("cat");
        if (!isSort(next.get("sort"))) next.delete("sort");
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  }, [rawCat, rawSort, setParams]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sites
      .filter((s) => (cat === "all" || s.category === cat) && (!needle || `${s.name} ${s.description} ${s.publisher ?? ""} ${s.repo ?? ""}`.toLowerCase().includes(needle)))
      .sort(compare(sort));
  }, [cat, q, sort]);

  const groups = sitesMeta.categories.map((c) => ({ category: c, items: list.filter((s) => s.category === c) })).filter((g) => g.items.length > 0);

  return (
    <div>
      <GalleryHeader title={t.title} lead={t.lead} stat={sites.length} statLabel={t.statLabel} />

      <FilterBar className="gap-y-3">
        {/* At 390 the chips scroll inside their own row; the inner padding keeps the focus ring and the last chip off the edges. */}
        <div ref={chipsRef} role="group" aria-label={t.categoryGroup} className="-mx-5 w-[calc(100%+2.5rem)] overflow-x-auto [scrollbar-width:none] sm:mx-0 sm:w-full sm:overflow-visible">
          <div className="flex w-max gap-2 px-5 py-1 sm:w-auto sm:flex-wrap sm:px-0 sm:py-0">
            <FilterChip selected={cat === "all"} onSelect={() => setParam("cat", null)} count={sites.length}>
              {t.all}
            </FilterChip>
            {sitesMeta.categories.map((c) => (
              <FilterChip key={c} selected={cat === c} onSelect={() => setParam("cat", cat === c ? null : c)} count={sitesMeta.counts[c]}>
                {siteCategoryLabel[c][locale]}
              </FilterChip>
            ))}
          </div>
        </div>
        <div className="flex w-full min-w-0 items-center gap-2">
          <div className="shrink-0">
            <SegmentedControl size="sm" className="pointer-coarse:[&>button]:h-11" label={t.sortLabel} value={sort} onChange={(v) => setParam("sort", v === "stars" ? null : v)} options={sorts.map((s) => ({ value: s, label: t.sort[s] }))} />
          </div>
          <SearchBox value={q} onChange={(v) => setParam("q", v || null)} placeholder={t.searchPlaceholder} className="sm:w-72" />
        </div>
      </FilterBar>

      <p className="t-caption mt-4 min-h-5 text-ink-muted" aria-live="polite">
        {(cat !== "all" || q.trim()) && t.resultCount(list.length)}
      </p>

      {list.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={t.notFoundTitle}
            description={t.notFoundBody}
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setParams(
                    (prev) => {
                      const next = new URLSearchParams(prev);
                      next.delete("q");
                      next.delete("cat");
                      return next;
                    },
                    { replace: true, preventScrollReset: true },
                  );
                }}
              >
                {t.clearFilters}
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-12">
          {groups.map((g) => (
            <section key={g.category} aria-labelledby={`sites-${g.category}`}>
              <SectionTitle id={`sites-${g.category}`} count={g.items.length}>
                {siteCategoryLabel[g.category][locale]}
              </SectionTitle>
              <p className="t-body-sm mt-1 measure text-ink-secondary">{t.categoryDescription[g.category]}</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {g.items.map((s) => (
                  <SiteCard key={s.id} site={s} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <DataNote updated={sitesMeta.updated}>
        {t.noteBefore} <Link to="/knowledge/research/recommended-sites">{sitesMeta.criteria}</Link>
        {t.noteAfter}
      </DataNote>
    </div>
  );
}

function SiteCard({ site: s }: { site: SiteEntry }) {
  const { locale } = useLocale();
  const t = useT(sitesMessages);
  const tag = localeMeta[locale].tag;
  const repoHref = s.repo ? `https://github.com/${s.repo}` : null;
  const note = isRestricted(s.id) ? t.licenseNote[s.id] : null;

  return (
    <li className="flex min-w-0 flex-col rounded-lg border border-hairline bg-surface p-4 sm:p-5">
      <div className="min-w-0">
        <a href={s.url} target="_blank" rel="noreferrer" className="t-h4 inline-flex max-w-full items-center gap-1.5 text-ink no-underline hover:text-accent">
          <span className="truncate">{s.name}</span>
          <ExternalLink className="size-3.5 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden />
          <span className="sr-only">{t.newTab}</span>
        </a>
        {s.publisher && s.publisher.toLowerCase() !== s.name.toLowerCase() && <p className="t-caption mt-0.5 truncate text-ink-muted">{t.by(s.publisher)}</p>}
      </div>

      <p className="t-body-sm mt-2 flex-1 text-ink-secondary" lang="ja">
        {s.description}
      </p>

      {(s.stars !== null || s.lastUpdated || repoHref) && (
        <div className="t-caption mt-3 flex flex-col gap-1 text-ink-muted">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {s.stars !== null && (
              <span className="t-mono tabular inline-flex items-center gap-1 text-ink" title={t.stars(s.stars.toLocaleString(tag))}>
                <Star className="size-3.5 text-ink-muted" strokeWidth={1.75} aria-hidden />
                <span aria-hidden>{compact(s.stars)}</span>
                <span className="sr-only">{t.stars(s.stars.toLocaleString(tag))}</span>
              </span>
            )}
            {s.lastUpdated && <span>{t.updated(formatDay(s.lastUpdated, tag))}</span>}
          </p>
          {repoHref && (
            <a href={repoHref} target="_blank" rel="noreferrer" aria-label={`${t.repoLabel(s.repo!)}${t.newTab}`} className="t-mono max-w-full self-start truncate">
              {s.repo}
            </a>
          )}
        </div>
      )}

      <div className="mt-3 border-t border-hairline pt-3">
        <p className="t-caption flex flex-wrap items-baseline gap-x-2 text-ink-muted">
          <span>{t.license}</span>
          {s.license ? (
            s.licenseUrl ? (
              <a href={s.licenseUrl} target="_blank" rel="noreferrer" aria-label={`${t.licenseLabel(s.name, s.license)}${t.newTab}`} className="font-medium">
                {s.license}
              </a>
            ) : (
              <span className="font-medium text-ink">{s.license}</span>
            )
          ) : (
            <span className="font-medium text-ink">{s.repo ? t.noLicenseRepo : t.noLicense}</span>
          )}
        </p>
        {note && (
          <p className="t-caption mt-2 flex gap-1.5 rounded-sm bg-warning-soft px-2 py-1.5 text-ink">
            <Info className="mt-0.5 size-3.5 shrink-0 text-warning" strokeWidth={1.75} aria-hidden />
            <span>{note}</span>
          </p>
        )}
      </div>
    </li>
  );
}
