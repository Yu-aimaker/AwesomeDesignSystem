import { describe, expect, test } from "vitest";
import { componentCatalog } from "./component-contracts";

describe("component verification IDs", () => {
  for (const component of componentCatalog) {
    for (const testId of component.testIds) {
      test(testId, () => {
        expect(testId).toMatch(/^[A-Z][A-Za-z]+\/[a-z0-9-]+$/);
        expect(component.testEvidence.length).toBeGreaterThan(0);
        expect(component.testEvidence.every((evidence) => evidence.caseName.trim().length > 0)).toBe(true);
      });
    }
  }
});
