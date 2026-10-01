import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Star } from "lucide-react";
import { repos, reposMeta, repoCategoryLabel, compact, daysSince, type RepoEntry } from "../lib/data";
import { entries } from "../lib/knowledge";
import { DataNote, FilterBar, FilterChip, GalleryHeader, SearchBox, Tag } from "../layout/Gallery";
import { Alert } from "../ds/components/Alert";
import { EmptyState } from "../ds/components/EmptyState";
import { repoUrl } from "../lib/nav";
import { cx } from "../ds/cx";

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
      <GalleryHeader title="ランキング" lead="デザインと AI フロントエンドの OSS を GitHub スターで。毎週月曜に自動更新。" stat={repos.length} statLabel="リポジトリ" />

      {pending && (
        <Alert tone="neutral" title="スター数は最初の自動取得を待っています" className="mb-6">
          GitHub Actions の「Update data」が毎週月曜 00:30 UTC に取得します。手動実行もできます。それまでは選定リストとして表示します。
        </Alert>
      )}

      <FilterBar>
        <FilterChip selected={cat === "all"} onSelect={() => setCat("all")} count={repos.length}>
          すべて
        </FilterChip>
        {categories.map(([id, n]) => (
          <FilterChip key={id} selected={cat === id} onSelect={() => setCat(id)} count={n}>
            {repoCategoryLabel[id] ?? id}
          </FilterChip>
        ))}
        <SearchBox value={q} onChange={setQ} placeholder="リポジトリ、topic" />
      </FilterBar>

      {list.length === 0 ? (
        <div className="mt-12">
          <EmptyState title="見つかりません" description="別の語で検索するか、分類を外してください。" />
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
                    <Tag>{repoCategoryLabel[r.category] ?? r.category}</Tag>
                    {r.inTopicTop && <Tag>topic 上位 20</Tag>}
                    {r.archived && <Tag className="text-warning">アーカイブ</Tag>}
                    {k && (
                      <Link to={k.to} className="t-caption">
                        解説
                      </Link>
                    )}
                  </div>
                  {r.description && <p className="t-caption mt-0.5 truncate text-ink-secondary">{r.description}</p>}
                  <p className="t-caption mt-0.5 text-ink-muted sm:hidden">
                    {r.language ?? ""}
                    {days !== null ? ` · ${days} 日前に更新` : ""}
                  </p>
                </div>
                <div className="hidden min-w-0 items-center gap-2 sm:flex">
                  <span className="h-2 flex-1 overflow-hidden rounded-xs bg-surface-sunken">
                    <span className="block h-full rounded-xs bg-accent transition-[width] duration-slow ease-out-ds" style={{ width: `${width}%` }} />
                  </span>
                  <span className="t-caption hidden w-16 truncate text-ink-muted lg:inline">{r.language ?? ""}</span>
                </div>
                <span className="t-mono tabular flex items-center justify-end gap-1 text-ink" title={r.stars !== null ? `${r.stars.toLocaleString()} stars` : r.note ?? "未取得"}>
                  <Star className="size-3.5 text-ink-muted" strokeWidth={1.75} aria-hidden />
                  {r.stars !== null ? compact(r.stars) : "–"}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <DataNote updated={reposMeta.updated}>
        選定リスト + GitHub 検索 topic:design-system の上位 20。取得は{" "}
        <a href={`${repoUrl}/blob/main/scripts/fetch-repos.mjs`} target="_blank" rel="noreferrer">
          scripts/fetch-repos.mjs
        </a>
        。{fetchedCount > 0 ? `${fetchedCount} 件取得済み。` : ""}
      </DataNote>
    </div>
  );
}
