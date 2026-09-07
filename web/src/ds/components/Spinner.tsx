import { Loader2 } from "lucide-react";
import { cx } from "../cx";

export interface SpinnerProps {
  size?: "sm" | "md";
  /** Text for screen readers. Defaults to 読み込み中. */
  label?: string;
  className?: string;
}

const sizes = { sm: "size-4", md: "size-5" };

// Inline only: inside a button or next to a label while something short runs.
// Full-page and card loads use Skeleton. A progress indicator is the one
// thing allowed to loop; reduced motion collapses it to a static glyph.
export function Spinner({ size = "sm", label = "読み込み中", className }: SpinnerProps) {
  return (
    <span role="status" className={cx("inline-flex shrink-0 items-center text-current", className)}>
      <Loader2 aria-hidden strokeWidth={1.75} className={cx("animate-spin", sizes[size])} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
