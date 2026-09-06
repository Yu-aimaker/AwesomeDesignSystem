import { useMemo, useState } from "react";
import { Link } from "react-router";
import { PageHeader } from "../layout/Page";
import { Input } from "../ds/components/Input";
import { Badge } from "../ds/components/Badge";
import { EmptyState } from "../ds/components/EmptyState";
import { AWESOMEDS_CATEGORY, entries, groupByCategory } from "../lib/knowledge";
import { cx } from "../ds/cx";

const typeLabel: Record<string, string> = {
  repo: "リポジトリ",
  library: "ライブラリ",
  skill: "スキル",
  article: "記事",
  product: "プロダクト",
  guideline: "ガイドライン",
  "design-system": "デザインシステム",
  foundation: "解説",
};

export function Knowledge() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const categories = useMemo(() => groupByCategory(entries), []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries.filter((e) => {
      if (category && e.category !== category) return false;
      if (!needle) return true;
      return [e.title, e.body, e.tags.join(" "), e.categoryLabel].some((s) => s.toLowerCase().includes(needle));
    });
  }, [q, category]);

  const groups = useMemo(() => groupByCategory(filtered), [filtered]);
  const knowledgeCount = entries.filter((e) => e.origin === "knowledge").length;

  return (
    <div>
      <PageHeader
        title="ナレッジ"
        lead={`参考にしたスキル、OSS、デザインシステム、ガイドライン、記事の要約です。${knowledgeCount} 件。各エントリは出典リンクと「AwesomeDS への反映」を持ちます。AwesomeDS 自身の解説もここから読めます。`}
      />

      <div className="mb-10 flex flex-col gap-4">
        <div className="max-w-md">
          <Input label="検索" placeholder="タイトル、本文、タグ" value={q} onChange={(e) => setQ(e.target.value)} type="search" />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="カテゴリで絞り込む">
          <button
            type="button"
            aria-pressed={category === null}
            onClick={() => setCategory(null)}
            className={cx(
              "t-label h-8 rounded-full border px-3 transition-colors duration-instant",
              category === null ? "border-ink bg-primary text-on-primary" : "border-hairline-strong text-ink-secondary hover:text-ink",
            )}
          >
            すべて
          </button>
          {categories.map((c) => (
            <button
              key={c.category}
              type="button"
              aria-pressed={category === c.category}
              onClick={() => setCategory(category === c.category ? null : c.category)}
              className={cx(
                "t-label h-8 rounded-full border px-3 transition-colors duration-instant",
                category === c.category ? "border-ink bg-primary text-on-primary" : "border-hairline-strong text-ink-secondary hover:text-ink",
              )}
            >
              {c.label} <span className="tabular opacity-70">{c.entries.length}</span>
            </button>
          ))}
        </div>
      </div>

      {entries.length === 0 ? (
        <EmptyState title="ナレッジはまだありません" description="Knowledge/ フォルダに Markdown が追加されると、ここに一覧が表示されます。" />
      ) : groups.length === 0 ? (
        <EmptyState title="一致する項目がありません" description="検索語やカテゴリを変えてみてください。" />
      ) : (
        <div className="flex flex-col gap-12">
          {groups.map((g) => (
            <section key={g.category} aria-labelledby={`cat-${g.category}`}>
              <h2 id={`cat-${g.category}`} className="t-h3 flex items-baseline gap-2 text-ink">
                {g.label}
                <span className="t-caption tabular text-ink-muted">{g.entries.length}</span>
              </h2>
              {g.category === AWESOMEDS_CATEGORY && (
                <p className="t-body-sm mt-2 max-w-[65ch] text-ink-secondary">AwesomeDS の各値の理由と出典。リポジトリの AwesomeDS/foundations にある Markdown をそのまま表示しています。</p>
              )}
              <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
                {g.entries.map((e) => (
                  <li key={e.id}>
                    <Link
                      to={`/knowledge/${e.category}/${e.slug}`}
                      className="grid gap-1 py-4 text-ink no-underline transition-colors duration-instant hover:bg-canvas-soft sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:px-3 sm:-mx-3 sm:rounded-md"
                    >
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="t-body font-medium">{e.title}</span>
                        {e.tags.length > 0 && <span className="t-caption truncate text-ink-muted">{e.tags.slice(0, 5).join(" · ")}</span>}
                      </span>
                      <span className="flex items-center gap-3">
                        {e.type && <Badge>{typeLabel[e.type] ?? e.type}</Badge>}
                        {e.updated && <span className="t-caption tabular text-ink-muted">{e.updated}</span>}
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
