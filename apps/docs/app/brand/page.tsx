import Link from "next/link";
import { docsForDomain, domainRoutes } from "../../lib/markdown";
import { Prose } from "../../components/prose";
import { formatMessage, getDictionary, localizePathname } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";

export const metadata = { title: domainRoutes["brand"].title };

export default async function DomainPage() {
  const docs = await docsForDomain("brand");
  const featured = docs[0];
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const d = dictionary.brand;
  return (
    <div className="ads-motion-enter">
      <h1>{d.title}</h1>
      <p className="muted">{formatMessage(d.intro, { count: docs.length })}</p>
      <p className="translation-notice" role="note" lang="ja">{locale === "ja" ? dictionary.canon.fallbackNotice : null}</p>
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
