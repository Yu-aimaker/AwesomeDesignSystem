import { useId, type InputHTMLAttributes } from "react";
import { cx } from "../cx";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function Radio({ label, id, className, ...rest }: RadioProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <label htmlFor={inputId} className={cx("flex cursor-pointer items-center gap-3", className)}>
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <input id={inputId} type="radio" className="peer absolute inset-0 size-5 cursor-pointer appearance-none rounded-full" {...rest} />
        <span
          aria-hidden
          className={cx(
            "pointer-events-none flex size-5 items-center justify-center rounded-full border border-hairline-strong bg-surface",
            "transition-colors duration-instant ease-out-ds peer-checked:border-primary peer-disabled:opacity-50",
            "after:size-2.5 after:rounded-full after:bg-primary after:opacity-0 after:transition-opacity after:duration-instant [.peer:checked~&]:after:opacity-100",
          )}
        />
      </span>
      <span className="t-body-sm text-ink">{label}</span>
    </label>
  );
}

export interface RadioGroupProps {
  legend: string;
  children: React.ReactNode;
}

export function RadioGroup({ legend, children }: RadioGroupProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="t-label mb-3 text-ink">{legend}</legend>
      {children}
    </fieldset>
  );
}
