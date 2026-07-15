import { getAtlas } from "../../../lib/content";
import { notFound } from "next/navigation";
import { getDictionary, localizePathname } from "../../../lib/i18n";
import { getRequestLocale } from "../../../lib/i18n-server";
import { createLocalizedMetadata } from "../../../lib/metadata";
import Link from "next/link";
import { PageHeader } from "../../../components/page-header";

export async function generateStaticParams() {
  const { references } = await getAtlas();
  return references.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { references } = await getAtlas();
  const reference = references.find((item) => item.id === id);
  return createLocalizedMetadata(`/references/${encodeURIComponent(id)}`, reference?.title ?? "Reference", reference?.summary);
}

export default async function ReferenceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { references, rules, artifacts } = await getAtlas();
  const ref = references.find((r) => r.id === id);
  if (!ref) notFound();
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const d = dictionary.referenceDetail;
  const linked = rules.filter((rule) => ref.linkedRuleIds.includes(rule.id) || rule.referenceIds.includes(ref.id));
  const implementations = artifacts.filter((artifact) => ref.linkedArtifactIds.includes(artifact.id) || artifact.referenceIds.includes(ref.id));
  return (
    <article className="ads-motion-enter route-page reference-detail">
      <PageHeader eyebrow={`${ref.id} · ${ref.sourceClass}`} title={ref.title} description={ref.summary} meta={<span>{d.verified} <time dateTime={ref.lastVerifiedDate}>{ref.lastVerifiedDate}</time> · {d.cadence} {ref.reviewCadenceDays}d</span>} />
      <p className="source-url"><a href={ref.url} rel="noreferrer">{ref.url}<span aria-hidden="true">↗</span></a></p>
      {locale === "ja" && ref.language !== "ja" ? <p className="translation-notice">{dictionary.canon.fallbackNotice}</p> : null}
      <h2>{d.teaches}</h2>
      <ul lang={ref.language}>{ref.lessons.map((l) => <li key={l}>{l}</li>)}</ul>
      <h2>{d.applied}</h2>
      <ul>
        {linked.map((rule) => (
          <li key={rule.id}><Link href={localizePathname(`/rules/${encodeURIComponent(rule.id)}`, locale)}><code>{rule.id}</code> — {rule.title}</Link></li>
        ))}
      </ul>
      <h2>{d.implementations}</h2>
      {implementations.length ? <ul>{implementations.map((artifact) => (
        <li key={artifact.id}><Link href={localizePathname(`/artifacts/${encodeURIComponent(artifact.id)}`, locale)}><code>{artifact.id}</code> — {artifact.title}</Link> <span className="meta">({artifact.path})</span></li>
      ))}</ul> : <p className="muted">{d.noImplementations}</p>}
      <h2>{d.caveats}</h2>
      <p lang={ref.language}>{ref.antiImitationNote}</p>
      <p className="meta">{d.evidence}: {ref.evidenceLevel} · {d.verified} {ref.lastVerifiedDate} · {d.cadence} {ref.reviewCadenceDays}d</p>
    </article>
  );
}
