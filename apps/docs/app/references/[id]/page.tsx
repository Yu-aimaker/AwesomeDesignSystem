import { getAtlas } from "../../../lib/content";
import { notFound } from "next/navigation";
import { getDictionary } from "../../../lib/i18n";
import { getRequestLocale } from "../../../lib/i18n-server";

export async function generateStaticParams() {
  const { references } = await getAtlas();
  return references.map((r) => ({ id: r.id }));
}

export default async function ReferenceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { references, rules } = await getAtlas();
  const ref = references.find((r) => r.id === id);
  if (!ref) notFound();
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const d = dictionary.referenceDetail;
  const linked = rules.filter((rule) => ref.linkedRuleIds.includes(rule.id) || rule.referenceIds.includes(ref.id));
  return (
    <article>
      <p className="meta">{ref.id}</p>
      <h1>{ref.title}</h1>
      <p><a href={ref.url} rel="noreferrer">{ref.url}</a></p>
      {locale === "ja" && ref.language !== "ja" ? <p className="translation-notice">{dictionary.canon.fallbackNotice}</p> : null}
      <p lang={ref.language}>{ref.summary}</p>
      <h2>{d.teaches}</h2>
      <ul lang={ref.language}>{ref.lessons.map((l) => <li key={l}>{l}</li>)}</ul>
      <h2>{d.applied}</h2>
      <ul>
        {linked.map((rule) => (
          <li key={rule.id}><code>{rule.id}</code> — {rule.title}</li>
        ))}
      </ul>
      <h2>{d.caveats}</h2>
      <p lang={ref.language}>{ref.antiImitationNote}</p>
      <p className="meta">{d.evidence}: {ref.evidenceLevel} · {d.verified} {ref.lastVerifiedDate} · {d.cadence} {ref.reviewCadenceDays}d</p>
    </article>
  );
}
