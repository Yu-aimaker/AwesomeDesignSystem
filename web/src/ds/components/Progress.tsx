import { useId } from "react";
import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export interface ProgressProps {
  /** 0 to 100. Omit for an indeterminate bar. */
  value?: number;
  label?: string;
  /** Show the percentage next to the label. */
  showValue?: boolean;
  size?: "sm" | "md";
  tone?: "neutral" | "success" | "danger";
  className?: string;
}

const fills = { neutral: "bg-primary", success: "bg-success", danger: "bg-danger" };

// A linear bar. The fill moves with transform (scaleX), 200ms ease-out. The
// indeterminate bar slides a 40% segment; it is a progress indicator, the one
// thing allowed to loop. Reduced motion collapses the loop to a still bar.
export function Progress({ value, label, showValue = false, size = "sm", tone = "neutral", className }: ProgressProps) {
  const m = useT(dsMessages);
  const id = useId();
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value));
  return (
    <div className={cx("flex w-full flex-col gap-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-3">
          {label && (
            <span id={id} className="t-label text-ink">
              {label}
            </span>
          )}
          {showValue && !indeterminate && <span className="t-caption tabular text-ink-secondary">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-labelledby={label ? id : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
        aria-valuetext={indeterminate ? m.loading : `${Math.round(clamped)}%`}
        className={cx("relative w-full overflow-hidden rounded-full bg-surface-sunken", size === "sm" ? "h-1.5" : "h-2.5")}
      >
        <div
          className={cx("absolute inset-y-0 left-0 w-full origin-left rounded-full transition-transform duration-base ease-out-ds", fills[tone], indeterminate && "animate-[progress-slide_1.2s_var(--ds-ease-in-out)_infinite]")}
          style={indeterminate ? { width: "40%" } : { transform: `scaleX(${clamped / 100})` }}
        />
        {indeterminate && <style>{`@keyframes progress-slide { from { transform: translateX(-100%); } to { transform: translateX(250%); } }`}</style>}
      </div>
    </div>
  );
}
