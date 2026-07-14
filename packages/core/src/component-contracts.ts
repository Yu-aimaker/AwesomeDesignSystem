import { z } from "zod";

export const ComponentCatalogItemSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  family: z.enum(["primitives", "forms", "overlay", "navigation", "status", "layout"]),
  description: z.string().min(1),
  ruleIds: z.array(z.string().regex(/^rule\.[a-z0-9-]+\.[a-z0-9-]+$/)).min(1),
  states: z.array(z.string().min(1)).min(1),
  importName: z.string().regex(/^[A-Z][A-Za-z0-9]+$/),
  example: z.string().min(1),
  anatomy: z.array(z.string().min(1)).min(1),
  keyboard: z.string().min(1),
  screenReader: z.string().min(1),
  contentRules: z.array(z.string().min(1)).min(1),
  rtl: z.string().min(1),
  highContrast: z.string().min(1),
  reducedMotion: z.string().min(1),
  testIds: z.array(z.string().min(1)).min(1),
  testEvidence: z.array(z.object({ file: z.string().min(1), caseName: z.string().min(1), level: z.enum(["unit", "browser"]) })).min(1),
  publicApi: z.array(z.object({ name: z.string().min(1), type: z.string().min(1), required: z.boolean(), description: z.string().min(1) })).min(1),
});

export type ComponentCatalogItem = z.infer<typeof ComponentCatalogItemSchema>;

type ComponentCatalogSource = Omit<ComponentCatalogItem, "anatomy" | "keyboard" | "screenReader" | "contentRules" | "rtl" | "highContrast" | "reducedMotion" | "testIds" | "testEvidence" | "publicApi">;

