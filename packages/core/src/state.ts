export type InteractionState =
  | "idle"
  | "hover"
  | "focus"
  | "active"
  | "disabled"
  | "loading"
  | "error"
  | "selected"
  | "expanded"
  | "checked";

export type StateAttributes = {
  "data-state"?: string;
  "data-disabled"?: "" | undefined;
  "data-loading"?: "" | undefined;
  "data-invalid"?: "" | undefined;
  "aria-disabled"?: boolean | "true" | "false";
  "aria-busy"?: boolean | "true" | "false";
  "aria-invalid"?: boolean | "true" | "false";
  "aria-expanded"?: boolean | "true" | "false";
  "aria-selected"?: boolean | "true" | "false";
  "aria-checked"?: boolean | "true" | "false" | "mixed";
};

export function stateAttributes(input: {
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  invalid?: boolean | undefined;
  expanded?: boolean | undefined;
  selected?: boolean | undefined;
  checked?: boolean | "mixed" | undefined;
  state?: InteractionState | undefined;
}): StateAttributes {
  const attrs: StateAttributes = {};
  if (input.state) attrs["data-state"] = input.state;
  if (input.disabled) {
    attrs["data-disabled"] = "";
    attrs["aria-disabled"] = true;
  }
  if (input.loading) {
    attrs["data-loading"] = "";
    attrs["aria-busy"] = true;
  }
  if (input.invalid) {
    attrs["data-invalid"] = "";
    attrs["aria-invalid"] = true;
  }
  if (input.expanded !== undefined) attrs["aria-expanded"] = input.expanded;
  if (input.selected !== undefined) attrs["aria-selected"] = input.selected;
  if (input.checked !== undefined) attrs["aria-checked"] = input.checked;
  return attrs;
}
