import { PageHeader } from "../../components/page-header";
import { getDictionary, localizePathname } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";
import { createLocalizedMetadata } from "../../lib/metadata";
import {
  loadReleaseReadinessReport,
  type ReleaseGateId,
} from "../../lib/release-report";

export const generateMetadata = () =>
  createLocalizedMetadata(
    "/reports",
    (dictionary) => dictionary.reports.title,
    (dictionary) => dictionary.reports.intro,
  );

const formatBytes = (value: number) => `${(value / 1000).toFixed(1)} kB`;

export default async function ReportsPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const d = dictionary.reports;
  const report = await loadReleaseReadinessReport();
  const passed = report.gates.filter((gate) => gate.status === "pass").length;
  const headroom = Math.max(
    0,
    ((report.performance.routeBudgetBytes - report.performance.largestRouteBytes) /
      report.performance.routeBudgetBytes) *
      100,
  );
  const gateCopy: Record<ReleaseGateId, { title: string; body: string }> = {
    core: { title: d.gateCore, body: d.gateCoreBody },
    browser: { title: d.gateBrowser, body: d.gateBrowserBody },
    accessibility: { title: d.gateAccessibility, body: d.gateAccessibilityBody },
    security: { title: d.gateSecurity, body: d.gateSecurityBody },
    performance: { title: d.gatePerformance, body: d.gatePerformanceBody },
    provenance: { title: d.gateProvenance, body: d.gateProvenanceBody },
    localization: { title: d.gateLocalization, body: d.gateLocalizationBody },
  };

  const metrics = [
    {
      label: d.metricMac,
      value: `${report.verification.browserTests.macos}/${report.verification.browserTests.macos}`,
      note: d.metricBrowserNote,
    },
    {
      label: d.metricLinux,
      value: `${report.verification.browserTests.linux}/${report.verification.browserTests.linux}`,
      note: d.metricBrowserNote,
    },
    {
      label: d.metricUnit,
      value: String(report.verification.unitTests),
      note: `${report.verification.unitTestFiles} ${d.testFiles}`,
    },
    {
      label: d.metricEvidence,
      value: String(report.evidence.references),
      note: `${report.evidence.rules} ${d.rules} · ${report.evidence.artifacts} ${d.artifacts}`,
    },
    {
      label: d.metricSecurity,
      value: String(report.security.vulnerabilities),
      note: `${report.security.packagesScanned} ${d.packagesScanned}`,
    },
    {
      label: d.metricPerformance,
      value: `${headroom.toFixed(1)}%`,
      note: `${formatBytes(report.performance.largestRouteBytes)} / ${formatBytes(report.performance.routeBudgetBytes)}`,
    },
  ];

  return (
    <div className="ads-motion-enter route-page reports-page">
      <PageHeader
        eyebrow="VERIFY / RELEASE REPORT"
        title={d.title}
        description={d.intro}
        meta={
          <span className="freshness-state freshness-state--healthy">
            <i aria-hidden="true" />
            {d.verified} · <time dateTime={report.verifiedAt}>{report.verifiedAt}</time>
          </span>
        }
      />

      <section className="readiness-verdict" aria-labelledby="release-verdict">
        <div>
          <p className="eyebrow">{d.releaseReadiness}</p>
          <h2 id="release-verdict">{report.verdict === "ship" ? d.ship : d.hold}</h2>
        </div>
        <div className="readiness-verdict__summary">
          <strong>{passed}/{report.gates.length}</strong>
          <p>{d.gatesPassed}</p>
          <span>{d.snapshotNotice}</span>
        </div>
      </section>

      <section className="report-section" aria-labelledby="report-signals">
        <header className="report-section__heading">
          <p className="eyebrow">01 / {d.signal}</p>
          <h2 id="report-signals">{d.signalTitle}</h2>
          <p>{d.signalBody}</p>
        </header>
        <dl className="report-metrics">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd className="report-metric__value">{metric.value}</dd>
              <dd className="report-metric__note">{metric.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="report-section" aria-labelledby="control-ledger">
        <header className="report-section__heading">
          <p className="eyebrow">02 / {d.controls}</p>
          <h2 id="control-ledger">{d.controlsTitle}</h2>
          <p>{d.controlsBody}</p>
        </header>
        <ol className="control-ledger">
          {report.gates.map((gate, index) => (
            <li key={gate.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{gateCopy[gate.id].title}</strong>
                <p>{gateCopy[gate.id].body}</p>
                <code>{gate.command}</code>
              </div>
              <span className={`control-state control-state--${gate.status}`}>
                {gate.status === "pass" ? d.pass : gate.status === "attention" ? d.attention : d.fail}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="report-section report-proof" aria-labelledby="proof-chain">
        <header className="report-section__heading">
          <p className="eyebrow">03 / {d.provenance}</p>
          <h2 id="proof-chain">{d.provenanceTitle}</h2>
          <p>{d.provenanceBody}</p>
        </header>
        <ol>
          <li><span>01</span><strong>{d.proofEvidence}</strong><p>{d.proofEvidenceBody}</p></li>
          <li><span>02</span><strong>{d.proofCommand}</strong><p>{d.proofCommandBody}</p></li>
          <li><span>03</span><strong>{d.proofArtifact}</strong><p>{d.proofArtifactBody}</p></li>
          <li><span>04</span><strong>{d.proofVerdict}</strong><p>{d.proofVerdictBody}</p></li>
        </ol>
      </section>

      <section className="report-section report-honesty" aria-labelledby="honest-boundary">
        <div>
          <p className="eyebrow">04 / {d.boundary}</p>
          <h2 id="honest-boundary">{d.boundaryTitle}</h2>
        </div>
        <div>
          <p>{d.boundaryBody}</p>
          <ul>
            <li>{report.evidence.reviewQueue} {d.reviewItems}</li>
            <li>{d.manualAssistiveTech}</li>
            <li>{d.snapshotScope}</li>
          </ul>
        </div>
      </section>

      <nav className="report-actions" aria-label={d.nextActions}>
        <a className="primary-link" href={localizePathname("/status", locale)}>{d.openStatus}</a>
        <a className="text-link" href={localizePathname("/review", locale)}>{d.openReview}</a>
        <a className="text-link" href={localizePathname("/references", locale)}>{d.openAtlas}</a>
      </nav>
    </div>
  );
}