const componentCatalogSource: ComponentCatalogSource[] = [
  {
    slug: "button",
    name: "Button",
    family: "primitives",
    description: "Primary actions with loading and disabled states.",
    ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix", "rule.foundations.semantic-tokens"],
    states: ["idle", "hover", "focus", "active", "disabled", "loading"],
    importName: "Button",
    example: `import { Button } from "@awesome-ds/react";\n\n<Button loading>Save</Button>`,
  },
  {
    slug: "icon-button",
    name: "IconButton",
    family: "primitives",
    description: "Icon-only control requiring an accessible name.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["idle", "disabled", "loading"],
    importName: "IconButton",
    example: `<IconButton label="Close">×</IconButton>`,
  },
  {
    slug: "link",
    name: "Link",
    family: "primitives",
    description: "Semantic navigation link styled with accent.",
    ruleIds: ["rule.a11y.wcag-aa", "rule.interaction.interface-quality"],
    states: ["idle", "hover", "focus", "visited"],
    importName: "Link",
    example: `<Link href="/references">Atlas</Link>`,
  },
  {
    slug: "badge",
    name: "Badge",
    family: "primitives",
    description: "Compact status or category label.",
    ruleIds: ["rule.foundations.semantic-tokens"],
    states: ["idle"],
    importName: "Badge",
    example: `<Badge tone="accent">New</Badge>`,
  },
  {
    slug: "input",
    name: "Input",
    family: "forms",
    description: "Labeled text field with hint and error association.",
    ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"],
    states: ["idle", "focus", "disabled", "error"],
    importName: "Input",
    example: `<Input id="email" label="Email" error="Required" />`,
  },
  {
    slug: "textarea",
    name: "Textarea",
    family: "forms",
    description: "Multi-line labeled field.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["idle", "focus", "disabled", "error"],
    importName: "Textarea",
    example: `<Textarea id="bio" label="Bio" />`,
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    family: "forms",
    description: "Binary choice with label.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["unchecked", "checked", "disabled"],
    importName: "Checkbox",
    example: `<Checkbox id="tos" label="Accept terms" />`,
  },
  {
    slug: "switch",
    name: "Switch",
    family: "forms",
    description: "Immediate on/off control with switch role.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["off", "on", "disabled"],
    importName: "Switch",
    example: `<Switch id="dark" label="Dark mode" />`,
  },
  {
    slug: "radio-group",
    name: "RadioGroup",
    family: "forms",
    description: "Single selection within a named group.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["selected", "unselected"],
    importName: "RadioGroup",
    example: `<RadioGroup legend="Plan" name="plan" options={[{value:'free',label:'Free'}]} />`,
  },
  {
    slug: "select",
    name: "Select",
    family: "forms",
    description: "Native select with label and error.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["idle", "disabled", "error"],
    importName: "Select",
    example: `<Select id="role" label="Role"><option>Admin</option></Select>`,
  },
  {
    slug: "dialog",
    name: "Dialog",
    family: "overlay",
    description: "Modal dialog with Escape dismiss and labelled title.",
    ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"],
    states: ["open", "closed"],
    importName: "Dialog",
    example: `<Dialog open title="Confirm" onClose={() => {}}>Body</Dialog>`,
  },
  {
    slug: "alert-dialog",
    name: "AlertDialog",
    family: "overlay",
    description: "Destructive confirmation dialog variant.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["open", "closed"],
    importName: "AlertDialog",
    example: `<AlertDialog open title="Delete" onClose={cancel} onConfirm={remove}>Sure?</AlertDialog>`,
  },
  {
    slug: "popover",
    name: "Popover",
    family: "overlay",
    description: "Lightweight non-modal disclosure.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["open", "closed"],
    importName: "Popover",
    example: `<Popover label="More">Details</Popover>`,
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    family: "overlay",
    description: "Supplementary description for a control.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["idle"],
    importName: "Tooltip",
    example: `<Tooltip label="Save">?</Tooltip>`,
  },
  {
    slug: "dropdown-menu",
    name: "DropdownMenu",
    family: "overlay",
    description: "Action menu with menuitem roles.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["open", "closed"],
    importName: "DropdownMenu",
    example: `<DropdownMenu label="Actions" items={[{id:'a',label:'Edit'}]} />`,
  },
  {
    slug: "tabs",
    name: "Tabs",
    family: "navigation",
    description: "Tablist / tab / tabpanel pattern.",
    ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"],
    states: ["selected"],
    importName: "Tabs",
    example: `<Tabs items={[{value:'a',label:'A',content:'A'}]} />`,
  },
  {
    slug: "accordion",
    name: "Accordion",
    family: "navigation",
    description: "Native details/summary disclosure list.",
    ruleIds: ["rule.a11y.wcag-aa", "rule.motion.purpose-first"],
    states: ["expanded", "collapsed"],
    importName: "Accordion",
    example: `<Accordion items={[{id:'1',title:'Q',content:'A'}]} />`,
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    family: "navigation",
    description: "Hierarchical location trail.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["current"],
    importName: "Breadcrumb",
    example: `<Breadcrumb items={[{label:'Home',href:'/'},{label:'Here'}]} />`,
  },
  {
    slug: "pagination",
    name: "Pagination",
    family: "navigation",
    description: "Paged navigation with live page announcement.",
    ruleIds: ["rule.interaction.url-state"],
    states: ["first", "middle", "last"],
    importName: "Pagination",
    example: `<Pagination page={2} pageCount={5} onChange={() => {}} />`,
  },
  {
    slug: "card",
    name: "Card",
    family: "status",
    description: "Surface container for grouped content.",
    ruleIds: ["rule.foundations.semantic-tokens"],
    states: ["idle"],
    importName: "Card",
    example: `<Card title="Title">Body</Card>`,
  },
  {
    slug: "callout",
    name: "Callout",
    family: "status",
    description: "Inline emphasis for tips or warnings.",
    ruleIds: ["rule.brand.content-design"],
    states: ["idle"],
    importName: "Callout",
    example: `<Callout title="Note">Details</Callout>`,
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    family: "status",
    description: "Loading placeholder matching content geometry.",
    ruleIds: ["rule.interaction.product-quality"],
    states: ["loading"],
    importName: "Skeleton",
    example: `<Skeleton height="2rem" />`,
  },
  {
    slug: "spinner",
    name: "Spinner",
    family: "status",
    description: "Indeterminate progress indicator.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["loading"],
    importName: "Spinner",
    example: `<Spinner label="Loading" />`,
  },
  {
    slug: "progress",
    name: "Progress",
    family: "status",
    description: "Determinate progressbar.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["0", "partial", "100"],
    importName: "Progress",
    example: `<Progress value={40} label="Upload" />`,
  },
  {
    slug: "toast",
    name: "Toast",
    family: "status",
    description: "Transient status message.",
    ruleIds: ["rule.interaction.product-quality"],
    states: ["visible"],
    importName: "Toast",
    example: `<Toast>Saved</Toast>`,
  },
  {
    slug: "empty-state",
    name: "EmptyState",
    family: "status",
    description: "Empty collection with next action.",
    ruleIds: ["rule.interaction.product-quality"],
    states: ["empty"],
    importName: "EmptyState",
    example: `<EmptyState title="None" description="Add one" actionLabel="Create" />`,
  },
  {
    slug: "error-state",
    name: "ErrorState",
    family: "status",
    description: "Failure recovery surface.",
    ruleIds: ["rule.interaction.product-quality"],
    states: ["error"],
    importName: "ErrorState",
    example: `<ErrorState title="Failed" description="Retry" actionLabel="Retry" />`,
  },
  {
    slug: "stack",
    name: "Stack",
    family: "layout",
    description: "Vertical flex stack with gap tokens.",
    ruleIds: ["rule.foundations.semantic-tokens"],
    states: ["idle"],
    importName: "Stack",
    example: `<Stack gap={4}>…</Stack>`,
  },
  {
    slug: "cluster",
    name: "Cluster",
    family: "layout",
    description: "Wrapping horizontal cluster.",
    ruleIds: ["rule.foundations.semantic-tokens"],
    states: ["idle"],
    importName: "Cluster",
    example: `<Cluster>…</Cluster>`,
  },
  {
    slug: "grid",
    name: "Grid",
    family: "layout",
    description: "Responsive auto-fit grid.",
    ruleIds: ["rule.foundations.semantic-tokens"],
    states: ["idle"],
    importName: "Grid",
    example: `<Grid>…</Grid>`,
  },
  {
    slug: "container",
    name: "Container",
    family: "layout",
    description: "Centered max-width content shell.",
    ruleIds: ["rule.foundations.semantic-tokens"],
    states: ["idle"],
    importName: "Container",
    example: `<Container>…</Container>`,
  },
  {
    slug: "visually-hidden",
    name: "VisuallyHidden",
    family: "layout",
    description: "Screen-reader-only text.",
    ruleIds: ["rule.a11y.wcag-aa"],
    states: ["idle"],
    importName: "VisuallyHidden",
    example: `<VisuallyHidden>Extra context</VisuallyHidden>`,
  },
];

