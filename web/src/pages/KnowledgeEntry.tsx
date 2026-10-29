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
  // lang="en" on English bodies also keeps words whole in table cells (ja uses overflow-wrap: anywhere).
  const showJaNote = locale !== "ja" && entry.origin === "knowledge";
  const bodyLang = entry.origin === "awesomeds" ? "en" : showJaNote ? "ja" : undefined;
  // The page header already shows the title; drop the Markdown's own leading H1 so there is one h1.
  const body = entry.body.replace(/^\s*#\s+.+\n/, "");

  return (
    <article>
      <Link to="/knowledge" className="t-body-sm inline-flex items-center gap-1 text-ink-secondary">
        <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden /> {t.backToList}
      </Link>
      <header className="mt-6 measure">
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
      {showJaNote && <p className="t-body-sm mt-12 measure rounded-md border border-hairline bg-canvas-soft px-4 py-3 text-ink-secondary">{t.bodyLanguageNote}</p>}
      <div className={showJaNote ? "prose t-body mt-6 text-ink" : "prose t-body mt-12 text-ink"} lang={bodyLang}>
        <Markdown remarkPlugins={[remarkGfm]} components={{ a: ({ href, children }) => <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{children}</a> }}>
          {body}
        </Markdown>
      </div>
      <p className="t-caption mt-12 text-ink-muted">
        {t.sourceFile}
        <code>{entry.path}</code>
      </p>
    </article>
  );
}
