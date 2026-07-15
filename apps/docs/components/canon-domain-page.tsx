import Link from "next/link";
import { docsForDomain, domainRoutes } from "../lib/markdown";
import { formatMessage, getDictionary, localizePathname } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";
import { Prose } from "./prose";
import { PageHeader } from "./page-header";

type DomainKey = keyof typeof domainRoutes;

const navLabels = {
  principles: "Principles",
  foundations: "Foundations",
  interaction: "Interaction",
  patterns: "Patterns",
  "ai-design": "AI Design",
  review: "Review",
} as const;

export async function CanonDomainPage({ domainKey }: { domainKey: DomainKey }) {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const docs = await docsForDomain(domainKey, locale);
  const featured = docs[0];
  const localizedDomain = domainKey as keyof typeof navLabels;
  const labelKey = localizedDomain in navLabels ? navLabels[localizedDomain] : undefined;
  const title = labelKey ? dictionary.nav[labelKey] : domainRoutes[domainKey].title;
  return (
    <div className="ads-motion-enter route-page">
      <PageHeader
        eyebrow={locale === "ja" ? "標準体系の領域" : "Canon domain"}
        title={title}
        description={formatMessage(dictionary.canon.domainIntro, { count: docs.length })}
        meta={<code>{docs.length} modules · {domainKey}</code>}
      />
      {locale === "ja" ? <aside className="translation-notice" role="note">{dictionary.canon.fallbackNotice}</aside> : null}
      <div className="grid-cards domain-card-grid">
        {docs.map((doc) => <Link key={doc.slug} className="card-link" href={localizePathname("/canon/" + doc.slug, locale)}><strong>{doc.title}</strong><p className="meta">{doc.excerpt || doc.slug}</p></Link>)}
      </div>
      {featured ? <section className="featured-document"><p className="eyebrow">{dictionary.canon.featured}</p><h2>{featured.title}</h2><Prose html={featured.html} /></section> : <p role="status">{dictionary.canon.empty}</p>}
    </div>
  );
}
