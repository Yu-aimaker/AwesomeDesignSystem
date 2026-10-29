import { useState } from "react";
import { Link } from "../../i18n/router";
import { MotionConfig } from "motion/react";
import { PageHeader, Section, SourceList, Why } from "../../layout/Page";
import { CodeBlock } from "../../layout/Preview";
import { Table } from "../../ds/components/Table";
import { Button } from "../../ds/components/Button";
import { Switch } from "../../ds/components/Switch";
import { SpringDragDemo } from "../../demos/MotionDemos";
import { durations, easings, tokens } from "../../lib/tokens";
import { useT } from "../../i18n/context";
import { foundationMotionMessages, type RichPart } from "../../i18n/messages/foundationMotion";
import { motionPatternsMessages } from "../../i18n/messages/motionPatterns";
import { MotionModeNote, MotionPatterns } from "./MotionPatterns";

/** Renders catalog text that contains inline code spans. */
function Rich({ parts }: { parts: RichPart[] }) {
  return (
    <>
      {parts.map((p, i) => (typeof p === "string" ? p : <code key={i}>{p.code}</code>))}
    </>
  );
}

function HoverDemo() {
  const t = useT(foundationMotionMessages);
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex flex-col gap-2">
        <Button variant="secondary">{t.hoverFast}</Button>
        <span className="t-caption text-ink-secondary">duration-instant, ease-out</span>
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="t-label h-10 rounded-md border border-hairline-strong bg-surface px-4 text-ink hover:bg-surface-sunken"
          style={{ transition: "background-color 600ms ease" }}
        >
          {t.hoverSlow}
        </button>
        <span className="t-caption text-ink-secondary">{t.hoverSlowNote}</span>
      </div>
    </div>
  );
}

function AsymmetryDemo() {
  const [openA, setOpenA] = useState(true);
  const [openB, setOpenB] = useState(true);
  const t = useT(foundationMotionMessages);
  const panel = "rounded-lg border border-hairline bg-surface p-4 text-sm text-ink";
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <Button variant="secondary" size="sm" onClick={() => setOpenA((v) => !v)}>
          {openA ? t.close : t.open}
        </Button>
        <div
          className={`${panel} mt-3`}
          style={{
            opacity: openA ? 1 : 0,
            transform: openA ? "none" : "translateY(4px)",
            transition: openA
              ? `opacity ${tokens.duration.base.$value} var(--ds-ease-out), transform ${tokens.duration.base.$value} var(--ds-ease-out)`
              : `opacity 130ms var(--ds-ease-in), transform 130ms var(--ds-ease-in)`,
          }}
        >
          {t.asymGood}
        </div>
        <p className="t-caption mt-3 text-ink-secondary">{t.asymGoodNote}</p>
      </div>
      <div>
        <Button variant="secondary" size="sm" onClick={() => setOpenB((v) => !v)}>
          {openB ? t.close : t.open}
        </Button>
        <div
          className={`${panel} mt-3`}
          style={{
            opacity: openB ? 1 : 0,
            transform: openB ? "none" : "translateY(24px) scale(0.8)",
            transition: "opacity 500ms ease, transform 500ms ease",
          }}
        >
          {t.asymBad}
        </div>
        <p className="t-caption mt-3 text-ink-secondary">{t.asymBadNote}</p>
      </div>
    </div>
  );
}

function EasingDemo() {
  const [key, setKey] = useState(0);
  const t = useT(foundationMotionMessages);
  return (
    <div>
      <Button variant="secondary" size="sm" onClick={() => setKey((k) => k + 1)}>
        {t.play}
      </Button>
      <div key={key} className="mt-4 grid gap-4 md:grid-cols-3">
        {t.curves.map((c) => (
          <div key={c.name} className="rounded-lg border border-hairline bg-surface p-4">
            <p className="t-mono text-ink">{c.name}</p>
            <div className="mt-4 h-10 w-full rounded-md bg-surface-sunken" style={{ containerType: "inline-size" }}>
              <div className="h-10 w-10 rounded-md bg-primary" style={{ animation: `demo-slide 800ms ${c.value} both` }} />
            </div>
            <p className="t-caption mt-3 text-ink-secondary">{c.note}</p>
          </div>
        ))}
      </div>
      <style>{`@keyframes demo-slide { from { transform: translateX(0); } to { transform: translateX(calc(100cqw - 100%)); } }`}</style>
    </div>
  );
}

