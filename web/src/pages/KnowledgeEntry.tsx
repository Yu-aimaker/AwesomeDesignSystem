import { useParams } from "react-router";
import { Link } from "../i18n/router";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { SourceList } from "../layout/Page";
import { Badge } from "../ds/components/Badge";
import { findEntry } from "../lib/knowledge";
import { NotFound } from "./NotFound";
import { useLocale } from "../i18n/context";

export function KnowledgeEntry() {
  const { locale } = useLocale();
  const { category = "", slug = "" } = useParams();
  const entry = findEntry(category, slug);
  if (!entry) return <NotFound />;

  return (
    <article>
      <Link to="/knowledge" className="t-body-sm inline-flex items-center gap-1 text-ink-secondary">
        <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden /> ナレッジ一覧
      </Link>
      <header className="mt-6 max-w-[65ch]">
        <p className="t-caption text-ink-muted">
          {entry.categoryLabel[locale]}
          {entry.updated && <> ・ 更新 {entry.updated}</>}
        </p>
        <h1 className="t-h1 mt-2 text-ink">{entry.title}</h1>
        {entry.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1" aria-label="タグ">
            {entry.tags.map((t) => (
              <li key={t}>
                <Badge>{t}</Badge>
              </li>
            ))}
          </ul>
        )}
      </header>
      {entry.sources.length > 0 && <SourceList sources={entry.sources} title="この記事の出典" />}
      <div className="prose t-body mt-12 text-ink">
        <Markdown remarkPlugins={[remarkGfm]} components={{ a: ({ href, children }) => <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{children}</a> }}>
          {entry.body}
        </Markdown>
      </div>
      <p className="t-caption mt-12 text-ink-muted">
        元ファイル: <code>{entry.path}</code>
      </p>
    </article>
  );
}
