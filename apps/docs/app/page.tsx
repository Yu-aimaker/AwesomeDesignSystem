import Link from "next/link";
import { getAtlas } from "../lib/content";

export default async function HomePage() {
  const { references, rules, validation, freshness } = await getAtlas();
  return (
    <div className="ads-motion-enter">
      <section className="hero">
        <p className="pill">Local-first platform</p>
        <h1>Design doctrine that compiles into tokens, components, and proof.</h1>
        <p className="muted">
          AwesomeDS synthesizes primary sources into executable best practices — not a bookmark dump,
          not an undocumented component kit.
        </p>
        <div className="grid-cards">
          <Link className="card-link" href="/references"><strong>Reference Atlas</strong><p className="meta">{references.length} curated sources with freshness</p></Link>
          <Link className="card-link" href="/components"><strong>Components</strong><p className="meta">Accessible React baseline</p></Link>
          <Link className="card-link" href="/motion"><strong>Motion</strong><p className="meta">Intent recipes + reduced motion</p></Link>
          <Link className="card-link" href="/status"><strong>Status</strong><p className="meta">Graph {validation.ok ? "healthy" : "needs attention"} · {freshness.healthy} healthy refs</p></Link>
        </div>
      </section>
      <h2>Canon domains</h2>
      <p className="muted">{rules.length} structured rules currently linked into the evidence graph.</p>
      <ul>
        {rules.slice(0, 8).map((rule) => (
          <li key={rule.id}><code>{rule.id}</code> — {rule.title}</li>
        ))}
      </ul>
    </div>
  );
}
