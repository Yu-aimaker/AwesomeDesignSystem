import { useState } from "react";
import { Info, Pause, Play, RotateCcw } from "lucide-react";
import { PageHeader, Section, SourceList, Why } from "../layout/Page";
import { BrandMark } from "../layout/BrandMark";
import { Table } from "../ds/components/Table";
import { Badge } from "../ds/components/Badge";
import { Button } from "../ds/components/Button";
import { Switch } from "../ds/components/Switch";
import { cx } from "../ds/cx";
import { useT } from "../i18n/context";
import { characterMessages } from "../i18n/messages/character";
import { Mascot, mascotMotions, usePrefersReducedMotion, type MascotMotion, type MascotPose } from "../mascot/Mascot";
import { MascotProposal, defaultProposal, proposalIds } from "../mascot/Proposals";
import { mascotName } from "../mascot/name";
import { repoUrl } from "../lib/nav";

const poses: MascotPose[] = ["neutral", "wave", "happy", "blink", "nod"];
const files = [
  { label: "docs/character/", url: `${repoUrl}/tree/main/docs/character` },
  { label: "docs/character.md", url: `${repoUrl}/blob/main/docs/character.md` },
  { label: "docs/assets/brand/", url: `${repoUrl}/tree/main/docs/assets/brand` },
];

