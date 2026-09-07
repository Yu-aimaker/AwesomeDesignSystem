import { cx } from "../cx";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "size-6 text-xs", md: "size-8 text-sm", lg: "size-10 text-base" };

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// Pill shape. Falls back to initials on surface-sunken. Images reserve their
// box with aspect-ratio so nothing shifts while loading.
export function Avatar({ name, src, size = "md" }: AvatarProps) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-hairline bg-surface-sunken font-medium text-ink-secondary",
        sizes[size],
      )}
      role="img"
      aria-label={name}
    >
      {src ? <img src={src} alt="" className="size-full object-cover" /> : initials(name)}
    </span>
  );
}

export interface AvatarGroupProps {
  people: Array<{ name: string; src?: string }>;
  /** Avatars shown before the +N counter. */
  max?: number;
  size?: AvatarProps["size"];
  className?: string;
}

// Overlap by 8px with a 2px canvas ring so each face keeps an edge. One size per
// row. Beyond `max`, a +N pill of the same size takes the last slot; the group
// itself is named with every person so screen readers hear the full list.
export function AvatarGroup({ people, max = 4, size = "md", className }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <span role="group" aria-label={people.map((p) => p.name).join("、")} className={cx("inline-flex items-center -space-x-2", className)}>
      {shown.map((p) => (
        <span key={p.name} className="rounded-full ring-2 ring-canvas">
          <Avatar name={p.name} src={p.src} size={size} />
        </span>
      ))}
      {rest > 0 && (
        <span
          aria-hidden
          className={cx(
            "inline-flex shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-sunken font-medium tabular text-ink-secondary ring-2 ring-canvas",
            sizes[size],
          )}
        >
          +{rest}
        </span>
      )}
    </span>
  );
}
