import { describe, expect, test } from "vitest";

import { buildComponentArtifactClaims } from "../scripts/lib/component-artifacts";

describe("component artifact evidence", () => {
  test("does not infer direct artifact evidence from rules or stale claims", () => {
    const claims = buildComponentArtifactClaims(
      [
        {
          id: "artifact.component.button",
          kind: "component",
          referenceIds: ["ref.direct.button"],
        },
        {
          id: "artifact.doc.keep",
          kind: "doc",
          title: "Keep me",
          path: "docs/keep.md",
          ruleIds: ["rule.a11y.wcag-aa"],
          referenceIds: ["ref.direct.doc"],
        },
      ],
      [
        {
          slug: "button",
          name: "Button",
          ruleIds: ["rule.a11y.wcag-aa"],
        },
        {
          slug: "link",
          name: "Link",
          ruleIds: ["rule.a11y.wcag-aa"],
        },
      ],
      [
        {
          id: "rule.a11y.wcag-aa",
          referenceIds: ["ref.rule.only"],
        },
      ],
    );

    expect(
      claims.find((claim) => claim.id === "artifact.component.button")
        ?.referenceIds,
    ).toEqual([]);
    expect(
      claims.find((claim) => claim.id === "artifact.component.link")
        ?.referenceIds,
    ).toEqual([]);
    expect(
      claims.find((claim) => claim.id === "artifact.doc.keep"),
    ).toMatchObject({ referenceIds: ["ref.direct.doc"] });
  });

  test("fails when a component cites an unknown rule", () => {
    expect(() =>
      buildComponentArtifactClaims(
        [],
        [{ slug: "button", name: "Button", ruleIds: ["rule.missing"] }],
        [],
      ),
    ).toThrow(/unknown rule/);
  });
});