function Stage({ reduced }: { reduced: boolean }) {
  const t = useT(characterMessages);
  const name = useT(mascotName);
  const osReduced = usePrefersReducedMotion();
  const still = reduced || osReduced;
  const [motion, setMotion] = useState<MascotMotion>("idle");
  const [playKey, setPlayKey] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);

  const play = (m: MascotMotion) => {
    setMotion(m);
    setPlayKey((k) => k + 1);
    setPlaying(true);
    setPaused(false);
  };

  const label = t.motion[motion];
  const status = still ? t.statusStill(label) : paused ? t.statusPaused(label) : playing ? t.statusPlaying(label) : t.statusDone(label);
  const canPause = playing && !still;

  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
      {/* Fixed height: switching motions never moves the controls below. */}
      <div className="flex h-56 items-center justify-center border-b border-hairline bg-canvas-soft sm:h-64">
        <Mascot
          motion={motion}
          playKey={playKey}
          paused={paused}
          reduced={reduced}
          title={t.figure(name, still ? t.pose[motion === "idle" ? "neutral" : motion] : label)}
          className="size-36 sm:size-44"
          onMotionEnd={() => {
            setPlaying(false);
            setPaused(false);
          }}
        />
      </div>
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div role="group" aria-label={t.picker} className="flex flex-wrap gap-2">
          {mascotMotions.map((m) => {
            const pressed = m === motion;
            return (
              <button
                key={m}
                type="button"
                aria-pressed={pressed}
                onClick={() => play(m)}
                className={cx(
                  "t-label inline-flex h-9 items-center rounded-md border px-3 transition-colors duration-instant ease-out-ds",
                  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none",
                  pressed ? "border-accent bg-accent-soft text-ink" : "border-hairline-strong bg-surface text-ink-secondary hover:bg-surface-sunken hover:text-ink",
                )}
              >
                {t.motion[m]}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => play(motion)}>
            <RotateCcw strokeWidth={1.75} aria-hidden />
            {t.replay}
          </Button>
          <Button variant="secondary" size="sm" aria-pressed={paused} disabled={!canPause} onClick={() => setPaused((p) => !p)}>
            {paused ? <Play strokeWidth={1.75} aria-hidden /> : <Pause strokeWidth={1.75} aria-hidden />}
            {paused ? t.resume : t.pause}
          </Button>
          <p role="status" className="t-body-sm min-w-0 text-ink-secondary sm:ml-2">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}

function ModeNote({ forced }: { forced: boolean }) {
  const t = useT(characterMessages);
  const os = usePrefersReducedMotion();
  const reduced = forced || os;
  return (
    <p className={cx("t-body-sm flex items-start gap-2 rounded-md border px-4 py-3", reduced ? "border-hairline-strong bg-surface text-ink" : "border-hairline bg-canvas-soft text-ink-secondary")}>
      <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden />
      <span>{forced ? t.notePage : os ? t.noteOs : t.noteNormal}</span>
    </p>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="t-body flex list-disc flex-col gap-2 pl-5 text-ink">
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

export function Character() {
  const [reduced, setReduced] = useState(false);
  const t = useT(characterMessages);
  const name = useT(mascotName);
  const rows = mascotMotions.map((m) => ({ id: m, ...t.rows[m] }));
  const bgs = [
    { key: "canvas", className: "bg-canvas", label: t.bg.canvas },
    { key: "surface", className: "bg-surface", label: t.bg.surface },
    { key: "sunken", className: "bg-surface-sunken", label: t.bg.sunken },
  ];

  return (
    <div data-reduced-motion={reduced ? "true" : undefined}>
      <PageHeader title={t.title} lead={t.lead(name)} />

      <Section id="motions" title={t.motionsTitle} lead={t.motionsLead}>
        <Stage reduced={reduced} />
        <div className="mt-6 flex max-w-[65ch] flex-col gap-4">
          <Switch label={t.reducedSwitch} checked={reduced} onChange={setReduced} />
          <ModeNote forced={reduced} />
        </div>
        {/* Under sm each motion is a stacked block; the four-column table needs more width than 390. */}
        <ul className="mt-8 flex flex-col rounded-lg border border-hairline sm:hidden">
          {rows.map((r, i) => (
            <li key={r.id} className={cx("flex flex-col gap-2 px-4 py-3", i > 0 && "border-t border-hairline")}>
              <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="t-label text-ink">{t.motion[r.id]}</span>
                <span className="t-caption tabular text-ink-secondary">{r.time}</span>
              </p>
              <p className="t-body-sm text-ink">{r.what}</p>
              <dl className="t-body-sm grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 text-ink-secondary">
                <dt>{t.colStill}</dt>
                <dd>{r.still}</dd>
              </dl>
            </li>
          ))}
        </ul>
        <Table
          className="mt-8 hidden sm:block"
          columns={[
            { key: "id", header: t.colMotion, render: (r) => t.motion[r.id] },
            { key: "what", header: t.colWhat, wrap: true, render: (r) => r.what },
            { key: "time", header: t.colTime, render: (r) => r.time },
            { key: "still", header: t.colStill, wrap: true, render: (r) => r.still },
          ]}
          rows={rows}
          rowKey={(r) => r.id}
        />
      </Section>

      <Section id="poses" title={t.posesTitle} lead={t.posesLead}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {poses.map((p) => (
            <li key={p} className="flex flex-col items-center gap-3 rounded-lg border border-hairline bg-surface px-3 py-5">
              <Mascot pose={p} className="size-16" />
              <span className="t-body-sm text-ink">{t.pose[p]}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="sizes" title={t.sizesTitle} lead={t.sizesLead}>
        <div className="grid gap-3 lg:grid-cols-3">
          {bgs.map((b) => (
            <figure key={b.key} className={cx("flex flex-col gap-4 rounded-lg border border-hairline p-5", b.className)}>
              <div className="flex items-end gap-5">
                <Mascot size={96} />
                <Mascot size={64} />
                <Mascot size={32} />
              </div>
              <figcaption className="t-caption flex flex-wrap justify-between gap-x-3 text-ink-secondary">
                <span className="t-mono">{b.label}</span>
                <span>{t.sizesCaption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="design" title={t.designTitle} lead={t.designLead}>
        <div className="flex items-end gap-6">
          <figure className="flex flex-col items-center gap-2">
            <BrandMark className="size-16" aria-hidden />
            <figcaption className="t-caption text-ink-secondary">{t.iconCaption}</figcaption>
          </figure>
          <span aria-hidden className="t-h3 pb-7 text-ink-muted">
            →
          </span>
          <figure className="flex flex-col items-center gap-2">
            <Mascot className="size-16" />
            <figcaption className="t-caption text-ink-secondary">{t.mascotCaption(name)}</figcaption>
          </figure>
        </div>
        <div className="mt-8 max-w-[65ch]">
          <List items={t.design} />
        </div>
        <Table
          className="mt-8 max-w-[65ch]"
          columns={[
            { key: "part", header: t.colPart, wrap: true, render: (r) => r.part },
            { key: "token", header: t.colToken, render: (r) => <code>{r.token}</code> },
          ]}
          rows={t.parts}
          rowKey={(r) => r.token}
        />
      </Section>

      <Section id="proposals" title={t.proposalsTitle} lead={t.proposalsLead}>
        <ul className="grid gap-3 sm:grid-cols-3">
          {proposalIds.map((id) => {
            const current = id === defaultProposal;
            return (
              <li key={id} className={cx("flex flex-col gap-3 rounded-lg border bg-surface p-4", current ? "border-accent" : "border-hairline")}>
                <div className="flex h-28 items-center justify-center rounded-md bg-canvas-soft">
                  <MascotProposal id={id} className="size-24" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="t-h4 text-ink">{t.proposals[id].title}</h3>
                  {current && <Badge tone="accent">{t.currentBadge}</Badge>}
                </div>
                <p className="t-body-sm text-ink-secondary">{t.proposals[id].diff}</p>
              </li>
            );
          })}
        </ul>
        <p className="t-body mt-6 measure text-ink">{t.defaultWhy}</p>
        <p className="t-body-sm mt-3 flex flex-wrap gap-x-3 gap-y-1 text-ink-secondary">
          <span>{t.filesLabel}:</span>
          {files.map((f) => (
            <a key={f.url} href={f.url} target="_blank" rel="noreferrer" className="t-mono">
              {f.label}
            </a>
          ))}
        </p>

        <h3 id="names" className="t-h3 mt-10 text-ink">
          {t.namesTitle}
        </h3>
        <p className="t-body mt-2 measure text-ink-secondary">{t.namesLead(name)}</p>
        <Table
          className="mt-4 max-w-[65ch]"
          columns={[
            { key: "name", header: t.colName, render: (r) => r.name },
            { key: "reading", header: t.colReading, render: (r) => r.reading },
            { key: "reason", header: t.colReason, wrap: true, render: (r) => r.reason },
          ]}
          rows={t.names}
          rowKey={(r) => r.reading}
        />
      </Section>

      <Section id="usage" title={t.usageTitle}>
        <div className="grid max-w-[65rem] gap-8 md:grid-cols-2">
          <div>
            <h3 className="t-h4 mb-3 text-ink">{t.showTitle}</h3>
            <List items={t.show} />
          </div>
          <div>
            <h3 className="t-h4 mb-3 text-ink">{t.hideTitle}</h3>
            <List items={t.hide} />
          </div>
        </div>
      </Section>

      <Section id="a11y" title={t.a11yTitle}>
        <div className="max-w-[65ch]">
          <List items={t.a11y} />
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
