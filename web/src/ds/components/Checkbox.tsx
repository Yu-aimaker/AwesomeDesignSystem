import { useId, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cx } from "../cx";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

// A native checkbox drives the state; the visible box is drawn with the peer.
export function Checkbox({ label, description, id, className, ...rest }: CheckboxProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <label htmlFor={inputId} className={cx("flex cursor-pointer items-start gap-3", className)}>
      <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
        <input id={inputId} type="checkbox" className="peer absolute inset-0 size-5 cursor-pointer appearance-none rounded-xs" {...rest} />
        <span
          aria-hidden
          className={cx(
            "pointer-events-none flex size-5 items-center justify-center rounded-xs border border-hairline-strong bg-surface text-on-primary",
            "transition-colors duration-instant ease-out-ds",
            "peer-checked:border-primary peer-checked:bg-primary peer-disabled:opacity-50",
          )}
        >
          <Check className="size-3.5 opacity-0 transition-opacity duration-instant [.peer:checked~&]:opacity-100" strokeWidth={2.5} />
        </span>
      </span>
      <span className="flex flex-col">
        <span className="t-body-sm text-ink">{label}</span>
        {description && <span className="t-caption text-ink-muted">{description}</span>}
      </span>
    </label>
  );
}
