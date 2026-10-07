import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { CircleAlert } from "lucide-react";
import { cx } from "../cx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
  error?: string;
}

// Label above, helper below, error below in danger with an icon (DESIGN.md §8).
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helper, error, id, className, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="t-label text-ink">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : helper ? helperId : undefined}
        className={cx(
          "h-10 w-full rounded-md border bg-surface px-3 text-sm text-ink",
          "transition-colors duration-instant ease-out-ds",
          "hover:border-hairline-strong focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-disabled",
          error ? "border-danger" : "border-hairline-strong",
        )}
        {...rest}
      />
      {error ? (
        <p id={errorId} className="t-caption flex items-center gap-1 text-danger">
          <CircleAlert aria-hidden className="size-4" strokeWidth={1.75} />
          {error}
        </p>
      ) : helper ? (
        <p id={helperId} className="t-caption text-ink-muted">
          {helper}
        </p>
      ) : null}
    </div>
  );
});
