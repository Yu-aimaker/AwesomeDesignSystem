import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import { cx } from "../cx";

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  selected?: boolean;
  onSelectedChange?: (next: boolean) => void;
  /** Shows a remove button; used for applied filters. */
  onRemove?: () => void;
  icon?: ReactNode;
  size?: "sm" | "md";
}

// A filter chip is a small secondary button with a pressed state. Selected fills
// with ink and shows a check so the state is never color alone. Badges are
// read-only; anything you can click is a chip.
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { selected = false, onSelectedChange, onRemove, icon, size = "sm", className, children, disabled, onClick, ...rest },
  ref,
) {
  const h = size === "sm" ? "h-8 px-3 text-sm" : "h-10 px-4 text-sm";
  return (
    <span className={cx("inline-flex items-stretch rounded-full", className)}>
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          onSelectedChange?.(!selected);
        }}
        className={cx(
          "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border font-medium leading-none",
          "transition-colors duration-instant ease-out-ds active:translate-y-px",
          "disabled:cursor-not-allowed disabled:opacity-50",
          onRemove ? "rounded-l-full border-r-0 pr-2" : "rounded-full",
          selected
            ? "border-primary bg-primary text-on-primary hover:bg-primary-hover"
            : "border-hairline-strong bg-surface text-ink hover:bg-surface-sunken",
          h,
        )}
        {...rest}
      >
        {selected ? <Check aria-hidden strokeWidth={2} className="size-4" /> : icon}
        {children}
      </button>
      {onRemove && (
        <button
          type="button"
          aria-label={`${typeof children === "string" ? children : "フィルタ"} を外す`}
          disabled={disabled}
          onClick={onRemove}
          className={cx(
            "inline-flex items-center rounded-r-full border pr-2.5 pl-1 transition-colors duration-instant ease-out-ds",
            "disabled:cursor-not-allowed disabled:opacity-50",
            selected
              ? "border-primary bg-primary text-on-primary hover:bg-primary-hover"
              : "border-hairline-strong bg-surface text-ink-secondary hover:bg-surface-sunken hover:text-ink",
            size === "sm" ? "h-8" : "h-10",
          )}
        >
          <X aria-hidden strokeWidth={1.75} className="size-3.5" />
        </button>
      )}
    </span>
  );
});
