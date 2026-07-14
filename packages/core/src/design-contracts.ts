import { z } from "zod";

const RuleIdSchema = z.string().regex(/^rule\.[a-z0-9-]+\.[a-z0-9-]+$/);
const nonEmptyList = z.array(z.string().min(1)).min(1);

/** Turns broad design doctrine into a reviewable product decision. */
export const DesignDecisionContractSchema = z.object({
  id: z.string().regex(/^decision\.[a-z0-9-]+$/),
  purpose: z.string().min(1),
  audience: nonEmptyList,
  contexts: nonEmptyList,
  ruleIds: z.array(RuleIdSchema).min(1),
  platform: z.object({
    capabilities: nonEmptyList,
    constraints: nonEmptyList,
    fallback: z.string().min(1),
  }),
  trust: z.object({
    permissions: nonEmptyList,
    reversibleActions: nonEmptyList,
    iconSemantics: nonEmptyList,
  }),
  quality: z.object({
    familiarPattern: z.string().min(1),
    flexibilityBoundary: z.string().min(1),
    simplicityBudget: z.string().min(1),
    systemicDelight: z.string().min(1),
  }),
  verification: z.array(z.object({
    method: z.string().min(1),
    successCriterion: z.string().min(1),
    owner: z.string().min(1),
  })).min(1),
});

/** Makes AI capability, agency, uncertainty, streaming, and recovery explicit. */
export const AIInteractionContractSchema = z.object({
  id: z.string().regex(/^ai-contract\.[a-z0-9-]+$/),
  capability: z.object({ supported: nonEmptyList, unsupported: nonEmptyList }),
  agency: z.object({ cancel: z.boolean(), undo: z.boolean(), confirmationFor: nonEmptyList }),
  uncertainty: z.object({ sourceDisclosure: z.string().min(1), confidencePresentation: z.string().min(1) }),
  streaming: z.object({ progressLabel: z.string().min(1), partialResultPolicy: z.string().min(1), interruptionPolicy: z.string().min(1) }),
  failure: z.object({ userMessage: z.string().min(1), retryPolicy: z.string().min(1), fallback: z.string().min(1) }),
  ruleIds: z.array(RuleIdSchema).min(1),
});

export type DesignDecisionContract = z.infer<typeof DesignDecisionContractSchema>;
export type AIInteractionContract = z.infer<typeof AIInteractionContractSchema>;
