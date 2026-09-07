import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ChevronDown, ExternalLink } from "lucide-react";
import { PageHeader } from "../layout/Page";
import { Input } from "../ds/components/Input";
import { Button } from "../ds/components/Button";
import { EmptyState } from "../ds/components/EmptyState";
import { entries, groupSourcesByDomain } from "../lib/knowledge";

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
        title="出典"
        lead={`ナレッジと AwesomeDS 解説が参照している外部リンクの一覧です。${total} 件、${all.length} ドメイン。リポジトリの Reference/REFERENCE.md と同じ内容を、ドメインごとにまとめています。`}
      />

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
    </div>
  );
}
