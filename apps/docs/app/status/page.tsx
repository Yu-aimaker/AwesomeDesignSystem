import { readFile } from "node:fs/promises";
import path from "node:path";

import { getAtlas } from "../../lib/content";
import {
  parseFreshnessReport,
  parseLinkCheckReport,
  type FreshnessReportView,
  type FreshnessReviewItem,
  type LinkCheckReportView,
} from "../../lib/freshness-report";
import { getDictionary } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";
import { createLocalizedMetadata } from "../../lib/metadata";
import { PageHeader } from "../../components/page-header";
import { getReportsRoot } from "../../lib/path-resolver";

export const generateMetadata = () =>
  createLocalizedMetadata(
    "/status",
    (dictionary) => dictionary.status.title,
    (dictionary) => dictionary.status.intro,
  );

type ReportState<T> =
  | { kind: "ready"; value: T }
  | { kind: "missing" }
  | { kind: "invalid"; message: string };

const reportsRoot = getReportsRoot();

function isMissingFile(error: unknown): boolean {
  return Boolean(
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "ENOENT",
  );
}

function integrityMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Report validation failed";
}

async function loadFreshnessReport(
  currentReferenceIds: Iterable<string>,
): Promise<ReportState<FreshnessReportView>> {
  try {
    const [freshness, queue] = await Promise.all([
      readFile(path.join(reportsRoot, "freshness.json"), "utf8"),
      readFile(path.join(reportsRoot, "review-queue.json"), "utf8"),
    ]);
    return {
      kind: "ready",
      value: parseFreshnessReport(
        freshness,
        queue,
        new Date(),
        currentReferenceIds,
      ),
    };
  } catch (error) {
    return isMissingFile(error)
      ? { kind: "missing" }
      : { kind: "invalid", message: integrityMessage(error) };
  }
}

async function loadLinkCheckReport(
  currentReferenceIds: Iterable<string>,
): Promise<ReportState<LinkCheckReportView>> {
  try {
    const report = await readFile(
      path.join(reportsRoot, "link-check.json"),
      "utf8",
    );
    return {
      kind: "ready",
      value: parseLinkCheckReport(report, new Date(), currentReferenceIds),
    };
  } catch (error) {
    return isMissingFile(error)
      ? { kind: "missing" }
      : { kind: "invalid", message: integrityMessage(error) };
  }
}

