import { ExternalLink, Zap, Shield, Sparkles } from "lucide-react";
import { DataNote, GalleryHeader } from "../layout/Gallery";
import { Section } from "../layout/Page";
import { Compare } from "../layout/Playground";
import { Link } from "../i18n/router";
import { useT } from "../i18n/context";
import { antiSlopMessages, type AntiSlopMessages } from "../i18n/messages/antiSlop";

/**
 * /anti-slop. Each pair is drawn, not described: the "avoid" side
 * renders the generated default, the "use" side renders the fix with the
 * same content. Copy pairs and the hack list follow.
 * Content source: Knowledge/skills/anti-ai-slop.md.
 */
export function AntiSlop() {
  const t = useT(antiSlopMessages);
  const count = 4 + t.copy.pairs.length;

  return (
    <div>
      <GalleryHeader title={t.title} lead={t.lead} stat={count} statLabel={t.statLabel}>
        <p className="t-body-sm mt-3">
          <Link to="/knowledge/skills/anti-ai-slop">{t.readKnowledge}</Link>
        </p>
      </GalleryHeader>

      <Section id="design" title={t.design.title} lead={t.design.lead}>
        <div className="flex flex-col gap-6">
          <Compare goodLabel={t.design.heroGoodLabel} badLabel={t.design.heroBadLabel} good={<HeroGood t={t} />} bad={<HeroBad t={t} />} />
          <Compare goodLabel={t.design.cardsGoodLabel} badLabel={t.design.cardsBadLabel} good={<CardsGood t={t} />} bad={<CardsBad t={t} />} />
        </div>
      </Section>

      <Section id="components" title={t.components.title} lead={t.components.lead}>
        <div className="flex flex-col gap-6">
          <Compare goodLabel={t.components.formGoodLabel} badLabel={t.components.formBadLabel} good={<FormGood t={t} />} bad={<FormBad t={t} />} />
        </div>
      </Section>

      <Section id="copy" title={t.copy.title} lead={t.copy.lead}>
        <ol className="overflow-hidden rounded-lg border border-hairline bg-surface">
          {t.copy.pairs.map((p, i) => (
            <PairRow key={p.after} index={i} before={p.before} after={p.after} why={p.why} t={t} />
          ))}
        </ol>
      </Section>

      <Section id="hacks" title={t.hacks.title} lead={t.hacks.lead}>
        <ul className="overflow-hidden rounded-lg border border-hairline bg-surface">
          {t.hacks.rows.map((h, i) => (
            <li key={h.name} className={"grid gap-x-6 gap-y-2 px-5 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]" + (i > 0 ? " border-t border-hairline" : "")}>
              <p className="t-label text-ink-secondary">{h.use}</p>
              <div className="min-w-0">
                <a href={h.url} target="_blank" rel="noreferrer" className="t-h4 inline-flex items-center gap-1.5">
                  {h.name}
                  <ExternalLink className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
                </a>
                <p className="mt-1 flex min-w-0 items-baseline gap-2">
                  <span className="t-caption shrink-0 text-ink-muted">{t.hacks.install}</span>
                  <code className="t-mono min-w-0 break-all text-ink-secondary">{h.install}</code>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <DataNote>{t.dataNote}</DataNote>
    </div>
  );
}

type T = AntiSlopMessages;

function PairRow({ index, label, before, after, why, where, t, children }: { index: number; label?: string; before: string; after: string; why: string; where?: string; t: T; children?: React.ReactNode }) {
  return (
    <li className={"px-5 py-5" + (index > 0 ? " border-t border-hairline" : "")}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="t-mono tabular text-ink-muted">{String(index + 1).padStart(2, "0")}</span>
        {label && <span className="t-label text-ink">{label}</span>}
        {where && <code className="t-caption min-w-0 break-all text-ink-muted">{where}</code>}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="min-w-0 rounded-md border border-dashed border-hairline-strong bg-canvas-soft px-4 py-3">
          <p className="t-caption text-ink-muted">{t.before}</p>
          <p className="t-body mt-1 text-ink-secondary" lang="ja">
            {before}
          </p>
        </div>
        <div className="min-w-0 rounded-md border border-hairline bg-surface px-4 py-3">
          <p className="t-caption text-ink-muted">{t.after}</p>
          <p className="t-body mt-1 text-ink" lang="ja">
            {after}
          </p>
        </div>
      </div>
      <p className="t-body-sm mt-3 text-ink-secondary">
        <span className="text-ink-muted">{t.whyWrong}: </span>
        {why}
      </p>
      {children}
    </li>
  );
}

/* ---- drawn specimens ---------------------------------------------------- */

function HeroBad({ t }: { t: T }) {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-xl px-5 py-10 text-center text-on-accent"
      // The point of this pane is the generated default: a purple-to-blue gradient.
      // Both stops are chart tokens, so no raw colour enters web/src.
      style={{ backgroundImage: "linear-gradient(135deg, var(--ds-chart-5), var(--ds-chart-1))" }}
    >
      <Sparkles className="size-6 opacity-80" strokeWidth={1.5} aria-hidden />
      <p className="t-h3 font-semibold">{t.design.heroBadTitle}</p>
      <p className="t-body-sm opacity-80">{t.design.heroBadBody}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <span className="inline-flex h-9 items-center rounded-full bg-canvas/20 px-4 text-sm">{t.design.heroBadPrimary}</span>
        <span className="inline-flex h-9 items-center rounded-full border border-canvas/40 px-4 text-sm">{t.design.heroBadSecondary}</span>
      </div>
    </div>
  );
}

function HeroGood({ t }: { t: T }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-hairline bg-canvas px-5 py-8">
      <p className="t-h3 text-ink">{t.design.heroGoodTitle}</p>
      <p className="t-body-sm max-w-[40ch] text-ink-secondary">{t.design.heroGoodBody}</p>
      <span className="mt-2 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary">{t.design.heroGoodPrimary}</span>
    </div>
  );
}

function CardsBad({ t }: { t: T }) {
  const icons = [Zap, Shield, Sparkles];
  return (
    <div className="grid grid-cols-3 gap-2">
      {t.design.cardsBad.map((label, i) => {
        const Icon = icons[i];
        return (
          <div key={label} className="flex min-w-0 flex-col items-center gap-2 rounded-lg bg-surface p-3 text-center shadow-2">
            <Icon className="size-5 text-accent" strokeWidth={1.75} aria-hidden />
            <p className="t-label text-ink">{label}</p>
            <p className="t-caption text-ink-muted">{t.design.cardsBadBody}</p>
          </div>
        );
      })}
    </div>
  );
}

function CardsGood({ t }: { t: T }) {
  return (
    <dl className="flex flex-col">
      {t.design.cardsGood.map(([k, v], i) => (
        <div key={k} className={"grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 py-2" + (i > 0 ? " border-t border-hairline" : "")}>
          <dt className="t-label text-ink">{k}</dt>
          <dd className="t-body-sm text-ink-secondary">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function FormBad({ t }: { t: T }) {
  return (
    <div className="flex h-10 items-center rounded-md border border-hairline-strong bg-surface px-3 text-sm text-ink-muted" aria-hidden>
      {t.components.formPlaceholder}
    </div>
  );
}

function FormGood({ t }: { t: T }) {
  return (
    <div className="flex flex-col gap-1.5" aria-hidden>
      <span className="t-label text-ink">{t.components.formLabel}</span>
      <span className="flex h-10 items-center rounded-md border border-hairline-strong bg-surface px-3 text-sm text-ink-muted">{t.components.formExample}</span>
    </div>
  );
}
