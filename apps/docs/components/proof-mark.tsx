import { computeProofMark, PROOF_MARK_UNIT } from "../lib/proof-mark";

/**
 * The AwesomeDS proof mark, rendered from the single canonical geometry spec
 * (`lib/proof-mark.ts`) so the site header, OG image, and banner stay identical.
 * An ember square + a knocked-out registration square: "this is verified; here
 * is where it points." Colors come from semantic tokens, so the mark tracks the
 * active theme. The calm ember pulse is decorative only and halts under
 * `prefers-reduced-motion` / `forced-colors` (see globals.css `.proof-mark`).
 */
export function ProofMark({
  size = 22,
  title,
  className,
  pulse = true,
}: {
  /** Rendered height in px; width scales with the mark's aspect ratio. */
  size?: number;
  /** Accessible name. When omitted the mark is purely decorative. */
  title?: string;
  className?: string;
  pulse?: boolean;
}) {
  const g = computeProofMark(PROOF_MARK_UNIT);
  const height = size;
  const width = (g.width / g.side) * size;
  const decorative = !title;
  const classes = ["proof-mark", pulse ? "proof-mark--pulse" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      className={classes}
      width={width}
      height={height}
      viewBox={`0 0 ${g.width} ${g.side}`}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {/* Ember square — the single interaction/proof signal. */}
      <rect
        className="proof-mark__ember"
        x={g.emberX}
        y={0}
        width={g.side}
        height={g.side}
        fill="var(--color-accent)"
      />
      {/* Registration square — the target outline. */}
      <rect
        x={g.registrationX}
        y={0}
        width={g.side}
        height={g.side}
        fill="none"
        stroke="var(--color-fg)"
        strokeWidth={g.stroke}
      />
      {/* Knocked-out center — where the evidence points. */}
      <rect
        x={g.registrationX + g.knockoutInset}
        y={g.knockoutInset}
        width={g.knockout}
        height={g.knockout}
        fill="var(--color-fg)"
      />
    </svg>
  );
}
