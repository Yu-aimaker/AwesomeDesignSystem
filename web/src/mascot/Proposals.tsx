import { Mascot } from "./Mascot";

export const proposalIds = ["a", "b", "c"] as const;
export type ProposalId = (typeof proposalIds)[number];

/** Proposal A is the current default, so it is the live figure itself. */
export const defaultProposal: ProposalId = "a";

const ink = { fill: "var(--ds-ink)" };
const canvas = { fill: "var(--ds-canvas)" };
const accent = { fill: "var(--ds-accent)" };

// Static copies of docs/character/proposal-b-tile.svg and proposal-c-stack.svg, drawn with tokens
// so they follow the site theme. Integer coordinates on the same 96 grid as the mascot.
function TileProposal() {
  return (
    <>
      <g style={ink}>
        <rect x="30" y="64" width="13" height="14" rx="5" />
        <rect x="53" y="64" width="13" height="14" rx="5" />
        <rect x="22" y="46" width="8" height="22" rx="4" transform="rotate(40 26 50)" />
        <rect x="66" y="46" width="8" height="22" rx="4" transform="rotate(-40 70 50)" />
        <path d="M47 16H49Q51 16 52 18L55 28Q55 29 54 29H42Q41 29 41 28L44 18Q45 16 47 16Z" />
        <rect x="22" y="26" width="52" height="46" rx="13" />
      </g>
      <rect x="22" y="52" width="52" height="7" style={accent} />
      <g style={canvas}>
        <ellipse cx="40" cy="40" rx="4" ry="5" />
        <ellipse cx="56" cy="40" rx="4" ry="5" />
        <rect x="45" y="47" width="6" height="2" rx="1" />
      </g>
    </>
  );
}

function StackProposal() {
  return (
    <>
      <g style={ink}>
        <rect x="33" y="66" width="12" height="12" rx="5" />
        <rect x="51" y="66" width="12" height="12" rx="5" />
        <rect x="29" y="54" width="8" height="18" rx="4" transform="rotate(40 33 58)" />
        <rect x="59" y="54" width="8" height="18" rx="4" transform="rotate(-40 63 58)" />
        <rect x="30" y="52" width="36" height="20" rx="9" />
        <rect x="24" y="14" width="48" height="36" rx="12" />
      </g>
      <rect x="28" y="48" width="40" height="6" rx="2" style={accent} />
      <g style={canvas}>
        <ellipse cx="40" cy="31" rx="4" ry="5" />
        <ellipse cx="56" cy="31" rx="4" ry="5" />
        <rect x="45" y="38" width="6" height="2" rx="1" />
      </g>
    </>
  );
}

export function MascotProposal({ id, className }: { id: ProposalId; className?: string }) {
  if (id === "a") return <Mascot className={className} />;
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden focusable="false">
      {id === "b" ? <TileProposal /> : <StackProposal />}
    </svg>
  );
}
