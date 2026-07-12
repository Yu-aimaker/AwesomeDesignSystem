import { describe, expect, test } from "vitest";

import { cx } from "./cx";
import { stateAttributes } from "./state";

describe("core utilities", () => {
  test("composes class names and ignores falsy values", () => {
    expect(cx("a", false && "b", null, undefined, { c: true, d: false })).toBe(
      "a c",
    );
  });

  test("emits stable state attributes for a11y contracts", () => {
    expect(
      stateAttributes({
        disabled: true,
        loading: true,
        invalid: true,
        expanded: true,
        state: "loading",
      }),
    ).toMatchObject({
      "data-state": "loading",
      "data-disabled": "",
      "data-loading": "",
      "data-invalid": "",
      "aria-disabled": true,
      "aria-busy": true,
      "aria-invalid": true,
      "aria-expanded": true,
    });
  });
});
