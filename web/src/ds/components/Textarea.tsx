import { forwardRef, useCallback, useEffect, useId, useRef, type ChangeEvent, type TextareaHTMLAttributes } from "react";
import { CircleAlert } from "lucide-react";
import { cx } from "../cx";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helper?: string;
  error?: string;
  /** Grow with the content. Uses field-sizing where supported, a resize fallback elsewhere. */
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
}

// Same frame as Input; min 3 rows; vertical resize only. Autosize measures
// scrollHeight, so the box grows between minRows and maxRows without a jump.
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, helper, error, id, className, autosize = true, minRows = 3, maxRows = 10, onChange, style, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const inner = useRef<HTMLTextAreaElement | null>(null);

  const setRef = (el: HTMLTextAreaElement | null) => {
    inner.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  const resize = useCallback(() => {
    const el = inner.current;
    if (!el || !autosize) return;
    if ("fieldSizing" in el.style) return; // native field-sizing handles it
    const line = parseFloat(getComputedStyle(el).lineHeight) || 22;
    const pad = 20; // py-2.5 top + bottom
    el.style.height = "auto";
    const target = Math.min(Math.max(el.scrollHeight, line * minRows + pad), line * maxRows + pad);
    el.style.height = `${target}px`;
  }, [autosize, minRows, maxRows]);

  useEffect(() => {
    resize();
  }, [resize, rest.value, rest.defaultValue]);

  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="t-label text-ink">
        {label}
      </label>
      <textarea
        ref={setRef}
        id={inputId}
        rows={minRows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : helper ? helperId : undefined}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          onChange?.(e);
          resize();
        }}
        style={{
          ...(autosize ? { fieldSizing: "content", minHeight: `calc(${minRows}lh + 20px)`, maxHeight: `calc(${maxRows}lh + 20px)` } : {}),
          ...style,
        } as React.CSSProperties}
        className={cx(
          "w-full resize-y rounded-md border bg-surface px-3 py-2.5 text-sm leading-[1.55] text-ink pointer-coarse:text-base",
          "transition-colors duration-instant ease-out-ds",
          "hover:border-ink-muted disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-disabled read-only:bg-canvas-soft",
          autosize && "resize-none",
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
