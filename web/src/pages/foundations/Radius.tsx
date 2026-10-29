import { PageHeader, Section, SourceList, Why } from "../../layout/Page";
import { CodeBlock } from "../../layout/Preview";
import { Table } from "../../ds/components/Table";
import { Button } from "../../ds/components/Button";
import { Badge } from "../../ds/components/Badge";
import { radiusScale } from "../../lib/tokens";
import { useT } from "../../i18n/context";
import { radiusMessages } from "../../i18n/messages/radius";

export function Radius() {
  const t = useT(radiusMessages);
  return (
    <div>
      <PageHeader title={t.title} lead={t.lead} />

      <Section id="rule" title={t.ruleTitle}>
        <div className="prose t-body text-ink">
          <p>{t.rule}</p>
        </div>
        <CodeBlock
          className="mt-6 measure"
          code={"--ds-radius-xs: 4px;  --ds-radius-sm: 6px;  --ds-radius-md: 8px;\n--ds-radius-lg: 12px; --ds-radius-xl: 16px; --ds-radius-2xl: 24px;\n--ds-radius-pill: 9999px;"}
        />
      </Section>

      <Section id="scale" title={t.scaleTitle}>
        <ul className="grid gap-4 sm:grid-cols-4 sm:gap-6 lg:grid-cols-7">
          {radiusScale.map((r) => (
            <li key={r.name} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-1 sm:flex sm:flex-col sm:items-start sm:gap-2">
              <span aria-hidden className="row-span-2 size-16 border border-hairline-strong bg-surface-sunken" style={{ borderRadius: r.value }} />
              <span className="t-mono text-ink">
                {r.name} <span className="text-ink-muted">{r.value}</span>
              </span>
              <span className="t-caption text-ink-secondary">{t.uses[r.name]}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="usage" title={t.usageTitle} lead={t.usageLead}>
        <div className="rounded-lg border border-hairline bg-canvas-soft p-6 sm:p-8">
          <div className="rounded-xl border border-hairline bg-surface p-6 shadow-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="t-h4 text-ink">{t.inviteMember}</p>
                <p className="t-body-sm mt-1 text-ink-secondary">{t.dialog16}</p>
              </div>
              <Badge>{t.pill}</Badge>
            </div>
            <div className="mt-6 rounded-lg border border-hairline bg-canvas-soft p-4">
              <p className="t-label text-ink">{t.card12}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="flex h-10 flex-1 items-center rounded-md border border-hairline-strong bg-surface px-3 text-sm text-ink-muted">{t.input8}</span>
                <Button>{t.button8}</Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="nested" title={t.nestedTitle} lead={t.nestedLead}>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="inline-block rounded-lg border border-hairline-strong bg-surface p-1">
              <div className="flex h-28 w-full min-w-56 items-center justify-center rounded-md bg-surface-sunken text-sm text-ink-secondary">12 − 4 = 8</div>
            </div>
            <p className="t-caption mt-3 text-ink-secondary">{t.nestedGood}</p>
          </div>
          <div>
            <div className="inline-block rounded-lg border border-hairline-strong bg-surface p-1">
              <div className="flex h-28 w-full min-w-56 items-center justify-center rounded-lg bg-surface-sunken text-sm text-ink-secondary">{t.nestedSame}</div>
            </div>
            <p className="t-caption mt-3 text-ink-secondary">{t.nestedBad}</p>
          </div>
        </div>
        <CodeBlock className="mt-6 measure" code={".card { border-radius: var(--ds-radius-lg); padding: 4px; }\n.card > img { border-radius: calc(var(--ds-radius-lg) - 4px); }"} />
      </Section>

      <Section id="family" title={t.familyTitle} lead={t.familyLead}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">{t.sameFamily}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button>{t.save}</Button>
              <Button variant="secondary">{t.cancel}</Button>
              <span className="flex h-10 items-center rounded-md border border-hairline-strong px-3 text-sm text-ink-muted">{t.search}</span>
            </div>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">{t.mixedFamily}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-on-primary">{t.save}</span>
              <span className="flex h-10 items-center rounded-none border border-hairline-strong px-4 text-sm text-ink">{t.cancel}</span>
              <span className="flex h-10 items-center rounded-md border border-hairline-strong px-3 text-sm text-ink-muted">{t.search}</span>
            </div>
          </div>
        </div>
      </Section>

      <Section id="measured" title={t.measuredTitle} lead={t.measuredLead}>
        <Table
          columns={[
            { key: "system", header: t.colSystem, render: (r) => r.system },
            { key: "ladder", header: t.colLadder, render: (r) => <code>{r.ladder}</code> },
            { key: "note", header: t.colNote, wrap: true, render: (r) => r.note },
          ]}
          rows={t.measured}
          rowKey={(r) => r.system}
        />
      </Section>

      <Why>
        {t.why.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Why>

      <SourceList sources={t.sources} />
    </div>
  );
}
