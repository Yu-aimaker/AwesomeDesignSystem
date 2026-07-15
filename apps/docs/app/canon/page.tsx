import Link from "next/link";
import { loadAllCanonDocs } from "../../lib/markdown";
import { getRequestLocale } from "../../lib/i18n-server";
import { localizePathname } from "../../lib/i18n";
import { formatMessage, getDictionary } from "../../lib/i18n";
import { PageHeader } from "../../components/page-header";

import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () => createLocalizedMetadata("/canon", (dictionary) => dictionary.nav.Canon);

export default async function CanonIndexPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const docs = await loadAllCanonDocs(locale);
  const byDomain = new Map<string, typeof docs>();
  for (const doc of docs) {
    const list = byDomain.get(doc.domain) ?? [];
    list.push(doc);
    byDomain.set(doc.domain, list);
  }
  return (
    <div className="ads-motion-enter route-page">
      <PageHeader
        eyebrow={locale === "ja" ? "人とAIの共通言語" : "A shared language for people and agents"}
        title={dictionary.canon.libraryTitle}
        description={formatMessage(dictionary.canon.libraryIntro, { count: docs.length })}
        meta={<code>{docs.length} modules · design-system/</code>}
      />
      <div className="canon-domain-grid">
      {[...byDomain.entries()].map(([domain, items], domainIndex) => (
        <section className="canon-domain" key={domain}>
          <header><span>{String(domainIndex + 1).padStart(2, "0")}</span><h2>{domain}</h2><small>{items.length}</small></header>
          <ul>
            {items.map((doc) => (
              <li key={doc.slug}>
                <Link href={localizePathname("/canon/" + doc.slug, locale)}>{doc.title}</Link>
                <span className="meta">{doc.slug}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      </div>
    </div>
  );
}
