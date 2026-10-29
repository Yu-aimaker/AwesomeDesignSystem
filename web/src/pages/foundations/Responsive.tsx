import { useLayoutEffect, useRef, useState } from "react";
import { PageHeader, Section, SourceList, Why } from "../../layout/Page";
import { CodeBlock } from "../../layout/Preview";
import { Table } from "../../ds/components/Table";
import { Button } from "../../ds/components/Button";
import { Slider } from "../../ds/components/Slider";
import { tokens } from "../../lib/tokens";
import { cx } from "../../ds/cx";
import { useT } from "../../i18n/context";
import { Link } from "../../i18n/router";
import { responsiveMessages, type ResponsiveMessages } from "../../i18n/messages/responsive";

type ClassId = keyof ResponsiveMessages["classNames"];

const px = (v: string) => parseInt(v, 10);
const layoutTokens = tokens.layout as unknown as Record<string, { $value: string }>;
const bp = (name: string) => px(tokens.layout.breakpoint[name].$value);

const MIN_W = 320;
const MAX_W = 1440;
const CONTAINER = px(tokens.layout.container.$value);
const CARD_MIN = 280;
const CARD_GAP = 16;
const NAV_INLINE_FROM = bp("lg");
const PRESETS = [320, 390, 768, 820, 1024, 1280];

/** Side margin steps, ascending by the width they start at. */
const gutters = [
  { from: 0, px: px(layoutTokens["gutter-sm"].$value) },
  { from: bp("sm"), px: px(layoutTokens["gutter-md"].$value) },
  { from: bp("lg"), px: px(layoutTokens["gutter-lg"].$value) },
];

/** Width classes, ascending. Each runs until the next one starts. */
const widthClasses: Array<{ id: ClassId; from: number; panes: 1 | 2 }> = [
  { id: "phone", from: MIN_W, panes: 1 },
  { id: "tabletPortrait", from: 600, panes: 1 },
  { id: "tabletLandscape", from: 840, panes: 2 },
  { id: "desktop", from: 1200, panes: 2 },
];

const lastFrom = <T extends { from: number }>(list: T[], w: number) => [...list].reverse().find((x) => w >= x.from) ?? list[0];

function layoutAt(w: number) {
  const cls = lastFrom(widthClasses, w);
  const gutter = lastFrom(gutters, w).px;
  const content = Math.min(w - 2 * gutter, CONTAINER);
  const cols = Math.max(1, Math.floor((content + CARD_GAP) / (CARD_MIN + CARD_GAP)));
  return { cls, gutter, content, cols, panes: cls.panes, navInline: w >= NAV_INLINE_FROM };
}

const classRows = widthClasses.map((c, i) => {
  const next = widthClasses[i + 1];
  const max = next ? next.from - 1 : null;
  const lo = layoutAt(c.from);
  const hi = layoutAt(max ?? MAX_W);
  const gutterSet = [...new Set([lo.gutter, ...gutters.filter((g) => g.from > c.from && g.from <= (max ?? MAX_W)).map((g) => g.px)])];
  return { ...c, max, lo, hi, gutterSet };
});

function Bar({ w, className }: { w: number | string; className?: string }) {
  return <span className={cx("block h-2.5 rounded-xs bg-hairline-strong", className)} style={{ width: w }} />;
}

