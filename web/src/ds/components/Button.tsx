import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cx } from "../cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

// Primary is ink on canvas. The accent is never a button fill (DESIGN.md §2 rule 1).
const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "bg-surface text-ink border border-hairline-strong hover:bg-surface-sunken",
  ghost: "bg-transparent text-ink-secondary hover:bg-surface-sunken hover:text-ink",
  danger: "bg-danger text-on-primary hover:opacity-90",
};

// 40px default, 32px small, 48px large (DESIGN.md §8).
const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 [&_svg]:size-4",
  md: "h-10 px-4 text-sm gap-2 [&_svg]:size-5",
  lg: "h-12 px-5 text-base gap-2 [&_svg]:size-5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? "button"}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cx(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md font-medium leading-none",
        "transition-colors duration-instant ease-out-ds",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "active:translate-y-px",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {loading && <Loader2 aria-hidden strokeWidth={1.75} className="animate-spin" />}
      {children}
    </button>
  );
});
