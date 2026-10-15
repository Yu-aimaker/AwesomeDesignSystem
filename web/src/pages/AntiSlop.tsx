import { ExternalLink } from "lucide-react";
import { DataNote, GalleryHeader } from "../layout/Gallery";
import { Section } from "../layout/Page";
import { Compare } from "../layout/Playground";
import { Link } from "../i18n/router";
import { useT } from "../i18n/context";
import { antiSlopMessages, type AntiSlopMessages, type CopyPair, type Pattern } from "../i18n/messages/antiSlop";

/**
 * /anti-slop. A few defaults are drawn side by side with their fix; the rest
 * are listed as pattern and fix with the sources that name them. Content:
 * Knowledge/skills/anti-ai-slop.md.
 */
export function AntiSlop() {
  const t = useT(antiSlopMessages);
  const count = t.design.rows.length + t.components.rows.length + t.copyEn.rows.length + t.copyJa.rows.length;

  return (
    <div>
      <GalleryHeader title={t.title} lead={t.lead} stat={count} statLabel={t.statLabel}>
        <p className="t-body-sm mt-3">
          <Link to="/knowledge/skills/anti-ai-slop">{t.readKnowledge}</Link>
        </p>
      </GalleryHeader>

      <Section id="design" title={t.design.title} lead={t.design.lead}>
        <div className="flex flex-col gap-6">
          <Compare goodLabel={`${t.use}: ${t.design.heroGoodLabel}`} badLabel={`${t.avoid}: ${t.design.heroBadLabel}`} good={<HeroGood t={t} />} bad={<HeroBad t={t} />} />
          <Compare goodLabel={`${t.use}: ${t.design.cardsGoodLabel}`} badLabel={`${t.avoid}: ${t.design.cardsBadLabel}`} good={<CardsGood t={t} />} bad={<CardsBad t={t} />} />
        </div>
        <PatternList rows={t.design.rows} t={t} className="mt-8" />
      </Section>

      <Section id="components" title={t.components.title} lead={t.components.lead}>
        <Compare goodLabel={`${t.use}: ${t.components.headGoodLabel}`} badLabel={`${t.avoid}: ${t.components.headBadLabel}`} good={<HeadGood t={t} />} bad={<HeadBad t={t} />} />
        <PatternList rows={t.components.rows} t={t} className="mt-8" />
      </Section>

      <Section id="copy-en" title={t.copyEn.title} lead={t.copyEn.lead}>
        <CopyList rows={t.copyEn.rows} t={t} lang="en" />
      </Section>

      <Section id="copy-ja" title={t.copyJa.title} lead={t.copyJa.lead}>
        <CopyList rows={t.copyJa.rows} t={t} lang="ja" />
      </Section>

      <Section id="excluded" title={t.excluded.title} lead={t.excluded.lead}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {t.excluded.rows.map((e) => (
            <li key={e.pattern} className="rounded-md border border-hairline bg-surface px-4 py-3">
              <p className="t-label text-ink">{e.pattern}</p>
              <p className="t-body-sm mt-1 text-ink-secondary">{e.why}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="hacks" title={t.hacks.title} lead={t.hacks.lead}>
        <ul className="overflow-hidden rounded-lg border border-hairline bg-surface">
          {t.hacks.rows.map((h, i) => (
            <li key={h.name} className={"px-5 py-4" + (i > 0 ? " border-t border-hairline" : "")}>
              <a href={h.url} target="_blank" rel="noreferrer" className="t-h4 inline-flex items-center gap-1.5">
                {h.name}
                <ExternalLink className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
              </a>
              <p className="t-body-sm mt-1 text-ink-secondary">{h.what}</p>
              <p className="mt-1 flex min-w-0 items-baseline gap-2">
                <span className="t-caption shrink-0 text-ink-muted">{t.hacks.install}</span>
                <code className="t-mono min-w-0 break-all text-ink-secondary">{h.install}</code>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <DataNote>{t.dataNote}</DataNote>
    </div>
  );
}

type T = AntiSlopMessages;

function PatternList({ rows, t, className }: { rows: Pattern[]; t: T; className?: string }) {
  return (
    <ol className={"overflow-hidden rounded-lg border border-hairline bg-surface " + (className ?? "")}>
      {rows.map((r, i) => (
        <li key={r.pattern} className={"grid gap-x-6 gap-y-1 px-5 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" + (i > 0 ? " border-t border-hairline" : "")}>
          <p className="t-label flex min-w-0 items-baseline gap-3 text-ink">
            <span className="t-mono tabular shrink-0 text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0">{r.pattern}</span>
          </p>
          <div className="min-w-0">
            <p className="t-body-sm text-ink">
              <span className="text-ink-muted">{t.fix}: </span>
              {r.fix}
            </p>
            <p className="t-caption mt-1 text-ink-muted">
              {t.sourcesLabel}: {r.sources}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function CopyList({ rows, t, lang }: { rows: CopyPair[]; t: T; lang: "ja" | "en" }) {
  return (
    <ol className="overflow-hidden rounded-lg border border-hairline bg-surface">
      {rows.map((r, i) => (
        <li key={r.pattern} className={"px-5 py-4" + (i > 0 ? " border-t border-hairline" : "")}>
          <p className="t-label flex items-baseline gap-3 text-ink">
            <span className="t-mono tabular shrink-0 text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0">{r.pattern}</span>
          </p>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            <p className="min-w-0 rounded-md border border-dashed border-hairline-strong bg-canvas-soft px-3 py-2">
              <span className="t-caption block text-ink-muted">{t.before}</span>
              <span className="t-body text-ink-secondary" lang={lang}>
                {r.before}
              </span>
            </p>
            <p className="min-w-0 rounded-md border border-hairline bg-surface px-3 py-2">
              <span className="t-caption block text-ink-muted">{t.after}</span>
              <span className="t-body text-ink" lang={lang}>
                {r.after}
              </span>
            </p>
          </div>
          <p className="t-caption mt-2 text-ink-muted">
            {t.sourcesLabel}: {r.sources}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ---- drawn specimens ---------------------------------------------------- */

function HeroBad({ t }: { t: T }) {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-2xl px-5 py-10 text-center text-on-accent"
      // The point of this pane is the generated default: a purple-to-blue gradient.
      // Both stops are chart tokens, so no raw colour enters web/src.
      style={{ backgroundImage: "linear-gradient(135deg, var(--ds-chart-5), var(--ds-chart-1))" }}
    >
      <p className="t-h3 font-semibold">{t.design.heroBad}</p>
      <p className="t-body-sm opacity-80">{t.design.heroBadSub}</p>
      <span className="mt-2 inline-flex h-10 items-center rounded-full bg-canvas/20 px-5 text-sm shadow-2">{t.design.heroBadCta}</span>
    </div>
  );
}

function HeroGood({ t }: { t: T }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-hairline bg-canvas px-5 py-8">
      <p className="t-h3 text-ink">{t.design.heroGood}</p>
      <p className="t-body-sm max-w-[40ch] text-ink-secondary">{t.design.heroGoodSub}</p>
      <span className="mt-2 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary">{t.design.heroGoodCta}</span>
    </div>
  );
}

function CardsBad({ t }: { t: T }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {t.design.cardsBad.map(([emoji, title, body]) => (
        <div key={title} className="flex min-w-0 flex-col items-center gap-2 rounded-2xl border-l-4 border-accent bg-surface p-3 text-center shadow-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent-soft text-lg" aria-hidden>
            {emoji}
          </span>
          <p className="t-label text-ink">{title}</p>
          <p className="t-caption text-ink-muted">{body}</p>
        </div>
      ))}
    </div>
  );
}

function CardsGood({ t }: { t: T }) {
  return (
    <dl className="flex flex-col">
      {t.design.cardsGood.map(([k, v], i) => (
        <div key={k} className={"grid grid-cols-[4rem_minmax(0,1fr)] gap-3 py-2" + (i > 0 ? " border-t border-hairline" : "")}>
          <dt className="t-label text-ink">{k}</dt>
          <dd className="t-body-sm text-ink-secondary">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function HeadBad({ t }: { t: T }) {
  const c = t.components;
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="inline-flex h-6 items-center rounded-full bg-accent-soft px-2.5 text-xs font-medium uppercase tracking-widest text-accent">{c.headBadPill}</span>
      <p className="flex items-baseline gap-3">
        <span className="t-mono text-ink-muted">{c.headBadNum}</span>
        <span className="t-h3 text-ink">{c.headBadTitle}</span>
      </p>
      <p className="flex items-baseline gap-2">
        <span className="t-h2 tabular text-ink">{c.headBadStat}</span>
        <span className="t-caption uppercase tracking-widest text-ink-muted">{c.headBadStatLabel}</span>
      </p>
      <span className="t-body-sm text-accent">{c.headBadLink}</span>
    </div>
  );
}

function HeadGood({ t }: { t: T }) {
  const c = t.components;
  return (
    <div className="flex flex-col items-start gap-2">
      <p className="t-h3 text-ink">{c.headGoodTitle}</p>
      <p className="t-body-sm text-ink-secondary">{c.headGoodLead}</p>
      <span className="t-body-sm text-accent underline">{c.headGoodLink}</span>
    </div>
  );
}