type ContractDetail = Pick<ComponentCatalogItem, "anatomy" | "keyboard" | "screenReader" | "contentRules" | "testIds" | "publicApi">;
const prop = (name: string, type: string, required: boolean, description: string) => ({ name, type, required, description });
const details: Record<string, ContractDetail> = {
  "button": { anatomy: ["native button", "label", "loading indicator"], keyboard: "Enter and Space activate once; disabled and loading states suppress activation.", screenReader: "The native button name remains stable while aria-disabled and busy state are exposed.", contentRules: ["Begin labels with a specific verb.", "Keep loading text consistent with the action."], publicApi: [prop("children", "ReactNode", true, "Visible accessible label"), prop("variant", '"primary" | "secondary" | "ghost" | "danger"', false, "Semantic action emphasis"), prop("size", '"sm" | "md" | "lg"', false, "Tokenized control size"), prop("loading", "boolean", false, "Prevents duplicate actions"), prop("…native", "ButtonHTMLAttributes<HTMLButtonElement>", false, "Native button attributes")], testIds: ["Button/loading-disabled", "Button/native-activation"] },
  "icon-button": { anatomy: ["native button", "decorative icon", "accessible label"], keyboard: "Enter and Space activate the control; focus uses the shared focus ring.", screenReader: "label supplies the required accessible name and the icon is presentation-only.", contentRules: ["Use a familiar single-purpose icon.", "Describe the action, not the icon shape."], publicApi: [prop("label", "string", true, "Accessible action name"), prop("loading", "boolean", false, "Prevents duplicate actions"), prop("children", "ReactNode", true, "Icon artwork"), prop("…native", "ButtonHTMLAttributes<HTMLButtonElement>", false, "Native button attributes")], testIds: ["IconButton/requires-label"] },
  "link": { anatomy: ["anchor", "link text", "optional external cue"], keyboard: "Tab focuses; Enter follows the href using native anchor behavior.", screenReader: "Announces as a link with meaningful destination text.", contentRules: ["Name the destination.", "Avoid bare URLs and vague read-more labels."], publicApi: [prop("href", "string", true, "Navigation destination"), prop("children", "ReactNode", true, "Destination label"), prop("…native", "Omit<AnchorHTMLAttributes<HTMLAnchorElement>, \"href\">", false, "Native anchor attributes")], testIds: ["Link/renders-href"] },
  "badge": { anatomy: ["inline status container", "short label"], keyboard: "Not focusable unless nested in an interactive owner.", screenReader: "Text is read in document order; decorative badges must be hidden by the caller.", contentRules: ["Use one or two short words.", "Do not place critical meaning only in tone."], publicApi: [prop("tone", "BadgeTone", false, "Semantic visual tone"), prop("children", "ReactNode", true, "Status text"), prop("…native", "HTMLAttributes<HTMLSpanElement>", false, "Native span attributes")], testIds: ["Badge/tone-text"] },
  "input": { anatomy: ["label", "text input", "hint", "error message"], keyboard: "Uses native text editing, selection, and Tab order.", screenReader: "Label, hint, invalid state, and error are programmatically associated.", contentRules: ["Labels describe the requested value.", "Errors explain how to recover."], publicApi: [prop("id", "string", true, "Association identifier"), prop("label", "string", true, "Field name"), prop("hint", "string", false, "Associated supporting guidance"), prop("error", "string", false, "Associated recovery message"), prop("…native", "InputHTMLAttributes<HTMLInputElement>", false, "Native input attributes")], testIds: ["Input/label-error-association"] },
  "textarea": { anatomy: ["label", "multiline text area", "hint or error"], keyboard: "Native multiline editing; Enter inserts a newline rather than submitting implicitly.", screenReader: "Label and descriptive/error text are associated with the textarea.", contentRules: ["State expected content and limits.", "Do not use placeholder text as a label."], publicApi: [prop("id", "string", true, "Association identifier"), prop("label", "string", true, "Field name"), prop("hint", "string", false, "Associated supporting guidance"), prop("error", "string", false, "Associated recovery message"), prop("…native", "TextareaHTMLAttributes<HTMLTextAreaElement>", false, "Native textarea attributes")], testIds: ["Textarea/multiline-label"] },
  "checkbox": { anatomy: ["native checkbox", "visible label", "optional description"], keyboard: "Space toggles the focused checkbox; Tab moves to the next control.", screenReader: "Announces checkbox name, checked/mixed state, and disabled state.", contentRules: ["Write the label as a selectable statement.", "Use a group legend for related choices."], publicApi: [prop("id", "string", true, "Association identifier"), prop("label", "string", true, "Choice label"), prop("…native", "Omit<InputHTMLAttributes<HTMLInputElement>, \"type\">", false, "Native checkbox attributes")], testIds: ["Checkbox/native-toggle"] },
  "switch": { anatomy: ["switch control", "track and thumb", "persistent label"], keyboard: "Space toggles immediately; Enter may toggle through the native button implementation.", screenReader: "role=switch exposes its name and aria-checked state.", contentRules: ["Name the setting, not On or Off.", "Use only for immediate changes."], publicApi: [prop("id", "string", true, "Association identifier"), prop("label", "string", true, "Setting name"), prop("checked", "boolean", false, "Controlled state"), prop("onChange", "(checked: boolean) => void", false, "State-change callback"), prop("disabled", "boolean", false, "Prevents interaction")], testIds: ["Switch/role-state"] },
  "radio-group": { anatomy: ["fieldset", "legend", "radio options"], keyboard: "Arrow keys move selection within the group; Tab enters and leaves the group.", screenReader: "Legend names the radiogroup and each option exposes checked state.", contentRules: ["Options must be mutually exclusive.", "Use concise parallel labels."], publicApi: [prop("legend", "string", true, "Group question"), prop("name", "string", true, "Native radio group name"), prop("options", "RadioOption[]", true, "Available answers"), prop("value", "string", false, "Controlled selected value"), prop("onChange", "(value: string) => void", false, "Selection callback")], testIds: ["RadioGroup/single-selection"] },
  "select": { anatomy: ["label", "native select", "options", "hint", "error message"], keyboard: "Uses platform-native select keyboard and type-ahead behavior.", screenReader: "Label, selected option, hint, invalid state, and error are announced.", contentRules: ["Use recognizable option labels.", "Avoid a disabled placeholder as the only instruction."], publicApi: [prop("id", "string", true, "Association identifier"), prop("label", "string", true, "Field name"), prop("children", "ReactNode", true, "Native option elements"), prop("hint", "string", false, "Associated supporting guidance"), prop("error", "string", false, "Associated recovery message"), prop("…native", "SelectHTMLAttributes<HTMLSelectElement>", false, "Native select attributes")], testIds: ["Select/native-options"] },
  "dialog": { anatomy: ["modal overlay", "labelled dialog", "title", "content", "close action"], keyboard: "Focus moves inside, Tab is contained, Escape closes, and focus returns to the trigger.", screenReader: "role=dialog and the title identify a modal context.", contentRules: ["Use a task-specific title.", "Keep the primary action visible and unambiguous."], publicApi: [prop("open", "boolean", true, "Controlled visibility"), prop("onClose", "() => void", true, "Dismiss callback"), prop("title", "string", true, "Accessible title"), prop("children", "ReactNode", true, "Dialog content"), prop("closeLabel", "string", false, "Localized close action label")], testIds: ["Dialog/escape-focus-restore", "Dialog/localized-labels"] },
  "alert-dialog": { anatomy: ["modal overlay", "alertdialog", "consequence", "confirm action", "cancel action", "error alert"], keyboard: "Focus is contained; Escape cancels unless confirmation is pending; actions lock during pending work.", screenReader: "role=alertdialog announces the title, consequence, pending state, and rejected confirmation error.", contentRules: ["Name the irreversible consequence.", "Use explicit confirm and safe cancel labels."], publicApi: [prop("open", "boolean", true, "Controlled visibility"), prop("onClose", "() => void", true, "Cancellation callback"), prop("onConfirm", "() => void | Promise<void>", true, "Destructive operation"), prop("title", "string", true, "Accessible title"), prop("children", "ReactNode", true, "Consequence and recovery copy"), prop("confirming", "boolean", false, "Externally controlled pending state"), prop("confirmLabel", "string", false, "Localized confirmation label"), prop("confirmingLabel", "string", false, "Localized pending label"), prop("cancelLabel", "string", false, "Localized cancellation label"), prop("confirmationErrorLabel", "string", false, "Localized failure announcement")], testIds: ["AlertDialog/confirm-cancel", "AlertDialog/pending-rejection", "AlertDialog/escape-focus-restore", "AlertDialog/localized-labels"] },
  "popover": { anatomy: ["disclosure trigger", "non-modal popover surface", "content"], keyboard: "Enter or Space opens; Escape closes and restores trigger focus.", screenReader: "Trigger exposes expanded state and the popover content follows it in reading order.", contentRules: ["Keep content brief and contextual.", "Do not hide essential workflow steps inside."], publicApi: [prop("label", "string", true, "Trigger name"), prop("children", "ReactNode", true, "Popover content")], testIds: ["Popover/escape-dismiss"] },
  "tooltip": { anatomy: ["trigger wrapper", "tooltip bubble", "description text"], keyboard: "Appears on keyboard focus and disappears on blur or Escape.", screenReader: "Tooltip text describes the trigger without replacing its accessible name.", contentRules: ["Add supplementary help only.", "Never put interactive content in a tooltip."], publicApi: [prop("label", "string", true, "Supplementary description"), prop("children", "ReactNode", true, "Visible trigger content")], testIds: ["Tooltip/focus-description"] },
  "dropdown-menu": { anatomy: ["menu trigger", "menu popup", "menu items"], keyboard: "Arrow keys move, Home/End jump, Enter selects, and Escape closes to the trigger.", screenReader: "Trigger expanded state, menu role, and each menuitem are exposed.", contentRules: ["Use action verbs.", "Separate destructive actions visually and semantically."], publicApi: [prop("label", "string", true, "Menu trigger name"), prop("items", "DropdownMenuItem[]", true, "Available actions")], testIds: ["DropdownMenu/keyboard-select"] },
  "tabs": { anatomy: ["tablist", "tabs", "active tabpanel"], keyboard: "Left/Right arrows move tabs, Home/End jump, and selection follows focus.", screenReader: "tab, aria-selected, and labelled tabpanel relationships are complete.", contentRules: ["Use short parallel tab labels.", "Keep related content at one hierarchy level."], publicApi: [prop("items", "TabItem[]", true, "Tabs and panels"), prop("defaultValue", "string", false, "Initially selected item"), prop("ariaLabel", "string", false, "Localized tab-list name")], testIds: ["Tabs/arrows-home-end"] },
  "accordion": { anatomy: ["disclosure list", "summary buttons", "content regions"], keyboard: "Enter or Space toggles the focused summary using native details behavior.", screenReader: "Each summary exposes expanded state and precedes its associated content.", contentRules: ["Summaries state what is revealed.", "Do not nest primary navigation in accordions."], publicApi: [prop("items", "AccordionItem[]", true, "Disclosure sections")], testIds: ["Accordion/native-details"] },
  "breadcrumb": { anatomy: ["labelled navigation", "ordered trail", "current page"], keyboard: "Links use native Tab and Enter behavior; the current page is not needlessly linked.", screenReader: "Navigation has a caller-localizable name and aria-current marks the current page.", contentRules: ["Use page titles, not URLs.", "Collapse only intermediate ancestors."], publicApi: [prop("items", "BreadcrumbItem[]", true, "Hierarchy trail"), prop("ariaLabel", "string", false, "Localized navigation name")], testIds: ["Breadcrumb/current-page", "Breadcrumb/localized-label"] },
  "pagination": { anatomy: ["labelled navigation", "previous control", "page status", "next control", "live announcement"], keyboard: "Controls use native activation and become disabled at range boundaries.", screenReader: "Current page and total are announced; disabled boundaries are exposed.", contentRules: ["Use stable page nouns.", "Preserve filters and URL state across pages."], publicApi: [prop("page", "number", true, "Current one-based page"), prop("pageCount", "number", true, "Total pages"), prop("onChange", "(page: number) => void", true, "Page request"), prop("ariaLabel", "string", false, "Localized navigation name"), prop("previousLabel", "string", false, "Localized previous-page action"), prop("nextLabel", "string", false, "Localized next-page action"), prop("formatPageStatus", "(page: number, pageCount: number) => string", false, "Locale-aware page announcement")], testIds: ["Pagination/range-boundaries", "Pagination/localized-labels"] },
  "card": { anatomy: ["grouped surface", "optional title", "body content"], keyboard: "The surface itself is static; interactive descendants retain independent focus targets.", screenReader: "Semantic descendants define structure; the entire card is not falsely announced as a button.", contentRules: ["Keep one clear subject per card.", "Avoid competing nested calls to action."], publicApi: [prop("title", "string", false, "Card heading"), prop("children", "ReactNode", true, "Grouped content")], testIds: ["Card/semantic-surface"] },
  "callout": { anatomy: ["semantic aside", "title", "supporting content"], keyboard: "Static callout content does not enter the Tab order unless it contains controls.", screenReader: "Title and text are encountered in reading order; urgent alerts use a different live pattern.", contentRules: ["Lead with the takeaway.", "Match tone to info, caution, or success meaning."], publicApi: [prop("title", "string", true, "Callout heading"), prop("children", "ReactNode", true, "Guidance")], testIds: ["Callout/semantic-aside"] },
  "skeleton": { anatomy: ["geometry-matched placeholder blocks"], keyboard: "Never focusable and never blocks keyboard navigation to already available content.", screenReader: "Decorative geometry is hidden; the owning region supplies one loading announcement.", contentRules: ["Match the expected layout.", "Do not use skeletons for sub-second updates."], publicApi: [prop("width", "string", false, "Expected block width"), prop("height", "string", false, "Expected block height")], testIds: ["Skeleton/hidden-placeholder"] },
  "spinner": { anatomy: ["status container", "animated indicator", "accessible label"], keyboard: "Not focusable; completion returns focus only when the workflow requires it.", screenReader: "A concise loading label is exposed without announcing every animation frame.", contentRules: ["Name what is loading.", "Avoid indefinite blocking without recovery."], publicApi: [prop("label", "string", false, "Loading status; defaults to Loading")], testIds: ["Spinner/status-label"] },
  "progress": { anatomy: ["label", "progressbar track", "value fill"], keyboard: "Read-only progress is not focusable; interactive sliders use another component.", screenReader: "Progressbar exposes label, current value, minimum, and maximum.", contentRules: ["Name the operation.", "Report meaningful completion rather than fake increments."], publicApi: [prop("value", "number", true, "Completion percentage"), prop("label", "string", true, "Operation name")], testIds: ["Progress/value-semantics"] },
  "toast": { anatomy: ["live status region", "message", "optional action"], keyboard: "Must not steal focus; any action is reachable in normal order while the toast remains available.", screenReader: "Polite status announcements avoid interrupting active input.", contentRules: ["State the completed result.", "Include recovery only when it is immediately actionable."], publicApi: [prop("children", "ReactNode", true, "Status message")], testIds: ["Toast/polite-status"] },
  "empty-state": { anatomy: ["empty illustration slot", "title", "description", "next action"], keyboard: "The primary next action is the first intentional focus target in the region.", screenReader: "Heading identifies the empty region and action text explains the next step.", contentRules: ["Explain why it is empty.", "Offer one useful next action."], publicApi: [prop("title", "string", true, "Empty condition"), prop("description", "string", true, "Explanation"), prop("actionLabel", "string", false, "Next step"), prop("onAction", "() => void", false, "Next-step callback")], testIds: ["EmptyState/next-action"] },
  "error-state": { anatomy: ["error heading", "plain-language description", "recovery action"], keyboard: "Recovery action is keyboard operable; focus moves only for blocking errors.", screenReader: "The error heading and recovery guidance are announced together.", contentRules: ["Say what failed without blame.", "Give a concrete retry or alternative."], publicApi: [prop("title", "string", true, "Failure summary"), prop("description", "string", true, "Recovery guidance"), prop("actionLabel", "string", false, "Recovery action"), prop("onAction", "() => void", false, "Recovery callback")], testIds: ["ErrorState/recovery-action"] },
  "stack": { anatomy: ["vertical flex container", "ordered children", "tokenized gaps"], keyboard: "Does not alter descendant order or focus behavior.", screenReader: "Adds no role; DOM order remains reading order.", contentRules: ["Use for one-dimensional vertical rhythm.", "Keep source order meaningful."], publicApi: [prop("gap", "1 | 2 | 3 | 4 | 6 | 8", false, "Vertical token gap"), prop("children", "ReactNode", false, "Ordered content"), prop("…native", "HTMLAttributes<HTMLDivElement>", false, "Native div attributes")], testIds: ["Stack/token-gap"] },
  "cluster": { anatomy: ["wrapping flex container", "inline children", "tokenized gaps"], keyboard: "Wrapping never changes DOM or keyboard focus order.", screenReader: "Adds no role and preserves logical reading order.", contentRules: ["Use for peer controls or metadata.", "Do not imply sequence through visual position alone."], publicApi: [prop("children", "ReactNode", false, "Inline peers"), prop("…native", "HTMLAttributes<HTMLDivElement>", false, "Native div attributes")], testIds: ["Cluster/wrap-order"] },
  "grid": { anatomy: ["responsive grid container", "repeating child cells"], keyboard: "Responsive reflow preserves DOM-based focus order.", screenReader: "Adds no grid role unless callers provide true two-dimensional interaction.", contentRules: ["Use for peer items of comparable weight.", "Avoid masonry ordering that changes meaning."], publicApi: [prop("children", "ReactNode", false, "Grid cells"), prop("…native", "HTMLAttributes<HTMLDivElement>", false, "Native div attributes")], testIds: ["Grid/responsive-order"] },
  "container": { anatomy: ["centered width constraint", "content slot", "responsive gutters"], keyboard: "Layout has no keyboard behavior and never clips focus indicators.", screenReader: "Adds no role; landmark semantics belong to the caller.", contentRules: ["Use one primary reading width.", "Allow intentional full-bleed children separately."], publicApi: [prop("children", "ReactNode", false, "Constrained content"), prop("…native", "HTMLAttributes<HTMLDivElement>", false, "Native div attributes")], testIds: ["Container/max-width"] },
  "visually-hidden": { anatomy: ["off-screen text wrapper", "semantic text content"], keyboard: "Focusable descendants become visible on focus only when the caller deliberately supports skip-link behavior.", screenReader: "Content remains in the accessibility tree while absent visually.", contentRules: ["Add context that sighted users receive visually.", "Do not hide interactive controls unintentionally."], publicApi: [prop("children", "ReactNode", true, "Assistive-only content")], testIds: ["VisuallyHidden/accessibility-tree"] },
};

