import { getAtlas } from "../../lib/content";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getDictionary } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";

export const metadata = { title: "Status" };

export default async function StatusPage() {
  const { references, rules, artifacts, signals, validation, freshness } = await getAtlas();
  let report: string | null = null;
  let observationSummary: Record<string, number> | null = null;
  let reviewItems: Array<{ sourceId: string; reason: string }> = [];
  try {
    report = await readFile(path.join(process.cwd(), "../../reports/freshness.json"), "utf8");
    const parsed = JSON.parse(report) as { observationSummary?: Record<string, number> };
    observationSummary = parsed.observationSummary ?? null;
    const queue = JSON.parse(await readFile(path.join(process.cwd(), "../../reports/review-queue.json"), "utf8")) as { items?: Array<{ sourceId: string; reason: string }> };
    reviewItems = queue.items ?? [];
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
      {observationSummary ? <><h3>{d.observations}</h3><div className="grid-cards">
        <div className="card-link"><strong>{d.changed}</strong><p className="meta">{observationSummary.changed ?? 0}</p></div>
        <div className="card-link"><strong>{d.unchanged}</strong><p className="meta">{observationSummary.unchanged ?? 0}</p></div>
        <div className="card-link"><strong>{d.fetchFailed}</strong><p className="meta">{observationSummary.fetch_failed ?? 0}</p></div>
      </div><h3>{d.reviewQueue}</h3>{reviewItems.length ? <ul>{reviewItems.map((item) => <li key={item.sourceId}><code>{item.sourceId}</code> — {item.reason}</li>)}</ul> : <p className="muted">0</p>}</> : <pre className="code">{report ?? d.noReport}</pre>}
      {!validation.ok ? (
        <>
          <h2>{d.issues}</h2>
          <ul>{validation.issues.map((i, idx) => <li key={idx}>{i.message}</li>)}</ul>
        </>
      ) : null}
    </div>
  );
}
