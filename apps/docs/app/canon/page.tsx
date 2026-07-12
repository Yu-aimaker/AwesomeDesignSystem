import Link from "next/link";
import { loadAllCanonDocs } from "../../lib/markdown";

export const metadata = { title: "Canon" };

export default async function CanonIndexPage() {
  const docs = await loadAllCanonDocs();
  const byDomain = new Map<string, typeof docs>();
  for (const doc of docs) {
    const list = byDomain.get(doc.domain) ?? [];
    list.push(doc);
    byDomain.set(doc.domain, list);
  }
  return (
    <div className="ads-motion-enter">
      <h1>Canon library</h1>
      <p className="muted">{docs.length} Markdown modules from design-system/, fully readable on the site.</p>
      {[...byDomain.entries()].map(([domain, items]) => (
        <section key={domain}>
          <h2>{domain}</h2>
          <ul>
            {items.map((doc) => (
              <li key={doc.slug}>
                <Link href={"/canon/" + doc.slug}>{doc.title}</Link>
                <span className="meta"> — {doc.slug}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