export function Motion() {
  const [reduced, setReduced] = useState(false);
  const t = useT(foundationMotionMessages);
  const tp = useT(motionPatternsMessages);
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <div data-reduced-motion={reduced ? "true" : undefined}>
        <PageHeader title={t.title} lead={t.lead} />

        <Section id="rule" title={t.ruleTitle}>
          <div className="prose t-body text-ink">
            <p>
              <Rich parts={t.rule} />
            </p>
          </div>
          <CodeBlock
            className="mt-6 measure"
            code={"--ds-duration-instant: 100ms;\n--ds-duration-fast: 150ms;\n--ds-duration-base: 200ms;\n--ds-duration-slow: 300ms;\n--ds-duration-slower: 500ms;\n--ds-ease-out: cubic-bezier(0.16, 1, 0.3, 1);\n--ds-ease-in: cubic-bezier(0.7, 0, 0.84, 0);\n/* spring: stiffness 400 / damping 30 (gesture), 170 / 26 (layout) */"}
          />
        </Section>

        <Section id="tokens" title={t.tokensTitle}>
          <Table
            columns={[
              { key: "name", header: "duration", render: (r) => <code>{r.name}</code> },
              { key: "value", header: t.colValue, align: "right", render: (r) => r.value },
              { key: "use", header: t.colUse, wrap: true, render: (r) => t.durationUse[r.name] ?? "" },
            ]}
            rows={durations}
            rowKey={(r) => r.name}
          />
          <Table
            className="mt-4"
            columns={[
              { key: "name", header: "easing", render: (r) => <code>{r.name}</code> },
              { key: "css", header: t.colValue, render: (r) => <code>{r.css}</code> },
              { key: "use", header: t.colUse, wrap: true, render: (r) => t.easingUse[r.name] ?? "" },
            ]}
            rows={easings}
            rowKey={(r) => r.name}
          />
        </Section>

        <Section id="reduced" title={t.reducedTitle} lead={t.reducedLead}>
          <Switch label={t.reducedSwitch} checked={reduced} onChange={setReduced} />
          <div className="mt-4 measure">
            <MotionModeNote forced={reduced} />
          </div>
        </Section>

        <Section id="patterns" title={tp.title} lead={tp.lead}>
          <MotionPatterns />
        </Section>

        <Section id="hover" title={t.hoverTitle} lead={t.hoverLead}>
          <HoverDemo />
        </Section>

        <Section id="easing" title={t.easingTitle} lead={t.easingLead}>
          <EasingDemo />
        </Section>

        <Section id="asymmetry" title={t.asymTitle} lead={t.asymLead}>
          <AsymmetryDemo />
        </Section>

        <Section id="spring" title={t.springTitle} lead={t.springLead}>
          <SpringDragDemo />
        </Section>

        <Section id="libraries" title={t.librariesTitle} lead={t.librariesLead}>
          <Table
            columns={[
              { key: "tool", header: t.colTool, render: (r) => r.tool },
              { key: "when", header: t.colWhen, wrap: true, render: (r) => r.when },
              { key: "not", header: t.colNot, wrap: true, render: (r) => r.not },
            ]}
            rows={t.libraries}
            rowKey={(r) => r.tool}
          />
          <p className="t-body-sm mt-4 text-ink-secondary">
            {t.samplesBefore}
            <Link to="/animation">{t.samplesLink}</Link>
            {t.samplesAfter}
          </p>
        </Section>

        <Why>
          {t.why.map((parts, i) => (
            <p key={i}>
              <Rich parts={parts} />
            </p>
          ))}
        </Why>

        <SourceList sources={t.sources} />
      </div>
    </MotionConfig>
  );
}
