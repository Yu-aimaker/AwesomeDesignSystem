import { useId, useState, type KeyboardEvent } from "react";
import { Star } from "lucide-react";
import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export interface RatingProps {
  value: number;
  onChange?: (next: number) => void;
  max?: number;
  label?: string;
  readOnly?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const sizes = { sm: "size-4", md: "size-6" };

// A radio group of stars with roving focus: arrows move the value, Home/End jump.
// Filled stars are ink, empty stars hairline-strong; the text next to it reads
// the value, so the rating is never color or shape alone. readOnly renders an img.
export function Rating({ value, onChange, max = 5, label: labelProp, readOnly = false, disabled = false, size = "md", className }: RatingProps) {
  const m = useT(dsMessages);
  const label = labelProp ?? m.rating;
  const [hover, setHover] = useState<number | null>(null);
  const id = useId();
  const shown = hover ?? value;
  const interactive = !readOnly && !disabled && !!onChange;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowUp" ? Math.min(max, value + 1)
      : e.key === "ArrowLeft" || e.key === "ArrowDown" ? Math.max(0, value - 1)
      : e.key === "Home" ? 1
      : e.key === "End" ? max
      : null;
    if (next === null) return;
    e.preventDefault();
    onChange?.(next);
  };

  if (readOnly) {
    return (
      <span role="img" aria-label={`${label} ${value} / ${max}`} className={cx("inline-flex items-center gap-0.5", className)}>
        {Array.from({ length: max }, (_, i) => (
          <Star key={i} aria-hidden strokeWidth={1.75} className={cx(sizes[size], i < value ? "fill-current text-ink" : "text-hairline-strong")} />
        ))}
        <span className="t-caption ml-1.5 tabular text-ink-secondary">{value}</span>
      </span>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      aria-disabled={disabled || undefined}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setHover(null)}
      className={cx("inline-flex items-center gap-0.5", disabled && "opacity-50", className)}
    >
      <span id={`${id}-label`} className="sr-only">
        {label}
      </span>
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const checked = value === n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${n}`}
            tabIndex={checked || (value === 0 && n === 1) ? 0 : -1}
            disabled={disabled}
            onMouseEnter={() => interactive && setHover(n)}
            onClick={() => interactive && onChange?.(n === value ? 0 : n)}
            className={cx(
              "flex items-center justify-center rounded-xs p-0.5 transition-[color,transform] duration-instant ease-out-ds",
              interactive && "hover:scale-110 active:scale-95",
              disabled && "cursor-not-allowed",
              n <= shown ? "text-ink" : "text-hairline-strong",
            )}
          >
            <Star aria-hidden strokeWidth={1.75} className={cx(sizes[size], n <= shown && "fill-current")} />
          </button>
        );
      })}
      <span className="t-caption ml-1.5 tabular text-ink-secondary" aria-hidden>
        {value}/{max}
      </span>
    </div>
  );
}
