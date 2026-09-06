import { Link } from "react-router";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "../layout/Page";
import { EmptyState } from "../ds/components/EmptyState";
import { entries, groupSourcesByDomain } from "../lib/knowledge";

export function Sources() {
  const groups = groupSourcesByDomain(entries);
  const total = groups.reduce((n, g) => n + g.sources.length, 0);
  return (
    <div>
      <PageHeader title="ソース一覧" lead={`Knowledge と AwesomeDS 解説が参照している URL。${total} 件、${groups.length} ドメイン。`} />
      {groups.length === 0 ? (
        <EmptyState title="ソースはまだありません" description="frontmatter の sources に URL が書かれると、ここに集計されます。" />
      ) : (
        <div className="flex flex-col gap-10">
          {groups.map((g) => (
            <section key={g.domain} aria-labelledby={`dom-${g.domain}`}>
              <h2 id={`dom-${g.domain}`} className="t-h3 text-ink">
                {g.domain} <span className="t-caption text-ink-muted">{g.sources.length}</span>
              </h2>
              <ul className="mt-3 divide-y divide-hairline rounded-lg border border-hairline bg-surface">
                {g.sources.map((s) => (
                  <li key={s.url} className="flex flex-col gap-1 p-4">
                    <a href={s.url} target="_blank" rel="noreferrer" className="t-body inline-flex items-start gap-1" style={{ overflowWrap: "anywhere" }}>
                      {s.title}
                      <ExternalLink className="mt-1.5 size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
                    </a>
                    <p className="t-caption text-ink-muted" style={{ overflowWrap: "anywhere" }}>
                      {s.url}
                    </p>
                    <p className="t-caption flex flex-wrap gap-x-2 text-ink-secondary">
                      引用:
                      {s.citedBy.map((e) => (
                        <Link key={e.id} to={`/knowledge/${e.category}/${e.slug}`}>
                          {e.title}
                        </Link>
                      ))}
                    </p>
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
