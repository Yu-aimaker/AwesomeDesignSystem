# AI interaction contracts

AI UI is a stateful collaboration surface, not a chat-bubble aesthetic. The normative synthesis uses [Google PAIR](https://pair.withgoogle.com/guidebook/), [Microsoft Human-AI Interaction Guidelines](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/), [Carbon for AI](https://carbondesignsystem.com/guidelines/carbon-for-ai/), [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework), and [Vercel AI Elements](https://ai-sdk.dev/elements/overview).

## 1. Capability contract

State the supported task, important non-capabilities, data boundary, required tools, expected latency/cost and freshness. Disclose model/provider/version only when it helps users assess behavior or accountability. Never promise general intelligence from a narrow capability.

## 2. Uncertainty contract

Separate source uncertainty, model uncertainty and stale data. Prefer provenance, dates and conflicts over an unexplained confidence percentage. Calibrate language to evidence and consequence; do not hide uncertainty behind fluent prose.

## 3. Agency contract

Users can preview, edit, confirm, cancel, stop, retry, undo, take over manually and escalate in proportion to impact. External side effects require an explicit approval boundary and durable audit record. Approval screens summarize the actual action—not merely “Continue?”.

## 4. Streaming contract

Streaming has semantic phases: queued, generating, tool action, partial result, completed, stopped and failed. Reserve layout, preserve input and focus, expose stop, batch accessible announcements, and label partial output as partial. Never present a token stream as a confirmed result.

## 5. Failure contract

Model refusal, safety block, timeout, rate limit, unavailable tool, malformed output, partial success and unsafe result are different states. Preserve valid work; identify what did and did not happen; offer a specific recovery; never silently retry an external side effect.

## 6. Feedback and evaluation

Tell users what feedback changes, what data is retained and how to contest a result. Evaluate task success, correction effort, accessibility, harmful-error severity, calibration, latency and cost. “Feels magical” is not a quality metric.

## Minimum test matrix

| Area | Required test |
|---|---|
| Capability | unsupported request and missing-tool disclosure |
| Uncertainty | stale/conflicting/no-source result |
| Agency | cancel, undo, manual takeover, high-risk approval |
| Streaming | keyboard stop, focus stability, batched live announcements |
| Failure | timeout, 429, refusal, malformed and partial tool result |
| Side effects | duplicate prevention, idempotency, audit trail, no silent retry |
| Accessibility | reduced motion, forced colors, zoom/reflow, screen reader |

Do not use sparkle icons, gradients, typing theater, anthropomorphic copy or hidden reasoning as substitutes for these guarantees.