export default async function StatusPage() {
  const { references, rules, artifacts, signals, validation, freshness } =
    await getAtlas();
  const currentReferenceIds = references.map((reference) => reference.id);
  const [freshnessState, linksState] = await Promise.all([
    loadFreshnessReport(currentReferenceIds),
    loadLinkCheckReport(currentReferenceIds),
  ]);
  const dictionary = getDictionary(await getRequestLocale());
  const d = dictionary.status;
  const reportView =
    freshnessState.kind === "ready" ? freshnessState.value : null;
  const linkView = linksState.kind === "ready" ? linksState.value : null;
  const groups: Array<{ label: string; items: FreshnessReviewItem[] }> =
    reportView
      ? [
          { label: d.changedSources, items: reportView.groups.changed },
          { label: d.fetchFailures, items: reportView.groups.fetchFailures },
          {
            label: d.adapterFailures,
            items: reportView.groups.adapterFailures,
          },
          { label: d.adapterRecoveries, items: reportView.groups.recoveries },
        ]
      : [];
  const unimplemented = new Set(
    validation.issues
      .filter((issue) => issue.code === "unimplemented-rule")
      .map((issue) => issue.id),
  );
  const unverified = new Set(
    validation.issues
      .filter((issue) => issue.code === "unverified-artifact")
      .map((issue) => issue.id),
  );
  const canonRules = rules.filter((rule) => rule.status === "canon");
  const implementedRules = Math.max(0, canonRules.length - unimplemented.size);
  const coverage =
    canonRules.length === 0 ? 0 : (implementedRules / canonRules.length) * 100;
  const calculatedDate =
    references
      .map((reference) => reference.lastVerifiedDate)
      .sort()
      .at(-1) ?? "1970-01-01";
  const calculatedAt =
    reportView?.generatedAt ?? `${calculatedDate}T00:00:00.000Z`;

  return (
    <div className="ads-motion-enter route-page">
      <PageHeader
        eyebrow={
          dictionary.localeName === "日本語"
            ? "根拠グラフ・鮮度・実装カバレッジ"
            : "Evidence graph · freshness · implementation coverage"
        }
        title={d.title}
        description={d.intro}
        meta={
          <span>
            {validation.ok
              ? d.graphHealthy
              : `${validation.issues.length} ${d.issueCount}`}{" "}
            · <time dateTime={calculatedAt}>{calculatedAt}</time>
          </span>
        }
      />
      <div className="grid-cards">
        <div className="card-link">
          <strong>{d.graph}</strong>
          <p className="meta">
            {validation.ok
              ? dictionary.home.pass
              : validation.issues.length + " " + d.issueCount}
          </p>
        </div>
        <div className="card-link">
          <strong>{d.references}</strong>
          <p className="meta">{references.length}</p>
        </div>
        <div className="card-link">
          <strong>{d.rules}</strong>
          <p className="meta">{rules.length}</p>
        </div>
        <div className="card-link">
          <strong>{d.artifacts}</strong>
          <p className="meta">{artifacts.length}</p>
        </div>
        <div className="card-link">
          <strong>{d.signals}</strong>
          <p className="meta">{signals.length}</p>
        </div>
      </div>

      <h2>{d.coverage}</h2>
      <p className="meta">
        {d.calculated}: <time dateTime={calculatedAt}>{calculatedAt}</time>
      </p>
      <div className="grid-cards">
        <div className="card-link">
          <strong>{d.ruleCoverage}</strong>
          <p className="meta">
            {coverage.toFixed(1)}% ({implementedRules}/{canonRules.length})
          </p>
        </div>
        <div className="card-link">
          <strong>{d.unimplemented}</strong>
          <p className="meta">{unimplemented.size}</p>
        </div>
        <div className="card-link">
          <strong>{d.unverified}</strong>
          <p className="meta">{unverified.size}</p>
        </div>
        <div className="card-link">
          <strong>{d.graphIssues}</strong>
          <p className="meta">{validation.issues.length}</p>
        </div>
      </div>

      <h2>{d.buckets}</h2>
      <pre className="code">{JSON.stringify(freshness, null, 2)}</pre>

      <h2>{d.latest}</h2>
      {freshnessState.kind === "invalid" ? (
        <div role="alert" className="callout">
          <strong>{d.reportIntegrityError}</strong>
          <p className="meta">{freshnessState.message}</p>
        </div>
      ) : freshnessState.kind === "missing" ? (
        <pre className="code">{d.noReport}</pre>
      ) : reportView ? (
        <>
          <p className="meta">
            {d.reportGenerated}:{" "}
            <time dateTime={reportView.generatedAt}>
              {reportView.generatedAt}
            </time>{" "}
            <span className="pill">
              {reportView.stale ? d.reportStale : d.reportCurrent}
            </span>{" "}
            ({reportView.ageDays.toFixed(1)} {d.daysOld})
          </p>
          <h3>{d.observations}</h3>
          <div className="grid-cards">
            <div className="card-link">
              <strong>{d.changed}</strong>
              <p className="meta">
                {reportView.observationSummary.changed ?? 0}
              </p>
            </div>
            <div className="card-link">
              <strong>{d.unchanged}</strong>
              <p className="meta">
                {reportView.observationSummary.unchanged ?? 0}
              </p>
            </div>
            <div className="card-link">
              <strong>{d.fetchFailed}</strong>
              <p className="meta">
                {reportView.observationSummary.fetch_failed ?? 0}
              </p>
            </div>
            <div className="card-link">
              <strong>{d.adapterDegraded}</strong>
              <p className="meta">
                {reportView.observationSummary.adapter_degraded ?? 0}
              </p>
            </div>
          </div>
          <h3>{d.reviewQueue}</h3>
          {groups.every((group) => group.items.length === 0) ? (
            <p className="muted">0</p>
          ) : (
            groups.map((group) =>
              group.items.length ? (
                <section key={group.label} aria-label={group.label}>
                  <h4>{group.label}</h4>
                  <ul>
                    {group.items.map((item) => (
                      <li key={`${item.sourceId}:${item.reason}`}>
                        <a href={item.url} rel="noreferrer">
                          {item.title}
                        </a>{" "}
                        <code>{item.sourceId}</code>
                        <span className="meta">
                          {" "}
                          — {item.reason}
                          {item.firstFailedAt
                            ? ` · ${d.firstFailure}: ${item.firstFailedAt}`
                            : ""}
                          {item.failureAgeDays > 0
                            ? ` · ${item.failureAgeDays.toFixed(1)} ${d.days}`
                            : ""}
                          {item.persistent ? ` · ${d.persistent}` : ""}
                          {item.allowlisted ? ` · ${d.allowlisted}` : ""}
                          {item.errorCategory ? ` · ${item.errorCategory}` : ""}
                          {item.error ? ` · ${d.error}: ${item.error}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null,
            )
          )}
        </>
      ) : null}

      <h2>{d.latestLinks}</h2>
      {linksState.kind === "invalid" ? (
        <div role="alert" className="callout">
          <strong>{d.linkIntegrityError}</strong>
          <p className="meta">{linksState.message}</p>
        </div>
      ) : linksState.kind === "missing" ? (
        <pre className="code">{d.noLinkReport}</pre>
      ) : linkView ? (
        <>
          <p className="meta">
            {d.linkChecked}:{" "}
            <time dateTime={linkView.checkedAt}>{linkView.checkedAt}</time>{" "}
            <span className="pill">
              {linkView.stale ? d.reportStale : d.reportCurrent}
            </span>{" "}
            ({linkView.ageDays.toFixed(1)} {d.daysOld}) ·{" "}
            {linkView.strict ? d.strict : d.advisory}
          </p>
          <div className="grid-cards">
            <div className="card-link">
              <strong>{d.linksChecked}</strong>
              <p className="meta">{linkView.total}</p>
            </div>
            <div className="card-link">
              <strong>{d.graphHealthy}</strong>
              <p className="meta">{linkView.healthy}</p>
            </div>
            <div className="card-link">
              <strong>{d.linkFailures}</strong>
              <p className="meta">{linkView.failed}</p>
            </div>
            <div className="card-link">
              <strong>{d.allowlisted}</strong>
              <p className="meta">{linkView.allowlisted}</p>
            </div>
          </div>
        </>
      ) : null}

      {!validation.ok ? (
        <>
          <h2>{d.issues}</h2>
          <ul>
            {validation.issues.map((issue, index) => (
              <li key={index}>
                <code>{issue.code}</code> — {issue.message}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
