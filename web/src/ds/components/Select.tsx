import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../cx";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  helper?: string;
}

// Native <select> with the input frame. The OS menu is kept: it is accessible
// and works on every device. Replace with a listbox only when you need search.
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, helper, id, className, children, ...rest },
  ref,
) {
  const auto = useId();
  const selectId = id ?? auto;
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={selectId} className="t-label text-ink">
        {label}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cx(
            "h-10 w-full appearance-none rounded-md border border-hairline-strong bg-surface pr-9 pl-3 text-sm text-ink pointer-coarse:text-base",
            "transition-colors duration-instant ease-out-ds hover:border-ink-muted",
            "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-disabled",
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown aria-hidden strokeWidth={1.75} className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted" />
      </div>
      {helper && <p className="t-caption text-ink-muted">{helper}</p>}
    </div>
  );
});
