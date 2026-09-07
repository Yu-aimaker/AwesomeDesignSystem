import type { ReactNode } from "react";
import { cx } from "../cx";

export type TimelineTone = "neutral" | "accent" | "success" | "warning" | "danger";

export interface TimelineItem {
  id: string;
  title: string;
  /** Formatted time or date, set in mono caption. */
  time?: string;
  description?: ReactNode;
  tone?: TimelineTone;
  icon?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const dots: Record<TimelineTone, string> = {
  neutral: "border-hairline-strong bg-surface",
  accent: "border-accent bg-accent",
  success: "border-success bg-success",
  warning: "border-warning bg-warning",
  danger: "border-danger bg-danger",
};

// A vertical list of events. The rail is a 1px hairline; each dot is 8px with the
// status color, and status is always paired with the title text so color is not
// the only signal. Newest first is the caller's choice; the component keeps order.
export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cx("flex flex-col", className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <li key={item.id} className="relative flex gap-4">
            <span className="flex w-5 shrink-0 flex-col items-center">
              <span
                aria-hidden
                className={cx(
                  "mt-1.5 flex shrink-0 items-center justify-center rounded-full border",
                  item.icon ? "size-5 border-hairline bg-surface text-ink-secondary [&_svg]:size-3" : cx("size-2", dots[item.tone ?? "neutral"]),
                )}
              >
                {item.icon}
              </span>
              {!last && <span aria-hidden className="my-1.5 w-px flex-1 bg-hairline" />}
            </span>
            <div className={cx("min-w-0 flex-1", !last && "pb-6")}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="t-label text-ink">{item.title}</p>
                {item.time && (
                  <time className="t-mono text-xs text-ink-muted" dateTime={item.time}>
                    {item.time}
                  </time>
                )}
              </div>
              {item.description && <div className="t-body-sm mt-1 text-ink-secondary">{item.description}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
