import type { HTMLAttributes } from "react";
import { cx } from "../cx";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Short text set in the line, e.g. または. */
  label?: string;
  orientation?: "horizontal" | "vertical";
}

// A 1px hairline. With a label the text sits in the middle in caption size and
// ink-muted; the label is decorative, so the separator role carries no name.
export function Divider({ label, orientation = "horizontal", className, ...rest }: DividerProps) {
  if (orientation === "vertical") {
    return <div role="separator" aria-orientation="vertical" className={cx("inline-block h-full w-px self-stretch bg-hairline", className)} {...rest} />;
  }
  if (!label) {
    return <div role="separator" className={cx("h-px w-full bg-hairline", className)} {...rest} />;
  }
  return (
    <div role="separator" className={cx("flex w-full items-center gap-3", className)} {...rest}>
      <span aria-hidden className="h-px flex-1 bg-hairline" />
      <span className="t-caption shrink-0 text-ink-muted">{label}</span>
      <span aria-hidden className="h-px flex-1 bg-hairline" />
    </div>
  );
}
