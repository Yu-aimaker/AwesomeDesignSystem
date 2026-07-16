import { CMY_MARK_UNIT, computeCmyMark } from "../lib/cmy-mark";

/**
 * The AwesomeDS CMY logomark — three overlapping circles in subtractive
 * mixing. Shared geometry with OG + banner via `lib/cmy-mark.ts`.
 * Breathe animation is decorative and halts under prefers-reduced-motion.
 */
export function CmyMark({
  size = 28,
  title,
  className,
  breathe = true,
}: {
  size?: number;
  title?: string;
  className?: string;
  breathe?: boolean;
}) {
  const g = computeCmyMark(CMY_MARK_UNIT);
  const decorative = !title;
  const classes = ["cmy-mark", breathe ? "cmy-mark--breathe" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      className={classes}
      width={size}
      height={size}
      viewBox={`0 0 ${g.width} ${g.height}`}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <g className="cmy-mark__mix" style={{ mixBlendMode: "multiply" }}>
        {g.circles.map((circle, index) => (
          <circle
            key={circle.id}
            className={`cmy-mark__orb cmy-mark__orb--${index + 1}`}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill={circle.fill}
          />
        ))}
      </g>
    </svg>
  );
}
