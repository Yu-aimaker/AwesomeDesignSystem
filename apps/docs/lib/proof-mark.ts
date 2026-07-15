/**
 * Canonical proof-mark geometry — the single source of truth for the AwesomeDS
 * signature (brand bible §3.1). The mark is an ember square paired with a
 * knocked-out registration square (a stroked target outline with a filled
 * center). Both squares share one side length; every other dimension is a fixed
 * ratio of that side, so the mark is identical whether it is rendered in the
 * site header (React SVG), the Open Graph image (Satori), or `assets/banner.svg`
 * (hand-authored static SVG).
 *
 * `apps/docs/tests/proof-mark-geometry.test.ts` asserts that the static banner
 * and this spec agree, so the artifact can never silently drift from the brand
 * contract.
 */
export const PROOF_MARK = {
  /** Gap between the ember square and the registration square, ÷ side. */
  gapRatio: 0.25,
  /** Registration outer stroke width, ÷ side. */
  strokeRatio: 1 / 12,
  /** Knocked-out inner (target) square side, ÷ side. Centered in the outline. */
  knockoutRatio: 0.5,
} as const;

export type ProofMarkGeometry = {
  /** Shared side length of both squares. */
  side: number;
  /** Gap between the two squares. */
  gap: number;
  /** Registration outline stroke width. */
  stroke: number;
  /** Side length of the knocked-out center square. */
  knockout: number;
  /** Inset of the knockout square inside the registration square. */
  knockoutInset: number;
  /** X origin of the ember square. */
  emberX: number;
  /** X origin of the registration square. */
  registrationX: number;
  /** Total mark width (viewBox width); height equals `side`. */
  width: number;
};

const round = (value: number) => Math.round(value * 1000) / 1000;

/** Compute concrete pixel geometry for a proof mark of the given `side`. */
export function computeProofMark(side: number): ProofMarkGeometry {
  const gap = round(side * PROOF_MARK.gapRatio);
  const stroke = round(side * PROOF_MARK.strokeRatio);
  const knockout = round(side * PROOF_MARK.knockoutRatio);
  const knockoutInset = round((side - knockout) / 2);
  const registrationX = round(side + gap);
  return {
    side,
    gap,
    stroke,
    knockout,
    knockoutInset,
    emberX: 0,
    registrationX,
    width: round(registrationX + side),
  };
}

/**
 * The canonical authoring side used by the shared SVG surfaces (header + OG +
 * banner). Chosen so every derived dimension is an integer: gap 9, stroke 3,
 * knockout 18, inset 9.
 */
export const PROOF_MARK_UNIT = 36;
