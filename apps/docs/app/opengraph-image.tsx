import { ImageResponse } from "next/og";
import { getSiteUrl } from "../lib/metadata";
import { computeProofMark, PROOF_MARK_UNIT } from "../lib/proof-mark";

export const alt = "AwesomeDS — the evidence-first design instrument";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// This OG raster is intentionally LOCALE-NEUTRAL. It is served identically to
// /en and /ja because its language-bearing marks are the brand's locale-invariant
// signature — the proof mark, mono registration labels, the ember signal, and the
// Latin "prove" voice the brand bible defines as invariant across locales. Locale
// awareness for social embeds is carried by metadata (og:locale + the localized
// image `alt`), not by re-rendering CJK text through Satori (whose default font
// ships no CJK glyphs). Per-locale text OG can be added later behind a CJK font.

// Brand grammar (kept in sync with assets/banner.svg + tokens ember signal):
const PAPER = "#FAFAF9";
const INK = "#18181B";
const MUTED = "#57574F";
const FAINT = "#A2A29A";
const HAIRLINE = "#E4E4DF";
const GRID_DOT = "#D7D7D0";
const EMBER = "#C0472A";

export default function OpenGraphImage() {
  const host = getSiteUrl().host;
  // One geometry spec, shared with the header + banner (lib/proof-mark.ts).
  const mark = computeProofMark(PROOF_MARK_UNIT);
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          alignItems: "stretch",
          background: PAPER,
          color: INK,
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "68px 80px",
          width: "100%",
        }}
      >
        {/* Blueprint plane — SVG pattern is deterministic in Satori, unlike a
            CSS radial-gradient background. */}
        <svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <pattern id="blueprint-dots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.35" fill={GRID_DOT} />
            </pattern>
            <linearGradient id="blueprint-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={PAPER} stopOpacity="0" />
              <stop offset="0.72" stopColor={PAPER} stopOpacity="0.94" />
            </linearGradient>
          </defs>
          <rect width={size.width} height={size.height} fill="url(#blueprint-dots)" />
          <rect width={size.width} height={size.height} fill="url(#blueprint-fade)" />
        </svg>
        {/* Instrument registration bar — the ember signature edge. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 80,
            width: 108,
            height: 5,
            background: EMBER,
          }}
        />
        {/* Content paints above the plane by DOM order (Satori ignores z-index). */}
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ alignItems: "center", display: "flex" }}>
            {/* The proof mark — ember square + knocked-out registration square. */}
            <div style={{ display: "flex", marginRight: 20 }}>
              <div style={{ width: mark.side, height: mark.side, background: EMBER }} />
              <div
                style={{
                  width: mark.side,
                  height: mark.side,
                  marginLeft: mark.gap,
                  border: `${mark.stroke}px solid ${INK}`,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: mark.knockout, height: mark.knockout, background: INK }} />
              </div>
            </div>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
              AwesomeDS
            </span>
          </div>
          <span
            style={{
              color: FAINT,
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            x1200 · y630 · v2026.07
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: EMBER,
              display: "flex",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.16em",
              marginBottom: 22,
              textTransform: "uppercase",
            }}
          >
            Evidence-first · Agent-readable · Japanese-first
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 92,
              fontWeight: 500,
              letterSpacing: "-0.045em",
              lineHeight: 1.0,
              maxWidth: 1000,
            }}
          >
            Taste you can prove.
          </div>
          <div
            style={{
              color: MUTED,
              display: "flex",
              fontSize: 26,
              lineHeight: 1.3,
              marginTop: 26,
              maxWidth: 900,
            }}
          >
            A source-cited Canon, semantic tokens, live components, and skills — one
            design instrument for people and AI agents.
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            borderTop: `2px solid ${HAIRLINE}`,
            color: FAINT,
            display: "flex",
            fontSize: 19,
            justifyContent: "space-between",
            paddingTop: 26,
          }}
        >
          <span>rule.* → ref.* evidence · WCAG 2.2 AA · freshness-tracked</span>
          <span>{host}</span>
        </div>
      </div>
    ),
    size,
  );
}
