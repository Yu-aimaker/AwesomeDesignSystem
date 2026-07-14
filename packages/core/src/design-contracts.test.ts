import { describe, expect, test } from "vitest";
import { AIInteractionContractSchema, DesignDecisionContractSchema } from "./design-contracts";

describe("executable design contracts", () => {
  test("requires platform, trust, quality, and verification decisions", () => {
    const decision = {
      id: "decision.adaptive-navigation",
      purpose: "Keep navigation usable across constrained surfaces.",
      audience: ["keyboard users", "mobile users"],
      contexts: ["web", "embedded surface"],
      ruleIds: ["rule.adaptation.capability-first"],
      platform: { capabilities: ["semantic navigation"], constraints: ["320px reflow"], fallback: "Linear document navigation" },
      trust: { permissions: ["No permission required"], reversibleActions: ["Back restores state"], iconSemantics: ["Icons retain text names"] },
      quality: { familiarPattern: "Landmark navigation", flexibilityBoundary: "No arbitrary reordering", simplicityBudget: "One primary path", systemicDelight: "State continuity" },
      verification: [{ method: "Keyboard and reflow test", successCriterion: "All destinations remain reachable", owner: "Design systems" }],
    };
    expect(DesignDecisionContractSchema.parse(decision).id).toBe(decision.id);
    expect(() => DesignDecisionContractSchema.parse({ ...decision, verification: [] })).toThrow();
  });

  test("requires all five AI interaction boundaries", () => {
    const contract = {
      id: "ai-contract.assistant",
      capability: { supported: ["Summarize supplied text"], unsupported: ["Verify external facts without sources"] },
      agency: { cancel: true, undo: true, confirmationFor: ["Destructive actions"] },
      uncertainty: { sourceDisclosure: "Cite every source", confidencePresentation: "Label inference separately" },
      streaming: { progressLabel: "Analyzing", partialResultPolicy: "Mark partial output", interruptionPolicy: "Preserve completed work" },
      failure: { userMessage: "Explain what failed", retryPolicy: "Offer bounded retry", fallback: "Return editable draft" },
      ruleIds: ["rule.ai.ux-agency-contract"],
    };
    expect(AIInteractionContractSchema.parse(contract).agency.cancel).toBe(true);
    expect(() => AIInteractionContractSchema.parse({ ...contract, failure: undefined })).toThrow();
  });
});
