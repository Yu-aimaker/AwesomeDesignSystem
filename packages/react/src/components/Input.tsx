"use client";

import { cx, stateAttributes } from "@awesome-ds/core";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { getComponentMetadata } from "../contracts";

export const inputMetadata = getComponentMetadata("input");
export type FieldProps = { label: string; hint?: string; error?: string; id: string };

export function Input({ label, hint, error, id, className, disabled, ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const describedBy = [hint ? id + "-hint" : null, error ? id + "-error" : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="ads-field">
      <label className="ads-label" htmlFor={id}>{label}</label>
      <input id={id} className={cx("ads-input", className)} disabled={disabled} aria-invalid={Boolean(error) || undefined} aria-describedby={describedBy} {...stateAttributes({ disabled: Boolean(disabled), invalid: Boolean(error) })} {...rest} />
      {hint ? <p id={id + "-hint"} className="ads-hint">{hint}</p> : null}
      {error ? <p id={id + "-error"} className="ads-error" role="alert">{error}</p> : null}
    </div>
  );
}
Input.metadata = inputMetadata;

export function Textarea({ label, hint, error, id, className, disabled, ...rest }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const describedBy = [hint ? id + "-hint" : null, error ? id + "-error" : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="ads-field">
      <label className="ads-label" htmlFor={id}>{label}</label>
      <textarea id={id} className={cx("ads-textarea", className)} disabled={disabled} aria-invalid={Boolean(error) || undefined} aria-describedby={describedBy} {...stateAttributes({ disabled: Boolean(disabled), invalid: Boolean(error) })} {...rest} />
      {hint ? <p id={id + "-hint"} className="ads-hint">{hint}</p> : null}
      {error ? <p id={id + "-error"} className="ads-error" role="alert">{error}</p> : null}
    </div>
  );
}

export function Checkbox({ label, id, ...rest }: { label: string; id: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <label className="ads-check" htmlFor={id}>
      <input id={id} {...rest} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}

export function Switch({ label, id, checked, onChange, disabled }: { label: string; id: string; checked?: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className="ads-switch-row" htmlFor={id}>
      <input id={id} type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export type RadioOption = { value: string; label: string };
export type RadioGroupProps = { legend: string; name: string; options: RadioOption[]; value?: string; onChange?: (v: string) => void };

export function RadioGroup({ legend, name, options, value, onChange }: RadioGroupProps) {
  return (
    <fieldset className="ads-field">
      <legend className="ads-label">{legend}</legend>
      {options.map((opt) => (
        <label key={opt.value} className="ads-radio">
          <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange?.(opt.value)} />
          <span>{opt.label}</span>
        </label>
      ))}
    </fieldset>
  );
}

export function Select({ label, hint, id, error, children, className, disabled, ...rest }: FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const describedBy = [hint ? id + "-hint" : null, error ? id + "-error" : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="ads-field">
      <label className="ads-label" htmlFor={id}>{label}</label>
      <select id={id} className={cx("ads-select", className)} disabled={disabled} aria-invalid={Boolean(error) || undefined} aria-describedby={describedBy} {...stateAttributes({ disabled: Boolean(disabled), invalid: Boolean(error) })} {...rest}>{children}</select>
      {hint ? <p id={id + "-hint"} className="ads-hint">{hint}</p> : null}
      {error ? <p id={id + "-error"} className="ads-error" role="alert">{error}</p> : null}
    </div>
  );
}
Textarea.metadata = getComponentMetadata("textarea");
Checkbox.metadata = getComponentMetadata("checkbox");
Switch.metadata = getComponentMetadata("switch");
RadioGroup.metadata = getComponentMetadata("radio-group");
Select.metadata = getComponentMetadata("select");
