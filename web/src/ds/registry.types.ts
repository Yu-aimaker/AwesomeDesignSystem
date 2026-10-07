import type { ReactNode } from "react";
import type { Control, PlaygroundState } from "../layout/Playground";

export type ComponentGroup = "actions" | "inputs" | "selection" | "navigation" | "overlay" | "feedback" | "data" | "layout" | "typography";

/**
 * Component maturity, defined in AwesomeDS/components/README.md ("Maturity").
 * alpha: API may change. beta: usable, spec or a11y review incomplete.
 * stable: API frozen, spec and review done. deprecated: replacement named.
 */
export type ComponentMaturity = "alpha" | "beta" | "stable" | "deprecated";

export interface ComponentEntry {
  /** kebab-case, used in the URL hash. */
  id: string;
  /** e.g. "Button" */
  name: string;
  group: ComponentGroup;
  maturity: ComponentMaturity;
  /** Japanese, at most 12 words: the single rule to remember. */
  caption: string;
  controls?: Control[];
  initial: PlaygroundState;
  /** The live demo. */
  render: (state: PlaygroundState) => ReactNode;
  /** JSX snippet reflecting the state. */
  code?: (state: PlaygroundState) => string;
  /** The component file content via a `?raw` import. */
  source: string;
  /** e.g. ["hover", "focus-visible", "active", "disabled", "loading"] */
  states?: string[];
  /** Token names used, e.g. ["--ds-radius-md", "--ds-control-md"] */
  tokens?: string[];
}
