import Link from "next/link";
import { notFound } from "next/navigation";
import { getAtlas } from "../../../lib/content";
import { getRequestLocale } from "../../../lib/i18n-server";
import { localizePathname } from "../../../lib/i18n";
import { createLocalizedMetadata } from "../../../lib/metadata";

export async function generateStaticParams() {
  const { artifacts } = await getAtlas();
  return artifacts.map((artifact) => ({ id: artifact.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { artifacts } = await getAtlas();
  const artifact = artifacts.find((candidate) => candidate.id === id);
  return createLocalizedMetadata(`/artifacts/${encodeURIComponent(id)}`, artifact?.title ?? "Artifact", artifact?.path);
}

export default async function ArtifactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getRequestLocale();
  const { artifacts, rules, references } = await getAtlas();
  const artifact = artifacts.find((candidate) => candidate.id === id);
  if (!artifact) notFound();
  const t = (english: string, japanese: string) => locale === "ja" ? japanese : english;
  const linkedRules = rules.filter((rule) => artifact.ruleIds.includes(rule.id));
  const linkedReferences = references.filter((reference) => artifact.referenceIds.includes(reference.id));
  const verifiers = artifacts.filter((candidate) => candidate.verifiesArtifactIds?.includes(artifact.id));

  return <article className="ads-motion-enter">
    <p className="meta"><Link href={localizePathname("/status", locale)}>{t("System status", "システムステータス")}</Link> / {artifact.kind}</p>
    <p className="meta"><code>{artifact.id}</code></p>
    <h1 lang="en">{artifact.title}</h1>
    <h2>{t("Repository implementation", "リポジトリ実装")}</h2>
    <p><code>{artifact.path}</code></p>
    <h2>{t("Implemented rules", "実装しているルール")}</h2>
    <ul>{linkedRules.map((rule) => <li key={rule.id}><Link href={localizePathname(`/rules/${encodeURIComponent(rule.id)}`, locale)}><code>{rule.id}</code> — <span lang="en">{rule.title}</span></Link></li>)}</ul>
    <h2>{t("Direct references", "直接参照する根拠")}</h2>
    {linkedReferences.length ? <ul>{linkedReferences.map((reference) => <li key={reference.id}><Link href={localizePathname(`/references/${encodeURIComponent(reference.id)}`, locale)}><code>{reference.id}</code> — <span lang={reference.language}>{reference.title}</span></Link></li>)}</ul> : <p className="muted">{t("No direct reference; trace through the implemented rules.", "直接参照はありません。実装ルールから根拠を追跡できます。")}</p>}
    <h2>{t("Verification artifacts", "検証成果物")}</h2>
    {verifiers.length ? <ul>{verifiers.map((verifier) => <li key={verifier.id}><Link href={localizePathname(`/artifacts/${encodeURIComponent(verifier.id)}`, locale)}><code>{verifier.id}</code> — <span lang="en">{verifier.title}</span></Link></li>)}</ul> : <p className="muted">{t("No separate verifier is declared for this artifact kind.", "この成果物種別には個別の検証成果物が宣言されていません。")}</p>}
  </article>;
}
