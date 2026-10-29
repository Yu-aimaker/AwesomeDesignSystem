import { DataNote, GalleryHeader } from "../layout/Gallery";
import { Section, SourceList } from "../layout/Page";
import { Compare } from "../layout/Playground";
import { Link } from "../i18n/router";
import { useT } from "../i18n/context";
import { reportMessages, type ReportMessages } from "../i18n/messages/report";

export function Report() {
  const t = useT(reportMessages);

  return (
    <div>
      <GalleryHeader title={t.title} lead={t.lead} stat={1} statLabel={t.statLabel}>
        <p className="t-body-sm mt-3">
          <Link to="/knowledge/skills/html-report">{t.readKnowledge}</Link>
        </p>
      </GalleryHeader>

      <Section id="how" title={t.how.title} lead={t.how.lead}>
        <ol className="overflow-hidden rounded-lg border border-hairline bg-surface">
          {t.how.steps.map((step, i) => (
            <li key={step.title} className={"grid gap-x-6 gap-y-1 px-5 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]" + (i > 0 ? " border-t border-hairline" : "")}>
              <p className="t-label text-ink">
                <span className="t-mono mr-2 tabular text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                {step.title}
              </p>
              <p className="t-body-sm min-w-0 text-ink-secondary">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="t-body-sm mt-4 text-ink-secondary">
          <code className="t-mono break-all text-ink">{t.how.invoke}</code>
        </p>
      </Section>

      <Section id="examples" title={t.examples.title} lead={t.examples.lead}>
        <Compare goodLabel={t.examples.goodLabel} badLabel={t.examples.badLabel} good={<ReportGood t={t} />} bad={<ReportBad t={t} />} />
      </Section>

      <Section id="rules" title={t.rules.title} lead={t.rules.lead}>
        <dl className="overflow-hidden rounded-lg border border-hairline bg-surface">
          {t.rules.rows.map((row, i) => (
            <div key={row.label} className={"grid gap-x-6 gap-y-1 px-5 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]" + (i > 0 ? " border-t border-hairline" : "")}>
              <dt className="t-label text-ink">{row.label}</dt>
              <dd className="t-body-sm min-w-0 text-ink-secondary">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <SourceList sources={t.sources} title={t.sourcesTitle} />
      <DataNote>{t.dataNote}</DataNote>
    </div>
  );
}

function ReportGood({ t }: { t: ReportMessages }) {
  return (
    <article data-theme="light" className="rounded-lg border border-hairline bg-canvas px-4 py-5">
      <h3 className="t-h3 text-ink">{t.examples.goodTitle}</h3>
      <div className="mt-3 flex flex-col gap-2">
        {t.examples.goodLines.map((line) => (
          <p key={line} className="t-body-sm text-ink">
            {line}
          </p>
        ))}
      </div>
      <table className="mt-4 w-full border-collapse">
        <caption className="sr-only">{t.examples.tableCaption}</caption>
        <tbody>
          {t.examples.rows.map((row) => (
            <tr key={row.item} className="border-t border-hairline">
              <th scope="row" className="t-label py-2 pr-3 text-left align-top text-ink">
                {row.item}
              </th>
              <td className="t-body-sm py-2 text-ink-secondary">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

function ReportBad({ t }: { t: ReportMessages }) {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-lg px-4 py-8 text-center text-on-accent"
      // The bad pane is the generated default: a purple-to-blue gradient.
      // Both stops are chart tokens, so no raw colour enters web/src.
      style={{ backgroundImage: "linear-gradient(160deg, var(--ds-chart-5), var(--ds-chart-1))" }}
    >
      <p className="t-h3">{t.examples.badTitle}</p>
      <p className="t-body-sm max-w-[36ch] opacity-90">{t.examples.badBody}</p>
      <div className="mt-2 grid w-full grid-cols-3 gap-2">
        {t.examples.badCards.map((label) => (
          <div key={label} className="min-w-0 rounded-lg bg-canvas/15 px-2 py-3">
            <p className="t-label break-words">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
