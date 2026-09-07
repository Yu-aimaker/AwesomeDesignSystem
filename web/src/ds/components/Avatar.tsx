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
