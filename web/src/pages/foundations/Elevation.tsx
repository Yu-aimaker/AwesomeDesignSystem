import { PageHeader, Section, SourceList, Why } from "../../layout/Page";
import { CodeBlock } from "../../layout/Preview";
import { Table } from "../../ds/components/Table";
import { Button } from "../../ds/components/Button";
import { colorValue } from "../../lib/tokens";
import { useT } from "../../i18n/context";
import { elevationMessages } from "../../i18n/messages/elevation";

const darkLadder = ["canvas", "canvas-soft", "surface", "surface-raised"] as const;

function Sample({ className, label, sub }: { className: string; label: string; sub: string }) {
  return (
    <div className={`flex h-32 flex-col justify-end rounded-lg bg-surface p-4 ${className}`}>
      <p className="t-label text-ink">{label}</p>
      <p className="t-mono text-ink-muted">{sub}</p>
    </div>
  );
}

export function Elevation() {
  const t = useT(elevationMessages);
  return (
    <div>
      <PageHeader title={t.title} lead={t.lead} />

      <Section id="rule" title={t.ruleTitle}>
        <div className="prose t-body text-ink">
          <p>{t.rule}</p>
        </div>
        <CodeBlock
          className="mt-6 measure"
          code={"--ds-shadow-1: none;                     /* 1px solid var(--ds-hairline) */\n--ds-shadow-2: 0 4px 12px -2px rgb(10 10 10 / 0.08);\n--ds-shadow-3: 0 16px 48px -12px rgb(10 10 10 / 0.18);"}
        />
      </Section>

      <Section id="levels" title={t.levelsTitle} lead={t.levelsLead}>
        <div className="grid gap-6 rounded-lg bg-canvas-soft p-6 sm:p-8 md:grid-cols-3">
          <Sample className="border border-hairline" label="Level 1" sub="border" />
          <Sample className="border border-hairline shadow-2" label="Level 2" sub="border + shadow-2" />
          <Sample className="border border-hairline shadow-3" label="Level 3" sub="border + shadow-3" />
        </div>
        <Table
          className="mt-8"
          columns={[
            { key: "level", header: t.colLevel, render: (r) => r.level },
            { key: "treatment", header: t.colTreatment, render: (r) => <code>{r.treatment}</code> },
            { key: "use", header: t.colUse, wrap: true, render: (r) => r.use },
          ]}
          rows={t.levels}
          rowKey={(r) => r.level}
        />
      </Section>

      <Section id="border-vs-shadow" title={t.borderVsShadowTitle} lead={t.borderVsShadowLead}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-canvas-soft p-6 sm:p-8">
            <div className="rounded-lg border border-hairline bg-surface p-6">
              <p className="t-h4 text-ink">{t.invoiceTitle}</p>
              <p className="t-body-sm mt-1 text-ink-secondary">{t.invoiceBody}</p>
              <div className="mt-4">
                <Button variant="secondary" size="sm">
                  {t.viewDetails}
                </Button>
              </div>
            </div>
            <p className="t-caption mt-4 text-ink-secondary">{t.borderNote}</p>
          </div>
          <div className="rounded-lg bg-canvas-soft p-6 sm:p-8">
            <div className="rounded-lg bg-surface p-6" style={{ boxShadow: "0 8px 24px rgb(0 0 0 / 0.25)" }}>
              <p className="t-h4 text-ink">{t.invoiceTitle}</p>
              <p className="t-body-sm mt-1 text-ink-secondary">{t.invoiceBody}</p>
              <div className="mt-4">
                <Button variant="secondary" size="sm">
                  {t.viewDetails}
                </Button>
              </div>
            </div>
            <p className="t-caption mt-4 text-ink-secondary">{t.shadowNote}</p>
          </div>
        </div>
      </Section>

      <Section id="tint" title={t.tintTitle} lead={t.tintLead}>
        <div className="grid gap-6 rounded-lg bg-canvas-soft p-6 sm:p-8 md:grid-cols-2">
          <div>
            <div className="h-24 rounded-lg border border-hairline bg-surface shadow-3" />
            <p className="t-mono mt-3 text-ink-secondary">rgb(10 10 10 / 0.18), y 16px, spread -12px</p>
          </div>
          <div>
            <div className="h-24 rounded-lg border border-hairline bg-surface" style={{ boxShadow: "0 16px 48px rgb(0 0 0 / 0.5)" }} />
            <p className="t-mono mt-3 text-ink-secondary">{t.tintBad}</p>
          </div>
        </div>
      </Section>

      <Section id="dark" title={t.darkTitle} lead={t.darkLead}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {darkLadder.map((role, i) => (
            <div key={role} className="flex flex-col gap-2">
              <div
                className="flex h-20 items-end rounded-md border p-3"
                style={{ background: colorValue("dark", role), borderColor: colorValue("dark", i === 0 ? "hairline" : "hairline") }}
              >
                <span className="t-caption" style={{ color: colorValue("dark", "ink-secondary") }}>
                  {i}
                </span>
              </div>
              <span className="t-mono text-ink">{role}</span>
              <span className="t-caption text-ink-muted">{colorValue("dark", role)}</span>
            </div>
          ))}
        </div>
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