const adaptations: Record<ComponentCatalogItem["family"], Pick<ComponentCatalogItem, "rtl" | "highContrast" | "reducedMotion">> = {
  primitives: { rtl: "Preserve icon meaning, use logical spacing, and mirror only directional artwork.", highContrast: "Keep native outlines and a visible text or border affordance in forced colors.", reducedMotion: "Remove hover travel and loading flourish while retaining immediate state feedback." },
  forms: { rtl: "Keep label, input, hint, and error aligned to inline-start without changing DOM order.", highContrast: "Use system field borders, focus indicators, and non-color invalid cues.", reducedMotion: "Change validation and selection states without sliding or spring motion." },
  overlay: { rtl: "Use logical action alignment and preserve the safe primary/cancel reading order.", highContrast: "Separate overlay, surface, focus, and actions with system-color boundaries.", reducedMotion: "Open and close instantly or with opacity only; focus timing remains deterministic." },
  navigation: { rtl: "Follow document direction for directional keys and visuals while preserving semantic order.", highContrast: "Current, selected, expanded, and focus states remain distinct without fill alone.", reducedMotion: "Move selection and disclosure state without animated travel." },
  status: { rtl: "Align status copy to inline-start and keep number/value semantics locale aware.", highContrast: "Expose status with text, shape, or system color rather than authored color alone.", reducedMotion: "Stop looping indicators where possible and retain a textual status." },
  layout: { rtl: "Logical properties and DOM order determine layout and reading order.", highContrast: "Never clip descendant outlines or depend on decorative surfaces for grouping.", reducedMotion: "Responsive reflow is immediate and does not animate layout geometry." },
};

