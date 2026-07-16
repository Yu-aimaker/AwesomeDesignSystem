import { ImageResponse } from "next/og";
import { CMY, CMY_MARK_UNIT, computeCmyMark } from "../lib/cmy-mark";
import { getSiteUrl } from "../lib/metadata";

export const alt = "AwesomeDS — the taste layer for AI agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Locale-neutral OG raster. Brand identity is the CMY mark + spectrum stripe.
// Every multi-child container needs explicit display:flex (Satori constraint).

const PAPER = CMY.paper;
const INK = CMY.ink;
const MUTED = "#57574F";
const FAINT = "#A2A29A";
const HAIRLINE = "#E6E6E0";

export default function OpenGraphImage() {
  const host = getSiteUrl().host;
  const mark = computeCmyMark(CMY_MARK_UNIT);
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          fontFamily: "Arial, sans-serif",
          height: "100%",
          padding: "64px 72px 56px",
          width: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 12% 18%, rgba(21,199,222,0.16), transparent 32%), radial-gradient(circle at 88% 22%, rgba(255,46,166,0.12), transparent 30%), radial-gradient(circle at 70% 88%, rgba(255,212,0,0.14), transparent 34%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                width: mark.width,
                height: mark.height,
                marginRight: 20,
              }}
            >
              {mark.circles.map((circle) => (
                <div
                  key={circle.id}
                  style={{
                    position: "absolute",
                    display: "flex",
                    left: circle.cx - circle.r,
                    top: circle.cy - circle.r,
                    width: circle.r * 2,
                    height: circle.r * 2,
                    borderRadius: 9999,
                    background: circle.fill,
                    opacity: 0.92,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>
                AwesomeDesignSystem
              </div>
              <div style={{ display: "flex", color: MUTED, fontSize: 18, marginTop: 4 }}>
                The taste layer for AI agents
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              color: FAINT,
              fontFamily: "ui-monospace, monospace",
              fontSize: 16,
            }}
          >
            {host}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: -1.8,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Stop shipping AI slop. Ship taste.
          </div>
          <div
            style={{
              display: "flex",
              color: MUTED,
              fontSize: 24,
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            Living Canon · semantic tokens · accessible React · motion with a job — every claim
            traceable to a source.
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {CMY.spectrum.map((color) => (
              <div
                key={color}
                style={{
                  display: "flex",
                  width: 48,
                  height: 18,
                  borderRadius: 999,
                  background: color,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: `1px solid ${HAIRLINE}`,
              paddingTop: 18,
              color: FAINT,
              fontFamily: "ui-monospace, monospace",
              fontSize: 15,
            }}
          >
            <span style={{ display: "flex" }}>CMY · OKLCH · WCAG 2.2 AA · JP-first</span>
            <span style={{ display: "flex" }}>read design-system/INDEX.md first</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
