import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "../ds/components/Button";
import { DataNote, GalleryHeader } from "../layout/Gallery";
import { Section, SourceList } from "../layout/Page";
import { Compare } from "../layout/Playground";
import { Link } from "../i18n/router";
import { useT } from "../i18n/context";
import { slidesMessages, type SlidesMessages } from "../i18n/messages/slides";

export function Slides() {
  const t = useT(slidesMessages);

  return (
    <div>
      <GalleryHeader title={t.title} lead={t.lead} stat={t.sample.slides.length} statLabel={t.statLabel}>
        <p className="t-body-sm mt-3">
          <Link to="/knowledge/skills/slides">{t.readKnowledge}</Link>
        </p>
      </GalleryHeader>

      <Section id="sample" title={t.examples.title} lead={t.examples.lead}>
        <Compare
          goodLabel={t.examples.goodLabel}
          badLabel={t.examples.badLabel}
          good={<SlideDeck t={t} />}
          bad={<SlideBad t={t} />}
        />
      </Section>

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

      <Section id="skills" title={t.popular.title} lead={t.popular.lead}>
        <ul className="overflow-hidden rounded-lg border border-hairline bg-surface">
          {t.popular.rows.map((row, i) => (
            <li key={row.name} className={"grid gap-x-6 gap-y-1 px-5 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]" + (i > 0 ? " border-t border-hairline" : "")}>
              <p className="t-label min-w-0 break-words text-ink">{row.name}</p>
              <div className="min-w-0">
                <p className="t-body-sm text-ink-secondary">{row.when}</p>
                <a href={row.url} target="_blank" rel="noreferrer" className="t-caption mt-1 inline-flex max-w-full items-center gap-1 break-all">
                  {row.url.replace(/^https:\/\//, "")}
                  <ExternalLink className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
                </a>
              </div>
            </li>
          ))}
        </ul>
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

function SlideDeck({ t }: { t: SlidesMessages }) {
  const slides = t.sample.slides;
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];
  const count = slides.length;

  function show(next: number) {
    setIndex((next + count) % count);
  }

  return (
    <div>
      <div
        tabIndex={0}
        aria-label={t.examples.goodLabel}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            show(index + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            show(index - 1);
          }
        }}
        className="rounded-lg outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <div data-theme="light" className="rounded-lg bg-ink p-3">
          <article className="flex aspect-video w-full min-w-0 flex-col justify-center bg-canvas px-[8%] text-ink">
            <h3 className="t-h3 break-words">{slide.title}</h3>
            {slide.sentence && <p className="t-body mt-3 break-words">{slide.sentence}</p>}
            {slide.items && (
              <ul className="mt-3 flex flex-col gap-1">
                {slide.items.map((item) => (
                  <li key={item} className="t-body-sm break-words">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => show(index - 1)}>
          {t.sample.prev}
        </Button>
        <Button variant="primary" size="sm" onClick={() => show(index + 1)}>
          {t.sample.next}
        </Button>
        <p className="t-mono ml-auto tabular text-ink">
          {index + 1} / {count}
        </p>
      </div>
    </div>
  );
}

function SlideBad({ t }: { t: SlidesMessages }) {
  return (
    <div
      className="flex aspect-video w-full min-w-0 flex-col items-center justify-center gap-2 rounded-lg px-4 text-center text-on-accent"
      // The bad pane is the generated default: a purple-to-blue gradient.
      // Both stops are chart tokens, so no raw colour enters web/src.
      style={{ backgroundImage: "linear-gradient(160deg, var(--ds-chart-5), var(--ds-chart-1))" }}
    >
      <p className="t-h3 break-words">{t.examples.badTitle}</p>
      <p className="t-body-sm max-w-[28ch] break-words opacity-90">{t.examples.badBody}</p>
      <div className="grid w-full grid-cols-3 gap-2">
        {t.examples.badCards.map((label) => (
          <div key={label} className="min-w-0 rounded-md bg-canvas/15 px-1 py-2">
            <p className="t-label break-words">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
