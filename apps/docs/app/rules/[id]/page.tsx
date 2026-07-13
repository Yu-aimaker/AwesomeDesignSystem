import Link from "next/link";
import { notFound } from "next/navigation";
import { getAtlas } from "../../../lib/content";
import { getRequestLocale } from "../../../lib/i18n-server";
import { localizePathname } from "../../../lib/i18n";
import { createLocalizedMetadata } from "../../../lib/metadata";

export async function generateStaticParams() {
  const { rules } = await getAtlas();
  return rules.map((rule) => ({ id: rule.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { rules } = await getAtlas();
  const rule = rules.find((candidate) => candidate.id === id);
  return createLocalizedMetadata(`/rules/${encodeURIComponent(id)}`, rule?.title ?? "Canon rule", rule?.summary);
}

export default async function RuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getRequestLocale();
  const { rules, references, artifacts } = await getAtlas();
  const rule = rules.find((candidate) => candidate.id === id);
  if (!rule) notFound();
  const supportingReferences = references.filter((reference) => rule.referenceIds.includes(reference.id));
  const implementations = artifacts.filter((artifact) => rule.artifactIds.includes(artifact.id) || artifact.ruleIds.includes(rule.id));
  const t = (english: string, japanese: string) => locale === "ja" ? japanese : english;

  return <article className="ads-motion-enter">
    <p className="meta"><Link href={localizePathname("/canon", locale)}>{t("Canon", "体系")}</Link> / {rule.domain}</p>
    <p className="meta"><code>{rule.id}</code> · {rule.status}</p>
    {locale === "ja" ? <aside className="translation-notice" role="note">このルール本文は未翻訳です。英語の原文を表示しています。 <span className="pill">英語</span></aside> : null}
    <h1 lang="en">{rule.title}</h1>
    <p className="muted" lang="en">{rule.summary}</p>
    <h2>{t("Guidance", "実践ガイダンス")}</h2>
    <p lang="en">{rule.guidance}</p>
    <div className="grid-cards">
      <section className="card-link"><h2>{t("Do", "推奨")}</h2><ul lang="en">{rule.do.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section className="card-link"><h2>{t("Do not", "非推奨")}</h2><ul lang="en">{rule.dont.map((item) => <li key={item}>{item}</li>)}</ul></section>
    </div>
    <h2>{t("Verification contract", "検証契約")}</h2>
    <p lang="en">{rule.verification}</p>
    <h2>{t("Supporting references", "根拠リファレンス")}</h2>
    <ul>{supportingReferences.map((reference) => <li key={reference.id}><Link href={localizePathname(`/references/${encodeURIComponent(reference.id)}`, locale)}><code>{reference.id}</code> — {reference.title}</Link></li>)}</ul>
    <h2>{t("Implementations and verification artifacts", "実装・検証成果物")}</h2>
    {implementations.length ? <ul>{implementations.map((artifact) => <li key={artifact.id}><Link href={localizePathname(`/artifacts/${encodeURIComponent(artifact.id)}`, locale)}><code>{artifact.id}</code> — <span lang="en">{artifact.title}</span></Link> <span className="meta">{artifact.kind} · {artifact.path}</span></li>)}</ul> : <p className="muted">{t("No linked implementation yet.", "リンクされた実装はまだありません。")}</p>}
  </article>;
}
