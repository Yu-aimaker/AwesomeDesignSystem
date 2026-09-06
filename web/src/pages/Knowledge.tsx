import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Search } from "lucide-react";
import { PageHeader } from "../layout/Page";
import { Input } from "../ds/components/Input";
import { Badge } from "../ds/components/Badge";
import { EmptyState } from "../ds/components/EmptyState";
import { allTags, entries, groupByCategory } from "../lib/knowledge";
import { cx } from "../ds/cx";

export function Knowledge() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const tags = useMemo(() => allTags(entries), []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries.filter((e) => {
      if (tag && !e.tags.includes(tag)) return false;
      if (!needle) return true;
      return [e.title, e.body, e.tags.join(" "), e.categoryLabel].some((s) => s.toLowerCase().includes(needle));
    });
  }, [q, tag]);

  const groups = useMemo(() => groupByCategory(filtered), [filtered]);

  return (
    <div>
      <PageHeader title="ナレッジ" lead={`調査で集めた根拠。${entries.length} 件。`} />
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Input label="検索" placeholder="タイトル、本文、タグ" value={q} onChange={(e) => setQ(e.target.value)} type="search" />
          <Search className="pointer-events-none absolute right-3 bottom-3 size-4 text-ink-muted" strokeWidth={1.75} aria-hidden />
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="タグで絞り込む">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tag === t}
                onClick={() => setTag(tag === t ? null : t)}
                className={cx("t-caption h-7 rounded-full border px-3 transition-colors duration-instant", tag === t ? "border-ink bg-primary text-on-primary" : "border-hairline-strong text-ink-secondary hover:text-ink")}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {entries.length === 0 ? (
        <EmptyState title="ナレッジはまだありません" description="Knowledge/ フォルダに Markdown が追加されると、ここに一覧が表示されます。" />
      ) : groups.length === 0 ? (
        <EmptyState title="一致する項目がありません" description="検索語やタグを変えてみてください。" />
      ) : (
        <div className="flex flex-col gap-12">
          {groups.map((g) => (
            <section key={g.category} aria-labelledby={`cat-${g.category}`}>
              <h2 id={`cat-${g.category}`} className="t-h3 text-ink">
                {g.label} <span className="t-caption text-ink-muted">{g.entries.length}</span>
              </h2>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {g.entries.map((e) => (
                  <li key={e.id}>
                    <Link to={`/knowledge/${e.category}/${e.slug}`} className="flex h-full flex-col rounded-lg border border-hairline bg-surface p-4 text-ink no-underline transition-colors duration-instant hover:border-hairline-strong hover:bg-canvas-soft">
                      <span className="t-h4">{e.title}</span>
                      <span className="t-caption mt-2 flex flex-wrap gap-1 text-ink-muted">
                        {e.type && <Badge>{e.type}</Badge>}
                        {e.tags.slice(0, 4).map((t) => (
                          <Badge key={t}>{t}</Badge>
                        ))}
                        {e.updated && <span className="ml-auto self-center">{e.updated}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
