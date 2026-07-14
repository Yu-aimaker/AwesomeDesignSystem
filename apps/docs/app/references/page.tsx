import Link from "next/link";
import { filterReferences, getAtlas } from "../../lib/content";
import { formatMessage, getDictionary, localizePathname } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";

import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () => createLocalizedMetadata("/references", (dictionary) => dictionary.references.title, (dictionary) => dictionary.references.intro);

export default async function ReferencesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const topic = typeof sp.topic === "string" ? sp.topic : undefined;
  const sourceClass = typeof sp.sourceClass === "string" ? sp.sourceClass : undefined;
  const owner = typeof sp.owner === "string" ? sp.owner : undefined;
  const language = typeof sp.language === "string" ? sp.language : undefined;
  const evidenceLevel = typeof sp.evidenceLevel === "string" ? sp.evidenceLevel : undefined;
  const medium = typeof sp.medium === "string" ? sp.medium : undefined;
  const driftRisk = typeof sp.driftRisk === "string" ? sp.driftRisk : undefined;
  const region = typeof sp.region === "string" ? sp.region : undefined;
  const freshness = typeof sp.freshness === "string" ? sp.freshness : undefined;
  const { references } = await getAtlas();
  const filtered = filterReferences(references, { q, topic, sourceClass, owner, language, evidenceLevel, medium, driftRisk, region, freshness });
  const topics = Array.from(new Set(references.flatMap((r) => r.topics))).sort();
  const owners = Array.from(new Set(references.map((r) => r.owner))).sort();
  const languages = Array.from(new Set(references.map((r) => r.language))).sort();
  const evidenceLevels = Array.from(new Set(references.map((r) => r.evidenceLevel))).sort();
  const locale = await getRequestLocale();
  const d = getDictionary(locale).references;

  return (
    <div>
      <h1>{d.title}</h1>
      <p className="muted">{d.intro}</p>
      <form className="filters" method="get" aria-label={d.filterLabel}>
        <label className="ads-field">
          <span className="ads-label">{d.search}</span>
          <input name="q" placeholder={d.searchPlaceholder} defaultValue={q ?? ""} aria-label={d.search} />
        </label>
        <label className="ads-field">
          <span className="ads-label">{d.owner}</span>
          <select name="owner" defaultValue={owner ?? ""} aria-label={d.owner}>
            <option value="">{d.allOwners}</option>
            {owners.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="ads-field">
          <span className="ads-label">{d.language}</span>
          <select name="language" defaultValue={language ?? ""} aria-label={d.language}>
            <option value="">{d.allLanguages}</option>
            {languages.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="ads-field">
          <span className="ads-label">{d.evidenceLevel}</span>
          <select name="evidenceLevel" defaultValue={evidenceLevel ?? ""} aria-label={d.evidenceLevel}>
            <option value="">{d.allEvidence}</option>
            {evidenceLevels.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="ads-field">
          <span className="ads-label">{d.topic}</span>
          <select name="topic" defaultValue={topic ?? ""} aria-label={d.topic}>
            <option value="">{d.allTopics}</option>
            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="ads-field">
          <span className="ads-label">{d.sourceClass}</span>
          <select name="sourceClass" defaultValue={sourceClass ?? ""} aria-label={d.sourceClass}>
            <option value="">{d.allClasses}</option>
            {["standard","official-system","design-engineering","implementation","brand","research","book","repository","signal"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="ads-field">
          <span className="ads-label">{d.medium}</span>
          <select name="medium" defaultValue={medium ?? ""} aria-label={d.medium}>
            <option value="">{d.allMedia}</option>
            {["standard","documentation","website","repository","article","book"].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="ads-field">
          <span className="ads-label">{d.driftRisk}</span>
          <select name="driftRisk" defaultValue={driftRisk ?? ""} aria-label={d.driftRisk}>
            <option value="">{d.allDriftRisks}</option>
            {["low","medium","high"].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="ads-field">
          <span className="ads-label">{d.region}</span>
          <select name="region" defaultValue={region ?? ""} aria-label={d.region}>
            <option value="">{d.allRegions}</option>
            {["global","us","eu","jp","kr","cn","other"].map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className="ads-field">
          <span className="ads-label">{d.freshness}</span>
          <select name="freshness" defaultValue={freshness ?? ""} aria-label={d.freshness}>
            <option value="">{d.allFreshness}</option>
            {["healthy","due","stale","expired","unknown"].map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
        <button className="ads-btn ads-btn--primary ads-btn--md" type="submit">{d.apply}</button>
      </form>
      <p className="meta">{formatMessage(d.count, { shown: filtered.length, total: references.length })}</p>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>{d.source}</th><th>{d.sourceClass}</th><th>{d.medium}</th><th>{d.topics}</th><th>{d.freshness}</th><th>{d.linkedRules}</th></tr></thead>
        <tbody>
          {filtered.map((ref) => (
            <tr key={ref.id}>
              <td><Link href={localizePathname("/references/" + encodeURIComponent(ref.id), locale)}>{ref.title}</Link><div className="meta">{ref.owner}</div></td>
              <td>{ref.sourceClass}</td>
              <td>{ref.medium}</td>
              <td>{ref.topics.join(", ")}</td>
              <td><span className={"pill " + ref.freshnessState}>{ref.freshnessState}</span></td>
              <td className="meta">{ref.linkedRuleIds.join(", ") || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
      {filtered.length === 0 ? <p role="status">{d.noResults}</p> : null}
    </div>
  );
}
