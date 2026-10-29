import { Check } from "lucide-react";
import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export interface Step {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  /** Zero-based index of the current step. Steps before it are complete. */
  current: number;
  orientation?: "horizontal" | "vertical";
  /** Let users jump to a completed step. */
  onStepClick?: (index: number) => void;
  className?: string;
}

// Sequential steps (tabs are for parallel content). Done steps fill with ink and a
// check, the current step has an ink ring and aria-current="step", upcoming steps
// are hairline. The connector is a 1px line that turns ink once the step is done.
export function Stepper({ steps, current, orientation = "horizontal", onStepClick, className }: StepperProps) {
  const m = useT(dsMessages);
  const vertical = orientation === "vertical";
  return (
    <ol className={cx("flex", vertical ? "flex-col" : "w-full items-start", className)}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === steps.length - 1;
        const clickable = done && !!onStepClick;
        const dot = (
          <span
            aria-hidden
            className={cx(
              "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular transition-colors duration-fast ease-out-ds",
              done && "border-primary bg-primary text-on-primary",
              active && "border-primary bg-surface text-ink ring-1 ring-primary ring-offset-2 ring-offset-surface",
              !done && !active && "border-hairline-strong bg-surface text-ink-muted",
            )}
          >
            {done ? <Check className="size-4" strokeWidth={2} /> : i + 1}
          </span>
        );
        const text = (
          <span className={cx("flex min-w-0 flex-col", vertical ? "pb-6" : "mt-2 pr-3")}>
            <span className={cx("t-label", active || done ? "text-ink" : "text-ink-muted")}>{step.label}</span>
            {step.description && <span className="t-caption mt-0.5 text-ink-muted">{step.description}</span>}
          </span>
        );
        const line = !last && <span aria-hidden className={cx("bg-hairline transition-colors duration-fast", done && "bg-primary", vertical ? "my-1 w-px flex-1" : "mt-3.5 h-px flex-1")} />;
        return (
          <li key={step.label} aria-current={active ? "step" : undefined} className={cx("flex min-w-0", vertical ? "gap-3" : "flex-1 flex-col")}>
            {vertical ? (
              <>
                <span className="flex flex-col items-center">
                  {clickable ? (
                    <button type="button" onClick={() => onStepClick(i)} aria-label={m.backTo(step.label)} className="rounded-full">
                      {dot}
                    </button>
                  ) : (
                    dot
                  )}
                  {line}
                </span>
                {text}
              </>
            ) : (
              <>
                <span className="flex w-full items-center gap-2">
                  {clickable ? (
                    <button type="button" onClick={() => onStepClick(i)} aria-label={m.backTo(step.label)} className="rounded-full">
                      {dot}
                    </button>
                  ) : (
                    dot
                  )}
                  {line}
                </span>
                {text}
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
