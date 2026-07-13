import Link from "next/link";
import { docsForDomain, domainRoutes } from "../lib/markdown";
import { formatMessage, getDictionary, localizePathname } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";
import { Prose } from "./prose";

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
    <div className="ads-motion-enter">
      <h1>{title}</h1>
      <p className="muted">{formatMessage(dictionary.canon.domainIntro, { count: docs.length })}</p>
      {locale === "ja" ? <aside className="translation-notice" role="note">{dictionary.canon.fallbackNotice}</aside> : null}
      <div className="grid-cards domain-card-grid">
        {docs.map((doc) => <Link key={doc.slug} className="card-link" href={localizePathname("/canon/" + doc.slug, locale)}><strong>{doc.title}</strong><p className="meta">{doc.excerpt || doc.slug}</p></Link>)}
      </div>
      {featured ? <section><h2>{dictionary.canon.featured}: {featured.title}</h2><Prose html={featured.html} /></section> : <p>{dictionary.canon.empty}</p>}
    </div>
  );
}
