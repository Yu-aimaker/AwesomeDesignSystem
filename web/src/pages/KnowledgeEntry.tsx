import { useParams } from "react-router";
import { Link } from "../i18n/router";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { SourceList } from "../layout/Page";
import { Badge } from "../ds/components/Badge";
import { findEntry } from "../lib/knowledge";
import { NotFound } from "./NotFound";
import { useLocale, useT } from "../i18n/context";
import { knowledgeMessages, langFor } from "../i18n/messages/knowledge";

export function KnowledgeEntry() {
  const { locale } = useLocale();
  const t = useT(knowledgeMessages);
  const { category = "", slug = "" } = useParams();
  const entry = findEntry(category, slug);
  if (!entry) return <NotFound />;
  // Knowledge/ bodies are written in Japanese; AwesomeDS/foundations bodies are English.
  const bodyLang = locale !== "ja" && entry.origin === "knowledge" ? "ja" : undefined;

  return (
    <article>
      <Link to="/knowledge" className="t-body-sm inline-flex items-center gap-1 text-ink-secondary">
        <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden /> {t.backToList}
      </Link>
      <header className="mt-6 max-w-[65ch]">
        <p className="t-caption text-ink-muted">
          {entry.categoryLabel[locale]}
          {entry.updated && t.updated(entry.updated)}
        </p>
        <h1 className="t-h1 mt-2 text-ink" lang={langFor(entry.title, locale)}>
          {entry.title}
        </h1>
        {entry.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1" aria-label={t.tags}>
            {entry.tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
        )}
      </header>
      {entry.sources.length > 0 && <SourceList sources={entry.sources} title={t.entrySources} />}
      {bodyLang && <p className="t-body-sm mt-12 max-w-[65ch] rounded-md border border-hairline bg-canvas-soft px-4 py-3 text-ink-secondary">{t.bodyLanguageNote}</p>}
      <div className={bodyLang ? "prose t-body mt-6 text-ink" : "prose t-body mt-12 text-ink"} lang={bodyLang}>
        <Markdown remarkPlugins={[remarkGfm]} components={{ a: ({ href, children }) => <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{children}</a> }}>
          {entry.body}
        </Markdown>
      </div>
      <p className="t-caption mt-12 text-ink-muted">
        {t.sourceFile}
        <code>{entry.path}</code>
      </p>
    </article>
  );
}
