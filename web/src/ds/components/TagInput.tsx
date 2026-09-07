import { useId, useRef, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cx } from "../cx";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  /** Stop accepting once this many tags exist. */
  max?: number;
  disabled?: boolean;
  className?: string;
}

// The input frame holds pills. Enter or comma commits, Backspace on an empty
// field removes the last tag, each pill has its own remove button. Duplicates
// are ignored (case-insensitive). Focus ring belongs to the inner input.
export function TagInput({ value, onChange, label, placeholder = "追加して Enter", helper, error, max, disabled = false, className }: TagInputProps) {
  const [draft, setDraft] = useState("");
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const full = max !== undefined && value.length >= max;

  const add = (raw: string) => {
    const tag = raw.trim().replace(/,+$/, "");
    if (!tag || full) return;
    if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, tag]);
    setDraft("");
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    input.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      e.preventDefault();
      remove(value.length - 1);
    }
  };

  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="t-label text-ink">
        {label}
        {max !== undefined && (
          <span className="t-caption ml-2 tabular text-ink-muted">
            {value.length}/{max}
          </span>
        )}
      </label>
      <div
        onClick={() => input.current?.focus()}
        className={cx(
          "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border bg-surface px-2 py-1.5 text-sm text-ink",
          "transition-colors duration-instant ease-out-ds",
          disabled ? "cursor-not-allowed bg-surface-sunken" : "cursor-text hover:border-ink-muted has-[:focus-visible]:border-accent",
          error ? "border-danger" : "border-hairline-strong",
        )}
      >
        {value.map((tag, i) => (
          <span key={tag} className="inline-flex h-6 items-center gap-1 rounded-full bg-surface-sunken pr-1 pl-2.5 text-xs font-medium text-ink-secondary">
            {tag}
            <button
              type="button"
              aria-label={`${tag} を削除`}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                remove(i);
              }}
              className="flex size-4 items-center justify-center rounded-full transition-colors duration-instant hover:bg-hairline hover:text-ink disabled:cursor-not-allowed"
            >
              <X className="size-3" strokeWidth={2} aria-hidden />
            </button>
          </span>
        ))}
        <input
          ref={input}
          id={id}
          type="text"
          value={draft}
          disabled={disabled || full}
          placeholder={full ? "" : value.length === 0 ? placeholder : ""}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft && add(draft)}
          className="h-6 min-w-24 flex-1 bg-transparent px-1 text-sm text-ink outline-none disabled:cursor-not-allowed"
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="t-caption text-danger">
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className="t-caption text-ink-muted">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