/** The page drawn at its real width `w`, then scaled down to fit the column. */
function Mock({ w }: { w: number }) {
  const l = layoutAt(w);
  return (
    <div className="bg-canvas" style={{ width: w }}>
      <div className="flex h-14 items-center justify-between border-b border-hairline bg-surface" style={{ paddingInline: l.gutter }}>
        <span className="flex items-center gap-3">
          <span className="size-7 rounded-md bg-primary" />
          <Bar w={72} />
        </span>
        {l.navInline ? (
          <span className="flex items-center gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <Bar key={i} w={56} />
            ))}
          </span>
        ) : (
          <span className="flex size-11 flex-col items-center justify-center gap-1.5 rounded-md border border-hairline-strong">
            {[0, 1, 2].map((i) => (
              <span key={i} className="block h-0.5 w-5 rounded-full bg-ink" />
            ))}
          </span>
        )}
      </div>
      <div className="bg-accent-soft" style={{ paddingInline: l.gutter }}>
        <div className="mx-auto flex flex-col gap-4 bg-canvas py-6" style={{ maxWidth: CONTAINER }}>
          <div className="grid gap-4" style={{ gridTemplateColumns: l.panes === 2 ? "minmax(0, 1fr) minmax(0, 2fr)" : "minmax(0, 1fr)" }}>
            <div className="flex flex-col gap-3 rounded-lg border border-hairline bg-surface p-4">
              {[70, 55, 80, 60, 45].map((pct, i) => (
                <span key={i} className={cx("flex items-center gap-3 rounded-md p-2", i === 0 && "bg-surface-sunken")}>
                  <span className="size-6 shrink-0 rounded-full bg-hairline" />
                  <Bar w={`${pct}%`} />
                </span>
              ))}
            </div>
            {l.panes === 2 && (
              <div className="flex flex-col gap-3 rounded-lg border border-hairline bg-surface p-5">
                <Bar w="40%" className="h-4 bg-ink" />
                {[95, 90, 85, 92, 60].map((pct, i) => (
                  <Bar key={i} w={`${pct}%`} />
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${l.cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: l.cols * 2 }, (_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-hairline bg-surface">
                <div className="h-16 bg-surface-sunken" />
                <div className="flex flex-col gap-2 p-3">
                  <Bar w="60%" />
                  <Bar w="85%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Simulator({ t }: { t: ResponsiveMessages }) {
  const [w, setW] = useState(390);
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ cw: 0, ih: 0 });

  useLayoutEffect(() => {
    const measure = () => setBox({ cw: outer.current?.clientWidth ?? 0, ih: inner.current?.offsetHeight ?? 0 });
    measure();
    const ro = new ResizeObserver(measure);
    if (outer.current) ro.observe(outer.current);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, []);

  const l = layoutAt(w);
  const scale = box.cw ? Math.min(1, (box.cw - 2) / w) : 0;
  const readout: Array<[string, string]> = [
    [t.readout.gutter, `${l.gutter}px`],
    [t.readout.content, `${l.content}px`],
    [t.readout.cols, t.colsValue(l.cols)],
    [t.readout.panes, t.panesValue(l.panes)],
    [t.readout.nav, l.navInline ? t.navInline : t.navSheet],
  ];

  return (
    <div className="rounded-lg border border-hairline bg-canvas-soft p-4 sm:p-6">
      <Slider value={w} onChange={setW} min={MIN_W} max={MAX_W} step={1} label={t.simWidth} showValue formatValue={(v) => `${v}px`} />
      <div role="group" aria-label={t.simPresets} className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {PRESETS.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === w ? "primary" : "secondary"}
            aria-pressed={p === w}
            onClick={() => setW(p)}
            className="tabular pointer-coarse:h-11"
          >
            {p}
          </Button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="t-h3 text-ink" aria-live="polite">
          {t.classNames[l.cls.id]}
        </p>
        <p className="t-mono tabular text-ink-secondary">{w}px</p>
      </div>
      <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
        {readout.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-ink-muted">{k}</dt>
            <dd className="tabular text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <div
        ref={outer}
        role="img"
        aria-label={t.simFrame(w)}
        className="mt-6 motion-safe:transition-[height] motion-safe:duration-fast motion-safe:ease-out-ds"
        style={{ height: box.ih * scale + 2 }}
      >
        <div className="mx-auto h-full overflow-hidden rounded-md border border-hairline-strong bg-surface" style={{ width: w * scale + 2 }}>
          <div ref={inner} aria-hidden className="origin-top-left" style={{ width: w, transform: `scale(${scale})` }}>
            <Mock w={w} />
          </div>
        </div>
      </div>
      <p className="t-caption mt-2 text-ink-muted">{t.simLegend}</p>
    </div>
  );
}

function RowTable({ rows, headers }: { rows: Array<{ label: string; note: string }>; headers: [string, string] }) {
  return (
    <Table
      columns={[
        { key: "label", header: headers[0], wrap: true, render: (r) => r.label },
        { key: "note", header: headers[1], wrap: true, render: (r) => r.note },
      ]}
      rows={rows}
      rowKey={(r) => r.label}
    />
  );
}

export function Responsive() {
  const t = useT(responsiveMessages);
  return (
    <div>
      <PageHeader title={t.title} lead={t.lead} />

      <Section id="rule" title={t.ruleTitle}>
        <div className="prose t-body text-ink">
          <p>{t.rule}</p>
        </div>
        <CodeBlock className="mt-6" code={t.ruleCode} />
        <p className="t-body-sm mt-3">
          <Link to="/knowledge/awesomeds/responsive">{t.noteLink}</Link>
        </p>
      </Section>

      <Section id="shapes" title={t.simTitle} lead={t.simLead}>
        <Simulator t={t} />
      </Section>

      <Section id="classes" title={t.classesTitle} lead={t.classesLead}>
        <Table
          columns={[
            { key: "cls", header: t.classHeaders.cls, render: (r) => t.classNames[r.id] },
            { key: "range", header: t.classHeaders.range, render: (r) => <span className="tabular">{t.span(r.from, r.max)}</span> },
            { key: "cols", header: t.classHeaders.cols, render: (r) => t.span(r.lo.cols, r.hi.cols) },
            {
              key: "nav",
              header: t.classHeaders.nav,
              render: (r) => (r.lo.navInline ? t.navInline : r.hi.navInline ? t.navRange(NAV_INLINE_FROM) : t.navSheet),
            },
            { key: "panes", header: t.classHeaders.panes, align: "right", render: (r) => r.panes },
            { key: "gutter", header: t.classHeaders.gutter, render: (r) => r.gutterSet.join(" / ") },
            { key: "source", header: t.classHeaders.source, wrap: true, render: (r) => t.classSources[r.id] },
          ]}
          rows={classRows}
          rowKey={(r) => r.id}
        />
      </Section>

      <Section id="review" title={t.reviewTitle} lead={t.reviewLead}>
        <p className="t-body-sm measure text-ink-secondary">{t.share}</p>
        <Table
          className="mt-6"
          columns={[
            { key: "width", header: t.reviewHeaders.width, align: "right", render: (r) => <span className="t-mono">{r.width}</span> },
            { key: "group", header: t.reviewHeaders.group, render: (r) => t.classNames[r.group] },
            { key: "why", header: t.reviewHeaders.why, wrap: true, render: (r) => r.why },
          ]}
          rows={t.review}
          rowKey={(r) => String(r.width)}
        />
      </Section>

      <Section id="touch" title={t.touchTitle} lead={t.touchLead}>
        <div className="flex flex-wrap items-end gap-8">
          <div className="flex flex-col items-start gap-2">
            <span className="flex size-6 items-center justify-center rounded-xs border border-hairline-strong bg-surface text-xs text-ink">24</span>
            <span className="t-caption text-ink-secondary">{t.touchTargets.floor}</span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="flex size-11 items-center justify-center rounded-md border border-hairline-strong bg-surface text-xs text-ink">44</span>
            <span className="t-caption text-ink-secondary">{t.touchTargets.coarse}</span>
          </div>
        </div>
        <div className="mt-6">
          <RowTable rows={t.touch} headers={[t.touchHeaders.what, t.touchHeaders.rule]} />
        </div>
        <CodeBlock className="mt-6" code={t.touchCode} />
      </Section>

      <Section id="navigation" title={t.navTitle} lead={t.navLead}>
        <ul className="flex flex-col gap-4">
          {t.navRows.map((r, i) => (
            <li key={r.label} className="rounded-lg border border-hairline bg-surface p-4">
              <div aria-hidden className="flex h-11 items-center justify-between gap-3 rounded-md bg-canvas-soft px-3">
                <span className="size-6 shrink-0 rounded-sm bg-primary" />
                {i === 2 ? (
                  <span className="t-label flex h-11 items-center rounded-md border border-hairline-strong bg-surface px-3 text-ink">{t.navMenu}</span>
                ) : (
                  <span className="flex min-w-0 items-center gap-3">
                    {Array.from({ length: i === 0 ? 6 : 4 }, (_, k) => (
                      <span key={k} className={cx("h-2 w-8 shrink rounded-xs bg-hairline-strong", i === 0 && k >= 3 && "hidden sm:block")} />
                    ))}
                  </span>
                )}
              </div>
              <p className="t-label mt-3 text-ink">{r.label}</p>
              <p className="t-body-sm text-ink-secondary">{r.note}</p>
            </li>
          ))}
        </ul>
        <p className="t-body-sm mt-4 measure text-ink-secondary">{t.navNote}</p>
      </Section>

      <Section id="height" title={t.heightTitle} lead={t.heightLead}>
        <CodeBlock code={t.heightCode} />
        <p className="t-body-sm mt-3 measure text-ink-secondary">{t.heightNote}</p>
      </Section>

      <Section id="overflow" title={t.overflowTitle} lead={t.overflowLead}>
        <RowTable rows={t.overflow} headers={[t.overflowHeaders.cause, t.overflowHeaders.fix]} />
        <p className="t-body-sm mt-4 measure text-ink-secondary">{t.overflowNote}</p>
      </Section>

      <Section id="verify" title={t.verifyTitle}>
        <RowTable rows={t.verify} headers={[t.verifyHeaders.check, t.verifyHeaders.how]} />
      </Section>

      <Why>
        {t.why.map((para) => (
          <p key={para}>{para}</p>
        ))}
      </Why>

      <SourceList
        sources={[
          { title: "WCAG 2.2: Understanding 1.4.10 Reflow", url: "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html", note: t.sourceNotes.reflow },
          { title: "WCAG 2.2: Understanding 2.5.8 Target Size (Minimum)", url: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html", note: t.sourceNotes.target },
          { title: "Apple HIG: Layout", url: "https://developer.apple.com/design/human-interface-guidelines/layout", note: t.sourceNotes.hig },
          { title: "Apple HIG: Accessibility", url: "https://developer.apple.com/design/human-interface-guidelines/accessibility", note: t.sourceNotes.higA11y },
          { title: "Android Developers: Use window size classes", url: "https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes", note: t.sourceNotes.sizeClasses },
          { title: "Android Developers: Canonical layouts", url: "https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts", note: t.sourceNotes.canonical },
          { title: "Android Developers: Adaptive app quality", url: "https://developer.android.com/docs/quality-guidelines/adaptive-app-quality", note: t.sourceNotes.adaptiveQuality },
          { title: "NN/g: Hamburger Menus and Hidden Navigation", url: "https://www.nngroup.com/articles/hamburger-menus/", note: t.sourceNotes.nngNav },
          { title: "StatCounter: Desktop vs Mobile vs Tablet (worldwide)", url: "https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/worldwide", note: t.sourceNotes.statPlatform },
          { title: "StatCounter: Desktop vs Mobile vs Tablet (Japan)", url: "https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/japan", note: t.sourceNotes.statPlatformJp },
          { title: "StatCounter: Mobile screen resolution (worldwide)", url: "https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide", note: t.sourceNotes.statMobile },
          { title: "StatCounter: Mobile screen resolution (Japan)", url: "https://gs.statcounter.com/screen-resolution-stats/mobile/japan", note: t.sourceNotes.statMobileJp },
          { title: "StatCounter: Tablet screen resolution", url: "https://gs.statcounter.com/screen-resolution-stats/tablet/worldwide", note: t.sourceNotes.statTablet },
          { title: "StatCounter: Desktop screen resolution", url: "https://gs.statcounter.com/screen-resolution-stats/desktop/worldwide", note: t.sourceNotes.statDesktop },
          { title: "MDN: viewport meta", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport", note: t.sourceNotes.viewport },
          { title: "MDN: <length> (viewport units)", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length", note: t.sourceNotes.units },
          { title: "MDN: pointer", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer", note: t.sourceNotes.pointer },
          { title: "web.dev: Responsive web design basics", url: "https://web.dev/articles/responsive-web-design-basics", note: t.sourceNotes.basics },
          { title: "CSS-Tricks: 16px or Larger Text Prevents iOS Form Zoom", url: "https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/", note: t.sourceNotes.inputZoom },
          { title: "デジタル庁デザインシステム: レイアウト（アクセシビリティ）", url: "https://design.digital.go.jp/dads/foundations/layout/accessibility/", note: t.sourceNotes.dads },
          { title: "Primer: Responsive", url: "https://primer.style/product/getting-started/foundations/responsive/", note: t.sourceNotes.primer },
          { title: "Atlassian Design System: Grid", url: "https://atlassian.design/foundations/grid", note: t.sourceNotes.atlassian },
          { title: "Tailwind CSS: Responsive design", url: "https://tailwindcss.com/docs/responsive-design", note: t.sourceNotes.tailwind },
        ]}
      />
    </div>
  );
}
