/**
 * "Dotto" — the AwesomeDS mascot. A playful CMY character that sits in the
 * hero and motion demos. Pure SVG + CSS; no external animation library.
 * Motion is decorative and respects prefers-reduced-motion.
 */
export function AdsCharacter({
  className,
  mood = "wave",
  size = 160,
  label = "Dotto, the AwesomeDS mascot",
}: {
  className?: string;
  mood?: "wave" | "think" | "cheer";
  size?: number;
  label?: string;
}) {
  return (
    <div
      className={["ads-character", `ads-character--${mood}`, className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    >
      <svg viewBox="0 0 160 160" width={size} height={size} aria-hidden="true" focusable="false">
        {/* Soft ground shadow */}
        <ellipse className="ads-character__shadow" cx="80" cy="142" rx="38" ry="8" fill="#18181D" opacity="0.08" />

        {/* Body — round CMY-flavored blob */}
        <g className="ads-character__body">
          <circle cx="80" cy="88" r="48" fill="#15C7DE" />
          {/* Magenta cheek blush */}
          <circle cx="52" cy="96" r="10" fill="#FF2EA6" opacity="0.55" />
          <circle cx="108" cy="96" r="10" fill="#FF2EA6" opacity="0.55" />
          {/* Yellow belly patch */}
          <ellipse cx="80" cy="108" rx="22" ry="16" fill="#FFD400" opacity="0.9" />

          {/* Eyes */}
          <g className="ads-character__eyes">
            <ellipse cx="64" cy="78" rx="8" ry="10" fill="#18181D" />
            <ellipse cx="96" cy="78" rx="8" ry="10" fill="#18181D" />
            <circle cx="66" cy="75" r="2.5" fill="#FFFFFF" />
            <circle cx="98" cy="75" r="2.5" fill="#FFFFFF" />
          </g>

          {/* Smile */}
          <path
            d="M64 100 Q80 114 96 100"
            fill="none"
            stroke="#18181D"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Antennae / ears */}
          <g className="ads-character__ears">
            <circle cx="48" cy="48" r="14" fill="#FF2EA6" />
            <circle cx="112" cy="48" r="14" fill="#FFD400" />
            <circle cx="48" cy="48" r="5" fill="#FFFFFF" opacity="0.55" />
            <circle cx="112" cy="48" r="5" fill="#FFFFFF" opacity="0.55" />
          </g>

          {/* Arm wave (mood-specific) */}
          {mood === "wave" ? (
            <g className="ads-character__arm">
              <path
                d="M122 90 Q148 70 138 48"
                fill="none"
                stroke="#15C7DE"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <circle cx="138" cy="44" r="10" fill="#FF2EA6" />
            </g>
          ) : null}
          {mood === "cheer" ? (
            <g className="ads-character__arm ads-character__arm--cheer">
              <path d="M38 90 Q18 50 32 30" fill="none" stroke="#15C7DE" strokeWidth="12" strokeLinecap="round" />
              <path d="M122 90 Q142 50 128 30" fill="none" stroke="#15C7DE" strokeWidth="12" strokeLinecap="round" />
              <circle cx="32" cy="26" r="9" fill="#FFD400" />
              <circle cx="128" cy="26" r="9" fill="#FF2EA6" />
            </g>
          ) : null}
          {mood === "think" ? (
            <g className="ads-character__think">
              <circle cx="128" cy="52" r="6" fill="#7C5CFC" opacity="0.85" />
              <circle cx="140" cy="38" r="4" fill="#7C5CFC" opacity="0.65" />
              <circle cx="148" cy="26" r="3" fill="#7C5CFC" opacity="0.45" />
            </g>
          ) : null}
        </g>
      </svg>
    </div>
  );
}