const unitEvidence: Partial<Record<string, { caseName: string }>> = {
  button: { caseName: "Button activates with Enter and Space but not while disabled" },
  "icon-button": { caseName: "IconButton activates from the keyboard" },
  link: { caseName: "Link follows its href with native Enter behavior" },
  badge: { caseName: "renders tone variants" },
  input: { caseName: "Input and Textarea accept keyboard editing through their labels" },
  textarea: { caseName: "Input and Textarea accept keyboard editing through their labels" },
  checkbox: { caseName: "Checkbox and Switch toggle with Space" },
  switch: { caseName: "Checkbox and Switch toggle with Space" },
  "radio-group": { caseName: "selects option and notifies change" },
  select: { caseName: "Select supports native keyboard selection" },
  dialog: { caseName: "moves focus inside, closes with Escape, and restores trigger focus" },
  "alert-dialog": { caseName: "locks actions while pending and reports a rejected confirmation" },
  popover: { caseName: "popover dismisses with Escape" },
  tooltip: { caseName: "tooltip opens from keyboard focus and dismisses with Escape" },
  "dropdown-menu": { caseName: "opens a menu, moves focus, selects, and closes" },
  tabs: { caseName: "moves selection with arrow keys" },
  accordion: { caseName: "renders expandable sections" },
  breadcrumb: { caseName: "marks current page and links ancestors" },
  pagination: { caseName: "Pagination activates the next page with Enter" },
  card: { caseName: "Card remains a static semantic section" },
  callout: { caseName: "labels aside with title" },
  skeleton: { caseName: "Skeleton is hidden from the accessibility tree" },
  spinner: { caseName: "announces loading status" },
  progress: { caseName: "exposes progressbar semantics and clamps value" },
  toast: { caseName: "uses status role for live message" },
  "empty-state": { caseName: "EmptyState and ErrorState expose working recovery actions" },
  "error-state": { caseName: "EmptyState and ErrorState expose working recovery actions" },
  stack: { caseName: "layout primitives preserve DOM and focus order without adding roles" },
  cluster: { caseName: "layout primitives preserve DOM and focus order without adding roles" },
  grid: { caseName: "layout primitives preserve DOM and focus order without adding roles" },
  container: { caseName: "layout primitives preserve DOM and focus order without adding roles" },
  "visually-hidden": { caseName: "keeps content available to assistive tech" },
};

