import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../cx";

export interface ToggleItem<V extends string> {
  value: V;
  /** Visible label. For icon-only items pass `label` as the accessible name and `icon` only. */
  label: string;
  icon?: ReactNode;
  iconOnly?: boolean;
  disabled?: boolean;
}

export type ToggleGroupProps<V extends string> =
  | {
      type: "single";
      items: ToggleItem<V>[];
      value: V | null;
      onChange: (value: V | null) => void;
      label: string;
      size?: "sm" | "md";
      disabled?: boolean;
      className?: string;
    }
  | {
      type: "multiple";
      items: ToggleItem<V>[];
      value: V[];
      onChange: (value: V[]) => void;
      label: string;
      size?: "sm" | "md";
      disabled?: boolean;
      className?: string;
    };

// Bordered buttons joined into one control (a toolbar: alignment, bold/italic).
// Pressed items fill with surface-sunken and ink; arrows move focus between items.
// single mode behaves like radios that can all be off; multiple uses aria-pressed.
export function ToggleGroup<V extends string>(props: ToggleGroupProps<V>) {
  const { items, label, size = "md", disabled = false, className } = props;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const isOn = (v: V) => (props.type === "single" ? props.value === v : props.value.includes(v));
  const toggle = (v: V) => {
    if (props.type === "single") props.onChange(props.value === v ? null : v);
    else props.onChange(props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabled = items.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
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
    refs.current[next]?.focus();
  };

  const anyOn = items.some((it) => isOn(it.value));

  return (
    <div
      role={props.type === "single" ? "radiogroup" : "group"}
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cx("inline-flex overflow-hidden rounded-md border border-hairline-strong bg-surface", disabled && "opacity-50", className)}
    >
      {items.map((it, i) => {
        const on = isOn(it.value);
        const state = props.type === "single" ? { role: "radio" as const, "aria-checked": on } : { "aria-pressed": on };
        return (
          <button
            key={it.value}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            {...state}
            aria-label={it.iconOnly ? it.label : undefined}
            tabIndex={props.type === "single" ? (on || (!anyOn && i === 0) ? 0 : -1) : 0}
            disabled={disabled || it.disabled}
            onClick={() => toggle(it.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cx(
              "inline-flex items-center justify-center gap-1.5 whitespace-nowrap border-l border-hairline-strong font-medium leading-none first:border-l-0",
              "transition-colors duration-instant ease-out-ds active:translate-y-px",
              "disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent",
              size === "sm" ? "h-8 min-w-8 px-2.5 text-sm [&_svg]:size-4" : "h-10 min-w-10 px-3 text-sm [&_svg]:size-4",
              on ? "bg-surface-sunken text-ink" : "text-ink-secondary hover:bg-canvas-soft hover:text-ink",
            )}
          >
            {it.icon}
            {!it.iconOnly && it.label}
          </button>
        );
      })}
    </div>
  );
}
