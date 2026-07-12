import Link from "next/link";
import { filterReferences, getAtlas } from "../../lib/content";

export const metadata = { title: "Reference Atlas" };

export default async function ReferencesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const topic = typeof sp.topic === "string" ? sp.topic : undefined;
  const sourceClass = typeof sp.sourceClass === "string" ? sp.sourceClass : undefined;
  const region = typeof sp.region === "string" ? sp.region : undefined;
  const freshness = typeof sp.freshness === "string" ? sp.freshness : undefined;
  const { references } = await getAtlas();
  const filtered = filterReferences(references, { q, topic, sourceClass, region, freshness });
  const topics = Array.from(new Set(references.flatMap((r) => r.topics))).sort();

  return (
    <div>
      <h1>Reference Atlas</h1>
      <p className="muted">Structured evidence — not a raw link dump. Each source links to AwesomeDS conclusions.</p>
      <form className="filters" method="get" aria-label="Filter references">
        <label className="ads-field">
          <span className="ads-label">Search</span>
          <input name="q" placeholder="Search title, lesson, owner…" defaultValue={q ?? ""} aria-label="Search references" />
        </label>
        <label className="ads-field">
          <span className="ads-label">Topic</span>
          <select name="topic" defaultValue={topic ?? ""} aria-label="Filter by topic">
            <option value="">All topics</option>
            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="ads-field">
          <span className="ads-label">Source class</span>
          <select name="sourceClass" defaultValue={sourceClass ?? ""} aria-label="Filter by source class">
            <option value="">All source classes</option>
            {["standard","official-system","design-engineering","implementation","brand","research","book","repository","signal"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="ads-field">
          <span className="ads-label">Region</span>
          <select name="region" defaultValue={region ?? ""} aria-label="Filter by region">
            <option value="">All regions</option>
            {["global","us","eu","jp","kr","cn","other"].map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className="ads-field">
          <span className="ads-label">Freshness</span>
          <select name="freshness" defaultValue={freshness ?? ""} aria-label="Filter by freshness">
            <option value="">All freshness</option>
            {["healthy","due","stale","expired","unknown"].map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
        <button className="ads-btn ads-btn--primary ads-btn--md" type="submit">Apply filters</button>
      </form>
      <p className="meta">{filtered.length} of {references.length} sources</p>
      <table className="table">
        <thead><tr><th>Source</th><th>Class</th><th>Topics</th><th>Freshness</th><th>Linked rules</th></tr></thead>
        <tbody>
          {filtered.map((ref) => (
            <tr key={ref.id}>
              <td><Link href={"/references/" + encodeURIComponent(ref.id)}>{ref.title}</Link><div className="meta">{ref.owner}</div></td>
              <td>{ref.sourceClass}</td>
              <td>{ref.topics.join(", ")}</td>
              <td><span className={"pill " + ref.freshnessState}>{ref.freshnessState}</span></td>
              <td className="meta">{ref.linkedRuleIds.join(", ") || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 ? <p role="status">No references match these filters.</p> : null}
    </div>
  );
}
