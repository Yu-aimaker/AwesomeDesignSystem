import Link from "next/link";
import { loadAllCanonDocs } from "../../lib/markdown";
import { getRequestLocale } from "../../lib/i18n-server";
import { localizePathname } from "../../lib/i18n";
import { formatMessage, getDictionary } from "../../lib/i18n";

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
    <div className="ads-motion-enter">
      <h1>{dictionary.canon.libraryTitle}</h1>
      <p className="muted">{formatMessage(dictionary.canon.libraryIntro, { count: docs.length })}</p>
      {[...byDomain.entries()].map(([domain, items]) => (
        <section key={domain}>
          <h2>{domain}</h2>
          <ul>
            {items.map((doc) => (
              <li key={doc.slug}>
                <Link href={localizePathname("/canon/" + doc.slug, locale)}>{doc.title}</Link>
                <span className="meta"> — {doc.slug}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
