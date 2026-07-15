import Image from "next/image";
import {
  getBrandDiagram,
  type BrandDiagramId,
} from "../lib/brand-diagrams";
import type { Locale } from "../lib/i18n";

/**
 * Renders a proof-grammar diagram responsively:
 * - Desktop (≥48rem): the authored wide SVG from `assets/`, marked decorative
 *   (`aria-hidden`) because the stacked list carries the meaning.
 * - Narrow (<48rem): a localized, stacked HTML representation with real text at a
 *   readable size — no 960px SVG shrunk to 4px, no horizontal overflow.
 * The stacked stations stay in the accessibility tree at every breakpoint (they
 * are only visually hidden on desktop), so screen readers get the localized
 * description regardless of viewport.
 */
export function ProofDiagram({
  id,
  caption,
  locale,
}: {
  id: BrandDiagramId;
  caption: string;
  locale: Locale;
}) {
  const diagram = getBrandDiagram(id, locale);
  const captionId = `${id}-figcaption`;
  return (
    <figure className="proof-diagram" aria-labelledby={captionId}>
      {/* The build syncs the canonical root asset byte-for-byte into public/.
          It stays decorative here because the localized stack is the a11y SSOT. */}
      <div
        className="proof-diagram__frame proof-diagram__wide"
        aria-hidden="true"
      >
        <Image
          className="proof-diagram__image"
          src={`/diagram-${id}.svg`}
          alt=""
          width={960}
          height={380}
          unoptimized
        />
      </div>
      <ol className="proof-diagram__stack" aria-label={diagram.title}>
        {diagram.stations.map((station) => (
          <li className="proof-diagram__station" key={station.index}>
            <span className="proof-diagram__station-label" translate="no">
              {station.label}
            </span>
            <code className="proof-diagram__station-value">{station.value}</code>
            <span className="proof-diagram__station-note">{station.note}</span>
          </li>
        ))}
      </ol>
      <p className="proof-diagram__flow">{diagram.flow}</p>
      <figcaption id={captionId}>{caption}</figcaption>
    </figure>
  );
}