const browserKeyboardEvidence: Partial<Record<string, { caseName: string }>> = {
  select: { caseName: "native Select changes selection from the keyboard" },
  dialog: { caseName: "Dialog traps focus and restores its trigger after Escape" },
  popover: { caseName: "Popover dismisses from the keyboard and preserves focus" },
  tooltip: { caseName: "tooltip has one trigger and supports keyboard dismissal" },
  "dropdown-menu": { caseName: "DropdownMenu supports arrows, Home, End, Escape, and focus restoration" },
  tabs: { caseName: "Tabs supports both arrows plus Home and End with automatic activation" },
};

export const componentCatalog: ComponentCatalogItem[] = componentCatalogSource.map((item) => {
  const detail = details[item.slug];
  const evidence = unitEvidence[item.slug];
  const browserEvidence = browserKeyboardEvidence[item.slug];
  if (!detail) throw new Error(`Missing component-specific contract: ${item.slug}`);
  const groupedKeyboardEvidence = item.slug === "radio-group" || item.slug === "accordion";
  if (!browserEvidence && !groupedKeyboardEvidence && !evidence) throw new Error(`Missing component-specific test evidence: ${item.slug}`);
  return ComponentCatalogItemSchema.parse({
    ...item,
    example: item.example.startsWith("import ")
      ? item.example
      : `import { ${item.importName} } from "@awesome-ds/react";\n\n${item.example}`,
    ...detail,
    ...adaptations[item.family],
    testEvidence: browserEvidence
      ? [{ file: "tests/e2e/component-keyboard.spec.ts", caseName: browserEvidence.caseName, level: "browser" }]
      : groupedKeyboardEvidence
      ? [{ file: "tests/e2e/component-keyboard.spec.ts", caseName: "native RadioGroup and Accordion contracts work from the keyboard", level: "browser" }]
      : [{ file: "packages/react/src/components/Components.test.tsx", caseName: evidence!.caseName, level: "unit" }],
  });
});

