import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../cx";

export interface SegmentedOption<V extends string> {
  value: V;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<V extends string> {
  options: SegmentedOption<V>[];
  value: V;
  onChange: (value: V) => void;
  label: string;
  size?: "sm" | "md";
  /** Stretch segments to fill the container. */
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

// A radiogroup drawn as one sunken track; the selected segment lifts to surface
// with shadow-2. Arrows move selection (roving tabindex), so one Tab stop.
// Use for two to five short, equal choices that switch a view immediately.
export function SegmentedControl<V extends string>({ options, value, onChange, label, size = "md", fullWidth = false, disabled = false, className }: SegmentedControlProps<V>) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
    const pos = enabled.indexOf(index);
    const last = enabled.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? enabled[pos === last ? 0 : pos + 1]
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? enabled[pos === 0 ? last : pos - 1]
      : e.key === "Home" ? enabled[0]
      : e.key === "End" ? enabled[last]
      : undefined;
    if (next === undefined) return;
    e.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cx("inline-flex rounded-md bg-surface-sunken p-0.5", fullWidth && "flex w-full", disabled && "opacity-50", className)}
    >
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => { refs.current[i] = el; }}
            id={`${id}-${o.value}`}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            disabled={disabled || o.disabled}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cx(
              "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-sm font-medium leading-none",
              "transition-colors duration-instant ease-out-ds disabled:cursor-not-allowed",
              size === "sm" ? "h-7 px-2.5 text-xs [&_svg]:size-3.5" : "h-9 px-3 text-sm [&_svg]:size-4",
              fullWidth && "flex-1",
              selected ? "bg-surface text-ink shadow-2" : "text-ink-secondary hover:text-ink",
            )}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
