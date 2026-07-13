import { describe, expect, test } from "vitest";
import { buildComponentArtifactClaims } from "../scripts/lib/component-artifacts";

describe("component artifact generation", () => {
  test("replaces stale generated claims while preserving handwritten artifacts", () => {
    const result = buildComponentArtifactClaims(
      [
        { id: "artifact.component.button", kind: "component", title: "Old", path: "old.tsx", ruleIds: [], referenceIds: [] },
        { id: "artifact.doc.handwritten", kind: "doc", title: "Keep", path: "README.md", ruleIds: ["rule.keep"], referenceIds: [] },
      ],
      [{ slug: "button", name: "Button", ruleIds: ["rule.button"] }],
      [{ id: "rule.button", referenceIds: ["ref.button"] }],
    );

    expect(result).toContainEqual(expect.objectContaining({
      id: "artifact.component.button",
      title: "Button",
      path: "packages/react/src/components/Button.tsx",
      ruleIds: ["rule.button"],
      referenceIds: ["ref.button"],
    }));
    expect(result).toContainEqual(expect.objectContaining({ id: "artifact.doc.handwritten", title: "Keep" }));
  });
});
