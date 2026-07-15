import Link from "next/link";
import { docsForDomain } from "../../lib/markdown";
import { Prose } from "../../components/prose";
import { formatMessage, getDictionary, localizePathname } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";

import { createLocalizedMetadata } from "../../lib/metadata";
import { PageHeader } from "../../components/page-header";
export const generateMetadata = () => createLocalizedMetadata("/brand", (dictionary) => dictionary.brand.title, (dictionary) => dictionary.brand.intro);

export default async function DomainPage() {
  const locale = await getRequestLocale();
  const docs = await docsForDomain("brand", locale);
  const featured = docs[0];
  const dictionary = getDictionary(locale);
  const d = dictionary.brand;
  return (
    <div className="ads-motion-enter route-page">
      <PageHeader eyebrow={locale === "ja" ? "言葉・形・動きの一貫性" : "Coherence across words, form, and motion"} title={d.title} description={formatMessage(d.intro, { count: docs.length })} meta={<code>{docs.length} modules · brand/</code>} />
      {locale === "ja" ? <p className="translation-notice" role="note" lang="ja">{dictionary.canon.fallbackNotice}</p> : null}
      <Link className="hero-cta" href={localizePathname("/brand/workbench", locale)}>{d.workbench} <span aria-hidden="true">↗</span></Link>
      <div className="grid-cards" style={{ marginBottom: "var(--space-8)" }}>
        {docs.map((doc) => (
          <Link key={doc.slug} className="card-link" href={localizePathname("/canon/" + doc.slug, locale)}>
            <strong>{doc.title}</strong>
            <p className="meta">{doc.excerpt || doc.slug}</p>
          </Link>
        ))}
      </div>
      {featured ? (
        <section>
          <h2>{d.featured}: {featured.title}</h2>
          <div lang="en"><Prose html={featured.html} /></div>
        </section>
      ) : (
        <p>{d.empty}</p>
      )}
    </div>
  );
}
