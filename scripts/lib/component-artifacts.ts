export type ArtifactClaimRecord = Record<string, unknown> & {
  id: string;
  kind?: string;
  title?: string;
  path?: string;
  ruleIds?: string[];
  referenceIds?: string[];
};

type ComponentContract = { slug: string; name: string; ruleIds: string[] };
type RuleEvidence = { id: string; referenceIds: string[] };

const sourceBySlug: Record<string, string> = {
  button: "Button.tsx", "icon-button": "IconButton.tsx", link: "Link.tsx", badge: "Badge.tsx",
  input: "Input.tsx", textarea: "Input.tsx", checkbox: "Input.tsx", switch: "Input.tsx", "radio-group": "Input.tsx", select: "Input.tsx",
  dialog: "Dialog.tsx", "alert-dialog": "Dialog.tsx", popover: "Overlay.tsx", tooltip: "Overlay.tsx", "dropdown-menu": "Overlay.tsx",
  tabs: "Tabs.tsx", accordion: "Accordion.tsx", breadcrumb: "Navigation.tsx", pagination: "Navigation.tsx",
  card: "Status.tsx", callout: "Status.tsx", skeleton: "Status.tsx", spinner: "Status.tsx", progress: "Status.tsx", toast: "Status.tsx", "empty-state": "Status.tsx", "error-state": "Status.tsx",
  stack: "Layout.tsx", cluster: "Layout.tsx", grid: "Layout.tsx", container: "Layout.tsx", "visually-hidden": "Layout.tsx",
};

export function buildComponentArtifactClaims(
  existing: ArtifactClaimRecord[],
  components: ComponentContract[],
  rules: RuleEvidence[],
): ArtifactClaimRecord[] {
  const rulesById = new Map(rules.map((rule) => [rule.id, rule]));
  const generated = components.map((component) => {
    const source = sourceBySlug[component.slug];
    if (!source) throw new Error(`Missing React source mapping for component ${component.slug}`);
    const referenceIds = [...new Set(component.ruleIds.flatMap((ruleId) => {
      const rule = rulesById.get(ruleId);
      if (!rule) throw new Error(`Component ${component.slug} points to unknown rule ${ruleId}`);
      return rule.referenceIds;
    }))].sort();
    return {
      id: `artifact.component.${component.slug}`,
      kind: "component",
      title: component.name,
      path: `packages/react/src/components/${source}`,
      ruleIds: [...component.ruleIds].sort(),
      referenceIds,
    };
  });
  return [
    ...existing.filter((claim) => !claim.id.startsWith("artifact.component.")),
    ...generated,
  ].sort((left, right) => left.id.localeCompare(right.id));
}
