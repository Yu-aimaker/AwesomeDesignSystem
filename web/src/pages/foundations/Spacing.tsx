import { PageHeader, Section, SourceList, Why } from "../../layout/Page";
import { CodeBlock } from "../../layout/Preview";
import { Table } from "../../ds/components/Table";
import { Button } from "../../ds/components/Button";
import { breakpoints, spaceScale, tokens } from "../../lib/tokens";
import { useT } from "../../i18n/context";
import { Link } from "../../i18n/router";
import { spacingMessages } from "../../i18n/messages/spacing";

export function Spacing() {
  const t = useT(spacingMessages);
  return (
    <div>
      <PageHeader
        title={t.title}
        lead={t.lead(tokens.layout.container.$value, tokens.layout["container-doc"].$value)}
      />

      <Section id="rule" title={t.ruleTitle}>
        <div className="prose t-body text-ink">
          <p>{t.rule}</p>
        </div>
        <CodeBlock
          className="mt-6 measure"
          code={"--ds-space-1: 4px;    --ds-space-2: 8px;    --ds-space-3: 12px;\n--ds-space-4: 16px;   --ds-space-6: 24px;   --ds-space-8: 32px;\n--ds-space-12: 48px;  --ds-space-16: 64px;  --ds-space-24: 96px;\n--ds-container: 1200px;  --ds-container-doc: 760px;\n--ds-measure: 65ch;     --ds-measure-ja: 40em;\n--ds-gutter-sm: 20px;   --ds-gutter-md: 24px;   --ds-gutter-lg: 32px;"}
        />
      </Section>

      <Section id="scale" title={t.scaleTitle} lead={t.scaleLead}>
        <ul className="flex flex-col gap-2">
          {spaceScale.map((s) => (
            <li key={s.step} className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[5rem_12rem_minmax(0,1fr)]">
              <span className="t-mono text-ink-muted">space-{s.step}</span>
              <span className="flex items-center gap-3">
                <span aria-hidden className="h-4 shrink-0 rounded-xs bg-primary" style={{ width: s.px }} />
                <span className="t-mono tabular text-ink">{s.px}px</span>
              </span>
              <span className="t-caption hidden text-ink-secondary sm:block">{t.uses[s.step]}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="bands" title={t.bandsTitle} lead={t.bandsLead}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-lg border border-hairline bg-canvas-soft p-6 sm:p-8">
            <div className="rounded-lg border border-hairline bg-surface p-6">
              <p className="t-h4 text-ink">{t.demo.title}</p>
              <p className="t-body-sm mt-2 text-ink-secondary">{t.demo.help}</p>
              <div className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <span className="t-label text-ink">{t.demo.name}</span>
                  <span className="flex h-10 items-center rounded-md border border-hairline-strong bg-surface px-3 text-sm text-ink-muted">{t.demo.namePlaceholder}</span>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="t-label text-ink">{t.demo.description}</span>
                  <span className="flex h-10 items-center rounded-md border border-hairline-strong bg-surface px-3 text-sm text-ink-muted">{t.demo.optional}</span>
                </label>
              </div>
              <div className="mt-8 flex gap-2">
                <Button>{t.demo.create}</Button>
                <Button variant="secondary">{t.demo.cancel}</Button>
              </div>
            </div>
          </div>
          <dl className="grid grid-cols-[4rem_1fr] gap-x-4 gap-y-3 self-center text-sm">
            {t.annotations.map(([px, note]) => (
              <div key={px} className="contents">
                <dt className="t-mono text-ink-muted">{px}</dt>
                <dd className="text-ink">{note}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Table
          className="mt-8"
          columns={[
            { key: "name", header: t.bandHeaders.name, render: (r) => r.name },
            { key: "range", header: "px", render: (r) => <code>{r.range}</code> },
            { key: "meaning", header: t.bandHeaders.meaning, wrap: true, render: (r) => r.meaning },
            { key: "example", header: t.bandHeaders.example, wrap: true, render: (r) => r.example },
          ]}
          rows={t.bands}
          rowKey={(r) => r.name}
        />
      </Section>

      <Section id="page" title={t.pageTitle} lead={t.pageLead}>
        <div className="rounded-lg border border-hairline bg-canvas-soft p-5 sm:p-6">
          <ul className="flex flex-col gap-4">
            {t.pageRows.map((r) => (
              <li key={r.label}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="t-label text-ink">{r.label}</span>
                  <span className="t-caption text-ink-secondary">{r.note}</span>
                </div>
                <div className="mt-2 h-3 rounded-xs bg-surface-sunken">
                  <div aria-hidden className="mx-auto h-3 rounded-xs bg-primary" style={{ width: `${(r.width / 1280) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Table
          className="mt-6"
          columns={[
            { key: "width", header: t.gutterHeaders.width, render: (r) => r.width },
            { key: "gutter", header: t.gutterHeaders.gutter, align: "right", render: (r) => r.gutter },
            { key: "token", header: t.gutterHeaders.token, render: (r) => <code>{r.token}</code> },
            { key: "reason", header: t.gutterHeaders.reason, wrap: true, render: (r) => r.reason },
          ]}
          rows={t.gutters}
          rowKey={(r) => r.token}
        />
        <p className="t-body-sm mt-3">
          <Link to="/knowledge/layout/reference-sites-measured">{t.sourceNotes.knowledge}</Link>
        </p>
        <div className="mt-8 grid gap-4">
          <figure className="rounded-lg border border-dashed border-hairline-strong bg-canvas-soft p-5 sm:p-6">
            <figcaption className="t-label text-ink">{t.measureBad}</figcaption>
            <p className="t-body mt-3 text-ink-secondary">{t.measureSample} {t.measureSample}</p>
            <p className="t-caption mt-3 text-ink-muted">{t.measureBadNote}</p>
          </figure>
          <figure className="rounded-lg border border-hairline bg-surface p-5 sm:p-6">
            <figcaption className="t-label text-ink">{t.measureGood}</figcaption>
            <p className="t-body mx-auto mt-3 measure text-ink-secondary">{t.measureSample} {t.measureSample}</p>
            <p className="t-caption mt-3 text-ink-muted">{t.measureGoodNote}</p>
          </figure>
        </div>
      </Section>

      <Section id="rhythm" title={t.rhythmTitle} lead={t.rhythmLead}>
        <div className="grid gap-4 sm:grid-cols-2">
          <figure className="rounded-lg border border-hairline bg-surface p-5 sm:p-6">
            <figcaption className="t-caption text-ink-muted">{t.rhythmGood}</figcaption>
            <p className="t-body-sm mt-4 text-ink-secondary">{t.rhythmPrev}</p>
            <p className="t-h4 mt-12 text-ink">{t.rhythmHeading}</p>
            <p className="t-body-sm mt-2 text-ink-secondary">{t.rhythmLeadText}</p>
            <p className="t-body-sm mt-6 rounded-md border border-hairline p-3 text-ink">{t.rhythmBody}</p>
          </figure>
          <figure className="rounded-lg border border-dashed border-hairline-strong bg-canvas-soft p-5 sm:p-6">
            <figcaption className="t-caption text-ink-muted">{t.rhythmBad}</figcaption>
            <p className="t-body-sm mt-4 text-ink-secondary">{t.rhythmPrev}</p>
            <p className="t-h4 mt-6 text-ink">{t.rhythmHeading}</p>
            <p className="t-body-sm mt-6 text-ink-secondary">{t.rhythmLeadText}</p>
            <p className="t-body-sm mt-6 rounded-md border border-hairline p-3 text-ink">{t.rhythmBody}</p>
            <p className="t-caption mt-4 text-ink-muted">{t.rhythmBadNote}</p>
          </figure>
        </div>
        <Table
          className="mt-6"
          columns={[
            { key: "what", header: t.rhythmHeaders.what, wrap: true, render: (r) => r.what },
            { key: "value", header: t.rhythmHeaders.value, align: "right", render: (r) => r.value },
          ]}
          rows={t.rhythm}
          rowKey={(r) => r.what}
        />
      </Section>

      <Section id="grid" title={t.gridTitle} lead={t.gridLead}>
        <div className="rounded-lg border border-hairline bg-canvas-soft p-4 sm:p-6">
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-12 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex h-16 items-center justify-center rounded-xs border border-dashed border-hairline-strong text-xs text-ink-muted tabular">
                {i + 1}
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-4 gap-4 sm:grid-cols-12 sm:gap-6">
            <div className="col-span-4 rounded-md border border-hairline bg-surface p-4 sm:col-span-8">
              <p className="t-label text-ink">{t.mainCols}</p>
              <p className="t-caption mt-1 text-ink-secondary">{t.mainColsNote}</p>
            </div>
            <div className="col-span-4 rounded-md border border-hairline bg-surface p-4 sm:col-span-4">
              <p className="t-label text-ink">{t.asideCols}</p>
              <p className="t-caption mt-1 text-ink-secondary">{t.asideColsNote}</p>
            </div>
          </div>
        </div>
        <CodeBlock
          className="mt-6 measure"
          code={".page { padding-inline: var(--ds-gutter-sm); }   /* 20 → 24 → 32 */\n.container { max-width: var(--ds-container); margin-inline: auto; }\n.container-doc { max-width: var(--ds-container-doc); margin-inline: auto; }\n.grid {\n  display: grid;\n  grid-template-columns: repeat(12, minmax(0, 1fr));\n  gap: var(--ds-space-6);\n}\n.prose { max-width: var(--ds-measure); }\n:lang(ja) .prose { max-width: var(--ds-measure-ja); }"}
        />
      </Section>

      <Section id="breakpoints" title={t.breakpointsTitle}>
        <Table
          columns={[
            { key: "name", header: t.bpHeaders.name, render: (r) => <code>{r.name}</code> },
            { key: "value", header: "min-width", align: "right", render: (r) => r.value },
            { key: "use", header: t.bpHeaders.use, wrap: true, render: (r) => t.bpUse[r.name] ?? "" },
          ]}
          rows={breakpoints}
          rowKey={(r) => r.name}
        />
      </Section>

      <Section id="targets" title={t.targetsTitle} lead={t.targetsLead}>
        <div className="flex flex-wrap items-end gap-8">
          <div className="flex flex-col items-start gap-2">
            <span className="flex size-6 items-center justify-center rounded-xs border border-hairline-strong bg-surface text-xs text-ink">24</span>
            <span className="t-caption text-ink-secondary">{t.targets.desktop}</span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="flex h-10 w-24 items-center justify-center rounded-md bg-primary text-sm font-medium text-on-primary">40</span>
            <span className="t-caption text-ink-secondary">{t.targets.button}</span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="flex size-11 items-center justify-center rounded-md border border-hairline-strong bg-surface text-xs text-ink">44</span>
            <span className="t-caption text-ink-secondary">{t.targets.touch}</span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="flex size-12 items-center justify-center rounded-md border border-hairline-strong bg-surface text-xs text-ink">48</span>
            <span className="t-caption text-ink-secondary">{t.targets.material}</span>
          </div>
        </div>
      </Section>

      <Section id="good-bad" title={t.goodBadTitle}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">{t.goodTitle}</p>
            <ul className="mt-4 flex flex-col gap-4">
              {t.items.map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-md border border-hairline p-3 text-sm text-ink">
                  <span aria-hidden className="size-2 rounded-full bg-success" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="t-caption mt-4 text-ink-secondary">{t.goodCaption}</p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">{t.badTitle}</p>
            <ul className="mt-4 flex flex-col">
              <li className="flex items-center gap-3 rounded-md border border-hairline p-3 text-sm text-ink">
                <span aria-hidden className="size-2 rounded-full bg-success" />
                {t.items[0]}
              </li>
              <li className="mt-3 flex items-center gap-2 rounded-md border border-hairline px-4 py-2 text-sm text-ink">
                <span aria-hidden className="size-2 rounded-full bg-success" />
                {t.items[1]}
              </li>
              <li className="mt-5 flex items-center gap-4 rounded-md border border-hairline p-3.5 text-sm text-ink">
                <span aria-hidden className="size-2 rounded-full bg-success" />
                {t.items[2]}
              </li>
            </ul>
            <p className="t-caption mt-4 text-ink-secondary">{t.badCaption}</p>
          </div>
        </div>
      </Section>

      <Section id="too-much" title={t.tooMuchTitle} lead={t.tooMuchLead}>
        <Table
          columns={[
            { key: "failure", header: t.tooMuchHeaders.failure, wrap: true, render: (r) => r.failure },
            { key: "fix", header: t.tooMuchHeaders.fix, wrap: true, render: (r) => r.fix },
          ]}
          rows={t.tooMuch}
          rowKey={(r) => r.failure}
        />
      </Section>

      <Why>
        {t.why.map((para) => (
          <p key={para}>{para}</p>
        ))}
      </Why>

      <SourceList
        sources={[
          { title: "WCAG 2.2: 2.5.8 Target Size (Minimum)", url: "https://www.w3.org/TR/WCAG22/#target-size-minimum", note: t.sourceNotes.wcag },
          { title: "Apple HIG: Layout", url: "https://developer.apple.com/design/human-interface-guidelines/layout", note: t.sourceNotes.hig },
          { title: "GOV.UK Design System: Layout", url: "https://design-system.service.gov.uk/styles/layout/", note: t.sourceNotes.govuk },
          { title: "デジタル庁デザインシステム: タイポグラフィ", url: "https://design.digital.go.jp/dads/foundations/typography/", note: t.sourceNotes.dads },
          { title: "SmartHR Design System: 余白の取り方", url: "https://smarthr.design/products/design-patterns/spacing-layout-pattern/", note: t.sourceNotes.smarthr },
          { title: "taste-skill: layout.md", url: "https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/references/layout.md", note: t.sourceNotes.taste },
          { title: "impeccable: layout.md", url: "https://github.com/pbakaus/impeccable/blob/main/cursor-plugin/skills/impeccable/reference/layout.md", note: t.sourceNotes.impeccable },
          { title: "NN/g: The Illusion of Completeness", url: "https://www.nngroup.com/articles/illusion-of-completeness/", note: t.sourceNotes.illusion },
          { title: "Material 3: Structure (touch targets)", url: "https://m3.material.io/foundations/designing/structure", note: t.sourceNotes.m3 },
          { title: "NN/g: Proximity Principle in Visual Design", url: "https://www.nngroup.com/articles/gestalt-proximity/", note: t.sourceNotes.proximity },
          { title: "NN/g: Fitts's Law", url: "https://www.nngroup.com/articles/fitts-law/", note: t.sourceNotes.fitts },
          { title: "Tailwind CSS v4: Theme variables", url: "https://tailwindcss.com/docs/theme", note: t.sourceNotes.tailwind },
          { title: "voltagent/awesome-design-md", url: "https://github.com/voltagent/awesome-design-md", note: t.sourceNotes.designMd },
        ]}
      />
    </div>
  );
}
