import { notFound } from "next/navigation";
import Link from "next/link";
import { loadAllCanonDocs, loadCanonDoc } from "../../../lib/markdown";
import { Prose } from "../../../components/prose";
import { getDictionary, localizePathname } from "../../../lib/i18n";
import { getRequestLocale } from "../../../lib/i18n-server";
import { createLocalizedMetadata } from "../../../lib/metadata";
import { getAtlas } from "../../../lib/content";

export async function generateStaticParams() {
  const docs = await loadAllCanonDocs();
  return docs.map((d) => ({ slug: d.slug.split("/") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const rel = "design-system/" + slug.join("/") + ".md";
  const doc = await loadCanonDoc(rel);
  return createLocalizedMetadata(`/canon/${slug.join("/")}`, doc?.title ?? "Canon", doc?.excerpt);
}

export default async function CanonDocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const rel = "design-system/" + slug.join("/") + ".md";
  const locale = await getRequestLocale();
  const doc = await loadCanonDoc(rel, locale);
  if (!doc) notFound();
  const { rules } = await getAtlas();
  const mentionedRules = rules.filter((rule) => doc.html.includes(rule.id));
  const d = getDictionary(locale).canon;
  return (
    <article className="ads-motion-enter">
      <p className="meta">
        <Link href={localizePathname("/canon", locale)}>{d.breadcrumb}</Link> / {doc.domain}
      </p>
      {locale === "ja" ? <aside className="translation-notice" role="note">{d.fallbackNotice} <span className="pill">{d.fallbackLanguage}</span></aside> : null}
      <div lang="en"><Prose html={doc.html} /></div>
      {mentionedRules.length ? <section aria-labelledby="traceability-heading">
        <h2 id="traceability-heading">{d.traceability}</h2>
        <ul>{mentionedRules.map((rule) => <li key={rule.id}><Link href={localizePathname(`/rules/${encodeURIComponent(rule.id)}`, locale)}><code>{rule.id}</code> — {rule.title}</Link></li>)}</ul>
      </section> : null}
      <p className="meta">{d.sourceLabel}: <code>{doc.path}</code></p>
    </article>
  );
}
