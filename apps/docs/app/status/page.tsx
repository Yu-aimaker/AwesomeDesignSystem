import { getAtlas } from "../../lib/content";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getDictionary } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";

import { createLocalizedMetadata } from "../../lib/metadata";
import { parseFreshnessReport, type FreshnessReportView, type FreshnessReviewItem } from "../../lib/freshness-report";
export const generateMetadata = () => createLocalizedMetadata("/status", (dictionary) => dictionary.status.title, (dictionary) => dictionary.status.intro);

export default async function StatusPage() {
  const { references, rules, artifacts, signals, validation, freshness } = await getAtlas();
  let reportView: FreshnessReportView | null = null;
  try {
    const [freshnessReport, queueReport] = await Promise.all([
      readFile(path.join(process.cwd(), "../../reports/freshness.json"), "utf8"),
      readFile(path.join(process.cwd(), "../../reports/review-queue.json"), "utf8"),
    ]);
    reportView = parseFreshnessReport(freshnessReport, queueReport);
  } catch {
    reportView = null;
  }
  const d = getDictionary(await getRequestLocale()).status;
  const groups: Array<{ label: string; items: FreshnessReviewItem[] }> = reportView ? [
    { label: d.changedSources, items: reportView.groups.changed },
    { label: d.fetchFailures, items: reportView.groups.fetchFailures },
    { label: d.adapterFailures, items: reportView.groups.adapterFailures },
    { label: d.adapterRecoveries, items: reportView.groups.recoveries },
  ] : [];
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
      {reportView ? <>
        <p className="meta">
          {d.reportGenerated}: <time dateTime={reportView.generatedAt}>{reportView.generatedAt}</time>{" "}
          <span className="pill">{reportView.stale ? d.reportStale : d.reportCurrent}</span>{" "}
          ({reportView.ageDays.toFixed(1)} {d.daysOld})
        </p>
        <h3>{d.observations}</h3><div className="grid-cards">
          <div className="card-link"><strong>{d.changed}</strong><p className="meta">{reportView.observationSummary.changed ?? 0}</p></div>
          <div className="card-link"><strong>{d.unchanged}</strong><p className="meta">{reportView.observationSummary.unchanged ?? 0}</p></div>
          <div className="card-link"><strong>{d.fetchFailed}</strong><p className="meta">{reportView.observationSummary.fetch_failed ?? 0}</p></div>
          <div className="card-link"><strong>{d.adapterDegraded}</strong><p className="meta">{reportView.observationSummary.adapter_degraded ?? 0}</p></div>
        </div>
        <h3>{d.reviewQueue}</h3>
        {groups.every((group) => group.items.length === 0) ? <p className="muted">0</p> : groups.map((group) => group.items.length ? (
          <section key={group.label} aria-label={group.label}>
            <h4>{group.label}</h4>
            <ul>{group.items.map((item) => <li key={`${item.sourceId}:${item.reason}`}>
              <a href={item.url} rel="noreferrer">{item.title}</a> <code>{item.sourceId}</code>
              <span className="meta"> — {item.reason}
                {item.firstFailedAt ? ` · ${d.firstFailure}: ${item.firstFailedAt}` : ""}
                {item.failureAgeDays > 0 ? ` · ${item.failureAgeDays.toFixed(1)} ${d.days}` : ""}
                {item.persistent ? ` · ${d.persistent}` : ""}
                {item.allowlisted ? ` · ${d.allowlisted}` : ""}
                {item.errorCategory ? ` · ${item.errorCategory}` : ""}
                {item.error ? ` · ${d.error}: ${item.error}` : ""}
              </span>
            </li>)}</ul>
          </section>
        ) : null)}
      </> : <pre className="code">{d.noReport}</pre>}
      {!validation.ok ? (
        <>
          <h2>{d.issues}</h2>
          <ul>{validation.issues.map((i, idx) => <li key={idx}>{i.message}</li>)}</ul>
        </>
      ) : null}
    </div>
  );
}