export function validateComponentContracts(items: ComponentCatalogItem[] = componentCatalog): string[] {
  const issues: string[] = [];
  const slugs = new Set<string>();
  const sourceSlugs = new Set(componentCatalogSource.map((item) => item.slug));
  for (const slug of Object.keys(details)) if (!sourceSlugs.has(slug)) issues.push(`${slug}: orphan component detail`);
  for (const item of items) {
    if (slugs.has(item.slug)) issues.push(`${item.slug}: duplicate slug`);
    slugs.add(item.slug);
    for (const field of ["anatomy", "contentRules", "testIds", "testEvidence", "publicApi"] as const) {
      if (item[field].length === 0) issues.push(`${item.slug}: ${field} is empty`);
    }
    for (const evidence of item.testEvidence) {
      if (!evidence.file.endsWith(".spec.ts") && !evidence.file.endsWith(".test.tsx")) issues.push(`${item.slug}: invalid test evidence file`);
      if (!evidence.caseName.trim()) issues.push(`${item.slug}: empty test evidence case`);
    }
    for (const field of ["keyboard", "screenReader", "rtl", "highContrast", "reducedMotion"] as const) {
      if (!item[field].trim()) issues.push(`${item.slug}: ${field} is empty`);
    }
    const propNames = new Set<string>();
    for (const api of item.publicApi) {
      if (!api.name || !api.type || !api.description) issues.push(`${item.slug}: incomplete public API entry`);
      if (propNames.has(api.name)) issues.push(`${item.slug}: duplicate public API prop ${api.name}`);
      propNames.add(api.name);
    }
  }
  return issues;
}

export function getComponent(slug: string) {
  return componentCatalog.find((c) => c.slug === slug);
}

export function getComponentMetadata(slug: string) {
  const item = getComponent(slug);
  if (!item) throw new Error(`Unknown component contract: ${slug}`);
  return { name: item.name, ruleIds: item.ruleIds, states: item.states };
}
