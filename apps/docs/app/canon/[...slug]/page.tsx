import { notFound } from "next/navigation";
import Link from "next/link";
import { loadAllCanonDocs, loadCanonDoc } from "../../../lib/markdown";
import { Prose } from "../../../components/prose";
import { getDictionary, localizePathname } from "../../../lib/i18n";
import { getRequestLocale } from "../../../lib/i18n-server";

export async function generateStaticParams() {
  const docs = await loadAllCanonDocs();
  return docs.map((d) => ({ slug: d.slug.split("/") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const rel = "design-system/" + slug.join("/") + ".md";
  const doc = await loadCanonDoc(rel);
  return { title: doc?.title ?? "Canon" };
}

export default async function CanonDocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const rel = "design-system/" + slug.join("/") + ".md";
  const doc = await loadCanonDoc(rel);
  if (!doc) notFound();
  const locale = await getRequestLocale();
  const d = getDictionary(locale).canon;
  return (
    <article className="ads-motion-enter">
      <p className="meta">
        <Link href={localizePathname("/canon", locale)}>Canon</Link> / {doc.domain}
      </p>
      {locale === "ja" ? <aside className="translation-notice" role="note">{d.fallbackNotice} <span className="pill">{d.fallbackLanguage}</span></aside> : null}
      <div lang="en"><Prose html={doc.html} /></div>
      <p className="meta">{d.sourceLabel}: <code>{doc.path}</code></p>
    </article>
  );
}
