import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { CircleAlert, File, Upload, X } from "lucide-react";
import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export interface UploadItem {
  id: string;
  name: string;
  /** Bytes. */
  size: number;
  status?: "ready" | "error";
  error?: string;
}

export interface FileUploadProps {
  value: UploadItem[];
  onChange: (items: UploadItem[]) => void;
  label: string;
  /** Native accept string, e.g. "image/*,.pdf". Shown as a hint. */
  accept?: string;
  multiple?: boolean;
  /** Files over this size are listed with an error instead of being dropped. */
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// The dropzone is a label around a real file input, so click, keyboard and drop
// all work. Drag-over strengthens the border; the list below shows name, size and
// a remove button. Nothing is uploaded here; the caller receives the list.
export function FileUpload({ value, onChange, label, accept, multiple = true, maxSizeMB, disabled = false, className }: FileUploadProps) {
  const m = useT(dsMessages);
  const id = useId();
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files || disabled) return;
    const limit = maxSizeMB !== undefined ? maxSizeMB * 1024 * 1024 : Infinity;
    const next: UploadItem[] = Array.from(files).map((f) => ({
      id: `${f.name}-${f.size}-${f.lastModified}`,
      name: f.name,
      size: f.size,
      status: f.size > limit ? "error" : "ready",
      error: f.size > limit ? m.overLimit(maxSizeMB ?? 0) : undefined,
    }));
    const merged = multiple ? [...value, ...next.filter((n) => !value.some((v) => v.id === n.id))] : next.slice(0, 1);
    onChange(merged);
    if (input.current) input.current.value = "";
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setOver(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className={cx("flex w-full flex-col gap-3", className)}>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cx(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-8 text-center",
          "transition-colors duration-instant ease-out-ds",
          disabled ? "cursor-not-allowed border-hairline bg-surface-sunken text-ink-disabled" : "cursor-pointer border-hairline-strong bg-surface hover:bg-canvas-soft has-[:focus-visible]:border-accent",
          over && !disabled && "border-accent bg-accent-soft",
        )}
      >
        <input
          ref={input}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e: ChangeEvent<HTMLInputElement>) => addFiles(e.target.files)}
          className="sr-only"
        />
        <span className={cx("flex size-10 items-center justify-center rounded-full bg-surface-sunken", disabled ? "text-ink-disabled" : "text-ink-muted")}>
          <Upload className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <span className={cx("t-label", disabled ? "text-ink-disabled" : "text-ink")}>{label}</span>
        <span className="t-caption text-ink-muted">
          {m.dropOrClick}
          {accept && <> · {accept.replace(/,/g, ", ")}</>}
          {maxSizeMB !== undefined && <> · {m.upTo(maxSizeMB)}</>}
        </span>
      </label>

      {value.length > 0 && (
        <ul className="divide-y divide-hairline rounded-lg border border-hairline bg-surface">
          {value.map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
              <span className={cx("flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-sunken", item.status === "error" ? "text-danger" : "text-ink-secondary")}>
                {item.status === "error" ? <CircleAlert className="size-4" strokeWidth={1.75} aria-hidden /> : <File className="size-4" strokeWidth={1.75} aria-hidden />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-ink">{item.name}</span>
                <span className={cx("t-caption block tabular", item.status === "error" ? "text-danger" : "text-ink-muted")}>{item.error ?? formatBytes(item.size)}</span>
              </span>
              <button
                type="button"
                aria-label={m.remove(item.name)}
                disabled={disabled}
                onClick={() => onChange(value.filter((v) => v.id !== item.id))}
                className="-m-1 rounded-sm p-1 text-ink-muted transition-colors duration-instant hover:bg-surface-sunken hover:text-ink disabled:cursor-not-allowed"
              >
                <X className="size-4" strokeWidth={1.75} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
