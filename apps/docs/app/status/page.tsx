import { getAtlas } from "../../lib/content";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const metadata = { title: "Status" };

export default async function StatusPage() {
  const { references, rules, artifacts, signals, validation, freshness } = await getAtlas();
  let report: string | null = null;
  try {
    report = await readFile(path.join(process.cwd(), "../../reports/freshness.json"), "utf8");
  } catch {
    report = null;
  }
  return (
    <div>
      <h1>System status</h1>
      <p className="muted">Integrity signals for content graph, freshness, and coverage.</p>
      <div className="grid-cards">
        <div className="card-link"><strong>Evidence graph</strong><p className="meta">{validation.ok ? "OK" : validation.issues.length + " issues"}</p></div>
        <div className="card-link"><strong>References</strong><p className="meta">{references.length}</p></div>
        <div className="card-link"><strong>Canon rules</strong><p className="meta">{rules.length}</p></div>
        <div className="card-link"><strong>Artifacts</strong><p className="meta">{artifacts.length}</p></div>
        <div className="card-link"><strong>Signals (quarantined)</strong><p className="meta">{signals.length}</p></div>
      </div>
      <h2>Freshness buckets</h2>
      <pre className="code">{JSON.stringify(freshness, null, 2)}</pre>
      <h2>Latest freshness report</h2>
      <pre className="code">{report ?? "No report yet. Run pnpm check:freshness."}</pre>
      {!validation.ok ? (
        <>
          <h2>Graph issues</h2>
          <ul>{validation.issues.map((i, idx) => <li key={idx}>{i.message}</li>)}</ul>
        </>
      ) : null}
    </div>
  );
}
