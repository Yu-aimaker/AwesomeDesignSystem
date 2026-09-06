import { PageHeader, Section } from "../../layout/Page";

const levels = [
  { level: 1, cls: "border border-hairline", label: "1px solid hairline" },
  { level: 2, cls: "border border-hairline shadow-2", label: "border + shadow-2" },
  { level: 3, cls: "border border-hairline shadow-3", label: "border + shadow-3" },
];

export function Elevation() {
  return (
    <div>
      <PageHeader title="エレベーション" lead="境界線が先、影は浮いているものだけ。" />
      <Section id="levels" title="3 段階">
        <div className="grid gap-6 rounded-lg bg-canvas-soft p-8 md:grid-cols-3">
          {levels.map((l) => (
            <div key={l.level} className={`flex h-32 flex-col justify-end rounded-lg bg-surface p-4 ${l.cls}`}>
              <p className="t-label text-ink">Level {l.level}</p>
              <p className="t-mono text-ink-muted">{l.label}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
