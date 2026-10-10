import { useMemo, useState } from "react";
import { Link } from "../i18n/router";
import { Star } from "lucide-react";
import { repos, reposMeta, repoCategoryLabel, compact, daysSince, type RepoEntry } from "../lib/data";
import { entries } from "../lib/knowledge";
import { DataNote, FilterBar, FilterChip, GalleryHeader, SearchBox, Tag } from "../layout/Gallery";
import { Alert } from "../ds/components/Alert";
import { EmptyState } from "../ds/components/EmptyState";
import { repoUrl } from "../lib/nav";
import { cx } from "../ds/cx";
import { useLocale, useT } from "../i18n/context";
import { localeMeta } from "../i18n/locales";
import { rankingsMessages } from "../i18n/messages/rankings";

/** Knowledge entries that cite a repository, by lower-cased github url. */
const knowledgeByRepo = (() => {
  const map = new Map<string, { to: string; title: string }>();
  for (const e of entries) {
    for (const s of e.sources) {
      const m = s.url.toLowerCase().match(/github\.com\/([^/#?]+\/[^/#?]+)/);
      if (m && !map.has(m[1])) map.set(m[1].replace(/\.git$/, ""), { to: `/knowledge/${e.category}/${e.slug}`, title: e.title });
    }
  }
  return map;
})();

const withStars = (r: RepoEntry) => r.stars !== null;

export function Rankings() {
  const { locale } = useLocale();
  const t = useT(rankingsMessages);
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of repos) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return repos
      .filter((r) => (cat === "all" || r.category === cat) && (!needle || `${r.owner}/${r.name} ${r.description ?? ""} ${r.topics.join(" ")}`.toLowerCase().includes(needle)))
      .sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1) || a.name.localeCompare(b.name));
  }, [cat, q]);

  const fetchedCount = repos.filter(withStars).length;
  const max = list.find(withStars)?.stars ?? 0;
  const pending = fetchedCount === 0;

  return (
    <div>
      <GalleryHeader title={t.title} lead={t.lead} stat={repos.length} statLabel={t.statLabel} />

      {pending && (
        <Alert tone="neutral" title={t.pendingTitle} className="mb-6">
          {t.pendingBody}
        </Alert>
      )}

      <FilterBar>
        <FilterChip selected={cat === "all"} onSelect={() => setCat("all")} count={repos.length}>
          {t.all}
        </FilterChip>
        {categories.map(([id, n]) => (
          <FilterChip key={id} selected={cat === id} onSelect={() => setCat(id)} count={n}>
            {repoCategoryLabel[id]?.[locale] ?? id}
          </FilterChip>
        ))}
        <SearchBox value={q} onChange={setQ} placeholder={t.searchPlaceholder} />
      </FilterBar>

      {list.length === 0 ? (
        <div className="mt-12">
          <EmptyState title={t.notFoundTitle} description={t.notFoundBody} />
        </div>
      ) : (
        <ol className="mt-8 overflow-hidden rounded-lg border border-hairline bg-surface">
          {list.map((r, i) => {
            const full = `${r.owner}/${r.name}`;
            const k = knowledgeByRepo.get(full.toLowerCase());
            const days = daysSince(r.pushedAt);
            const width = r.stars && max ? Math.max(2, (r.stars / max) * 100) : 0;
            return (
              <li key={full} className={cx("grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-3 sm:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,12rem)_5rem] sm:px-5", i > 0 && "border-t border-hairline")}>
                <span className="t-mono tabular text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <a href={r.url} target="_blank" rel="noreferrer" className="t-h4 truncate text-ink no-underline hover:text-accent">
                      <span className="text-ink-muted">{r.owner}/</span>
                      {r.name}
                    </a>
                    <Tag>{repoCategoryLabel[r.category]?.[locale] ?? r.category}</Tag>
                    {r.inTopicTop && <Tag>{t.topicTop}</Tag>}
                    {r.archived && <Tag className="text-warning">{t.archived}</Tag>}
                    {k && (
                      <Link to={k.to} className="t-caption">
                        {t.notes}
                      </Link>
                    )}
                  </div>
                  {r.description && <p className="t-caption mt-0.5 truncate text-ink-secondary">{r.description}</p>}
                  <p className="t-caption mt-0.5 text-ink-muted sm:hidden">
                    {r.language ?? ""}
                    {days !== null ? t.updatedDaysAgo(days) : ""}
                  </p>
                </div>
                <div className="hidden min-w-0 items-center gap-2 sm:flex">
                  <span className="h-2 flex-1 overflow-hidden rounded-xs bg-surface-sunken">
                    <span className="block h-full rounded-xs bg-accent transition-[width] duration-slow ease-out-ds" style={{ width: `${width}%` }} />
                  </span>
                  <span className="t-caption hidden w-16 truncate text-ink-muted lg:inline">{r.language ?? ""}</span>
                </div>
                <span className="t-mono tabular flex items-center justify-end gap-1 text-ink" title={r.stars !== null ? t.stars(r.stars.toLocaleString(localeMeta[locale].tag)) : r.note ?? t.notFetched}>
                  <Star className="size-3.5 text-ink-muted" strokeWidth={1.75} aria-hidden />
                  {r.stars !== null ? compact(r.stars) : "–"}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <DataNote updated={reposMeta.updated}>
        {t.noteBefore}{" "}
        <a href={`${repoUrl}/blob/main/scripts/fetch-repos.mjs`} target="_blank" rel="noreferrer">
          scripts/fetch-repos.mjs
        </a>
        {t.noteAfter(fetchedCount)}
      </DataNote>
    </div>
  );
}
