import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cx } from "../cx";

export type DeltaTone = "up" | "down" | "neutral";

export interface StatTileProps {
  label: string;
  /** Preformatted, e.g. "¥1,284,000". Numbers render in tabular figures. */
  value: string;
  unit?: string;
  delta?: { value: string; tone: DeltaTone; hint?: string };
  /** Series for the inline sparkline; the last point is the current value. */
  sparkline?: number[];
  className?: string;
}

const deltaTone: Record<DeltaTone, { cls: string; Icon: typeof Minus; word: string }> = {
  up: { cls: "text-success", Icon: ArrowUpRight, word: "増加" },
  down: { cls: "text-danger", Icon: ArrowDownRight, word: "減少" },
  neutral: { cls: "text-ink-secondary", Icon: Minus, word: "変化なし" },
};

// Builds a polyline path in a 100x32 box. Flat series draw a centered line.
function sparkPath(points: number[]): string {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const stepX = points.length > 1 ? 100 / (points.length - 1) : 0;
  return points
    .map((p, i) => {
      const x = i * stepX;
      const y = 30 - ((p - min) / span) * 28;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

// One number per tile. The value is h2 size in tabular figures; the delta pairs a
// status color with an arrow and text so it never relies on color alone. The
// sparkline is one 2px line in ink-secondary with no axes: it shows shape, not values.
export function StatTile({ label, value, unit, delta, sparkline, className }: StatTileProps) {
  const d = delta ? deltaTone[delta.tone] : null;
  return (
    <div className={cx("flex flex-col gap-3 rounded-lg border border-hairline bg-surface p-5 text-ink", className)}>
      <p className="t-label text-ink-secondary">{label}</p>
      <div className="flex items-end justify-between gap-4">
        <p className="flex items-baseline gap-1">
          <span className="t-h2 tabular text-ink">{value}</span>
          {unit && <span className="t-body-sm text-ink-secondary">{unit}</span>}
        </p>
        {sparkline && sparkline.length > 1 && (
          <svg viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden className="h-8 w-24 shrink-0 overflow-visible text-ink-secondary">
            <path d={sparkPath(sparkline)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <circle cx={100} cy={30 - ((sparkline[sparkline.length - 1] - Math.min(...sparkline)) / (Math.max(...sparkline) - Math.min(...sparkline) || 1)) * 28} r={3} fill="currentColor" className="text-ink" />
          </svg>
        )}
      </div>
      {delta && d && (
        <p className="t-caption flex items-center gap-1 tabular">
          <span className={cx("inline-flex items-center gap-0.5 font-medium", d.cls)}>
            <d.Icon aria-hidden strokeWidth={1.75} className="size-3.5" />
            {delta.value}
            <span className="sr-only">{d.word}</span>
          </span>
          {delta.hint && <span className="text-ink-muted">{delta.hint}</span>}
        </p>
      )}
    </div>
  );
}
