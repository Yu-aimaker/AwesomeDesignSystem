import { useId } from "react";
import { cx } from "../cx";

export interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  id?: string;
}

// A real <button role="switch">. The thumb moves 16px in 150ms with ease-out.
export function Switch({ label, checked, onChange, disabled, id }: SwitchProps) {
  const auto = useId();
  const switchId = id ?? auto;
  return (
    <div className="flex items-center gap-3">
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative h-6 w-10 shrink-0 rounded-full border transition-colors duration-fast ease-out-ds",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "border-primary bg-primary" : "border-hairline-strong bg-surface-sunken",
        )}
      >
        <span
          aria-hidden
          className={cx(
            "absolute top-0.5 left-0.5 size-[18px] rounded-full transition-transform duration-fast ease-out-ds",
            checked ? "translate-x-4 bg-on-primary" : "bg-ink-muted",
          )}
        />
      </button>
      <label htmlFor={switchId} className="t-body-sm cursor-pointer text-ink">
        {label}
      </label>
    </div>
  );
}
