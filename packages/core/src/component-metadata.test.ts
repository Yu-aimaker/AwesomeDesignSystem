import { describe, expect, it } from "vitest";
import { componentCatalog } from "./component-contracts";
import { getComponentMetadata } from "./component-metadata";

describe("lightweight component metadata", () => {
  it("matches every Zod-validated authoring contract", () => {
    for (const item of componentCatalog) {
      expect(getComponentMetadata(item.slug)).toEqual({
        name: item.name,
        ruleIds: item.ruleIds,
        states: item.states,
      });
    }
  });
});
