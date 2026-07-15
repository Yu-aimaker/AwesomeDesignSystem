import { ImageResponse } from "next/og";

export const alt = "AwesomeDS — evidence-backed design intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#f7f5ef",
        color: "#171713",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 80px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          fontSize: 24,
          fontWeight: 700,
          justifyContent: "space-between",
          letterSpacing: "-0.02em",
        }}
      >
        <span>AwesomeDS</span>
        <span style={{ color: "#5d5b52", fontSize: 18, fontWeight: 500 }}>
          CANON → BUILD → EVIDENCE
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            color: "#e35336",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          AI design intelligence · Evidence first
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 76,
            fontWeight: 500,
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
            maxWidth: 980,
          }}
        >
          The design bible that agents can actually use.
        </div>
      </div>
      <div
        style={{
          borderTop: "2px solid #d9d5ca",
          color: "#5d5b52",
          display: "flex",
          fontSize: 20,
          justifyContent: "space-between",
          paddingTop: 28,
        }}
      >
        <span>
          First-party sources → Canon rules → executable UI → verification
        </span>
        <span>awesome-design-system.yumaker.studio</span>
      </div>
    </div>,
    size,
  );
}
