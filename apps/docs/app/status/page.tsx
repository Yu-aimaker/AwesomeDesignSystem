import { getAtlas } from "../../lib/content";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getDictionary } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";

export const metadata = { title: "Status" };

export default async function StatusPage() {
  const { references, rules, artifacts, signals, validation, freshness } = await getAtlas();
  let report: string | null = null;
  try {
    report = await readFile(path.join(process.cwd(), "../../reports/freshness.json"), "utf8");
  } catch {
    report = null;
  }
  const d = getDictionary(await getRequestLocale()).status;
  return (
    <div>
      <h1>{d.title}</h1>
      <p className="muted">{d.intro}</p>
      <div className="grid-cards">
        <div className="card-link"><strong>{d.graph}</strong><p className="meta">{validation.ok ? "OK" : validation.issues.length + " issues"}</p></div>
        <div className="card-link"><strong>{d.references}</strong><p className="meta">{references.length}</p></div>
        <div className="card-link"><strong>{d.rules}</strong><p className="meta">{rules.length}</p></div>
        <div className="card-link"><strong>{d.artifacts}</strong><p className="meta">{artifacts.length}</p></div>
        <div className="card-link"><strong>{d.signals}</strong><p className="meta">{signals.length}</p></div>
      </div>
      <h2>{d.buckets}</h2>
      <pre className="code">{JSON.stringify(freshness, null, 2)}</pre>
      <h2>{d.latest}</h2>
      <pre className="code">{report ?? d.noReport}</pre>
      {!validation.ok ? (
        <>
          <h2>{d.issues}</h2>
          <ul>{validation.issues.map((i, idx) => <li key={idx}>{i.message}</li>)}</ul>
        </>
      ) : null}
    </div>
  );
}
