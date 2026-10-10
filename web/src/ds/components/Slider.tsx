import { useCallback, useId, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export type SliderValue = number | [number, number];

export interface SliderProps<V extends SliderValue> {
  value: V;
  onChange: (value: V) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  /** Show the current value(s) next to the label. */
  showValue?: boolean;
  /** Text read by assistive tech, e.g. (v) => `${v} 円`. Also used for the visible value. */
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function snap(v: number, min: number, step: number) {
  const n = Math.round((v - min) / step) * step + min;
  const decimals = (String(step).split(".")[1] ?? "").length;
  return Number(n.toFixed(decimals));
}

// Single or range. Each thumb is a role="slider" button (20px, ink fill) with the
// full keyboard set: arrows step, PageUp/Down step x10, Home/End jump. The track is
// a 4px hairline with an ink fill; pointer capture makes drags stick to the thumb.
export function Slider<V extends SliderValue>({ value, onChange, min = 0, max = 100, step = 1, label, showValue = false, formatValue, disabled = false, className }: SliderProps<V>) {
  const m = useT(dsMessages);
  const id = useId();
  const track = useRef<HTMLDivElement>(null);
  const isRange = Array.isArray(value);
  const values: number[] = isRange ? [...(value as [number, number])] : [value as number];
  const fmt = formatValue ?? ((v: number) => String(v));
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const commit = useCallback(
    (index: number, raw: number) => {
      const next = snap(clamp(raw, min, max), min, step);
      if (isRange) {
        const pair: [number, number] = [values[0], values[1]];
        pair[index] = next;
        if (pair[0] > pair[1]) pair.sort((a, b) => a - b);
        onChange(pair as V);
      } else {
        onChange(next as V);
      }
    },
    [isRange, values, min, max, step, onChange],
  );

  const fromPointer = (clientX: number) => {
    const el = track.current;
    if (!el) return min;
    const rect = el.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return min + ratio * (max - min);
  };

  const onTrackPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const v = fromPointer(e.clientX);
    // Move the nearest thumb.
    const index = isRange ? (Math.abs(v - values[0]) <= Math.abs(v - values[1]) ? 0 : 1) : 0;
    commit(index, v);
    const thumb = e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=slider]")[index];
    thumb?.focus();
  };

  const onThumbPointerDown = (e: PointerEvent<HTMLButtonElement>, index: number) => {
    if (disabled) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const move = (ev: globalThis.PointerEvent) => commit(index, fromPointer(ev.clientX));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const v = values[index];
    const big = step * 10;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowUp" ? v + step
      : e.key === "ArrowLeft" || e.key === "ArrowDown" ? v - step
      : e.key === "PageUp" ? v + big
      : e.key === "PageDown" ? v - big
      : e.key === "Home" ? min
      : e.key === "End" ? max
      : null;
    if (next === null) return;
    e.preventDefault();
    commit(index, next);
  };

  const lo = isRange ? pct(values[0]) : 0;
  const hi = pct(values[values.length - 1]);

  return (
    <div className={cx("flex w-full flex-col gap-2", disabled && "opacity-50", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span id={`${id}-label`} className="t-label text-ink">
          {label}
        </span>
        {showValue && <span className="t-caption tabular text-ink-secondary">{values.map(fmt).join(" – ")}</span>}
      </div>
      <div
        ref={track}
        onPointerDown={onTrackPointerDown}
        className={cx("relative flex h-6 w-full touch-none items-center", disabled ? "cursor-not-allowed" : "cursor-pointer")}
      >
        <div className="absolute inset-x-0 h-1 rounded-full bg-hairline" />
        <div className="absolute h-1 rounded-full bg-primary" style={{ left: `${lo}%`, width: `${hi - lo}%` }} />
        {values.map((v, i) => (
          <button
            key={i}
            type="button"
            role="slider"
            aria-labelledby={`${id}-label`}
            aria-label={isRange ? (i === 0 ? m.min : m.max) : undefined}
            aria-valuemin={isRange && i === 1 ? values[0] : min}
            aria-valuemax={isRange && i === 0 ? values[1] : max}
            aria-valuenow={v}
            aria-valuetext={fmt(v)}
            aria-orientation="horizontal"
            disabled={disabled}
            onPointerDown={(e) => onThumbPointerDown(e, i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cx(
              "absolute size-5 -translate-x-1/2 rounded-full border-2 border-primary bg-surface shadow-2",
              "transition-[transform,box-shadow] duration-instant ease-out-ds",
              !disabled && "hover:scale-110 active:scale-105",
              disabled && "cursor-not-allowed",
            )}
            style={{ left: `${pct(v)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
