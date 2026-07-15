export type ComponentMetadata = {
  name: string;
  ruleIds: string[];
  states: string[];
};

// Keep runtime metadata independent from the Zod-backed authoring catalog.
// The parity test makes drift fail loudly while client bundles stay lean.
const metadataBySlug: Record<string, ComponentMetadata> = {
  button: { name: "Button", ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix", "rule.foundations.semantic-tokens"], states: ["idle", "hover", "focus", "active", "disabled", "loading"] },
  "icon-button": { name: "IconButton", ruleIds: ["rule.a11y.wcag-aa"], states: ["idle", "disabled", "loading"] },
  link: { name: "Link", ruleIds: ["rule.a11y.wcag-aa", "rule.interaction.interface-quality"], states: ["idle", "hover", "focus", "visited"] },
  badge: { name: "Badge", ruleIds: ["rule.foundations.semantic-tokens"], states: ["idle"] },
  input: { name: "Input", ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"], states: ["idle", "focus", "disabled", "error"] },
  textarea: { name: "Textarea", ruleIds: ["rule.a11y.wcag-aa"], states: ["idle", "focus", "disabled", "error"] },
  checkbox: { name: "Checkbox", ruleIds: ["rule.a11y.wcag-aa"], states: ["unchecked", "checked", "disabled"] },
  switch: { name: "Switch", ruleIds: ["rule.a11y.wcag-aa"], states: ["off", "on", "disabled"] },
  "radio-group": { name: "RadioGroup", ruleIds: ["rule.a11y.wcag-aa"], states: ["selected", "unselected"] },
  select: { name: "Select", ruleIds: ["rule.a11y.wcag-aa"], states: ["idle", "disabled", "error"] },
  dialog: { name: "Dialog", ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"], states: ["open", "closed"] },
  "alert-dialog": { name: "AlertDialog", ruleIds: ["rule.a11y.wcag-aa"], states: ["open", "closed"] },
  popover: { name: "Popover", ruleIds: ["rule.a11y.wcag-aa"], states: ["open", "closed"] },
  tooltip: { name: "Tooltip", ruleIds: ["rule.a11y.wcag-aa"], states: ["idle"] },
  "dropdown-menu": { name: "DropdownMenu", ruleIds: ["rule.a11y.wcag-aa"], states: ["open", "closed"] },
  tabs: { name: "Tabs", ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"], states: ["selected"] },
  accordion: { name: "Accordion", ruleIds: ["rule.a11y.wcag-aa", "rule.motion.purpose-first"], states: ["expanded", "collapsed"] },
  breadcrumb: { name: "Breadcrumb", ruleIds: ["rule.a11y.wcag-aa"], states: ["current"] },
  pagination: { name: "Pagination", ruleIds: ["rule.interaction.url-state"], states: ["first", "middle", "last"] },
  card: { name: "Card", ruleIds: ["rule.foundations.semantic-tokens"], states: ["idle"] },
  callout: { name: "Callout", ruleIds: ["rule.brand.content-design"], states: ["idle"] },
  skeleton: { name: "Skeleton", ruleIds: ["rule.interaction.product-quality"], states: ["loading"] },
  spinner: { name: "Spinner", ruleIds: ["rule.a11y.wcag-aa"], states: ["loading"] },
  progress: { name: "Progress", ruleIds: ["rule.a11y.wcag-aa"], states: ["0", "partial", "100"] },
  toast: { name: "Toast", ruleIds: ["rule.interaction.product-quality"], states: ["visible"] },
  "empty-state": { name: "EmptyState", ruleIds: ["rule.interaction.product-quality"], states: ["empty"] },
  "error-state": { name: "ErrorState", ruleIds: ["rule.interaction.product-quality"], states: ["error"] },
  stack: { name: "Stack", ruleIds: ["rule.foundations.semantic-tokens"], states: ["idle"] },
  cluster: { name: "Cluster", ruleIds: ["rule.foundations.semantic-tokens"], states: ["idle"] },
  grid: { name: "Grid", ruleIds: ["rule.foundations.semantic-tokens"], states: ["idle"] },
  container: { name: "Container", ruleIds: ["rule.foundations.semantic-tokens"], states: ["idle"] },
  "visually-hidden": { name: "VisuallyHidden", ruleIds: ["rule.a11y.wcag-aa"], states: ["idle"] },
};

export function getComponentMetadata(slug: string): ComponentMetadata {
  const metadata = metadataBySlug[slug];
  if (!metadata) throw new Error(`Unknown component contract: ${slug}`);
  return metadata;
}
