import { getAtlas } from "../../../lib/content";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { references } = await getAtlas();
  return references.map((r) => ({ id: r.id }));
}

export default async function ReferenceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { references, rules } = await getAtlas();
  const ref = references.find((r) => r.id === id);
  if (!ref) notFound();
  const linked = rules.filter((rule) => ref.linkedRuleIds.includes(rule.id) || rule.referenceIds.includes(ref.id));
  return (
    <article>
      <p className="meta">{ref.id}</p>
      <h1>{ref.title}</h1>
      <p><a href={ref.url} rel="noreferrer">{ref.url}</a></p>
      <p>{ref.summary}</p>
      <h2>What this source teaches</h2>
      <ul>{ref.lessons.map((l) => <li key={l}>{l}</li>)}</ul>
      <h2>Where AwesomeDS applied it</h2>
      <ul>
        {linked.map((rule) => (
          <li key={rule.id}><code>{rule.id}</code> — {rule.title}</li>
        ))}
      </ul>
      <h2>Caveats & anti-imitation</h2>
      <p>{ref.antiImitationNote}</p>
      <p className="meta">Evidence: {ref.evidenceLevel} · Verified {ref.lastVerifiedDate} · Cadence {ref.reviewCadenceDays}d</p>
    </article>
  );
}
